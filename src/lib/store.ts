export type StyleProfile = {
  length: string;
  formality: string;
  emoji: string;
  humor: string;
  questions?: string;
  vocabulary?: string;
  summary?: string;
};

export type HistoryItem = {
  id: string;
  type: "chat" | "profile" | "practice";
  title: string;
  createdAt: number;
  data: Record<string, any>;
};

export type ThemeChoice = "system" | "light" | "dark";

const STYLE_KEY = "cc.style";
const HISTORY_KEY = "cc.history";
const STYLE_ON_KEY = "cc.styleEnabled";
const CACHE_KEY = "cc.cache";
const THEME_KEY = "cc.theme";
const CACHE_LIMIT = 30;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full — drop the oldest cache entries and retry once.
    if (key !== CACHE_KEY) {
      write(CACHE_KEY, []);
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* give up silently */
      }
    }
  }
  window.dispatchEvent(new Event("cc:store"));
}

/** Fast non-crypto hash so identical inputs reuse a cached AI result. */
function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

type CacheEntry = { key: string; value: unknown; at: number };

export const store = {
  getStyle: () => read<StyleProfile | null>(STYLE_KEY, null),
  setStyle: (style: StyleProfile | null) => write(STYLE_KEY, style),
  isStyleEnabled: () => read<boolean>(STYLE_ON_KEY, true),
  setStyleEnabled: (on: boolean) => write(STYLE_ON_KEY, on),

  getTheme: () => read<ThemeChoice>(THEME_KEY, "dark"),
  setTheme: (theme: ThemeChoice) => {
    write(THEME_KEY, theme);
    applyTheme(theme);
  },

  getHistory: () => read<HistoryItem[]>(HISTORY_KEY, []),
  addHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => {
    const items = read<HistoryItem[]>(HISTORY_KEY, []);
    const next: HistoryItem = {
      ...item,
      id: Math.random().toString(36).slice(2),
      createdAt: Date.now(),
    };
    write(HISTORY_KEY, [next, ...items].slice(0, 60));
    return next;
  },
  removeHistory: (id: string) =>
    write(
      HISTORY_KEY,
      read<HistoryItem[]>(HISTORY_KEY, []).filter((i) => i.id !== id),
    ),
  clearAll: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(HISTORY_KEY);
    window.localStorage.removeItem(STYLE_KEY);
    window.localStorage.removeItem(CACHE_KEY);
    window.dispatchEvent(new Event("cc:store"));
  },

  /** Returns a cached AI result for identical input, or null. Saves AI credits. */
  getCached: <T>(scope: string, parts: unknown): T | null => {
    const key = `${scope}:${hash(JSON.stringify(parts))}`;
    const hit = read<CacheEntry[]>(CACHE_KEY, []).find((e) => e.key === key);
    return hit ? (hit.value as T) : null;
  },
  setCached: (scope: string, parts: unknown, value: unknown) => {
    const key = `${scope}:${hash(JSON.stringify(parts))}`;
    const entries = read<CacheEntry[]>(CACHE_KEY, []).filter((e) => e.key !== key);
    entries.unshift({ key, value, at: Date.now() });
    write(CACHE_KEY, entries.slice(0, CACHE_LIMIT));
  },
};

export function applyTheme(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  const dark =
    choice === "dark" ||
    (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/** Call once on app boot (client) to apply the saved theme. */
export function initTheme() {
  if (typeof window === "undefined") return;
  applyTheme(store.getTheme());
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (store.getTheme() === "system") applyTheme("system");
    });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

/**
 * Downscales + re-encodes an upload to JPEG (max 1024px) before it is sent to
 * the AI. Massively cuts token cost and upload time on mobile data, and keeps
 * thumbnails from breaking with multi-MB data URLs.
 */
export async function fileToCompressedDataUrl(
  file: File,
  maxDim = 1024,
  quality = 0.8,
): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return fileToDataUrl(file);
  }
}

export function errorMessage(error: unknown, fallback: string) {
  const msg = error instanceof Error ? error.message : "";
  if (!msg) return fallback;
  if (/429|rate/i.test(msg)) return "You've reached the current analysis limit. Try again shortly.";
  return msg.length > 180 ? fallback : msg;
}
