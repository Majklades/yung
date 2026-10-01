const themePreferenceKey = 'site-theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
let savedTheme = null;

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
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    const targetTheme = theme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Přepnout na ${targetTheme === 'light' ? 'světlý' : 'tmavý'} režim`);
    toggle.title = `Přepnout na ${targetTheme === 'light' ? 'světlý' : 'tmavý'} režim`;
  }
};

applyTheme(savedTheme || (systemTheme.matches ? 'light' : 'dark'));

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  applyTheme(document.documentElement.dataset.theme);
  toggle.addEventListener('click', () => {
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
  if (!savedTheme) {
    applyTheme(event.matches ? 'light' : 'dark');
  }
});
