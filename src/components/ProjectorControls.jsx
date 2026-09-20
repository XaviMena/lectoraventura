import React from "react";
import { Maximize2, ZoomIn, ZoomOut, Sun, Moon, BookOpen, Monitor } from "lucide-react";

export default function ProjectorControls({
  isProjectorMode,
  setIsProjectorMode,
  fontSize,
  setFontSize,
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

  const increaseFont = () => {
    if (fontSize === "base") setFontSize("lg");
    else if (fontSize === "lg") setFontSize("xl");
    else if (fontSize === "xl") setFontSize("2xl");
    else if (fontSize === "2xl") setFontSize("3xl");
  };

  const decreaseFont = () => {
    if (fontSize === "3xl") setFontSize("2xl");
    else if (fontSize === "2xl") setFontSize("xl");
    else if (fontSize === "xl") setFontSize("lg");
    else if (fontSize === "lg") setFontSize("base");
  };

  const iconBtn = (active) =>
    `p-1.5 rounded-md transition-colors ${
      active
        ? "text-slate-900 dark:text-white"
        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
    }`;

  return (
    <div className="flex items-center gap-0.5 text-slate-400">
      <button
        type="button"
        onClick={decreaseFont}
        disabled={fontSize === "base"}
        title="Reducir texto"
        className={`${iconBtn(false)} disabled:opacity-30`}
        aria-label="Reducir tamaño de letra"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={increaseFont}
        disabled={fontSize === "3xl"}
        title="Aumentar texto"
        className={`${iconBtn(false)} disabled:opacity-30`}
        aria-label="Aumentar tamaño de letra"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1.5" />

      <button type="button" onClick={() => setColorTheme("light")} title="Tema claro" className={iconBtn(colorTheme === "light")} aria-label="Tema claro">
        <Sun className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => setColorTheme("sepia")} title="Tema sepia" className={iconBtn(colorTheme === "sepia")} aria-label="Tema sepia">
        <BookOpen className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => setColorTheme("dark")} title="Tema oscuro" className={iconBtn(colorTheme === "dark")} aria-label="Tema oscuro">
        <Moon className="w-4 h-4" />
      </button>

      <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1.5" />

      <button type="button" onClick={toggleFullscreen} title="Pantalla completa" className={iconBtn(false)} aria-label="Pantalla completa">
        <Maximize2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          const next = !isProjectorMode;
          setIsProjectorMode(next);
          if (next && (fontSize === "base" || fontSize === "lg")) {
            setFontSize("xl");
          }
        }}
        title="Modo proyector"
        className={`inline-flex items-center gap-1.5 px-1.5 py-1 text-sm transition-colors ${
          isProjectorMode
            ? "text-slate-900 dark:text-white"
            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
        aria-pressed={isProjectorMode}
      >
        <Monitor className="w-4 h-4" />
        <span className="hidden xl:inline">Proyector</span>
      </button>
    </div>
  );
}
