import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Crosshair,
  Ruler,
  MoonStar,
  HelpCircle,
  X,
  SlidersHorizontal,
  Pin,
  PinOff,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { FONT_OPTIONS, useSettings } from "../context/SettingsContext";

export default function ProjectorDock({
  showReadingAids = false,
  teleprompterActive = false,
  onToggleTeleprompter,
  teleprompterSpeed = 32,
  onChangeTeleprompterSpeed,
  focusMode = true,
  onToggleFocusMode,
  autoFocusSync = true,
  onToggleAutoFocusSync,
  onStepParagraph,
  rulerVisible = false,
  onToggleRuler,
  onToggleBlackout,
  onToggleHelp,
}) {
  const {
    colorTheme,
    setColorTheme,
    fontSizePx,
    changeFontSize,
    fontFamily,
    setFontFamily,
    setIsProjectorMode,
    isDockPinned,
    setIsDockPinned,
  } = useSettings();

  const drawerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [isTempVisible, setIsTempVisible] = useState(false);

  const minPx = 22;
  const maxPx = 44;

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const revealTemporarily = () => {
    clearHideTimer();
    setIsTempVisible(true);
  };

  const scheduleHide = (delay = 1400) => {
    clearHideTimer();
    if (isDockPinned) return;
    hideTimerRef.current = setTimeout(() => {
      const active = document.activeElement;
      if (drawerRef.current && active && drawerRef.current.contains(active) && active.tagName === "SELECT") {
        return;
      }
      setIsTempVisible(false);
    }, delay);
  };

  useEffect(() => () => clearHideTimer(), []);

  const isVisible = isDockPinned || isTempVisible;

  const surfaceClass =
    colorTheme === "dark"
      ? "bg-slate-900/95 text-slate-100 border-slate-800"
      : colorTheme === "sepia"
        ? "bg-[#fcf8ef]/95 text-[#251b10] border-[#dfd3be]"
        : "bg-white/95 text-slate-900 border-slate-200";

  const subBtnClass =
    colorTheme === "dark"
      ? "border-slate-700 hover:bg-slate-800 text-slate-200"
      : colorTheme === "sepia"
        ? "border-[#dfd3be] hover:bg-[#efe5d1] text-[#251b10]"
        : "border-slate-200 hover:bg-slate-100 text-slate-800";

  const mutedText =
    colorTheme === "dark"
      ? "text-slate-400"
      : colorTheme === "sepia"
        ? "text-[#5f4b34]"
        : "text-slate-500";

  const optionSurface =
    colorTheme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";

  const activePillClass = "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";

  return (
    <>
      {/* Zona sensible en el borde izquierdo (igual que el menú superior) */}
      {!isDockPinned && (
        <div
          onMouseEnter={revealTemporarily}
          className="fixed top-0 bottom-0 left-0 w-5 z-40"
          aria-hidden="true"
        />
      )}

      {/* Pestaña discreta pegada al borde izquierdo cuando el menú lateral está oculto */}
      {!isVisible && (
        <button
          type="button"
          onMouseEnter={revealTemporarily}
          onClick={revealTemporarily}
          className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 inline-flex flex-col items-center gap-1.5 px-2 py-3 rounded-r-xl border border-l-0 shadow-md backdrop-blur-md transition-opacity opacity-75 hover:opacity-100 ${surfaceClass}`}
          title="Abrir menú de controles (pasa el cursor por el borde izquierdo)"
          aria-label="Abrir controles"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* Menú lateral deslizable desde el borde izquierdo */}
      <aside
        ref={drawerRef}
        onMouseEnter={clearHideTimer}
        onMouseLeave={() => scheduleHide(1200)}
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 border-r shadow-2xl backdrop-blur-md flex flex-col justify-between p-4 sm:p-5 overflow-y-auto transition-all duration-200 ${surfaceClass} ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        aria-label="Controles de Modo Proyector"
      >
        <div className="space-y-5">
          {/* Cabecera del menú lateral */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-extrabold tracking-tight">Controles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  const next = !isDockPinned;
                  setIsDockPinned(next);
                  if (!next) setIsTempVisible(false);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  isDockPinned ? activePillClass : subBtnClass
                }`}
                title={isDockPinned ? "Auto-ocultar al quitar el cursor" : "Fijar menú lateral"}
              >
                {isDockPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                <span>{isDockPinned ? "Fijado" : "Fijar"}</span>
              </button>
              {!isDockPinned && (
                <button
                  type="button"
                  onClick={() => setIsTempVisible(false)}
                  className={`p-1 rounded-lg border ${subBtnClass}`}
                  title="Ocultar menú"
                  aria-label="Ocultar menú"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sección 1: Texto y contraste */}
          <div className="space-y-3">
            <p className={`text-[11px] font-bold uppercase tracking-wider ${mutedText}`}>
              Texto y pantalla
            </p>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold">Tamaño</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    changeFontSize(-2);
                  }}
                  disabled={fontSizePx <= minPx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border disabled:opacity-35 ${subBtnClass}`}
                  aria-label="Reducir tamaño de letra"
                >
                  A−
                </button>
                <span className="w-11 text-center font-mono font-bold tabular-nums text-xs">
                  {fontSizePx}px
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    changeFontSize(2);
                  }}
                  disabled={fontSizePx >= maxPx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border disabled:opacity-35 ${subBtnClass}`}
                  aria-label="Aumentar tamaño de letra"
                >
                  A+
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-semibold block ${mutedText}`}>Tipo de letra</label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  e.currentTarget.blur();
                }}
                aria-label="Tipo de letra"
                className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer bg-transparent ${subBtnClass}`}
              >
                {FONT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className={optionSurface}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-semibold block ${mutedText}`}>Modo de pantalla</label>
              <select
                value={colorTheme}
                onChange={(e) => {
                  setColorTheme(e.target.value);
                  e.currentTarget.blur();
                }}
                aria-label="Modo de pantalla"
                className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer bg-transparent ${subBtnClass}`}
              >
                <option value="light" className={optionSurface}>☀ Pizarra (claro)</option>
                <option value="sepia" className={optionSurface}>📖 Cálido (papel)</option>
                <option value="dark" className={optionSurface}>🌙 Noche (oscuro)</option>
              </select>
            </div>
          </div>

          {/* Sección 2: Lectura y Teleprompter */}
          {showReadingAids && (
            <div className="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
              <p className={`text-[11px] font-bold uppercase tracking-wider ${mutedText}`}>
                Lectura en aula
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onToggleTeleprompter?.();
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border ${
                    teleprompterActive ? activePillClass : subBtnClass
                  }`}
                >
                  {teleprompterActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{teleprompterActive ? "Pausar Teleprompter" : "Teleprompter"}</span>
                </button>
                <select
                  value={teleprompterSpeed}
                  onChange={(e) => {
                    onChangeTeleprompterSpeed?.(Number(e.target.value));
                    e.currentTarget.blur();
                  }}
                  aria-label="Velocidad de teleprompter"
                  className={`px-2 py-2 rounded-xl text-xs font-bold border cursor-pointer bg-transparent ${subBtnClass}`}
                >
                  <option value={18} className={optionSurface}>0.5×</option>
                  <option value={32} className={optionSurface}>1×</option>
                  <option value={50} className={optionSurface}>1.5×</option>
                  <option value={68} className={optionSurface}>2×</option>
                  <option value={88} className={optionSurface}>2.5×</option>
                  <option value={110} className={optionSurface}>3×</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onToggleFocusMode?.();
                    }}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border ${
                      focusMode ? activePillClass : subBtnClass
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Foco manual</span>
                  </button>
                  {focusMode && onStepParagraph && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onStepParagraph(-1);
                        }}
                        title="Párrafo anterior (↑)"
                        aria-label="Párrafo anterior"
                        className={`p-2 rounded-xl border ${subBtnClass}`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onStepParagraph(1);
                        }}
                        title="Siguiente párrafo (↓)"
                        aria-label="Siguiente párrafo"
                        className={`p-2 rounded-xl border ${subBtnClass}`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

                {onToggleAutoFocusSync && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onToggleAutoFocusSync();
                    }}
                    className={`w-full inline-flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border ${
                      autoFocusSync && focusMode ? activePillClass : subBtnClass
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Foco automático al reproducir</span>
                    </span>
                    <span className="text-[11px] font-bold">
                      {autoFocusSync && focusMode ? "Sí" : "No"}
                    </span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onToggleRuler?.();
                }}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${
                  rulerVisible ? activePillClass : subBtnClass
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Regla guía de lectura</span>
              </button>
            </div>
          )}
        </div>

        {/* Pie del menú lateral */}
        <div className="space-y-2 pt-4 mt-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            {onToggleBlackout && (
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onToggleBlackout();
                }}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border ${subBtnClass}`}
              >
                <MoonStar className="w-3.5 h-3.5" />
                <span>Pausa (B)</span>
              </button>
            )}
            {onToggleHelp && (
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onToggleHelp();
                }}
                className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border ${subBtnClass}`}
                title="Atajos de teclado"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Atajos</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsProjectorMode(false)}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border ${subBtnClass}`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Salir de Modo Proyector</span>
          </button>
        </div>
      </aside>
    </>
  );
}
