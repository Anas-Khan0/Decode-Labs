// State
let activeFilter = 'all';
let searchQuery = '';
let activeSort = 'default';
let bookmarks = JSON.parse(localStorage.getItem('devhub-bookmarks') || '[]');
let currentModalId = null;

// DOM refs
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const sortSelect = document.getElementById('sortSelect');
const contentGrid = document.getElementById('contentGrid');
const emptyState = document.getElementById('emptyState');
const resourceCount = document.getElementById('resourceCount');
const backToTop = document.getElementById('backToTop');
const bookmarkBadge = document.getElementById('bookmarkBadge');
const bookmarkList = document.getElementById('bookmarkList');
const bookmarkEmptyMsg = document.getElementById('bookmarkEmptyMsg');
const bookmarkCountBtn = document.getElementById('bookmarkCountBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalBookmark = document.getElementById('modalBookmark');
const toastContainer = document.getElementById('toastContainer');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// Dark mode
const savedTheme = localStorage.getItem('devhub-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
syncThemeIcon(savedTheme);

function syncThemeIcon(theme) {
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('devhub-theme', next);
  syncThemeIcon(next);
});

// Mobile nav toggle
navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Filter + Search + Sort — unified render
function getCards() {
  return Array.from(contentGrid.querySelectorAll('.card'));
}

function applyFilters() {
  const cards = getCards();
  const query = searchQuery.toLowerCase().trim();
  let visible = 0;

  cards.forEach(card => {
    const cat = card.dataset.category;
    const title = (card.dataset.title || card.querySelector('h3').textContent).toLowerCase();
    const desc = card.querySelector('p').textContent.toLowerCase();

    const matchCat = activeFilter === 'all' || cat === activeFilter;
    const matchSearch = !query || title.includes(query) || desc.includes(query);
    const show = matchCat && matchSearch;

    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  emptyState.hidden = visible > 0;
  updateCount(visible, cards.length);
}

function updateCount(visible, total) {
  if (searchQuery || activeFilter !== 'all') {
    resourceCount.textContent = `Showing ${visible} of ${total} resources`;
  } else {
    resourceCount.textContent = `${total} resources`;
  }
}

function applySorting() {
  if (activeSort === 'default') return;
  const cards = getCards();

  cards.sort((a, b) => {
    const ta = (a.dataset.title || a.querySelector('h3').textContent).toLowerCase();
    const tb = (b.dataset.title || b.querySelector('h3').textContent).toLowerCase();
    const ca = a.dataset.category;
    const cb = b.dataset.category;

    if (activeSort === 'az') return ta.localeCompare(tb);
    if (activeSort === 'za') return tb.localeCompare(ta);
    if (activeSort === 'category') return ca.localeCompare(cb) || ta.localeCompare(tb);
    return 0;
  });

  cards.forEach(card => contentGrid.appendChild(card));
}

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyFilters();

    if (primaryNav.classList.contains('is-open') && window.innerWidth < 768) {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Search
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  searchClear.hidden = !searchQuery;
  applyFilters();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  searchClear.hidden = true;
  searchInput.focus();
  applyFilters();
});

// Sort
sortSelect.addEventListener('change', () => {
  activeSort = sortSelect.value;
  applySorting();
  applyFilters();
});

// Bookmark count btn → scroll to sidebar
bookmarkCountBtn.addEventListener('click', () => {
  document.getElementById('resources').scrollIntoView({ behavior: 'smooth' });
});

// Initial render
applyFilters();

// Bookmarks
function saveBookmarks() {
  localStorage.setItem('devhub-bookmarks', JSON.stringify(bookmarks));
}

function renderBookmarks() {
  bookmarkList.innerHTML = '';

  if (bookmarks.length === 0) {
    bookmarkEmptyMsg.hidden = false;
    bookmarkBadge.hidden = true;
    return;
  }

  bookmarkEmptyMsg.hidden = true;
  bookmarkBadge.hidden = false;
  bookmarkBadge.textContent = bookmarks.length;

  bookmarks.forEach(bm => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = 'bm-title';
    span.textContent = bm.title;

    const btn = document.createElement('button');
    btn.className = 'bm-remove';
    btn.textContent = '×';
    btn.setAttribute('aria-label', `Remove ${bm.title}`);
    btn.addEventListener('click', () => removeBookmark(bm.id));

    li.appendChild(span);
    li.appendChild(btn);
    bookmarkList.appendChild(li);
  });
}

function addBookmark(id, title) {
  if (bookmarks.find(b => b.id === id)) return;
  bookmarks.push({ id, title });
  saveBookmarks();
  renderBookmarks();
  syncBookmarkButtons();
  showToast(`Bookmarked: "${title}"`, 'success');
}

function removeBookmark(id) {
  const bm = bookmarks.find(b => b.id === id);
  bookmarks = bookmarks.filter(b => b.id !== id);
  saveBookmarks();
  renderBookmarks();
  syncBookmarkButtons();
  if (bm) showToast(`Removed: "${bm.title}"`, 'remove');
}

function toggleBookmark(id, title) {
  bookmarks.find(b => b.id === id) ? removeBookmark(id) : addBookmark(id, title);
}

function syncBookmarkButtons() {
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    const saved = bookmarks.some(b => b.id === btn.dataset.id);
    btn.classList.toggle('is-bookmarked', saved);
    btn.textContent = saved ? '♥' : '♡';
    btn.title = saved ? 'Remove bookmark' : 'Bookmark this guide';
  });

  // Sync modal button if open
  if (currentModalId) {
    const saved = bookmarks.some(b => b.id === currentModalId);
    modalBookmark.textContent = saved ? 'Remove Bookmark' : 'Bookmark this guide';
  }
}

