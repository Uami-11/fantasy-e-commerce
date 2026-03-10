(function () {
  const STORAGE_KEY = 'arcane-theme';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') {
    document.body.classList.add('light');
  }

  // Wait for the DOM to be ready before inserting the button
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.id          = 'theme-toggle';
    btn.title       = 'Toggle light / dark mode';
    btn.textContent = document.body.classList.contains('light') ? 'Dark' : 'Light';

    btn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      btn.textContent = isLight ? 'Dark' : 'Light';
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
    });

    document.body.appendChild(btn);
  });
})();