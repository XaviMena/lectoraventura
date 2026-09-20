import React, { useState } from "react";
import { Download } from "lucide-react";
import { downloadStoryPdf } from "../lib/storyPdf";

export default function DownloadStoryButton({ reading, className = "", variant = "quiet" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (busy || !reading) return;
    setBusy(true);
    setError("");
    try {
      await downloadStoryPdf(reading);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el PDF. Recarga la página e inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const quiet = variant === "quiet";

  return (
    <div className={`inline-flex flex-col items-end gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className={
          quiet
            ? "inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-60 transition-colors"
            : "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-60 shadow-sm shadow-amber-700/20 transition-colors"
        }
      >
        <Download className={quiet ? "w-3.5 h-3.5" : "w-4 h-4"} />
        {busy ? "Preparando…" : quiet ? "PDF" : "Descargar cuento en PDF"}
      </button>
      {error && <span className="text-[11px] text-rose-600 font-semibold">{error}</span>}
    </div>
  );
}
