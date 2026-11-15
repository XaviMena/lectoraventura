import React, { useEffect, useRef, useState } from "react";
import {
  ALargeSmall,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  Crosshair,
  Gauge,
  Keyboard,
  LogOut,
  Monitor,
  Moon,
  MoonStar,
  Pause,
  Pin,
  PinOff,
  Play,
  Ruler,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";
import { FONT_OPTIONS, useSettings } from "../context/SettingsContext";

const SPEED_OPTIONS = [
  { value: 18, label: "0.5× · Lento" },
  { value: 32, label: "1× · Normal" },
  { value: 50, label: "1.5× · Ágil" },
  { value: 68, label: "2× · Rápido" },
  { value: 88, label: "2.5× · Muy rápido" },
  { value: 110, label: "3× · Máximo" },
];

const THEME_OPTIONS = [
  { id: "light", label: "Pizarra (claro)", Icon: Sun },
  { id: "sepia", label: "Cálido (papel)", Icon: BookOpen },
  { id: "dark", label: "Noche (oscuro)", Icon: Moon },
];

function RailButton({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  hideTooltip = false,
  onClick,
  baseClass,
  activeClass,
  tooltipClass,
  children,
}) {
  return (
    <div className="relative flex items-center justify-center group">
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.currentTarget.blur();
          onClick?.(e);
        }}
        aria-label={label}
        aria-pressed={active}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-30 disabled:cursor-not-allowed ${
          active ? activeClass : baseClass
        }`}
      >
        <Icon className="w-[18px] h-[18px]" />
      </button>

      {!hideTooltip && (
        <span
          className={`pointer-events-none absolute left-full ml-2.5 px-2.5 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap shadow-md opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-50 ${tooltipClass}`}
        >
          {label}
        </span>
      )}

      {children}
    </div>
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

  const containerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [isTempVisible, setIsTempVisible] = useState(false);
  const [openFlyout, setOpenFlyout] = useState(null); // "size" | "font" | "theme" | "speed" | null

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

  const scheduleHide = (delay = 1100) => {
    clearHideTimer();
    if (isDockPinned) return;
    hideTimerRef.current = setTimeout(() => {
      setOpenFlyout(null);
      setIsTempVisible(false);
    }, delay);
  };

  useEffect(() => () => clearHideTimer(), []);

  useEffect(() => {
    if (!openFlyout) return;
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenFlyout(null);
      }
    };
    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [openFlyout]);

  const isVisible = isDockPinned || isTempVisible;

  const railSurface =
    colorTheme === "dark"
      ? "bg-slate-900 text-slate-100 border-slate-800"
      : colorTheme === "sepia"
        ? "bg-[#fcf8ef] text-[#251b10] border-[#dfd3be]"
        : "bg-white text-slate-800 border-slate-200";

  const iconDefaultClass =
    colorTheme === "dark"
      ? "text-slate-300 hover:bg-slate-800 hover:text-white"
      : colorTheme === "sepia"
        ? "text-[#4b3a27] hover:bg-[#efe4d0] hover:text-[#251b10]"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950";

  const iconActiveClass = "bg-blue-600 text-white shadow-xs hover:bg-blue-700";

  const dividerClass =
    colorTheme === "dark"
      ? "bg-slate-800"
      : colorTheme === "sepia"
        ? "bg-[#e3d7c3]"
        : "bg-slate-200";

  const flyoutSurface =
    colorTheme === "dark"
      ? "bg-slate-900 text-slate-100 border-slate-700"
      : colorTheme === "sepia"
        ? "bg-[#fcf8ef] text-[#251b10] border-[#d8cbb4]"
        : "bg-white text-slate-900 border-slate-200";

  const flyoutItemDefault =
    colorTheme === "dark"
      ? "hover:bg-slate-800 text-slate-200"
      : colorTheme === "sepia"
        ? "hover:bg-[#efe4d0] text-[#251b10]"
        : "hover:bg-slate-100 text-slate-800";

  const flyoutItemActive =
    colorTheme === "dark"
      ? "bg-blue-600/20 text-blue-300 font-semibold"
      : colorTheme === "sepia"
        ? "bg-amber-800/10 text-amber-900 font-semibold"
        : "bg-blue-50 text-blue-700 font-semibold";

  const tooltipClass =
    colorTheme === "dark"
      ? "bg-slate-800 text-slate-100 border-slate-700"
      : colorTheme === "sepia"
        ? "bg-[#251b10] text-[#fcf8ef] border-[#3d2e1d]"
        : "bg-slate-900 text-white border-slate-800";

  const mutedText =
    colorTheme === "dark"
      ? "text-slate-400"
      : colorTheme === "sepia"
        ? "text-[#6b553b]"
        : "text-slate-500";

  const toggleFlyout = (name) => {
    setOpenFlyout((prev) => (prev === name ? null : name));
  };

  return (
    <>
      {/* Zona sensible en el borde izquierdo */}
      {!isDockPinned && (
        <div
          onMouseEnter={revealTemporarily}
          className="fixed top-0 bottom-0 left-0 w-4 z-40"
          aria-hidden="true"
        />
      )}

      {/* Pestaña discreta cuando el riel está oculto */}
      {!isVisible && (
        <button
          type="button"
          onMouseEnter={revealTemporarily}
          onClick={revealTemporarily}
          className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 inline-flex items-center justify-center w-7 h-11 rounded-r-xl border border-l-0 shadow-md backdrop-blur-md transition-opacity opacity-75 hover:opacity-100 ${railSurface}`}
          title="Abrir controles (borde izquierdo)"
          aria-label="Abrir controles"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* Riel vertical angosto estilo SRI (56px) */}
      <aside
        ref={containerRef}
        onMouseEnter={clearHideTimer}
        onMouseLeave={() => scheduleHide(1100)}
        className={`fixed top-0 bottom-0 left-0 z-50 w-14 border-r shadow-xl backdrop-blur-md flex flex-col items-center justify-between py-2.5 px-2 transition-all duration-200 ${railSurface} ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        aria-label="Controles de Modo Proyector"
      >
        <div className="flex flex-col items-center gap-1 w-full">
          {/* Fijar riel */}
          <RailButton
            icon={isDockPinned ? PinOff : Pin}
            label={isDockPinned ? "Soltar menú (auto-ocultar)" : "Fijar menú lateral"}
            active={isDockPinned}
            onClick={() => {
              const next = !isDockPinned;
              setIsDockPinned(next);
              if (!next) {
                setOpenFlyout(null);
                setIsTempVisible(false);
              }
            }}
            baseClass={iconDefaultClass}
            activeClass={iconActiveClass}
            tooltipClass={tooltipClass}
          />

          <div className={`w-7 h-px my-1 ${dividerClass}`} />

          {/* Grupo 1: Texto y pantalla */}
          <RailButton
            icon={ALargeSmall}
            label={`Tamaño (${fontSizePx}px)`}
            active={openFlyout === "size"}
            hideTooltip={openFlyout === "size"}
            onClick={() => toggleFlyout("size")}
            baseClass={iconDefaultClass}
            activeClass={iconActiveClass}
            tooltipClass={tooltipClass}
          >
            {openFlyout === "size" && (
              <div
                className={`absolute left-full top-0 ml-2.5 w-48 rounded-2xl border shadow-xl p-2.5 z-50 ${flyoutSurface}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${mutedText}`}>
                  Tamaño de letra
                </p>
                <div className="grid grid-cols-[40px_1fr_40px] h-9 rounded-xl border border-current/15 overflow-hidden">
                  <button
                    type="button"
                    disabled={fontSizePx <= minPx}
                    onClick={() => changeFontSize(-2)}
                    className={`flex items-center justify-center text-base font-bold border-r border-current/15 disabled:opacity-35 ${flyoutItemDefault}`}
                    aria-label="Reducir tamaño"
                  >
                    −
                  </button>
                  <span className="flex items-center justify-center font-mono text-xs font-bold tabular-nums">
                    {fontSizePx}px
                  </span>
                  <button
                    type="button"
                    disabled={fontSizePx >= maxPx}
                    onClick={() => changeFontSize(2)}
                    className={`flex items-center justify-center text-base font-bold border-l border-current/15 disabled:opacity-35 ${flyoutItemDefault}`}
                    aria-label="Aumentar tamaño"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </RailButton>

          <RailButton
            icon={Type}
            label="Tipo de letra"
            active={openFlyout === "font"}
            hideTooltip={openFlyout === "font"}
            onClick={() => toggleFlyout("font")}
            baseClass={iconDefaultClass}
            activeClass={iconActiveClass}
            tooltipClass={tooltipClass}
          >
            {openFlyout === "font" && (
              <div
                className={`absolute left-full top-0 ml-2.5 w-52 rounded-2xl border shadow-xl p-2 z-50 space-y-0.5 ${flyoutSurface}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 ${mutedText}`}>
                  Tipo de letra
                </p>
                {FONT_OPTIONS.map((opt) => {
                  const selected = fontFamily === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setFontFamily(opt.id);
                        setOpenFlyout(null);
                      }}
                      className={`w-full h-8 px-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        selected ? flyoutItemActive : flyoutItemDefault
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </RailButton>

          <RailButton
            icon={Monitor}
            label="Modo de pantalla"
            active={openFlyout === "theme"}
            hideTooltip={openFlyout === "theme"}
            onClick={() => toggleFlyout("theme")}
            baseClass={iconDefaultClass}
            activeClass={iconActiveClass}
            tooltipClass={tooltipClass}
          >
            {openFlyout === "theme" && (
              <div
                className={`absolute left-full top-0 ml-2.5 w-48 rounded-2xl border shadow-xl p-2 z-50 space-y-0.5 ${flyoutSurface}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 ${mutedText}`}>
                  Modo de pantalla
                </p>
                {THEME_OPTIONS.map(({ id, label, Icon }) => {
                  const selected = colorTheme === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setColorTheme(id);
                        setOpenFlyout(null);
                      }}
                      className={`w-full h-8 px-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        selected ? flyoutItemActive : flyoutItemDefault
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </span>
                      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </RailButton>

          {/* Grupo 2: Lectura en aula */}
          {showReadingAids && (
            <>
              <div className={`w-7 h-px my-1 ${dividerClass}`} />

              <RailButton
                icon={teleprompterActive ? Pause : Play}
                label={teleprompterActive ? "Pausar Teleprompter (Espacio)" : "Iniciar Teleprompter (Espacio)"}
                active={teleprompterActive}
                onClick={() => {
                  setOpenFlyout(null);
                  onToggleTeleprompter?.();
                }}
                baseClass={iconDefaultClass}
                activeClass={iconActiveClass}
                tooltipClass={tooltipClass}
              />

              <RailButton
                icon={Gauge}
                label="Velocidad de teleprompter"
                active={openFlyout === "speed"}
                hideTooltip={openFlyout === "speed"}
                onClick={() => toggleFlyout("speed")}
                baseClass={iconDefaultClass}
                activeClass={iconActiveClass}
                tooltipClass={tooltipClass}
              >
                {openFlyout === "speed" && (
                  <div
                    className={`absolute left-full top-0 ml-2.5 w-48 rounded-2xl border shadow-xl p-2 z-50 space-y-0.5 ${flyoutSurface}`}
                  >
                    <p className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 ${mutedText}`}>
                      Velocidad
                    </p>
                    {SPEED_OPTIONS.map((opt) => {
                      const selected = teleprompterSpeed === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onChangeTeleprompterSpeed?.(opt.value);
                            setOpenFlyout(null);
                          }}
                          className={`w-full h-8 px-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            selected ? flyoutItemActive : flyoutItemDefault
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </RailButton>

              <RailButton
                icon={Crosshair}
                label={focusMode ? "Desactivar foco manual (F)" : "Activar foco manual (F)"}
                active={focusMode}
                onClick={() => {
                  setOpenFlyout(null);
                  onToggleFocusMode?.();
                }}
                baseClass={iconDefaultClass}
                activeClass={iconActiveClass}
                tooltipClass={tooltipClass}
              />

              <RailButton
                icon={ArrowUp}
                label="Párrafo anterior (↑)"
                disabled={!focusMode || !onStepParagraph}
                onClick={() => {
                  setOpenFlyout(null);
                  onStepParagraph?.(-1);
                }}
                baseClass={iconDefaultClass}
                activeClass={iconActiveClass}
                tooltipClass={tooltipClass}
              />

              <RailButton
                icon={ArrowDown}
                label="Siguiente párrafo (↓)"
                disabled={!focusMode || !onStepParagraph}
                onClick={() => {
                  setOpenFlyout(null);
                  onStepParagraph?.(1);
                }}
                baseClass={iconDefaultClass}
                activeClass={iconActiveClass}
                tooltipClass={tooltipClass}
              />

              {onToggleAutoFocusSync && (
                <RailButton
                  icon={Sparkles}
                  label={
                    autoFocusSync
                      ? "Foco automático al reproducir: Sí"
                      : "Foco automático al reproducir: No"
                  }
                  active={autoFocusSync && focusMode}
                  disabled={!focusMode}
                  onClick={() => {
                    setOpenFlyout(null);
                    onToggleAutoFocusSync();
                  }}
                  baseClass={iconDefaultClass}
                  activeClass={iconActiveClass}
                  tooltipClass={tooltipClass}
                />
              )}

              <RailButton
                icon={Ruler}
                label={rulerVisible ? "Ocultar regla guía (R)" : "Mostrar regla guía (R)"}
                active={rulerVisible}
                onClick={() => {
                  setOpenFlyout(null);
                  onToggleRuler?.();
                }}
                baseClass={iconDefaultClass}
                activeClass={iconActiveClass}
                tooltipClass={tooltipClass}
              />
            </>
          )}
        </div>

        {/* Pie: Pausa, Atajos y Salir */}
        <div className="flex flex-col items-center gap-1 w-full pt-2">
          <div className={`w-7 h-px my-1 ${dividerClass}`} />

          {onToggleBlackout && (
            <RailButton
              icon={MoonStar}
              label="Pausa en negro (B)"
              onClick={() => {
                setOpenFlyout(null);
                onToggleBlackout();
              }}
              baseClass={iconDefaultClass}
              activeClass={iconActiveClass}
              tooltipClass={tooltipClass}
            />
          )}

          {onToggleHelp && (
            <RailButton
              icon={Keyboard}
              label="Atajos de teclado (?)"
              onClick={() => {
                setOpenFlyout(null);
                onToggleHelp();
              }}
              baseClass={iconDefaultClass}
              activeClass={iconActiveClass}
              tooltipClass={tooltipClass}
            />
          )}

          <RailButton
            icon={LogOut}
            label="Salir de Modo Proyector (P)"
            onClick={() => {
              setOpenFlyout(null);
              setIsProjectorMode(false);
            }}
            baseClass={iconDefaultClass}
            activeClass={iconActiveClass}
            tooltipClass={tooltipClass}
          />
        </div>
      </aside>
    </>
  );
}
