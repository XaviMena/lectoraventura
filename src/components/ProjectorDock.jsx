import React, { useEffect, useRef, useState } from "react";
import {
  ALargeSmall,
  ArrowDown,
  ArrowUp,
  Crosshair,
  Gauge,
  Keyboard,
  LogOut,
  Monitor,
  MoonStar,
  MoveVertical,
  Pause,
  Pin,
  PinOff,
  Play,
  Ruler,
  SlidersHorizontal,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { FONT_OPTIONS, useSettings } from "../context/SettingsContext";

function MacSwitch({ checked, disabled = false, onChange, label, offTrackClass }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.currentTarget.blur();
        onChange?.();
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-35 disabled:cursor-not-allowed ${
        checked ? "bg-blue-600" : offTrackClass
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

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
        ? "bg-[#f8f1e3]/95 text-[#251b10] border-[#dfd3be]"
        : "bg-slate-50/95 text-slate-900 border-slate-200";

  const groupCardClass =
    colorTheme === "dark"
      ? "bg-slate-800/80 border-slate-700/80 divide-slate-700/70"
      : colorTheme === "sepia"
        ? "bg-[#fcf8ef] border-[#dfd3be] divide-[#e8decb]"
        : "bg-white border-slate-200/90 divide-slate-200/80";

  const controlBoxClass =
    colorTheme === "dark"
      ? "bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
      : colorTheme === "sepia"
        ? "bg-[#f6ede0] border-[#d8cbb4] text-[#251b10] hover:bg-[#efe3cf]"
        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100";

  const controlDivideClass =
    colorTheme === "dark"
      ? "divide-slate-700"
      : colorTheme === "sepia"
        ? "divide-[#d8cbb4]"
        : "divide-slate-200";

  const iconBadgeClass =
    colorTheme === "dark"
      ? "bg-slate-700/80 text-blue-300"
      : colorTheme === "sepia"
        ? "bg-amber-900/10 text-amber-800"
        : "bg-blue-50 text-blue-600";

  const mutedText =
    colorTheme === "dark"
      ? "text-slate-400"
      : colorTheme === "sepia"
        ? "text-[#6b553b]"
        : "text-slate-500";

  const optionSurface =
    colorTheme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";

  const switchOffClass =
    colorTheme === "dark"
      ? "bg-slate-600"
      : colorTheme === "sepia"
        ? "bg-[#cdbfa6]"
        : "bg-slate-300";

  const pinActiveClass = "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";

  const rowClass = "h-11 px-3 flex items-center justify-between gap-2.5";
  const leftCellClass = "flex items-center gap-2.5 min-w-0";
  const rightSlotClass = "w-[136px] shrink-0 flex items-center justify-end";
  const selectClass = `w-[136px] h-8 px-2.5 rounded-lg border text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${controlBoxClass}`;

  return (
    <>
      {/* Zona sensible en el borde izquierdo */}
      {!isDockPinned && (
        <div
          onMouseEnter={revealTemporarily}
          className="fixed top-0 bottom-0 left-0 w-5 z-40"
          aria-hidden="true"
        />
      )}

      {/* Pestaña discreta en el borde izquierdo */}
      {!isVisible && (
        <button
          type="button"
          onMouseEnter={revealTemporarily}
          onClick={revealTemporarily}
          className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 inline-flex items-center justify-center w-8 h-12 rounded-r-xl border border-l-0 shadow-md backdrop-blur-md transition-opacity opacity-75 hover:opacity-100 ${surfaceClass}`}
          title="Abrir controles (pasa el cursor por el borde izquierdo)"
          aria-label="Abrir controles"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* Menú lateral estilo panel macOS con medidas sincronizadas */}
      <aside
        ref={drawerRef}
        onMouseEnter={clearHideTimer}
        onMouseLeave={() => scheduleHide(1200)}
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 border-r shadow-2xl backdrop-blur-md flex flex-col justify-between p-4 overflow-y-auto transition-all duration-200 ${surfaceClass} ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        aria-label="Controles de Modo Proyector"
      >
        <div className="space-y-4">
          {/* Cabecera fija de 44px */}
          <div className="h-11 flex items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBadgeClass}`}>
                <SlidersHorizontal className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold tracking-tight">Controles</span>
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
                className={`h-8 inline-flex items-center gap-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                  isDockPinned ? pinActiveClass : controlBoxClass
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
                  className={`w-8 h-8 inline-flex items-center justify-center rounded-lg border transition-colors ${controlBoxClass}`}
                  title="Ocultar menú"
                  aria-label="Ocultar menú"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grupo 1: Texto y pantalla */}
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-wider px-1 mb-1.5 ${mutedText}`}>
              Texto y pantalla
            </p>
            <div className={`rounded-xl border divide-y overflow-hidden shadow-xs ${groupCardClass}`}>
              {/* Fila 1: Tamaño */}
              <div className={rowClass}>
                <div className={leftCellClass}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                    <ALargeSmall className="w-[15px] h-[15px]" />
                  </span>
                  <span className="text-[13px] font-medium truncate">Tamaño</span>
                </div>
                <div className={rightSlotClass}>
                  <div
                    className={`w-[136px] h-8 rounded-lg border grid grid-cols-[36px_1fr_36px] divide-x overflow-hidden ${controlBoxClass} ${controlDivideClass}`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        changeFontSize(-2);
                      }}
                      disabled={fontSizePx <= minPx}
                      className="flex items-center justify-center text-sm font-bold disabled:opacity-35 transition-opacity"
                      aria-label="Reducir tamaño de letra"
                    >
                      −
                    </button>
                    <span className="flex items-center justify-center font-mono text-xs font-semibold tabular-nums">
                      {fontSizePx}px
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        changeFontSize(2);
                      }}
                      disabled={fontSizePx >= maxPx}
                      className="flex items-center justify-center text-sm font-bold disabled:opacity-35 transition-opacity"
                      aria-label="Aumentar tamaño de letra"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Fila 2: Fuente */}
              <div className={rowClass}>
                <div className={leftCellClass}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                    <Type className="w-[15px] h-[15px]" />
                  </span>
                  <span className="text-[13px] font-medium truncate">Letra</span>
                </div>
                <div className={rightSlotClass}>
                  <select
                    value={fontFamily}
                    onChange={(e) => {
                      setFontFamily(e.target.value);
                      e.currentTarget.blur();
                    }}
                    aria-label="Tipo de letra"
                    className={selectClass}
                  >
                    {FONT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id} className={optionSurface}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila 3: Pantalla */}
              <div className={rowClass}>
                <div className={leftCellClass}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                    <Monitor className="w-[15px] h-[15px]" />
                  </span>
                  <span className="text-[13px] font-medium truncate">Pantalla</span>
                </div>
                <div className={rightSlotClass}>
                  <select
                    value={colorTheme}
                    onChange={(e) => {
                      setColorTheme(e.target.value);
                      e.currentTarget.blur();
                    }}
                    aria-label="Modo de pantalla"
                    className={selectClass}
                  >
                    <option value="light" className={optionSurface}>Pizarra (claro)</option>
                    <option value="sepia" className={optionSurface}>Cálido (papel)</option>
                    <option value="dark" className={optionSurface}>Noche (oscuro)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Grupo 2: Lectura en aula */}
          {showReadingAids && (
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider px-1 mb-1.5 ${mutedText}`}>
                Lectura en aula
              </p>
              <div className={`rounded-xl border divide-y overflow-hidden shadow-xs ${groupCardClass}`}>
                {/* Fila 1: Teleprompter */}
                <div className={rowClass}>
                  <div className={leftCellClass}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                      {teleprompterActive ? (
                        <Pause className="w-[15px] h-[15px]" />
                      ) : (
                        <Play className="w-[15px] h-[15px]" />
                      )}
                    </span>
                    <span className="text-[13px] font-medium truncate">Teleprompter</span>
                  </div>
                  <div className={rightSlotClass}>
                    <MacSwitch
                      checked={teleprompterActive}
                      onChange={onToggleTeleprompter}
                      label="Activar teleprompter"
                      offTrackClass={switchOffClass}
                    />
                  </div>
                </div>

                {/* Fila 2: Velocidad */}
                <div className={rowClass}>
                  <div className={leftCellClass}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                      <Gauge className="w-[15px] h-[15px]" />
                    </span>
                    <span className="text-[13px] font-medium truncate">Velocidad</span>
                  </div>
                  <div className={rightSlotClass}>
                    <select
                      value={teleprompterSpeed}
                      onChange={(e) => {
                        onChangeTeleprompterSpeed?.(Number(e.target.value));
                        e.currentTarget.blur();
                      }}
                      aria-label="Velocidad de teleprompter"
                      className={selectClass}
                    >
                      <option value={18} className={optionSurface}>0.5× · Lento</option>
                      <option value={32} className={optionSurface}>1× · Normal</option>
                      <option value={50} className={optionSurface}>1.5× · Ágil</option>
                      <option value={68} className={optionSurface}>2× · Rápido</option>
                      <option value={88} className={optionSurface}>2.5× · Muy rápido</option>
                      <option value={110} className={optionSurface}>3× · Máximo</option>
                    </select>
                  </div>
                </div>

                {/* Fila 3: Foco manual */}
                <div className={rowClass}>
                  <div className={leftCellClass}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                      <Crosshair className="w-[15px] h-[15px]" />
                    </span>
                    <span className="text-[13px] font-medium truncate">Foco manual</span>
                  </div>
                  <div className={rightSlotClass}>
                    <MacSwitch
                      checked={focusMode}
                      onChange={onToggleFocusMode}
                      label="Activar foco manual"
                      offTrackClass={switchOffClass}
                    />
                  </div>
                </div>

                {/* Fila 4: Paso de párrafo ↑ ↓ */}
                <div className={rowClass}>
                  <div className={leftCellClass}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                      <MoveVertical className="w-[15px] h-[15px]" />
                    </span>
                    <span className="text-[13px] font-medium truncate">Párrafo</span>
                  </div>
                  <div className={rightSlotClass}>
                    <div
                      className={`w-[136px] h-8 rounded-lg border grid grid-cols-2 divide-x overflow-hidden ${controlBoxClass} ${controlDivideClass}`}
                    >
                      <button
                        type="button"
                        disabled={!focusMode || !onStepParagraph}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onStepParagraph?.(-1);
                        }}
                        title="Párrafo anterior (↑)"
                        aria-label="Párrafo anterior"
                        className="flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed transition-opacity"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={!focusMode || !onStepParagraph}
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onStepParagraph?.(1);
                        }}
                        title="Siguiente párrafo (↓)"
                        aria-label="Siguiente párrafo"
                        className="flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed transition-opacity"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fila 5: Foco automático al reproducir */}
                {onToggleAutoFocusSync && (
                  <div className={rowClass}>
                    <div className={leftCellClass}>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                        <Sparkles className="w-[15px] h-[15px]" />
                      </span>
                      <span className="text-[13px] font-medium truncate">Foco automático</span>
                    </div>
                    <div className={rightSlotClass}>
                      <MacSwitch
                        checked={autoFocusSync && focusMode}
                        disabled={!focusMode}
                        onChange={onToggleAutoFocusSync}
                        label="Sincronizar foco al reproducir"
                        offTrackClass={switchOffClass}
                      />
                    </div>
                  </div>
                )}

                {/* Fila 6: Regla guía */}
                <div className={rowClass}>
                  <div className={leftCellClass}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBadgeClass}`}>
                      <Ruler className="w-[15px] h-[15px]" />
                    </span>
                    <span className="text-[13px] font-medium truncate">Regla guía</span>
                  </div>
                  <div className={rightSlotClass}>
                    <MacSwitch
                      checked={rulerVisible}
                      onChange={onToggleRuler}
                      label="Mostrar regla guía de lectura"
                      offTrackClass={switchOffClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie sincronizado */}
        <div className="space-y-2 pt-4 mt-4 border-t border-black/10 dark:border-white/10">
          {(onToggleBlackout || onToggleHelp) && (
            <div className={`grid gap-2 ${onToggleBlackout && onToggleHelp ? "grid-cols-2" : "grid-cols-1"}`}>
              {onToggleBlackout && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onToggleBlackout();
                  }}
                  className={`h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${controlBoxClass}`}
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
                  className={`h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${controlBoxClass}`}
                  title="Atajos de teclado"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Atajos</span>
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsProjectorMode(false)}
            className={`w-full h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${controlBoxClass}`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir de Modo Proyector</span>
          </button>
        </div>
      </aside>
    </>
  );
}
