// Opens and closes the header menu on small screens.
(function () {
  var header = document.querySelector('.site-header');
  var toggle = header && header.querySelector('.nav-toggle');
  if (!toggle) return;
  function setOpen(open) {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () { setOpen(!header.classList.contains('menu-open')); });
  header.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
})();
