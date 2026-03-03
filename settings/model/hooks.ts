"use client";

import { useState, useCallback } from "react";
import type { SettingsSection, AppearancePrefs } from "./types";
import { SETTINGS_SECTIONS } from "./constants";

/** Navigate between settings sections */
export function useSettingsNav(defaultSection: SettingsSection = "general") {
  const [activeSection, setActiveSection] = useState<SettingsSection>(defaultSection);
  return { activeSection, setActiveSection, sections: SETTINGS_SECTIONS };
}

/** Unsaved changes tracking */
export function useUnsavedChanges<T extends Record<string, unknown>>(initial: T) {
  const [current, setCurrent] = useState<T>(initial);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setCurrent((prev) => {
      const next = { ...prev, [key]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initial));
      return next;
    });
  }, [initial]);

  const reset = useCallback(() => { setCurrent(initial); setIsDirty(false); }, [initial]);
  const markSaved = useCallback(() => setIsDirty(false), []);

  return { current, updateField, reset, markSaved, isDirty };
}

/** Appearance with system theme detection */
export function useAppearance(prefs: AppearancePrefs) {
  const resolvedTheme = prefs.theme === "system"
    ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : prefs.theme;

  return { ...prefs, resolvedTheme };
}
