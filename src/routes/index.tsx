import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquareText, Instagram, Drama, GraduationCap, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import logo from "@/assets/talksy-logo.png.asset.json";
import { Panel } from "@/components/coach-ui";
import { store, type HistoryItem } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Talksy — AI conversation coach & chat helper" },
      {
        name: "description",
        content:
          "Talksy reads your chats, suggests replies that sound like you, analyses public Instagram profiles for conversation starters, and lets you practise. Free and private.",
      },
      { property: "og:title", content: "Talksy — AI conversation coach & chat helper" },
      {
        property: "og:description",
        content: "Understand any chat, get natural replies, and practise conversations for free.",
      },
    ],
  }),
  component: Home,
});

const CHALLENGES = [
  "Ask one relevant follow-up before changing topics.",
  "Give a detail with your answer, not just the answer.",
  "End one conversation warmly instead of letting it fade.",
  "Introduce a new topic that connects to something they said.",
  "Keep one reply under two lines.",
];

const TILES = [
  {
    to: "/analyze",
    label: "Analyze a chat",
    desc: "Paste a conversation or screenshots, get tone, momentum and reply options.",
    icon: MessageSquareText,
  },
  {
    to: "/profile",
    label: "Profile analyzer",
    desc: "Turn public Instagram bio and captions into conversation starters.",
    icon: Instagram,
  },
  {
    to: "/practice",
    label: "Practice",
    desc: "Rehearse with a simulated partner and get scored feedback.",
    icon: Drama,
  },
  {
    to: "/coach",
    label: "Coach & style",
    desc: "Teach Talksy how you write, review saved analyses.",
    icon: GraduationCap,
  },
] as const;

function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const sync = () => setHistory(store.getHistory().slice(0, 4));
    sync();
    window.addEventListener("cc:store", sync);
    return () => window.removeEventListener("cc:store", sync);
  }, []);

  const challenge = CHALLENGES[new Date().getDate() % CHALLENGES.length]!;

  return (
    <>
      <section className="hero-glow rounded-3xl border border-border/60 p-6 text-center sm:p-10">
        <img src={logo.url} alt="Talksy" className="mx-auto h-10 w-auto sm:h-14" />
        <h1 className="sr-only">Talksy — AI conversation coach</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Understand any conversation, get replies that sound like you, and practise until it feels
          natural. Free, and everything stays on your device.
        </p>
        <Link
          to="/analyze"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Analyze a chat <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {TILES.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="panel flex items-start gap-3 p-4 transition-colors hover:border-primary/40"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-semibold">{label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {desc}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        <Panel title="Today's challenge">
          <p className="text-sm">{challenge}</p>
        </Panel>

        {history.length ? (
          <Panel title="Recent">
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.id} className="rounded-xl bg-elevated p-3">
                  <p className="truncate text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} · {new Date(item.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          Your chats are sent to the AI provider only to produce your analysis. Nothing is stored on
          our servers.
        </p>
      </div>
    </>
  );
}
