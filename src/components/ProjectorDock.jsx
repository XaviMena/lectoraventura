import React, { useEffect, useRef, useState } from "react";
import {
  GripVertical,
  Minimize2,
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
    isDockMinimized,
    setIsDockMinimized,
    isDockPinned,
    setIsDockPinned,
    dockPosition,
    setDockPosition,
  } = useSettings();

  const dockRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [dragPos, setDragPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveredReveal, setIsHoveredReveal] = useState(false);

  const minPx = 22;
  const maxPx = 44;

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const revealDock = () => {
    clearHideTimer();
    setIsHoveredReveal(true);
  };

  const scheduleHideDock = (delay = 1700) => {
    clearHideTimer();
    if (isDockPinned || isDragging) return;
    hideTimerRef.current = setTimeout(() => {
      const active = document.activeElement;
      if (dockRef.current && active && dockRef.current.contains(active) && active.tagName === "SELECT") {
        return;
      }
      setIsHoveredReveal(false);
    }, delay);
  };

  useEffect(() => () => clearHideTimer(), []);

  const clampPosition = (x, y) => {
    const el = dockRef.current;
    const width = el ? el.offsetWidth : 340;
    const height = el ? el.offsetHeight : 80;
    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);
    return {
      x: Math.min(maxX, Math.max(margin, x)),
      y: Math.min(maxY, Math.max(margin, y)),
    };
  };

  useEffect(() => {
    if (!dockPosition) return;
    const handleResize = () => {
      const clamped = clampPosition(dockPosition.x, dockPosition.y);
      if (clamped.x !== dockPosition.x || clamped.y !== dockPosition.y) {
        setDockPosition(clamped);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dockPosition, setDockPosition]);

  useEffect(() => {
    if (!dockPosition) return;
    const id = requestAnimationFrame(() => {
      const clamped = clampPosition(dockPosition.x, dockPosition.y);
      if (clamped.x !== dockPosition.x || clamped.y !== dockPosition.y) {
        setDockPosition(clamped);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [isDockMinimized]);

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
    const el = dockRef.current;
    if (!el) return;
    e.preventDefault();
    revealDock();

    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const originX = rect.left;
    const originY = rect.top;

    let currentPos = clampPosition(originX, originY);
    setIsDragging(true);
    setDragPos(currentPos);

    const onMove = (ev) => {
      const nextX = originX + (ev.clientX - startX);
      const nextY = originY + (ev.clientY - startY);
      currentPos = clampPosition(nextX, nextY);
      setDragPos(currentPos);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setIsDragging(false);
      setDragPos(null);
      setDockPosition(currentPos);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const activePos = dragPos || dockPosition;
  const positionStyle = activePos
    ? { left: `${activePos.x}px`, top: `${activePos.y}px` }
    : { left: "14px", bottom: "14px" };

  const isVisible = isDockPinned || isHoveredReveal || isDragging || Boolean(dockPosition && isDockPinned);

  const surfaceClass =
    colorTheme === "dark"
      ? "bg-slate-900/95 text-slate-100 border-slate-700"
      : colorTheme === "sepia"
        ? "bg-[#fcf8ef]/95 text-[#251b10] border-[#d8cbb4]"
        : "bg-white/95 text-slate-900 border-slate-300";

  const subBtnClass =
    colorTheme === "dark"
      ? "border-slate-700 hover:bg-slate-800 text-slate-200"
      : colorTheme === "sepia"
        ? "border-[#dfd3be] hover:bg-[#efe5d1] text-[#251b10]"
        : "border-slate-200 hover:bg-slate-100 text-slate-800";

  const optionSurface =
    colorTheme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";

  const activePillClass = "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";

  return (
    <>
      {/* Zona sensible en el borde izquierdo: pasar el cursor por el lado izquierdo abre los controles */}
      {!isDockPinned && (
        <div
          onMouseEnter={revealDock}
          className="fixed top-14 bottom-0 left-0 w-7 z-30"
          aria-hidden="true"
        />
      )}

      {/* Pestaña discreta en la esquina inferior izquierda cuando la barra está oculta */}
      {!isVisible && (
        <button
          type="button"
          onMouseEnter={revealDock}
          onClick={revealDock}
          className={`fixed bottom-3 left-3 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-md backdrop-blur-md transition-opacity opacity-85 hover:opacity-100 ${surfaceClass}`}
          title="Mostrar controles de Modo Proyector (o pasa el cursor por el borde izquierdo)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Controles</span>
        </button>
      )}

      <div
        ref={dockRef}
        style={positionStyle}
        onMouseEnter={revealDock}
        onMouseLeave={() => scheduleHideDock(1600)}
        className={`fixed z-40 max-w-[min(470px,calc(100vw-24px))] lg:max-w-[min(470px,calc(43vw-20px))] transition-all duration-200 ${
          isVisible
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-6 opacity-0 pointer-events-none"
        } ${isDragging ? "shadow-2xl" : ""}`}
      >
        <div
          className={`rounded-2xl shadow-xl border backdrop-blur-md px-2.5 py-2 text-xs ${surfaceClass}`}
        >
          {isDockMinimized ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onPointerDown={handlePointerDown}
                onDoubleClick={() => setDockPosition(null)}
                title="Arrastra para mover (doble clic vuelve abajo a la izquierda)"
                aria-label="Mover barra de controles"
                className={`touch-none inline-flex items-center p-1 rounded-lg cursor-grab active:cursor-grabbing ${subBtnClass}`}
              >
                <GripVertical className="w-3.5 h-3.5 opacity-70" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setIsDockMinimized(false);
                }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold border ${subBtnClass}`}
                title="Expandir controles"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Controles</span>
              </button>
              {showReadingAids && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onToggleTeleprompter?.();
                  }}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold border ${
                    teleprompterActive ? activePillClass : subBtnClass
                  }`}
                  title="Teleprompter (Espacio)"
                >
                  {teleprompterActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsProjectorMode(false)}
                className={`inline-flex items-center p-1 rounded-lg font-semibold border ${subBtnClass}`}
                title="Salir de Modo Proyector (P)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {/* Fila 1: Agarre + Tamaño + Fuente + Selector único de Tema + Pin/Min/Salir */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onPointerDown={handlePointerDown}
                  onDoubleClick={() => setDockPosition(null)}
                  title="Arrastra para mover (doble clic vuelve abajo a la izquierda)"
                  aria-label="Mover barra de controles"
                  className={`touch-none inline-flex items-center p-1 rounded-lg cursor-grab active:cursor-grabbing ${subBtnClass}`}
                >
                  <GripVertical className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Tamaño en px */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      changeFontSize(-2);
                    }}
                    disabled={fontSizePx <= minPx}
                    className={`px-1.5 py-1 rounded-lg font-bold border disabled:opacity-35 ${subBtnClass}`}
                    title="Reducir letra"
                    aria-label="Reducir tamaño de letra"
                  >
                    A−
                  </button>
                  <span className="w-9 text-center font-mono font-bold tabular-nums text-[11px]">
                    {fontSizePx}px
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      changeFontSize(2);
                    }}
                    disabled={fontSizePx >= maxPx}
                    className={`px-1.5 py-1 rounded-lg font-bold border disabled:opacity-35 ${subBtnClass}`}
                    title="Aumentar letra"
                    aria-label="Aumentar tamaño de letra"
                  >
                    A+
                  </button>
                </div>

                {/* Fuente */}
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    e.currentTarget.blur();
                  }}
                  aria-label="Tipo de letra"
                  title="Tipo de letra"
                  className={`px-1.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer bg-transparent max-w-[125px] ${subBtnClass}`}
                >
                  {FONT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className={optionSurface}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Selector único de tema: Pizarra / Cálido / Noche */}
                <select
                  value={colorTheme}
                  onChange={(e) => {
                    setColorTheme(e.target.value);
                    e.currentTarget.blur();
                  }}
                  aria-label="Tema de proyector"
                  title="Tema de contraste"
                  className={`px-1.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer bg-transparent ${subBtnClass}`}
                >
                  <option value="light" className={optionSurface}>☀ Pizarra</option>
                  <option value="sepia" className={optionSurface}>📖 Cálido</option>
                  <option value="dark" className={optionSurface}>🌙 Noche</option>
                </select>

                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setIsDockPinned((p) => !p);
                    }}
                    title={isDockPinned ? "Auto-ocultar al salir del borde izquierdo" : "Fijar controles visibles siempre"}
                    aria-label={isDockPinned ? "Auto-ocultar controles" : "Fijar controles"}
                    className={`inline-flex items-center p-1 rounded-lg border ${
                      isDockPinned ? activePillClass : subBtnClass
                    }`}
                  >
                    {isDockPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setIsDockMinimized(true);
                    }}
                    title="Minimizar barra"
                    aria-label="Minimizar controles"
                    className={`inline-flex items-center p-1 rounded-lg border ${subBtnClass}`}
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProjectorMode(false)}
                    title="Salir de Modo Proyector (P)"
                    className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg font-bold border ${subBtnClass}`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Salir</span>
                  </button>
                </div>
              </div>

              {/* Fila 2: Teleprompter + Foco manual + Foco auto + Regla + Pausa + Ayuda */}
              <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-black/10 dark:border-white/10">
                {showReadingAids && (
                  <>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onToggleTeleprompter?.();
                        }}
                        title="Teleprompter automático (Espacio)"
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold border ${
                          teleprompterActive ? activePillClass : subBtnClass
                        }`}
                      >
                        {teleprompterActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>Tele</span>
                      </button>
                      <select
                        value={teleprompterSpeed}
                        onChange={(e) => {
                          onChangeTeleprompterSpeed?.(Number(e.target.value));
                          e.currentTarget.blur();
                        }}
                        aria-label="Velocidad de teleprompter"
                        title="Velocidad de teleprompter"
                        className={`px-1 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer bg-transparent ${subBtnClass}`}
                      >
                        <option value={18} className={optionSurface}>0.5×</option>
                        <option value={32} className={optionSurface}>1×</option>
                        <option value={50} className={optionSurface}>1.5×</option>
                        <option value={68} className={optionSurface}>2×</option>
                        <option value={88} className={optionSurface}>2.5×</option>
                        <option value={110} className={optionSurface}>3×</option>
                      </select>
                    </div>

                    {/* Foco manual + Auto-seguimiento */}
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.currentTarget.blur();
                          onToggleFocusMode?.();
                        }}
                        title="Foco manual por párrafo (F)"
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold border ${
                          focusMode ? activePillClass : subBtnClass
                        }`}
                      >
                        <Crosshair className="w-3 h-3" />
                        <span>Foco</span>
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
                            className={`px-1.5 py-1 rounded-lg font-bold border ${subBtnClass}`}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.currentTarget.blur();
                              onStepParagraph(1);
                            }}
                            title="Siguiente párrafo (↓)"
                            aria-label="Siguiente párrafo"
                            className={`px-1.5 py-1 rounded-lg font-bold border ${subBtnClass}`}
                          >
                            ↓
                          </button>
                        </>
                      )}
                      {onToggleAutoFocusSync && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.currentTarget.blur();
                            onToggleAutoFocusSync();
                          }}
                          title="Auto-avanzar Foco cuando corre el Teleprompter"
                          className={`inline-flex items-center gap-0.5 px-1.5 py-1 rounded-lg font-semibold border ${
                            autoFocusSync && focusMode ? activePillClass : subBtnClass
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Auto</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        onToggleRuler?.();
                      }}
                      title="Regla guía de lectura (R)"
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-semibold border ${
                        rulerVisible ? activePillClass : subBtnClass
                      }`}
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Regla</span>
                    </button>
                  </>
                )}

                {onToggleBlackout && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onToggleBlackout();
                    }}
                    title="Pausa en negro para conversar (B)"
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-semibold border ${subBtnClass}`}
                  >
                    <MoonStar className="w-3 h-3" />
                    <span>Pausa</span>
                  </button>
                )}

                {onToggleHelp && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onToggleHelp();
                    }}
                    title="Atajos de teclado"
                    aria-label="Atajos de teclado"
                    className={`inline-flex items-center justify-center p-1 rounded-lg font-bold border ${subBtnClass}`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
