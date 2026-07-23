// Slugify item name to filename: "Bolinho de bacalhau" -> "bolinho-de-bacalhau"
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Auto-inject a photo before each menu item name.
// Looks for images/<slug>.jpg (or .jpeg/.png/.webp). Falls back to placeholder.
(function injectMenuPhotos() {
  const EXTS = ['jpg', 'jpeg', 'png', 'webp'];
  document.querySelectorAll('.menu-item').forEach(item => {
    const nameEl = item.querySelector('.menu-item__name');
    if (!nameEl) return;
    const slug = slugify(nameEl.textContent);

    const photo = document.createElement('div');
    photo.className = 'menu-item__photo menu-item__photo--placeholder';

    const img = document.createElement('img');
    img.alt = nameEl.textContent;
    img.loading = 'lazy';

    let idx = 0;
    const tryNext = () => {
      if (idx >= EXTS.length) return; // stays as placeholder
      img.onerror = tryNext;
      img.onload = () => photo.classList.remove('menu-item__photo--placeholder');
      img.src = `images/${slug}.${EXTS[idx++]}`;
    };
    tryNext();

    photo.appendChild(img);
    item.insertBefore(photo, item.firstChild);
  });
})();

// Tab switching for menu categories
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('is-active', t === tab));
    document.querySelectorAll('.menu-group').forEach(g => {
      g.classList.toggle('is-active', g.dataset.group === target);
    });
  });
});

// Mobile menu toggle (basic)
const burger = document.querySelector('.nav__burger');
const links = document.querySelector('.nav__links');
if (burger && links) {
  burger.addEventListener('click', () => {
    if (links.style.display === 'flex') {
      links.style.display = '';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '72px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(26,18,11,.98)';
      links.style.padding = '20px 24px';
      links.style.gap = '18px';
    }
  });
}

// Year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Set min date for reservation to today
const dataInput = document.getElementById('data');
if (dataInput) {
  const today = new Date().toISOString().split('T')[0];
  dataInput.min = today;
}
