const STORAGE_KEY = "theme";
const STORAGE_OVERRIDE_KEY = "theme-override";
const THEME_ATTR  = "data-theme";
const QUERY_KEY   = "(prefers-color-scheme: dark)";

const themes = {
  LIGHT: "light",
  DARK: "dark",
};

initTheme();

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const hasOverride = localStorage.getItem(STORAGE_OVERRIDE_KEY) === "true";

  // Check if user has manually overridden the theme
  if (hasOverride && savedTheme) {
    // User has manually set a theme, use that
    setTheme(savedTheme);
  } else {
    // Always follow system preference by default
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
    // Save system theme but mark as not overridden
    localStorage.setItem(STORAGE_KEY, systemTheme);
    localStorage.removeItem(STORAGE_OVERRIDE_KEY);
  }

  // Watch for system theme changes and apply automatically if not overridden
  window.matchMedia(QUERY_KEY).addEventListener("change", (e) => {
    const hasManualOverride = localStorage.getItem(STORAGE_OVERRIDE_KEY) === "true";
    
    if (!hasManualOverride) {
      // User hasn't manually overridden, so follow system theme
      const newSystemTheme = e.matches ? themes.DARK : themes.LIGHT;
      setTheme(newSystemTheme);
      localStorage.setItem(STORAGE_KEY, newSystemTheme);
    }
    // If user has overridden, don't change the theme
  });
}

function getSystemTheme() {
  // Get the current system theme preference
  if (window.matchMedia && window.matchMedia(QUERY_KEY).matches) {
    return themes.DARK;
  }
  return themes.LIGHT;
}

function toggleTheme() {
  const theme = getTheme();
  const newTheme = theme === themes.DARK ? themes.LIGHT : themes.DARK;
  setTheme(newTheme);
  
  // Mark that user has manually overridden the system theme
  localStorage.setItem(STORAGE_KEY, newTheme);
  localStorage.setItem(STORAGE_OVERRIDE_KEY, "true");
}

// Reset to system theme preference
function resetToSystemTheme() {
  localStorage.removeItem(STORAGE_OVERRIDE_KEY);
  const systemTheme = getSystemTheme();
  setTheme(systemTheme);
  localStorage.setItem(STORAGE_KEY, systemTheme);
}

function getTheme() {
  return document.documentElement.getAttribute(THEME_ATTR);
}

function setTheme(value) {
  document.documentElement.setAttribute(THEME_ATTR, value);
  updateThemeToggler(value);
}

function updateThemeToggler(theme) {
  const toggler = document.getElementById("theme-toggler");
  if (!toggler) return;

  const isOverridden = localStorage.getItem(STORAGE_OVERRIDE_KEY) === "true";
  
  // Update tooltip to show if following system preference
  const tooltipText = isOverridden 
    ? `Switch to ${theme === themes.DARK ? 'light' : 'dark'} theme (manual override active)`
    : `Switch to ${theme === themes.DARK ? 'light' : 'dark'} theme (following system preference)`;
  
  toggler.setAttribute("title", tooltipText);
  toggler.setAttribute("data-bs-toggle", "tooltip");
  toggler.setAttribute("data-bs-placement", "bottom");
}
