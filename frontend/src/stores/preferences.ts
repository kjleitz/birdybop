import { getDarkModePreference, setDarkModePreference } from "@/lib/dom-utils";
import { defineStore } from "pinia";

export const usePreferencesStore = defineStore("preferences", {
  state: () => ({
    darkMode: getDarkModePreference(),
  }),

  actions: {
    setDarkMode(darkMode: boolean): void {
      this.darkMode = darkMode;
      setDarkModePreference(darkMode);
    },
  },
});
