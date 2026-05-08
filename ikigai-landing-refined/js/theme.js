/* ============================================================
   THEME — Dark mode toggle with localStorage persistence.
   Loaded as a regular script (no ES module export needed).
   ============================================================ */

function initTheme() {
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ikigai-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('ikigai-theme', 'dark');
    }
  });
}
