import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading, PageHeader, Panel, PrimaryButton, ScoreBar } from "@/components/coach-ui";
import { practiceTurn } from "@/lib/coach.functions";
import { errorMessage, store } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice a conversation — Talksy" },
      {
        name: "description",
        content:
          "Rehearse first messages, awkward moments and difficult conversations with an AI partner, then get scored feedback.",
      },
      { property: "og:title", content: "Practice a conversation — Talksy" },
      {
        property: "og:description",
        content: "Safe conversation practice with scored feedback and one clear challenge.",
      },
    ],
  }),
  component: PracticePage,
});

const SCENARIOS = [
  "Starting a new conversation",
  "Talking to a new friend",
  "A difficult conversation",
  "An awkward moment",
  "Apologising",
  "Making plans",
  "Introducing yourself",
  "Keeping a conversation going",
  "Ending a conversation politely",
];

const DIFFICULTIES = ["Easy", "Normal", "Hard", "Expert"];

type Msg = { role: "user" | "partner"; content: string };

function PracticePage() {
  const [scenario, setScenario] = useState(SCENARIOS[0]!);
  const [difficulty, setDifficulty] = useState("Normal");
  const [history, setHistory] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState("");
  const [report, setReport] = useState<any>(null);
  const turnFn = useServerFn(practiceTurn);

  const send = useMutation({
    mutationFn: async (message: string) =>
      turnFn({ data: { scenario, difficulty, history, message, finish: false } }),
    onSuccess: (data, message) => {
      setHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "partner", content: String(data["reply"] ?? "") },
      ]);
      setHint(String(data["hint"] ?? ""));
    },
    onError: (error) => toast.error(errorMessage(error, "That practice turn failed. Try again.")),
  });

  const finish = useMutation({
    mutationFn: async () =>
      turnFn({ data: { scenario, difficulty, history, message: "", finish: true } }),
    onSuccess: (data) => {
      setReport(data);
      store.addHistory({ type: "practice", title: scenario, data });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't score that session.")),
  });

  return (
    <>
      <PageHeader
        title="Practice"
        subtitle="Rehearse the conversations you overthink. Nobody sees these except you."
      />

      <div className="space-y-4">
        <Panel title="Scenario">
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-xs transition-colors",
                  scenario === s ? "border-primary bg-primary/15 text-primary" : "text-muted-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "rounded-lg border border-border px-3 py-1.5 text-xs transition-colors",
                  difficulty === d ? "border-accent bg-accent/15 text-accent" : "text-muted-foreground",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Conversation">
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Send the first message to start the simulation.
              </p>
            ) : null}
            {history.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-elevated text-foreground",
                  )}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {send.isPending ? <Loading label="They're typing…" /> : null}
          </div>

          {hint ? <p className="mt-4 text-xs text-accent">Coach nudge: {hint}</p> : null}

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const message = draft.trim();
              if (!message) return;
              setDraft("");
              send.mutate(message);
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Your message"
              className="bg-elevated"
            />
            <Button type="submit" size="icon" disabled={send.isPending} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {history.length >= 4 ? (
            <PrimaryButton
              variant="secondary"
              className="mt-3"
              loading={finish.isPending}
              onClick={() => finish.mutate()}
            >
              Finish & score session
            </PrimaryButton>
          ) : null}
        </Panel>

        {report ? (
          <Panel title="Communication score">
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(report.scores ?? {}).map(([k, v]) => (
                <ScoreBar key={k} label={k.replace(/_/g, " ")} value={Number(v)} max={100} />
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">Strengths</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {(report.strengths ?? []).map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  To work on
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {(report.weaknesses ?? []).map((s: string, i: number) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
            {report.challenge ? (
              <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
                <span className="font-medium">Next challenge: </span>
                {String(report.challenge)}
              </p>
            ) : null}
          </Panel>
        ) : null}
      </div>
    </>
  );
}
