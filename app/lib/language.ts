import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "es";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: "resumind-language",
    }
  )
);
