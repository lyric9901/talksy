import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loading, PageHeader, Panel, PrimaryButton, Stat } from "@/components/coach-ui";
import { buildStyleProfile } from "@/lib/coach.functions";
import { errorMessage, store, type HistoryItem, type StyleProfile } from "@/lib/store";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Your coach & style — Talksy" },
      {
        name: "description",
        content:
          "Teach the coach your writing style, review your saved analyses and manage your data in one place.",
      },
      { property: "og:title", content: "Your coach & style — Talksy" },
      {
        property: "og:description",
        content: "Personal writing style, saved history and privacy controls.",
      },
    ],
  }),
  component: CoachPage,
});

const CHALLENGES = [
  "Ask one relevant follow-up before changing topics.",
  "Give a detail with your answer, not just the answer.",
  "End one conversation warmly instead of letting it fade.",
  "Introduce a new topic that connects to something they said.",
  "Keep one reply under two lines.",
];

function CoachPage() {
  const [samples, setSamples] = useState("");
  const [style, setStyle] = useState<StyleProfile | null>(null);
  const [styleOn, setStyleOn] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const styleFn = useServerFn(buildStyleProfile);

  useEffect(() => {
    const sync = () => {
      setStyle(store.getStyle());
      setStyleOn(store.isStyleEnabled());
      setHistory(store.getHistory());
    };
    sync();
    window.addEventListener("cc:store", sync);
    return () => window.removeEventListener("cc:store", sync);
  }, []);

  const build = useMutation({
    mutationFn: async () => styleFn({ data: { samples } }),
    onSuccess: (data) => {
      const next: StyleProfile = {
        length: String(data["length"] ?? "Medium"),
        formality: String(data["formality"] ?? "Casual"),
        emoji: String(data["emoji"] ?? "Low"),
        humor: String(data["humor"] ?? "Medium"),
        questions: String(data["questions"] ?? ""),
        vocabulary: String(data["vocabulary"] ?? ""),
        summary: String(data["summary"] ?? ""),
      };
      store.setStyle(next);
      toast.success("Style profile saved");
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't build your style profile.")),
  });

  const challenge = CHALLENGES[new Date().getDate() % CHALLENGES.length]!;

  return (
    <>
      <PageHeader
        title="Coach"
        subtitle="Your writing style, today's challenge and everything you've saved."
      />

      <div className="space-y-4">
        <Panel title="Today's challenge">
          <p className="text-sm">{challenge}</p>
        </Panel>

        <Panel
          title="Your writing style"
          action={
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Use my style
              <Switch
                checked={styleOn}
                onCheckedChange={(v) => {
                  store.setStyleEnabled(v);
                  setStyleOn(v);
                }}
              />
            </div>
          }
        >
          {style ? (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Length" value={style.length} />
              <Stat label="Formality" value={style.formality} />
              <Stat label="Emoji" value={style.emoji} />
              <Stat label="Humour" value={style.humor} />
            </div>
          ) : null}
          <Textarea
            value={samples}
            onChange={(e) => setSamples(e.target.value)}
            rows={5}
            placeholder="Paste 5–10 messages you've actually sent, one per line."
            className="resize-none bg-elevated"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <PrimaryButton
              loading={build.isPending}
              disabled={!samples.trim()}
              onClick={() => build.mutate()}
            >
              {style ? "Rebuild style profile" : "Create style profile"}
            </PrimaryButton>
            {style ? (
              <Button
                variant="ghost"
                onClick={() => {
                  store.setStyle(null);
                  toast.success("Style reset");
                }}
              >
                Reset style
              </Button>
            ) : null}
            {build.isPending ? <Loading label="Learning how you write…" /> : null}
          </div>
        </Panel>

        <Panel
          title="History"
          action={
            history.length ? (
              <Button variant="ghost" size="sm" onClick={() => store.clearAll()}>
                Clear all data
              </Button>
            ) : null
          }
        >
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing saved yet. Analyses you run appear here, stored only on this device.
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-elevated p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete saved item"
                    onClick={() => store.removeHistory(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Conversations are sent to the AI provider only to produce your analysis, and are never
            stored on our servers or used for training.
          </p>
        </Panel>
      </div>
    </>
  );
}
