import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, RefreshCw, Sparkle } from "lucide-react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ImageDropzone,
  Loading,
  PageHeader,
  Panel,
  PrimaryButton,
  RiskBadge,
  ScoreBar,
  Stat,
} from "@/components/coach-ui";
import { analyzeConversation, refineReply } from "@/lib/coach.functions";
import { errorMessage, store } from "@/lib/store";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a chat — Converse Coach" },
      {
        name: "description",
        content:
          "Paste a conversation or upload screenshots and get a clear read of tone, momentum and balance, plus reply options with reasons.",
      },
      { property: "og:title", content: "Analyze a chat — Converse Coach" },
      {
        property: "og:description",
        content: "Understand any conversation and get natural replies you can actually send.",
      },
    ],
  }),
  component: AnalyzePage,
});

type Suggestion = {
  text: string;
  style?: string;
  reason?: string;
  goal?: string;
  risk?: string;
};

function AnalyzePage() {
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [replies, setReplies] = useState<Suggestion[]>([]);

  const analyzeFn = useServerFn(analyzeConversation);
  const refineFn = useServerFn(refineReply);

  const analysis = useMutation({
    mutationFn: async () => {
      const style = store.isStyleEnabled() ? store.getStyle() : null;
      return analyzeFn({ data: { text, context, images, style } });
    },
    onSuccess: (data) => {
      setResult(data);
      setReplies(Array.isArray(data.suggestions) ? data.suggestions : []);
      store.addHistory({
        type: "chat",
        title: String(data.topic ?? "Chat analysis"),
        data,
      });
    },
    onError: (error) =>
      toast.error("Analysis failed", {
        description: errorMessage(error, "Your content wasn't lost. Try again."),
      }),
  });

  const refine = useMutation({
    mutationFn: async (input: { index: number; instruction: string }) => {
      const style = store.isStyleEnabled() ? store.getStyle() : null;
      const out = await refineFn({
        data: { reply: replies[input.index]!.text, instruction: input.instruction, style },
      });
      return { index: input.index, out };
    },
    onSuccess: ({ index, out }) => {
      setReplies((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, text: String(out.text ?? r.text), reason: String(out.reason ?? r.reason ?? "") } : r,
        ),
      );
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't rewrite that reply.")),
  });

  const metrics = (result?.metrics ?? {}) as Record<string, number>;

  return (
    <>
      <PageHeader
        title="Analyze a chat"
        subtitle="Paste the conversation or drop in screenshots. Nothing is stored on a server."
      />

      <div className="space-y-4">
        <Panel title="Conversation">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder={"Them: hey how was your weekend\nMe: pretty good, mostly gaming"}
            className="resize-none bg-elevated"
          />
          <div className="mt-3">
            <ImageDropzone
              images={images}
              onChange={setImages}
              hint="Optional: up to 4 screenshots of the chat."
            />
          </div>
          <Input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Context (optional): who they are, what you want from the chat"
            className="mt-3 bg-elevated"
          />
          <div className="mt-4 flex items-center gap-3">
            <PrimaryButton loading={analysis.isPending} onClick={() => analysis.mutate()}>
              Analyze conversation
            </PrimaryButton>
            {analysis.isPending ? <Loading label="Reading the conversation…" /> : null}
          </div>
        </Panel>

        {result ? (
          <>
            <Panel title="Conversation overview">
              <p className="text-sm leading-relaxed">{String(result.summary ?? "")}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                <Stat label="Topic" value={String(result.topic ?? "—")} />
                <Stat label="Tone" value={String(result.tone ?? "—")} />
                <Stat label="Momentum" value={String(result.momentum ?? "—")} />
                <Stat label="Question balance" value={String(result.question_balance ?? "—")} />
                <Stat label="Topic diversity" value={String(result.topic_diversity ?? "—")} />
                <Stat label="Possible awkwardness" value={String(result.awkwardness ?? "—")} />
              </div>
              {result.next_action ? (
                <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
                  <span className="font-medium">Suggested next action: </span>
                  {String(result.next_action)}
                </p>
              ) : null}
            </Panel>

            {Object.keys(metrics).length ? (
              <Panel title="Conversation health">
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(metrics).map(([key, value]) => (
                    <ScoreBar key={key} label={key.replace(/_/g, " ")} value={Number(value)} />
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  These describe conversation characteristics, not the other person's feelings.
                </p>
              </Panel>
            ) : null}

            {replies.length ? (
              <Panel title="Reply options">
                <div className="space-y-3">
                  {replies.map((reply, i) => (
                    <article key={i} className="rounded-xl bg-elevated p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                          {reply.style ?? "Natural"}
                        </span>
                        <RiskBadge risk={reply.risk} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed">{reply.text}</p>
                      {reply.reason ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Why: </span>
                          {reply.reason}
                        </p>
                      ) : null}
                      {reply.goal ? (
                        <p className="mt-1 text-xs text-muted-foreground">Goal: {reply.goal}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            navigator.clipboard.writeText(reply.text);
                            toast.success("Copied");
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </Button>
                        {[
                          { label: "Shorter", instruction: "Make it noticeably shorter." },
                          { label: "More casual", instruction: "Make it more casual and relaxed." },
                          {
                            label: "Sound like me",
                            instruction: "Rewrite it in the user's own saved writing style.",
                          },
                        ].map((action) => (
                          <Button
                            key={action.label}
                            size="sm"
                            variant="ghost"
                            disabled={refine.isPending}
                            onClick={() => refine.mutate({ index: i, instruction: action.instruction })}
                          >
                            {action.label === "Sound like me" ? (
                              <Sparkle className="h-3.5 w-3.5" />
                            ) : (
                              <RefreshCw className="h-3.5 w-3.5" />
                            )}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {result.coaching ? (
              <Panel title="Coach">
                <p className="text-sm">{String(result.coaching.observation ?? "")}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {String(result.coaching.suggestion ?? "")}
                </p>
                {result.coaching.skill ? (
                  <p className="mt-3 text-xs text-primary">Skill: {String(result.coaching.skill)}</p>
                ) : null}
              </Panel>
            ) : null}

            {Array.isArray(result.observations) && result.observations.length ? (
              <Panel title="Observations">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.observations.map((o: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </Panel>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
