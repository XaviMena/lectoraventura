import React from "react";
import { Maximize2, ZoomIn, ZoomOut, Sun, Moon, BookOpen, Monitor } from "lucide-react";

export default function ProjectorControls({
  isProjectorMode,
  setIsProjectorMode,
  fontSizePx,
  changeFontSize,
  colorTheme,
  setColorTheme,
}) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable full-screen: ${err.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const minPx = isProjectorMode ? 22 : 15;
  const maxPx = isProjectorMode ? 44 : 28;

  const iconBtn = (active) =>
    `inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 p-2.5 sm:p-1.5 rounded-md transition-colors ${
      active
        ? "text-slate-900 dark:text-white"
        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 text-slate-400">
      <button
        type="button"
        onClick={() => changeFontSize(-2)}
        disabled={fontSizePx <= minPx}
        title="Reducir texto"
        className={`${iconBtn(false)} disabled:opacity-30`}
        aria-label="Reducir tamaño de letra"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => changeFontSize(2)}
        disabled={fontSizePx >= maxPx}
        title="Aumentar texto"
        className={`${iconBtn(false)} disabled:opacity-30`}
        aria-label="Aumentar tamaño de letra"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

      <button type="button" onClick={() => setColorTheme("light")} title="Tema claro" className={iconBtn(colorTheme === "light")} aria-label="Tema claro">
        <Sun className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => setColorTheme("sepia")} title="Tema sepia" className={iconBtn(colorTheme === "sepia")} aria-label="Tema sepia">
        <BookOpen className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => setColorTheme("dark")} title="Tema oscuro" className={iconBtn(colorTheme === "dark")} aria-label="Tema oscuro">
        <Moon className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

      <button type="button" onClick={toggleFullscreen} title="Pantalla completa" className={`${iconBtn(false)} hidden sm:inline-flex`} aria-label="Pantalla completa">
        <Maximize2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setIsProjectorMode((prev) => !prev)}
        title="Modo Proyector"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
          isProjectorMode
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
        aria-pressed={isProjectorMode}
      >
        <Monitor className="w-4 h-4" />
        <span>Modo Proyector</span>
      </button>
    </div>
  );
}

