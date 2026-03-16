"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilePlus, RefreshCw, Sparkles, Copy, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getTranscript, getTranscripts, saveTranscript, mockSummarize, TranscriptRecord,
} from "@/lib/transcript-store";
import { useLanguage } from "@/components/language-provider";

function ResultView({ record, onNew }: { record: TranscriptRecord; onNew: () => void }) {
  const [summary, setSummary] = useState(record.summary ?? "");
  const [summarizing, setSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  async function handleSummarize() {
    setSummarizing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const s = mockSummarize(record.segments);
    setSummary(s);
    saveTranscript({ ...record, summary: s });
    setSummarizing(false);
  }

  function handleCopy() {
    const text = record.segments.map((s) => `[${s.start}] ${s.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const text = record.segments.map((s) => `[${s.start}] ${s.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.fileName.replace(/\.[^.]+$/, "")}_transkript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <FilePlus className="size-4" /> {t("common.new")}
        </button>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <RefreshCw className="size-4" /> {t("common.retry")}
        </button>
        <button
          onClick={handleSummarize}
          disabled={summarizing}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
            summarizing && "cursor-wait opacity-60"
          )}
        >
          <Sparkles className="size-4" />
          {summarizing ? t("common.summarizing") : t("common.summarize")}
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="rounded-lg border p-1.5 transition-colors hover:bg-accent"
            title={t("common.copy")}
          >
            <Copy className={cn("size-4", copied && "text-green-500")} />
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg border p-1.5 transition-colors hover:bg-accent"
            title={t("common.download")}
          >
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="text-muted-foreground flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {record.duration}
        </span>
        <span>{record.model}</span>
        <span className="truncate max-w-xs">{record.fileName}</span>
      </div>

      {/* Summary */}
      {summary && (
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4" /> {t("common.summarize")}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Segment list */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="max-h-[65vh] divide-y overflow-y-auto">
          {record.segments.map((seg, i) => (
            <div
              key={i}
              className="flex gap-4 px-5 py-3 transition-colors hover:bg-muted/30"
            >
              <span className="text-muted-foreground shrink-0 pt-0.5 font-mono text-xs">
                {seg.start}
              </span>
              <p className="text-sm leading-relaxed">{seg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TranscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [record, setRecord] = useState<TranscriptRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (id) {
      const found = getTranscript(id);
      if (found) setRecord(found);
      else setNotFound(true);
    } else {
      const all = getTranscripts();
      if (all.length > 0) setRecord(all[0]);
      else setNotFound(true);
    }
  }, [id]);

  function handleNew() {
    router.push("/dashboard");
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-muted-foreground text-sm">{t("recordings.noRecordings")}</p>
        <Button onClick={handleNew} size="sm">{t("common.new")} {t("transcribe.title")}</Button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return <ResultView record={record} onNew={handleNew} />;
}

export default function TranscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      }
    >
      <TranscribeContent />
    </Suspense>
  );
}
