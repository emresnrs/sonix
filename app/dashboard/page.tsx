"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, ChevronDown, ChevronRight, Zap, Languages, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveTranscript, generateId, TranscriptRecord } from "@/lib/transcript-store";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  getModelsByCategory, 
  getModelById, 
  CATEGORY_LABELS, 
  getCachedModels 
} from "@/config/models";
import { useLanguage } from "@/components/language-provider";

const LANGUAGES = [
  { code: "auto", label: "Otomatik Algıla" },
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "İngilizce" },
  { code: "de", label: "Almanca" },
  { code: "fr", label: "Fransızca" },
  { code: "es", label: "İspanyolca" },
  { code: "ru", label: "Rusça" },
  { code: "ar", label: "Arapça" },
];

function ProcessingView({ 
  fileName, 
  statusText, 
  progress,
  logs,
  t
}: { 
  fileName: string; 
  statusText: string;
  progress: number;
  logs: string[];
  t: (keyPath: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="size-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="size-6 text-primary" />
        </div>
      </div>
      <div className="text-center w-full space-y-2">
        <p className="text-lg font-semibold">{statusText}</p>
        <p className="text-muted-foreground text-sm truncate">{fileName}</p>
        
        {progress > 0 && (
          <div className="w-full space-y-1 mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}%</p>
          </div>
        )}
      </div>

      <div className="w-full mt-4 border rounded-xl overflow-hidden bg-muted/30">
        <div className="bg-muted px-4 py-2 border-b text-xs font-semibold text-muted-foreground flex justify-between items-center">
          <span>{t("transcribe.historyTitle")}</span>
          <span className="text-[10px] uppercase font-mono tracking-wider">{logs.length} olay</span>
        </div>
        <div ref={scrollRef} className="p-4 h-48 overflow-y-auto space-y-1 font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-muted-foreground/50 italic">Log bekleniyor...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-muted-foreground break-all border-b border-border/40 pb-1 mb-1 last:border-0">
                <span className="text-primary/70 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-center text-xs mt-2">
        Bu işlem tarayıcınızda yerel olarak güvenle yapılmaktadır. 
        Lütfen sekmeyi kapatmayın.
      </p>
    </div>
  );
}

export default function DashboardHomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState("");
  const [statusText, setStatusText] = useState(""); // Will update dynamically with hooks
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const workerRef = useRef<Worker | null>(null);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [model, setModel] = useState("Xenova/whisper-tiny");
  const [modelOpen, setModelOpen] = useState(false);
  const [quantize, setQuantize] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState("auto");
  const [langSelectOpen, setLangSelectOpen] = useState(false);
  const [translate, setTranslate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cachedModels, setCachedModels] = useState<Set<string>>(new Set());

  useEffect(() => {
    getCachedModels().then(setCachedModels);
  }, []);

  const selectedLang = LANGUAGES.find((l) => l.code === language)!;
  const canStart = !!file && !!model;

  // Cleanup worker
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleStart = useCallback(async () => {
    if (!file || !model) return;
    setProcessingFile(file.name);
    setProcessing(true);
    setStatusText(t("transcribe.processing"));
    setProgress(0);
    setLogs(["İşlem başlatıldı " + file.name]);

    try {
      // 1. Ses dosyasını buffer'a çevir
      setLogs((prev) => [...prev, "Ses dosyası belleğe alınıyor..."]);
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const durationSecs = audioBuffer.duration;
      const mins = Math.floor(durationSecs / 60).toString().padStart(2, "0");
      const secs = Math.floor(durationSecs % 60).toString().padStart(2, "0");
      const durationStr = `${mins}:${secs}`;

      // 2. Fallback to mono Float32Array (Exactly like Katip)
      setLogs((prev) => [...prev, "Ses dosyası Float32Array formatına (16kHz) dönüştürülüyor..."]);
      let rawAudio: Float32Array;
      if (audioBuffer.numberOfChannels === 1) {
        rawAudio = audioBuffer.getChannelData(0);
      } else {
        const length = audioBuffer.length;
        const channels = audioBuffer.numberOfChannels;
        rawAudio = new Float32Array(length);

        const channelData: Float32Array[] = [];
        for (let c = 0; c < channels; c++) {
          channelData.push(audioBuffer.getChannelData(c));
        }

        for (let i = 0; i < length; i++) {
          let sum = 0;
          for (let c = 0; c < channels; c++) {
            sum += channelData[c]![i]!;
          }
          rawAudio[i] = sum / channels;
        }
      }
      
      // Make a hard copy for postMessage to avoid detach/DataCloneError issues
      const audio = new Float32Array(rawAudio);

      // 3. Worker Başlat
      if (!workerRef.current) {
        setLogs((prev) => [...prev, "Yeni Web Worker başlatılıyor... (ONNX Runtime CDN üzerinden)"]);
        // Next.js'de worker URL'ini alias yerine relative path ile vermek Turbopack/Webpack için şarttır
        workerRef.current = new Worker(new URL("../../lib/whisper-worker.ts", import.meta.url), {
          type: "module",
        });
      } else {
        setLogs((prev) => [...prev, "Mevcut Web Worker kullanılıyor..."]);
      }
      
      const worker = workerRef.current;
      
      // İzlenecek olan dosya indirme havuzu
      const progressItems = new Map<string, number>();

      worker.onmessage = (e) => {
        const message = e.data;
        
        switch (message.status) {
          case "worker_loaded":
            setLogs((prev) => [...prev, "Worker script başarıyla yüklendi (Hazır)."]);
            break;

          case "initiate":
            if (message.file) {
              setStatusText(t("transcribe.downloading"));
              progressItems.set(message.file, message.progress || 0);
              let sum = 0;
              progressItems.forEach(val => sum += val);
              setProgress(sum / progressItems.size);
              setLogs((prev) => [...prev, `İndirme başlatıldı: ${message.file}`]);
            }
            break;

          case "progress":
            if (message.file) {
              progressItems.set(message.file, message.progress || 0);
              let sum = 0;
              progressItems.forEach(val => sum += val);
              setProgress(sum / progressItems.size);
            }
            break;

          case "done":
            if (message.file) {
              progressItems.set(message.file, 100);
              let sum = 0;
              progressItems.forEach(val => sum += val);
              setProgress(sum / progressItems.size);
              setLogs((prev) => [...prev, `İndirme tamamlandı: ${message.file}`]);
            }
            break;

          case "ready":
            setStatusText(t("transcribe.transcribing"));
            setProgress(0);
            setLogs((prev) => [...prev, "Model hazır, deşifre işlemi başlatıldı."]);
            break;

          case "update":
            // Katip implementasyonu update event formatı
            if (message.data) {
              const chunks = message.data[1]?.chunks || message.data.chunks || [];
              if (chunks.length > 0) {
                const lastChunk = chunks[chunks.length - 1];
                if (lastChunk && lastChunk.timestamp) {
                  const end = lastChunk.timestamp[1] || lastChunk.timestamp[0];
                  let estimatedProgress = 0;
                  if (durationSecs > 0) {
                    estimatedProgress = Math.min(99, (end / durationSecs) * 100);
                  }
                  setProgress(estimatedProgress);
                }
              }
            }
            break;

          case "complete": {
            setStatusText("Tamamlanıyor...");
            setProgress(100);
            setLogs((prev) => [...prev, "Deşifre bitti, sonuçlar kaydediliyor..."]);

            // Whisper pipeline sonucu şu formatlardan birinde gelir:
            // 1. Single object: { text: "...", chunks: [{timestamp, text}...] }
            // 2. Array: [{ text: "..." }, {chunks: [...]}]
            // 3. Plain string: "..."
            const raw = message.data;
            let resultObj: { text?: string; chunks?: any[] } = {};

            if (typeof raw === "string") {
              resultObj = { text: raw };
            } else if (Array.isArray(raw)) {
              // Tüm item'ların text ve chunks'larını birleştir
              const textParts: string[] = [];
              for (const item of raw) {
                if (item && typeof item === "object") {
                  if (typeof item.text === "string" && item.text.trim()) {
                    textParts.push(item.text.trim());
                  }
                  if (item.chunks && !resultObj.chunks) resultObj.chunks = item.chunks;
                }
              }
              if (textParts.length > 0) resultObj.text = textParts.join(" ");
            } else if (raw && typeof raw === "object") {
              resultObj = raw;
            }

            const chunks = resultObj.chunks || [];

            setLogs((prev) => [...prev, `Raw output debug: text="${String(resultObj.text).slice(0, 80)}", chunks=${chunks.length}`]);

            let segments;
            if (chunks.length > 0) {
              segments = chunks.map((c: any) => ({
                start: Array.isArray(c.timestamp) ? formatTime(c.timestamp[0]) : "00:00",
                end: Array.isArray(c.timestamp) ? formatTime(c.timestamp[1] || c.timestamp[0]) : "00:00",
                text: (c.text || "").trim(),
              })).filter((s: any) => s.text);
            } else if (resultObj.text && resultObj.text.trim()) {
              segments = [{
                start: "00:00",
                end: durationStr,
                text: resultObj.text.trim(),
              }];
            } else {
              segments = [{
                start: "00:00",
                end: durationStr,
                text: "(Ses anlaşılamadı veya metin üretilemedi)",
              }];
            }

            const record: TranscriptRecord = {
              id: generateId(),
              fileName: file.name,
              fileSize: file.size,
              model: getModelById(model)?.name || model,
              language: language === "auto" ? "Otomatik Algıla" : language,
              createdAt: Date.now(),
              duration: durationStr,
              segments,
            };

            saveTranscript(record);
            router.push(`/dashboard/transcribe?id=${record.id}`);
            break;
          }

          case "error":
            console.error("Worker error:", message.data);
            setProcessing(false);
            setLogs((prev) => [...prev, `Hata oluştu: ${message.data}`]);
            alert("Bir hata oluştu: " + message.data);
            break;
        }
      };

      const task = translate ? "translate" : "transcribe";
      const lang = language === "auto" ? null : language;

      setLogs((prev) => [...prev, `Worker'a mesaj gönderiliyor (Model: ${model}, Quantized: ${quantize})`]);
      worker.postMessage({
        audio,
        model,
        quantized: quantize,
        language: lang,
        task,
      });

    } catch (error) {
      console.error(error);
      setProcessing(false);
      setLogs((prev) => [...prev, `Beklenmedik bir hata oluştu: ${String(error)}`]);
      alert("Ses dosyası işlenirken hata oluştu.");
    }
  }, [file, model, language, translate, quantize, router]);

  function formatTime(secs: number) {
    if (!secs) return "00:00";
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  if (processing) return <ProcessingView fileName={processingFile} statusText={statusText} progress={progress} logs={logs} t={t} />;

  return (
    <div className="flex flex-col gap-4">
      {/* Card 1: Ses Dosyası */}
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-base font-semibold">{t("transcribe.title")}</p>
        <p className="text-muted-foreground mt-0.5 text-sm">{t("transcribe.dropAudio").split(" veya")[0]}</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          className={cn(
            "mt-4 flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          <input ref={fileInputRef} type="file" accept="audio/*,video/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
          {file ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="bg-primary/10 rounded-xl p-3"><Upload className="text-primary size-6" /></div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-muted-foreground text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <Button variant="ghost" size="sm" className="mt-1 text-xs" onClick={() => setFile(null)}>{t("common.delete")}</Button>
            </div>
          ) : (
            <>
              <Upload className="text-muted-foreground size-7" />
              <div className="text-center">
                <p className="text-sm font-medium">{t("transcribe.dropAudio")}</p>
                <p className="text-muted-foreground text-xs">{t("transcribe.supportedFormats")}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-1" onClick={() => fileInputRef.current?.click()}>Göz at</Button>
            </>
          )}
        </div>
      </div>

      {/* Card 2: Whisper Model */}
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-base font-semibold">{t("transcribe.modelSelect")}</p>
        <p className="text-muted-foreground mt-0.5 text-sm">{t("transcribe.modelsCached")}</p>
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium">{t("transcribe.selectModel")}</p>
          <p className="text-muted-foreground text-xs mb-2"></p>
          
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-full h-auto py-2.5">
              <SelectValue placeholder="Bir whisper modeli seçin">
                {model && (
                  <span>{getModelById(model)?.name || model.split("/").pop()}</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
                {/* Multilingual Models */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {CATEGORY_LABELS.multilingual}
                </div>
                {getModelsByCategory("multilingual").map((m) => (
                  <SelectItem key={m.id} value={m.id} className="cursor-pointer">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {cachedModels.has(m.id) && (
                          <span className="text-green-500 font-semibold">Önbellekte • </span>
                        )}
                        {quantize ? m.quantizedSize : m.size} • {m.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}

                {/* englishOnly Models */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t">
                  {CATEGORY_LABELS.englishOnly}
                </div>
                {getModelsByCategory("englishOnly").map((m) => (
                  <SelectItem key={m.id} value={m.id} className="cursor-pointer">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {cachedModels.has(m.id) && (
                          <span className="text-green-500 font-semibold">Önbellekte • </span>
                        )}
                        {quantize ? m.quantizedSize : m.size} • {m.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}

                {/* Distilled Models */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2 border-t">
                  {CATEGORY_LABELS.distilled}
                </div>
                {getModelsByCategory("distilled").map((m) => (
                  <SelectItem key={m.id} value={m.id} className="cursor-pointer">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {cachedModels.has(m.id) && (
                          <span className="text-green-500 font-semibold">Önbellekte • </span>
                        )}
                        {quantize ? m.quantizedSize : m.size} • {m.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {model && (
            <div className="p-3 mt-3 rounded-lg border bg-muted/50 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Seçili Model</p>
              <p className="text-sm font-medium">{getModelById(model)?.name || model.split("/").pop()}</p>
              <p className="text-xs text-muted-foreground">
                {cachedModels.has(model) && (
                  <span className="text-green-500 font-semibold">Önbellekte • </span>
                )}
                {quantize ? getModelById(model)?.quantizedSize + " • Kuantize" : getModelById(model)?.size}
                {getModelById(model)?.description && ` • ${getModelById(model)?.description}`}
              </p>
            </div>
          )}

        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-start gap-2">
            <Zap className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">{t("transcribe.useQuantized")}</p>
              <p className="text-muted-foreground text-xs">{t("transcribe.quantizedDesc")}</p>
            </div>
          </div>
          <button type="button" onClick={() => setQuantize(!quantize)}
            className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200", quantize ? "bg-primary" : "bg-muted")}
            role="switch" aria-checked={quantize}>
            <span className={cn("pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200", quantize ? "translate-x-5" : "translate-x-0")} />
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-start gap-2">
            <div>
              <p className="text-sm font-medium text-destructive">{t("transcribe.clearCache")}</p>
              <p className="text-muted-foreground text-xs">{t("transcribe.clearCacheDesc")}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={async () => {
              try {
                const dbs = await window.indexedDB.databases();
                for (const db of dbs) {
                  if (db.name && db.name.startsWith("transformers-cache")) {
                    window.indexedDB.deleteDatabase(db.name);
                  }
                }
                window.location.reload();
              } catch (e) {
                // Ignore error silently to end user
              }
            }}
          >
            {t("transcribe.clearCacheBtn")}
          </Button>
        </div>
      </div>

      {/* Card 3: Dil Seçenekleri */}
      <div className="rounded-2xl border bg-card">
        <button type="button" className="flex w-full items-center justify-between p-6 text-left" onClick={() => setLangOpen(!langOpen)}>
          <div>
            <p className="text-base font-semibold">{t("transcribe.languageSelect").split(" (")[0]}</p>
            <p className="text-muted-foreground mt-0.5 text-sm">{t("transcribe.languageSelect")} - {t("transcribe.autoDetect")}</p>
          </div>
          <ChevronRight className={cn("text-muted-foreground size-5 transition-transform", langOpen && "rotate-90")} />
        </button>
        {langOpen && (
          <div className="border-t px-6 pb-6 pt-4 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium"><Languages className="size-4" />{t("transcribe.languageSelect")}</div>
              <div className="relative mt-2">
                <button type="button" onClick={() => setLangSelectOpen(!langSelectOpen)}
                  className="bg-background flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors hover:bg-muted">
                  {selectedLang.label === "Otomatik Algıla" ? t("transcribe.autoDetect") : selectedLang.label}
                  <ChevronDown className={cn("size-4 transition-transform", langSelectOpen && "rotate-180")} />
                </button>
                {langSelectOpen && (
                  <div className="bg-popover absolute left-0 top-full z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border p-1 shadow-lg">
                    {LANGUAGES.map((lang) => (
                      <button key={lang.code} type="button" onClick={() => { setLanguage(lang.code); setLangSelectOpen(false); }}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent">
                        {lang.label === "Otomatik Algıla" ? t("transcribe.autoDetect") : lang.label}
                        {language === lang.code && <Check className="size-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("transcribe.translateToEnglish")}</p>
                <p className="text-muted-foreground text-xs">{t("transcribe.translateDesc")}</p>
              </div>
              <button type="button" onClick={() => setTranslate(!translate)}
                className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200", translate ? "bg-primary" : "bg-muted")}
                role="switch" aria-checked={translate}>
                <span className={cn("pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200", translate ? "translate-x-5" : "translate-x-0")} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 z-10 -mx-4 lg:-mx-6 -mb-4 lg:-mb-6 mt-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4">
        <Button onClick={handleStart} disabled={!canStart} className="mx-auto flex w-full max-w-2xl" size="lg">
          {t("transcribe.start")}
        </Button>
      </div>
    </div>
  );
}
