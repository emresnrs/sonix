// Transcript storage using localStorage

export interface TranscriptSegment {
  start: string; // "00:00"
  text: string;
}

export interface TranscriptRecord {
  id: string;
  fileName: string;
  fileSize: number;
  model: string;
  language: string;
  createdAt: number; // timestamp
  duration: string;
  segments: TranscriptSegment[];
  summary?: string;
}

const STORAGE_KEY = "sonix_transcripts";

export function getTranscripts(): TranscriptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTranscript(record: TranscriptRecord): void {
  if (typeof window === "undefined") return;
  const existing = getTranscripts();
  const idx = existing.findIndex((r) => r.id === record.id);
  if (idx >= 0) existing[idx] = record;
  else existing.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function deleteTranscript(id: string): void {
  if (typeof window === "undefined") return;
  const existing = getTranscripts().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getTranscript(id: string): TranscriptRecord | undefined {
  return getTranscripts().find((r) => r.id === id);
}

export function generateId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Mock transcription: generate fake timestamped segments
export function mockTranscribe(fileName: string): TranscriptSegment[] {
  const lines = [
    "Merhaba, bugün size Sonix uygulamasından bahsetmek istiyorum.",
    "Sonix, ses dosyalarını metne çeviren güçlü bir transkripsiyon aracıdır.",
    "Whisper gibi gelişmiş yapay zeka modelleri kullanarak yüksek doğruluk sağlar.",
    "Ses dosyanızı yükledikten sonra model seçebilir ve transkripti başlatabilirsiniz.",
    "Transkripsiyon tamamlandığında metni kopyalayabilir veya indirebilirsiniz.",
    "Ayrıca yapay zeka ile transkriptinizin özetini de oluşturabilirsiniz.",
    "Tüm transkriptler tarayıcı önbelleğinde güvenle saklanır.",
    "Böylece geçmiş transkriptlerinize istediğiniz zaman erişebilirsiniz.",
    "Sonix ile ses dosyalarını metne çevirmek artık çok kolay.",
    "Hadi deneyelim, teşekkürler.",
  ];
  let seconds = 0;
  return lines.map((text) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    const start = `${mins}:${secs}`;
    seconds += Math.floor(Math.random() * 8) + 4;
    return { start, text };
  });
}

export function mockSummarize(segments: TranscriptSegment[]): string {
  return "Bu transkript, Sonix uygulamasının özelliklerini tanıtmaktadır. " +
    "Ses dosyalarını Whisper modelleriyle metne çevirme, transkriptleri kaydetme ve özetleme " +
    "gibi temel işlevler açıklanmıştır. Tüm veriler tarayıcı önbelleğinde saklanmaktadır.";
}