document.querySelectorAll('.bookmark-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.card');
    const title = card.dataset.title || card.querySelector('h3').textContent;
    toggleBookmark(btn.dataset.id, title);
  });
});

// Initialise bookmarks on load
renderBookmarks();
syncBookmarkButtons();

// Toast notifications
function showToast(message, type = '') {
  const toast = document.createElement('div');
  toast.className = `toast${type ? ' is-' + type : ''}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2700);
}

// Back to top
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 420);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Card entrance animations (Intersection Observer)
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.card').forEach(card => cardObserver.observe(card));

// Modal
function openModal(card) {
  const id = card.querySelector('.bookmark-btn').dataset.id;
  const tag = card.querySelector('.card-tag').textContent;
  const title = card.dataset.title || card.querySelector('h3').textContent;
  const desc = card.dataset.desc || card.querySelector('p').textContent;

  currentModalId = id;
  modalTag.textContent = tag;
  modalTitle.textContent = title;
  modalBody.textContent = desc;

  const saved = bookmarks.some(b => b.id === id);
  modalBookmark.textContent = saved ? 'Remove Bookmark' : 'Bookmark this guide';

  modalOverlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.setAttribute('hidden', '');
  document.body.style.overflow = '';
  currentModalId = null;
}

document.querySelectorAll('.card-link[data-modal]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openModal(link.closest('.card'));
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modalOverlay.hidden) closeModal(); });

modalBookmark.addEventListener('click', () => {
  if (!currentModalId) return;
  const card = document.querySelector(`.bookmark-btn[data-id="${currentModalId}"]`)?.closest('.card');
  const title = card?.dataset.title || '';
  toggleBookmark(currentModalId, title);
});

// Stats counter animation
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1100;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Contact form validation
contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const nameEl = document.getElementById('contactName');
  const emailEl = document.getElementById('contactEmail');
  const msgEl = document.getElementById('contactMessage');
  const nameErr = document.getElementById('nameError');
  const emailErr = document.getElementById('emailError');
  const msgErr = document.getElementById('messageError');

  // Clear previous
  [nameErr, emailErr, msgErr].forEach(el => el.textContent = '');
  [nameEl, emailEl, msgEl].forEach(el => el.classList.remove('is-error'));

  let valid = true;

  if (!nameEl.value.trim()) {
    nameErr.textContent = 'Please enter your name.';
    nameEl.classList.add('is-error');
    valid = false;
  }

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailEl.value.trim() || !emailRx.test(emailEl.value)) {
    emailErr.textContent = 'Please enter a valid email address.';
    emailEl.classList.add('is-error');
    valid = false;
  }

  if (msgEl.value.trim().length < 10) {
    msgErr.textContent = 'Message must be at least 10 characters.';
    msgEl.classList.add('is-error');
    valid = false;
  }

  if (!valid) return;

  showToast("Message sent! We'll be in touch soon.", 'success');
  contactForm.reset();
});

// Newsletter form validation
newsletterForm.addEventListener('submit', e => {
  e.preventDefault();

  const input = document.getElementById('newsletterEmail');
  const error = document.getElementById('newsletterError');
  error.textContent = '';

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.value.trim() || !emailRx.test(input.value)) {
    error.textContent = 'Please enter a valid email address.';
    return;
  }

  showToast('Subscribed! Welcome to DevHub.', 'success');
  newsletterForm.reset();
});
