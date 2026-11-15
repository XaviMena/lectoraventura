import React, { useEffect, useRef, useState } from "react";
import {
  GripVertical,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  Crosshair,
  Ruler,
  MoonStar,
  HelpCircle,
  Sun,
  BookOpen,
  Moon,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { FONT_OPTIONS, useSettings } from "../context/SettingsContext";

export default function ProjectorDock({
  showReadingAids = false,
  teleprompterActive = false,
  onToggleTeleprompter,
  teleprompterSpeed = 32,
  onChangeTeleprompterSpeed,
  focusMode = false,
  onToggleFocusMode,
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
    dockPosition,
    setDockPosition,
  } = useSettings();

  const dockRef = useRef(null);
  const [dragPos, setDragPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const minPx = 22;
  const maxPx = 44;

  const clampPosition = (x, y) => {
    const el = dockRef.current;
    const width = el ? el.offsetWidth : 280;
    const height = el ? el.offsetHeight : 52;
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

  // Re-clamp when toggling minimized <-> expanded so it never overflows the right/bottom edge
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
    : { left: "50%", bottom: "14px", transform: "translateX(-50%)" };

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

  const dividerClass =
    colorTheme === "dark"
      ? "bg-slate-700"
      : colorTheme === "sepia"
        ? "bg-[#dfd3be]"
        : "bg-slate-200";

  const activePillClass = "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";

  return (
    <div
      ref={dockRef}
      style={positionStyle}
      className={`fixed z-40 max-w-[96vw] transition-opacity ${
        isDragging ? "opacity-100 shadow-2xl" : "opacity-90 hover:opacity-100 focus-within:opacity-100"
      }`}
    >
      <div
        className={`flex flex-wrap items-center gap-1.5 px-2.5 py-2 rounded-2xl shadow-xl border backdrop-blur-md text-xs sm:text-sm ${surfaceClass}`}
      >
        {/* Asa movible */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onDoubleClick={() => setDockPosition(null)}
          title="Arrastra para mover los controles (doble clic para centrar abajo)"
          aria-label="Mover barra de controles"
          className={`touch-none inline-flex items-center gap-1 px-1.5 py-1.5 rounded-lg cursor-grab active:cursor-grabbing ${subBtnClass}`}
        >
          <GripVertical className="w-4 h-4 opacity-70" />
        </button>

        {isDockMinimized ? (
          <>
            <button
              type="button"
              onClick={() => setIsDockMinimized(false)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold border ${subBtnClass}`}
              title="Mostrar controles de Modo Proyector"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Controles</span>
            </button>
            {showReadingAids && (
              <button
                type="button"
                onClick={onToggleTeleprompter}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold border ${
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
              className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg font-semibold border ${subBtnClass}`}
              title="Salir de Modo Proyector (P)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            {/* Tamaño en px */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeFontSize(-2)}
                disabled={fontSizePx <= minPx}
                className={`px-2 py-1 rounded-lg font-bold border disabled:opacity-35 ${subBtnClass}`}
                title="Reducir letra"
                aria-label="Reducir tamaño de letra"
              >
                A−
              </button>
              <span className="w-10 text-center font-mono font-bold tabular-nums text-xs">
                {fontSizePx}px
              </span>
              <button
                type="button"
                onClick={() => changeFontSize(2)}
                disabled={fontSizePx >= maxPx}
                className={`px-2 py-1 rounded-lg font-bold border disabled:opacity-35 ${subBtnClass}`}
                title="Aumentar letra"
                aria-label="Aumentar tamaño de letra"
              >
                A+
              </button>
            </div>

            <span className={`w-px h-5 ${dividerClass}`} />

            {/* Selector de fuente legible */}
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              aria-label="Tipo de letra"
              title="Tipo de letra"
              className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer bg-transparent ${subBtnClass}`}
            >
              {FONT_OPTIONS.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  className={colorTheme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}
                >
                  {opt.label}
                </option>
              ))}
            </select>

            <span className={`w-px h-5 ${dividerClass}`} />

            {/* 3 temas de alto contraste */}
            <div className="flex items-center gap-1" role="group" aria-label="Tema del proyector">
              <button
                type="button"
                onClick={() => setColorTheme("light")}
                title="Pizarra clara"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${
                  colorTheme === "light" ? activePillClass : subBtnClass
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pizarra</span>
              </button>
              <button
                type="button"
                onClick={() => setColorTheme("sepia")}
                title="Papel cálido"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${
                  colorTheme === "sepia" ? activePillClass : subBtnClass
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cálido</span>
              </button>
              <button
                type="button"
                onClick={() => setColorTheme("dark")}
                title="Noche proyector"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${
                  colorTheme === "dark" ? activePillClass : subBtnClass
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Noche</span>
              </button>
            </div>

            {showReadingAids && (
              <>
                <span className={`w-px h-5 ${dividerClass}`} />

                {/* Teleprompter + velocidad */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onToggleTeleprompter?.();
                    }}
                    title="Teleprompter automático (Espacio)"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      teleprompterActive ? activePillClass : subBtnClass
                    }`}
                  >
                    {teleprompterActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Teleprompter</span>
                  </button>
                  <select
                    value={teleprompterSpeed}
                    onChange={(e) => {
                      onChangeTeleprompterSpeed?.(Number(e.target.value));
                      e.currentTarget.blur();
                    }}
                    aria-label="Velocidad de teleprompter"
                    title="Velocidad de teleprompter"
                    className={`px-1.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer bg-transparent ${subBtnClass}`}
                  >
                    <option value={18} className={colorTheme === "dark" ? "bg-slate-900" : "bg-white"}>0.5×</option>
                    <option value={32} className={colorTheme === "dark" ? "bg-slate-900" : "bg-white"}>1×</option>
                    <option value={50} className={colorTheme === "dark" ? "bg-slate-900" : "bg-white"}>1.5×</option>
                    <option value={68} className={colorTheme === "dark" ? "bg-slate-900" : "bg-white"}>2×</option>
                    <option value={88} className={colorTheme === "dark" ? "bg-slate-900" : "bg-white"}>2.5×</option>
                    <option value={110} className={colorTheme === "dark" ? "bg-slate-900" : "bg-white"}>3×</option>
                  </select>
                </div>

                {/* Foco por párrafo + flechas rápidas */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onToggleFocusMode?.();
                    }}
                    title="Foco por párrafo (F)"
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border ${
                      focusMode ? activePillClass : subBtnClass
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Foco</span>
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
                        className={`px-1.5 py-1 rounded-lg text-xs font-bold border ${subBtnClass}`}
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
                        className={`px-1.5 py-1 rounded-lg text-xs font-bold border ${subBtnClass}`}
                      >
                        ↓
                      </button>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onToggleRuler?.();
                  }}
                  title="Regla guía de lectura (R)"
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${
                    rulerVisible ? activePillClass : subBtnClass
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Regla</span>
                </button>
              </>
            )}

            <span className={`w-px h-5 ${dividerClass}`} />

            {onToggleBlackout && (
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  onToggleBlackout();
                }}
                title="Pausa en negro para conversar (B)"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${subBtnClass}`}
              >
                <MoonStar className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Pausa</span>
              </button>
            )}

            {onToggleHelp && (
              <button
                type="button"
                onClick={onToggleHelp}
                title="Atajos de teclado"
                aria-label="Atajos de teclado"
                className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold border ${subBtnClass}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDockMinimized(true)}
              title="Minimizar barra para que no ocupe espacio"
              aria-label="Minimizar controles"
              className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-semibold border ${subBtnClass}`}
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsProjectorMode(false)}
              title="Salir de Modo Proyector (P)"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${subBtnClass}`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
