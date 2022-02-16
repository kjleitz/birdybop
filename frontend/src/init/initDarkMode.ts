import {
  getDarkModePreference,
  onAutoDarkModePreferenceChanged,
  setDarkModeClassOnDocument,
  setDarkModePreference,
} from "@/lib/dom-utils";
import type { StoreDefinition } from "pinia";

export default function initDarkMode<State extends { darkMode: boolean }>(storeDefinition?: StoreDefinition<string, State>) {
  const existingPreference = getDarkModePreference();
  setDarkModeClassOnDocument(existingPreference);
  const store = storeDefinition && storeDefinition();
  if (store) store.setDarkMode(existingPreference);

  onAutoDarkModePreferenceChanged((darkMode) => {
    setDarkModePreference(darkMode);
    const store = storeDefinition && storeDefinition();
    if (store) store.setDarkMode(darkMode);
  });
}
