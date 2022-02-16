// Returns `true` if the user has (or we have) explicitly selected dark mode
// Returns `false` if the user has (or we have) explicitly selected light mode
// Returns `null` if the user has (or we have) not explicitly selected a theme
function getUserDarkModePreference(): boolean | null {
  const storedPreference = localStorage.getItem("birdybop:settings:darkMode");
  return storedPreference === null ? null : storedPreference === "true";
}

// Returns `true` if the user's system has a theme preference set to dark,
// otherwise returns `false`
function getAutoDarkModePreference(): boolean {
  return !!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Sets a class on the `<html>` element, depending on the theme: "dark" for dark
// and "light" for light
export function setDarkModeClassOnDocument(darkMode: boolean): void {
  const [toRemove, toAdd] = darkMode ? ["light", "dark"] : ["dark", "light"];
  document.documentElement.classList.remove(toRemove);
  document.documentElement.classList.add(toAdd);
}

// Returns the user's preference if they (or we) have explicitly selected a
// theme, otherwise falls back on the system's automatic preference
export function getDarkModePreference(): boolean {
  const userPref = getUserDarkModePreference();
  return userPref === null ? getAutoDarkModePreference() : userPref;
}

// This makes `getDarkModePreference()` return `true`
export function setDarkModePreference(darkMode: boolean): void {
  localStorage.setItem("birdybop:settings:darkMode", `${darkMode}`);
  setDarkModeClassOnDocument(darkMode);
}

// When the system's automatic preference changes, run the given callback
export function onAutoDarkModePreferenceChanged(listener: (darkMode: boolean) => any): void {
  if (!window.matchMedia) return;

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    listener(event.matches);
  });
}
