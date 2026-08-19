import { Loader2, ImagePlus, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fileToDataUrl } from "@/lib/store";

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
  action,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("panel p-4 md:p-5", className)}>
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-elevated p-3">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

export function ScoreBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (Number(value) / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-display font-semibold">
          {Number.isFinite(value) ? Number(value).toFixed(max === 10 ? 1 : 0) : "–"}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function RiskBadge({ risk }: { risk?: string | undefined }) {
  const key = (risk ?? "Low").toLowerCase();
  const tone =
    key === "high"
      ? "text-risk-high border-risk-high/40 bg-risk-high/10"
      : key === "medium"
        ? "text-risk-medium border-risk-medium/40 bg-risk-medium/10"
        : "text-risk-low border-risk-low/40 bg-risk-low/10";
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", tone)}>
      {risk ?? "Low"} risk
    </span>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function ImageDropzone({
  images,
  onChange,
  hint,
}: {
  images: string[];
  onChange: (next: string[]) => void;
  hint: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} alt="Uploaded screenshot" className="h-20 w-16 rounded-lg object-cover" />
            <button
              type="button"
              aria-label="Remove screenshot"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-elevated text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <label className="grid h-20 w-16 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <ImagePlus className="h-5 w-5" />
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              const urls = await Promise.all(files.map(fileToDataUrl));
              onChange([...images, ...urls].slice(0, 4));
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  ...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return (
    <Button {...props} disabled={loading || props.disabled} className={cn("w-full sm:w-auto", props.className)}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}
