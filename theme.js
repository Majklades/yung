const themeSettings = document.documentElement.dataset;
const themePreferenceKey = themeSettings.themeStorageKey || 'site-theme';
const defaultTheme = themeSettings.themeDefault;
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
let savedTheme = null;
let themeToggle = null;

try {
  const storedTheme = localStorage.getItem(themePreferenceKey);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    savedTheme = storedTheme;
  }
} catch (error) {
  console.warn('Unable to read the saved theme preference.', error);
}

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeColorValue = themeSettings[theme === 'light' ? 'themeColorLight' : 'themeColorDark'];
  if (themeColor && themeColorValue) {
    themeColor.content = themeColorValue;
  }

  if (themeToggle) {
    const targetTheme = theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Přepnout na ${targetTheme === 'light' ? 'světlý' : 'tmavý'} režim`);
    themeToggle.title = `Přepnout na ${targetTheme === 'light' ? 'světlý' : 'tmavý'} režim`;
  }
};

applyTheme(savedTheme || defaultTheme || (systemTheme.matches ? 'light' : 'dark'));

document.addEventListener('DOMContentLoaded', () => {
  themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  applyTheme(document.documentElement.dataset.theme);
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    savedTheme = theme;
    applyTheme(theme);
    try {
      localStorage.setItem(themePreferenceKey, theme);
    } catch (error) {
      console.warn('Unable to save the theme preference.', error);
    }
  });
});

systemTheme.addEventListener('change', (event) => {
  if (!savedTheme && !defaultTheme) {
    applyTheme(event.matches ? 'light' : 'dark');
  }
});
