export interface WhisperModel {
  id: string;
  name: string;
  size: string;
  quantizedSize: string;
  description: string;
  category: "multilingual" | "englishOnly" | "distilled";
}

export const WHISPER_MODELS: WhisperModel[] = [
  // Multilingual Models
  {
    id: "Xenova/whisper-tiny",
    name: "Whisper Tiny",
    size: "152 MB",
    quantizedSize: "41 MB",
    description: "En az RAM tüketimi, en hızlı sonuç.",
    category: "multilingual",
  },
  {
    id: "Xenova/whisper-base",
    name: "Whisper Base",
    size: "292 MB",
    quantizedSize: "77 MB",
    description: "Hız ve doğruluk dengesi.",
    category: "multilingual",
  },
  {
    id: "Xenova/whisper-small",
    name: "Whisper Small",
    size: "968 MB",
    quantizedSize: "249 MB",
    description: "Daha iyi doğruluk oranı.",
    category: "multilingual",
  },
  {
    id: "Xenova/whisper-medium",
    name: "Whisper Medium",
    size: "3.06 GB",
    quantizedSize: "776 MB",
    description: "Yüksek doğruluk gerektiren işler için.",
    category: "multilingual",
  },
  {
    id: "Xenova/whisper-large",
    name: "Whisper Large",
    size: "6.18 GB",
    quantizedSize: "1.52 GB",
    description: "En yüksek doğruluk (Large v1).",
    category: "multilingual",
  },
  {
    id: "Xenova/whisper-large-v2",
    name: "Whisper Large v2",
    size: "6.18 GB",
    quantizedSize: "1.52 GB",
    description: "Gelişmiş büyük model (Large v2).",
    category: "multilingual",
  },
  {
    id: "Xenova/whisper-large-v3",
    name: "Whisper Large v3",
    size: "6.18 GB",
    quantizedSize: "1.52 GB",
    description: "Mevcut en iyi doğruluk.",
    category: "multilingual",
  },

  // englishOnly Models
  {
    id: "Xenova/whisper-tiny.en",
    name: "Whisper Tiny (EN)",
    size: "152 MB",
    quantizedSize: "41 MB",
    description: "İngilizce için en hızlı sonuç.",
    category: "englishOnly",
  },
  {
    id: "Xenova/whisper-base.en",
    name: "Whisper Base (EN)",
    size: "292 MB",
    quantizedSize: "77 MB",
    description: "İngilizce için dengeli model.",
    category: "englishOnly",
  },
  {
    id: "Xenova/whisper-small.en",
    name: "Whisper Small (EN)",
    size: "968 MB",
    quantizedSize: "249 MB",
    description: "İngilizce konuşmalar için yüksek kalite.",
    category: "englishOnly",
  },
  {
    id: "Xenova/whisper-medium.en",
    name: "Whisper Medium (EN)",
    size: "3.06 GB",
    quantizedSize: "776 MB",
    description: "Zorlu İngilizce kayıtlar için en iyi seçim.",
    category: "englishOnly",
  },

  // Distilled Models (Faster & Accurate)
  {
    id: "distil-whisper/distil-small.en",
    name: "Distil Small (EN)",
    size: "665 MB",
    quantizedSize: "172 MB",
    description: "Normalize edilmiş hızlı İngilizce model.",
    category: "distilled",
  },
  {
    id: "distil-whisper/distil-medium.en",
    name: "Distil Medium (EN)",
    size: "1.57 GB",
    quantizedSize: "402 MB",
    description: "Daha büyük ve hızlı distile model.",
    category: "distilled",
  },
  {
    id: "distil-whisper/distil-large-v2",
    name: "Distil Large v2",
    size: "3.01 GB",
    quantizedSize: "767 MB",
    description: "Maksimum hız ve kalite (Large v2 Distil).",
    category: "distilled",
  },
  {
    id: "distil-whisper/distil-large-v3",
    name: "Distil Large v3",
    size: "3.01 GB",
    quantizedSize: "767 MB",
    description: "En verimli büyük İngilizce model.",
    category: "distilled",
  },
];

// Helper to get models by category
export const getModelsByCategory = (
  category: WhisperModel["category"]
): WhisperModel[] => {
  return WHISPER_MODELS.filter((model) => model.category === category);
};

// Helper to find model by ID
export const getModelById = (id: string): WhisperModel | undefined => {
  return WHISPER_MODELS.find((model) => model.id === id);
};

// Category labels for UI
export const CATEGORY_LABELS = {
  multilingual: "Çok Dilli (Multilingual)",
  englishOnly: "Sadece İngilizce",
  distilled: "Distile (Hızlı ve Optimize)",
} as const;

export async function getCachedModels(): Promise<Set<string>> {
  try {
    const dbs = await window.indexedDB.databases();
    const cacheDbs = dbs
      .filter((db) => db.name && db.name.startsWith("transformers-cache"))
      .map((db) => db.name!);

    if (cacheDbs.length === 0) {
      return new Set();
    }

    const cachedFiles = new Set<string>();

    for (const dbName of cacheDbs) {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(dbName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const storeNames = Array.from(db.objectStoreNames);
      if (storeNames.includes("cache")) {
        const tx = db.transaction("cache", "readonly");
        const store = tx.objectStore("cache");
        const request = store.getAllKeys();

        await new Promise<void>((resolve, reject) => {
          request.onsuccess = () => {
            request.result.forEach((key) => {
              const url = String(key);
              for (const model of WHISPER_MODELS) {
                if (url.includes(model.id)) {
                  cachedFiles.add(model.id);
                }
              }
            });
            resolve();
          };
          request.onerror = () => reject(request.error);
        });
      }
      db.close();
    }

    return cachedFiles;
  } catch (error) {
    console.warn("Failed to check cached models:", error);
    return new Set();
  }
}
