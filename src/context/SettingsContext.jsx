import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsContext = createContext(null);
const STORAGE_KEY = "lectoraventura-settings-v1";

export const FONT_OPTIONS = [
  { id: "atkinson", label: "Atkinson (Proyector)", className: "font-atkinson" },
  { id: "lexend", label: "Lexend (Fluida)", className: "font-lexend" },
  { id: "sans", label: "Plus Jakarta (Sans)", className: "font-sans" },
  { id: "reading", label: "Lora (Libro)", className: "font-reading" },
];

export const FONT_CLASS_MAP = Object.fromEntries(
  FONT_OPTIONS.map((opt) => [opt.id, opt.className])
);

const NORMAL_THEME_BACKGROUNDS = {
  light: "bg-slate-50 text-slate-800",
  sepia: "bg-[#fbf7ee] text-[#433422]",
  dark: "bg-slate-950 text-slate-100",
};

const PROJECTOR_THEME_BACKGROUNDS = {
  light: "bg-white text-slate-950",
  sepia: "bg-[#f8f1e3] text-[#251b10]",
  dark: "bg-[#090d14] text-slate-50",
};

const DEFAULT_SETTINGS = {
  isProjectorMode: false,
  normalFontSizePx: 19,
  projectorFontSizePx: 30,
  normalFontFamily: "reading",
  projectorFontFamily: "atkinson",
  colorTheme: "light",
  isDockMinimized: false,
  isDockPinned: false,
  dockPosition: null,
};

function loadSavedSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_SETTINGS;

    const clamp = (n, min, max, fallback) => {
      const v = Number(n);
      return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
    };

    const validFont = (f, fallback) => (FONT_CLASS_MAP[f] ? f : fallback);
    const validTheme = ["light", "sepia", "dark"].includes(parsed.colorTheme)
      ? parsed.colorTheme
      : DEFAULT_SETTINGS.colorTheme;

    const validPos =
      parsed.dockPosition &&
      Number.isFinite(Number(parsed.dockPosition.x)) &&
      Number.isFinite(Number(parsed.dockPosition.y))
        ? { x: Number(parsed.dockPosition.x), y: Number(parsed.dockPosition.y) }
        : null;

    return {
      isProjectorMode: Boolean(parsed.isProjectorMode),
      normalFontSizePx: clamp(parsed.normalFontSizePx, 15, 28, DEFAULT_SETTINGS.normalFontSizePx),
      projectorFontSizePx: clamp(parsed.projectorFontSizePx, 22, 44, DEFAULT_SETTINGS.projectorFontSizePx),
      normalFontFamily: validFont(parsed.normalFontFamily, DEFAULT_SETTINGS.normalFontFamily),
      projectorFontFamily: validFont(parsed.projectorFontFamily, DEFAULT_SETTINGS.projectorFontFamily),
      colorTheme: validTheme,
      isDockMinimized: Boolean(parsed.isDockMinimized),
      isDockPinned: Boolean(parsed.isDockPinned),
      dockPosition: validPos,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSavedSettings);
  const isProjectorRef = React.useRef(settings.isProjectorMode);
  isProjectorRef.current = settings.isProjectorMode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", settings.colorTheme === "dark");
  }, [settings.colorTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* cuota llena o modo privado */
    }
  }, [settings]);

  const setIsProjectorMode = (nextValue) => {
    const next =
      typeof nextValue === "function"
        ? Boolean(nextValue(isProjectorRef.current))
        : Boolean(nextValue);
    isProjectorRef.current = next;

    if (typeof document !== "undefined") {
      if (next && !document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (!next && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }

    setSettings((prev) => ({
      ...prev,
      isProjectorMode: next,
      projectorFontSizePx: next ? Math.max(28, prev.projectorFontSizePx) : prev.projectorFontSizePx,
    }));
  };

  const fontSizePx = settings.isProjectorMode ? settings.projectorFontSizePx : settings.normalFontSizePx;
  const fontFamily = settings.isProjectorMode ? settings.projectorFontFamily : settings.normalFontFamily;

  const setFontSizePx = (nextPx) => {
    setSettings((prev) => {
      const min = prev.isProjectorMode ? 22 : 15;
      const max = prev.isProjectorMode ? 44 : 28;
      const val = Math.min(max, Math.max(min, Number(nextPx) || min));
      return prev.isProjectorMode
        ? { ...prev, projectorFontSizePx: val }
        : { ...prev, normalFontSizePx: val };
    });
  };

  const changeFontSize = (delta) => {
    setFontSizePx(fontSizePx + delta);
  };

  const setFontFamily = (familyId) => {
    if (!FONT_CLASS_MAP[familyId]) return;
    setSettings((prev) =>
      prev.isProjectorMode
        ? { ...prev, projectorFontFamily: familyId }
        : { ...prev, normalFontFamily: familyId }
    );
  };

  const setColorTheme = (theme) => {
    if (!["light", "sepia", "dark"].includes(theme)) return;
    setSettings((prev) => ({ ...prev, colorTheme: theme }));
  };

  const setIsDockMinimized = (nextVal) => {
    setSettings((prev) => ({
      ...prev,
      isDockMinimized: typeof nextVal === "function" ? nextVal(prev.isDockMinimized) : Boolean(nextVal),
    }));
  };

  const setIsDockPinned = (nextVal) => {
    setSettings((prev) => ({
      ...prev,
      isDockPinned: typeof nextVal === "function" ? nextVal(prev.isDockPinned) : Boolean(nextVal),
    }));
  };

  const setDockPosition = (pos) => {
    setSettings((prev) => ({ ...prev, dockPosition: pos }));
  };

  const legacyFontSize = useMemo(() => {
    if (fontSizePx <= 17) return "base";
    if (fontSizePx <= 21) return "lg";
    if (fontSizePx <= 26) return "xl";
    if (fontSizePx <= 32) return "2xl";
    return "3xl";
  }, [fontSizePx]);

  const setLegacyFontSize = (sizeKey) => {
    const map = { base: 16, lg: 19, xl: 24, "2xl": 30, "3xl": 36 };
    if (map[sizeKey]) setFontSizePx(map[sizeKey]);
  };

  const value = useMemo(() => {
    const themeMap = settings.isProjectorMode ? PROJECTOR_THEME_BACKGROUNDS : NORMAL_THEME_BACKGROUNDS;
    return {
      isProjectorMode: settings.isProjectorMode,
      setIsProjectorMode,
      fontSize: legacyFontSize,
      setFontSize: setLegacyFontSize,
      fontSizePx,
      setFontSizePx,
      changeFontSize,
      fontFamily,
      fontFamilyClass: FONT_CLASS_MAP[fontFamily] || "font-atkinson",
      setFontFamily,
      colorTheme: settings.colorTheme,
      setColorTheme,
      isDockMinimized: settings.isDockMinimized,
      setIsDockMinimized,
      isDockPinned: settings.isDockPinned,
      setIsDockPinned,
      dockPosition: settings.dockPosition,
      setDockPosition,
      themeClass: themeMap[settings.colorTheme] || themeMap.light,
    };
  }, [settings, legacyFontSize, fontSizePx, fontFamily]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings debe usarse dentro de SettingsProvider");
  }
  return context;
}

