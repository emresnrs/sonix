import { pipeline, env, AutomaticSpeechRecognitionPipeline } from "@xenova/transformers";

// Transformers.js lokal model (node_modules vb. üzerinde) izin vermesin, direk CDN üzerinden Xenova modellerini kullansın
// @ts-ignore
env.allowLocalModels = false;

// Worker yüklendiğini hosta bildir
self.postMessage({ status: "worker_loaded" });

class PipelineFactory {
  static task = "automatic-speech-recognition";
  static model: string | null = null;
  static quantized: boolean = true;
  static instance: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

  static async getInstance(
    model: string,
    quantized: boolean,
    progress_callback?: (data: any) => void
  ) {
    if (this.model !== model || this.quantized !== quantized) {
      this.model = model;
      this.quantized = quantized;

      if (this.instance !== null) {
        const instance = await this.instance;
        instance.dispose();
        this.instance = null;
      }
    }

    if (this.instance === null) {
      // @ts-ignore
      this.instance = pipeline(this.task, model, {
        quantized,
        progress_callback,
        revision: model.includes("/whisper-medium") ? "no_attentions" : "main",
      }) as Promise<AutomaticSpeechRecognitionPipeline>;
    }

    return this.instance;
  }
}

interface TranscribeMessage {
  audio: Float32Array;
  model: string;
  quantized: boolean;
  language: string | null;
  task: "transcribe" | "translate";
}

self.addEventListener("message", async (event: MessageEvent<TranscribeMessage>) => {
  const { audio, model, quantized, language, task } = event.data;

  try {
    const transcript = await transcribe(audio, model, quantized, language, task);

    if (transcript === null) return;

    self.postMessage({
      status: "complete",
      data: transcript,
    });
  } catch (error) {
    self.postMessage({
      status: "error",
      data: error instanceof Error ? error.message : String(error),
    });
  }
});

async function transcribe(
  audio: Float32Array,
  model: string,
  quantized: boolean,
  language: string | null,
  subtask: "transcribe" | "translate"
) {
  const transcriber = await PipelineFactory.getInstance(model, quantized, (data) => {
    self.postMessage(data); // Progress bar için (loading, indirme durumu vs)
  });

  const time_precision =
    transcriber.processor.feature_extractor.config.chunk_length /
    transcriber.model.config.max_source_positions;

  const chunks_to_process: Array<{
    tokens: number[];
    finalised: boolean;
  }> = [
    {
      tokens: [],
      finalised: false,
    },
  ];

  function chunk_callback(chunk: any) {
    const last = chunks_to_process[chunks_to_process.length - 1];
    if (!last) return;
    Object.assign(last, chunk);
    last.finalised = true;
    if (!chunk.is_last) {
      chunks_to_process.push({ tokens: [], finalised: false });
    }
  }

  function callback_function(item: any) {
    const last = chunks_to_process[chunks_to_process.length - 1];
    if (!last) return;

    last.tokens = [...item[0].output_token_ids];

    // @ts-ignore - internal transformers method
    const data = transcriber.tokenizer._decode_asr(chunks_to_process, {
      time_precision,
      return_timestamps: true,
      force_full_sequences: false,
    });

    self.postMessage({ status: "update", data: data });
  }

  const isDistilWhisper = model.startsWith("distil-whisper/");

  const baseOptions = {
    top_k: 0,
    do_sample: false,
    // chunk_length_s yalnızca distil için - küçük modeller varsayılanlarını kullansın
    chunk_length_s: isDistilWhisper ? 20 : 30,
    stride_length_s: isDistilWhisper ? 3 : 5,
    // @ts-ignore
    language: language || undefined,
    task: subtask,
    force_full_sequences: false,
    callback_function,
    chunk_callback,
  };

  // Aşama 1: return_timestamps: true ile dene (segment bazlı zaman damgası için tercihli)
  // Türkçe gibi bazı dillerde timestamp tokenları boş dizi döndürebilir.
  let output: any = await transcriber(audio, {
    ...baseOptions,
    return_timestamps: true,
  }).catch((error: Error) => {
    self.postMessage({ status: "error", data: error.message });
    return null;
  });

  if (output === null) return null;

  // Aşama 2: Eğer chunks boşsa VE text de boş/whitespace ise → timestamps olmadan tekrar dene.
  // Bu Türkçe MP3 kayıtlarında sık görülen boş çıktı sorununu çözer.
  const hasChunks = Array.isArray(output?.chunks) && output.chunks.length > 0;
  const hasText = typeof output?.text === "string" && output.text.trim().length > 0;

  if (!hasChunks && !hasText) {
    self.postMessage({ status: "update", data: [null, { chunks: [] }] }); // UI'yi sıfırla
    const retryOutput = await transcriber(audio, {
      ...baseOptions,
      return_timestamps: false,
    }).catch((error: Error) => {
      self.postMessage({ status: "error", data: error.message });
      return null;
    });
    if (retryOutput !== null) {
      output = retryOutput;
    }
  }

  return output;
}

export {};
