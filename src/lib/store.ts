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

const STYLE_KEY = "cc.style";
const HISTORY_KEY = "cc.history";
const STYLE_ON_KEY = "cc.styleEnabled";

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
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("cc:store"));
}

export const store = {
  getStyle: () => read<StyleProfile | null>(STYLE_KEY, null),
  setStyle: (style: StyleProfile | null) => write(STYLE_KEY, style),
  isStyleEnabled: () => read<boolean>(STYLE_ON_KEY, true),
  setStyleEnabled: (on: boolean) => write(STYLE_ON_KEY, on),
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
    window.dispatchEvent(new Event("cc:store"));
  },
};

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

export function errorMessage(error: unknown, fallback: string) {
  const msg = error instanceof Error ? error.message : "";
  if (!msg) return fallback;
  if (/429|rate/i.test(msg)) return "You've reached the current analysis limit. Try again shortly.";
  return msg.length > 180 ? fallback : msg;
}
