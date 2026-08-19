import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageDropzone, Loading, PageHeader, Panel, PrimaryButton } from "@/components/coach-ui";
import { analyzeProfile } from "@/lib/coach.functions";
import { errorMessage, store } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Instagram profile analyzer — Talksy" },
      {
        name: "description",
        content:
          "Turn publicly visible Instagram bio, captions or screenshots into conversation topics and natural openers.",
      },
      { property: "og:title", content: "Instagram profile analyzer — Talksy" },
      {
        property: "og:description",
        content: "Find genuine conversation topics from public profile information.",
      },
    ],
  }),
  component: ProfilePage,
});

const STRENGTH_ICON: Record<string, string> = {
  strong: "🔥",
  good: "🟢",
  possible: "🟡",
};

function ProfilePage() {
  const [handle, setHandle] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const analyzeFn = useServerFn(analyzeProfile);

  const mutation = useMutation({
    mutationFn: async () => {
      const cleaned = handle.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "");
      if (handle.trim() && !/^[\w.]{1,30}$/.test(cleaned)) {
        throw new Error("That doesn't look like a valid Instagram profile.");
      }
      return analyzeFn({ data: { handle: cleaned, notes, images } });
    },
    onSuccess: (data) => {
      setResult(data);
      store.addHistory({ type: "profile", title: `@${handle || "profile"}`, data });
    },
    onError: (error) =>
      toast.error("Couldn't analyze that profile", {
        description: errorMessage(
          error,
          "We couldn't access enough public information. Try uploading screenshots of the public profile instead.",
        ),
      }),
  });

  return (
    <>
      <PageHeader
        title="Profile analyzer"
        subtitle="Public information only. We never log in as you, bypass private accounts or scrape restricted data."
      />

      <div className="space-y-4">
        <Panel title="Public profile input">
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@username or instagram.com/username"
            className="bg-elevated"
          />
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Paste the public bio and a few public captions here."
            className="mt-3 resize-none bg-elevated"
          />
          <div className="mt-3">
            <ImageDropzone
              images={images}
              onChange={setImages}
              hint="Or upload screenshots of the public profile (up to 4)."
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <PrimaryButton loading={mutation.isPending} onClick={() => mutation.mutate()}>
              Analyze profile
            </PrimaryButton>
            {mutation.isPending ? <Loading label="Reading public content…" /> : null}
          </div>
        </Panel>

        {result ? (
          <>
            <Panel title="Profile overview">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Observed</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {(result.observed ?? []).map((o: string, i: number) => (
                      <li key={i}>• {o}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    Content themes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[...(result.themes ?? []), ...(result.interests ?? [])].map(
                      (t: string, i: number) => (
                        <span key={i} className="rounded-full bg-elevated px-3 py-1 text-xs">
                          {t}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
              {result.caveat ? (
                <p className="mt-4 text-xs text-muted-foreground">{String(result.caveat)}</p>
              ) : null}
            </Panel>

            {Array.isArray(result.opportunities) && result.opportunities.length ? (
              <Panel title="Conversation opportunities">
                <div className="space-y-2">
                  {result.opportunities.map((o: any, i: number) => (
                    <div key={i} className="rounded-xl bg-elevated p-3 text-sm">
                      <p className="font-medium">
                        {STRENGTH_ICON[String(o.strength ?? "").toLowerCase()] ?? "🟡"} {o.topic}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{o.evidence}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            ) : null}

            {Array.isArray(result.starters) && result.starters.length ? (
              <Panel title="Conversation starters">
                <div className="space-y-3">
                  {result.starters.map((s: any, i: number) => (
                    <article key={i} className="rounded-xl bg-elevated p-3">
                      <p className="text-sm">{s.text}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Based on: {s.based_on} — {s.why}
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-3"
                        onClick={() => {
                          navigator.clipboard.writeText(String(s.text));
                          toast.success("Copied");
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </Button>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
