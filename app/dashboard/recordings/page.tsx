"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Download, Trash2, Search, Clock, Cpu, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTranscripts, deleteTranscript, TranscriptRecord } from "@/lib/transcript-store";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("tr-TR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function RecordItem({ record, onDelete, t }: { record: TranscriptRecord; onDelete: (id: string) => void; t: (k: string) => string }) {
  const [expanded, setExpanded] = useState(false);

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
    <div className="border-t first:border-t-0">
      {/* Row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="bg-muted rounded-lg p-2 shrink-0">
          <FileText className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{record.fileName}</p>
          <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
            <span>{formatDate(record.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock className="size-3" />{record.duration}</span>
            <span className="flex items-center gap-1"><Cpu className="size-3" />{record.model}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {record.summary && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <Sparkles className="size-3" /> Özet
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="hover:bg-accent rounded-md p-1.5 transition-colors"
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          <button onClick={handleDownload} className="hover:bg-accent rounded-md p-1.5 transition-colors" title={t("common.download")}>
            <Download className="size-4" />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="hover:bg-destructive/10 text-destructive rounded-md p-1.5 transition-colors"
            title={t("common.delete")}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t bg-muted/20 px-5 py-4 space-y-3">
          {record.summary && (
            <div className="rounded-lg border bg-card p-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">
                <Sparkles className="size-3" /> Özet
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{record.summary}</p>
            </div>
          )}
          <div className="max-h-64 overflow-y-auto rounded-lg border bg-card divide-y">
            {record.segments.map((seg, i) => (
              <div key={i} className="flex gap-4 px-4 py-2.5">
                <span className="text-muted-foreground font-mono text-xs shrink-0 pt-0.5">{seg.start}</span>
                <p className="text-sm leading-relaxed">{seg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useLanguage } from "@/components/language-provider";

export default function RecordingsPage() {
  const [records, setRecords] = useState<TranscriptRecord[]>([]);
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    setRecords(getTranscripts());
  }, []);

  function handleDelete(id: string) {
    deleteTranscript(id);
    setRecords(getTranscripts());
  }

  const filtered = records.filter((r) =>
    r.fileName.toLowerCase().includes(search.toLowerCase()) ||
    r.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("recordings.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {records.length > 0 ? `${records.length} ${t("recordings.title").toLowerCase()}` : ""}
          </p>
        </div>
        {records.length > 0 && (
          <Button asChild size="sm">
            <Link href="/dashboard">{t("sidebar.transcribe")}</Link>
          </Button>
        )}
      </div>

      {/* Search */}
      {records.length > 0 && (
        <div className="relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("recordings.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-input bg-background placeholder:text-muted-foreground flex h-10 w-full max-w-sm rounded-md border py-2 pl-9 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      )}

      {/* Empty state */}
      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-20 text-center">
          <div className="bg-muted rounded-xl p-4">
            <FileText className="text-muted-foreground size-8" />
          </div>
          <div>
            <p className="font-medium">{t("recordings.noRecordings")}</p>
            <p className="text-muted-foreground mt-0.5 text-sm">{t("recordings.noRecordingsDesc")}</p>
          </div>
          <Button asChild size="sm" className="mt-2">
            <Link href="/dashboard">{t("sidebar.transcribe")}</Link>
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-12 text-center">
          <p className="text-muted-foreground text-sm">"{search}" bulunamadı.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          {filtered.map((record) => (
            <RecordItem key={record.id} record={record} onDelete={handleDelete} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
