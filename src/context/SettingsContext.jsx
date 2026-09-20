import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsContext = createContext(null);

const THEME_BACKGROUNDS = {
  light: "bg-slate-50 text-slate-800",
  sepia: "bg-[#fbf7ee] text-[#433422]",
  dark: "bg-slate-950 text-slate-100",
};

export function SettingsProvider({ children }) {
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [fontSize, setFontSize] = useState("lg");
  const [colorTheme, setColorTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", colorTheme === "dark");
  }, [colorTheme]);

  const value = useMemo(
    () => ({
      isProjectorMode,
      setIsProjectorMode,
      fontSize,
      setFontSize,
      colorTheme,
      setColorTheme,
      themeClass: THEME_BACKGROUNDS[colorTheme] || THEME_BACKGROUNDS.light,
    }),
    [isProjectorMode, fontSize, colorTheme]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings debe usarse dentro de SettingsProvider");
  }
  return context;
}
