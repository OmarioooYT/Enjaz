/**
 * Enjaz — Shared UI helpers: modals, toasts, confirmation dialog, project icons, the
 * tutorial and small formatting utilities.
 *
 * Copyright (C) 2026 Omariooo
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Enjaz, free software released under the GNU General
 * Public License v3.0 or later. See the LICENSE file for details.
 */

const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastCompletedTaskId = null;
let lastKpiState = { total: 0, members: 0, percent: 0, urgent: 0 };

/**
 * Shows a modal (or bottom sheet) with its entrance animation.
 *
 * @param {string} modalId
 * @param {boolean} [isSheet=false]
 */
function animateModalOpen(modalId, isSheet = false) {
  const m = document.getElementById(modalId);
  if (!m) return;
  const panel = m.firstElementChild;
  m.classList.remove('hidden', 'animate-backdrop-out');
  m.classList.add('flex', 'animate-backdrop-in');
  if (panel) {
    panel.classList.remove('animate-modal-out', 'animate-sheet-down');
    panel.classList.add(isSheet ? 'animate-sheet-up' : 'animate-modal-in');
  }
}

/**
 * Hides a modal (or bottom sheet) after its exit animation.
 *
 * @param {string} modalId
 * @param {boolean} [isSheet=false]
 */
function animateModalClose(modalId, isSheet = false) {
  const m = document.getElementById(modalId);
  if (!m || m.classList.contains('hidden')) return;
  if (prefersReducedMotion()) {
    m.classList.add('hidden');
    m.classList.remove('flex');
    return;
  }
  const panel = m.firstElementChild;
  m.classList.remove('animate-backdrop-in');
  m.classList.add('animate-backdrop-out');
  if (panel) {
    panel.classList.remove('animate-modal-in', 'animate-sheet-up');
    panel.classList.add(isSheet ? 'animate-sheet-down' : 'animate-modal-out');
  }
  clearTimeout(m._closeTimer);
  m._closeTimer = setTimeout(() => {
    m.classList.add('hidden');
    m.classList.remove('flex', 'animate-backdrop-out');
    if (panel) panel.classList.remove('animate-modal-out', 'animate-sheet-down');
  }, 160);
}

/**
 * Counts a number up or down in an element (skipped when reduced motion is
 * preferred).
 *
 * @param {string} elId
 * @param {number} fromVal
 * @param {number} toVal
 * @param {string} [suffix=''] Appended text, e.g. '%'.
 */
function animateNumber(elId, fromVal, toVal, suffix = '') {
  const el = document.getElementById(elId);
  if (!el) return;
  if (prefersReducedMotion() || fromVal === toVal) {
    el.textContent = `${toVal}${suffix}`;
    return;
  }
  const start = performance.now();
  const duration = 340;
  const diff = toVal - fromVal;
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = `${Math.round(fromVal + diff * eased)}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Pointer-tracking spotlight for elevated cards (GPU radial gradient)
document.addEventListener('pointermove', (e) => {
  if (prefersReducedMotion()) return;
  const card = e.target.closest('.spotlight-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  card.style.setProperty('--my', `${e.clientY - rect.top}px`);
}, { passive: true });

/**
 * Shows or hides the search row on mobile.
 */
function toggleMobileSearch() {
  const row = document.getElementById('mobileSearchRow');
  const btn = document.getElementById('mobileSearchToggleBtn');
  const isHidden = row.classList.contains('hidden');
  row.classList.toggle('hidden', !isHidden);
  if (isHidden) {
    row.classList.remove('animate-fade-up');
    void row.offsetWidth;
    row.classList.add('animate-fade-up');
  }
  btn.classList.toggle('border-brand', isHidden);
  btn.classList.toggle('text-brand', isHidden);
  if (isHidden) {
    setTimeout(() => document.getElementById('mobileSearchInput').focus(), 40);
  }
}

/**
 * Opens the project options menu (bottom sheet on mobile, modal on desktop).
 */
function openMobileProjectMenu() {
  if (!activeProjectId) return;
  const p = projects.find(x => x.id === activeProjectId);
  if (p) {
    document.getElementById('sheetProjIcon').innerHTML = renderProjectIconHtml(p.icon, 'w-4 h-4');
    document.getElementById('sheetProjName').textContent = p.name;
    document.getElementById('sheetProjStatus').value = getProjectStatus(p);
    document.getElementById('sheetProjCodeLabel').textContent = `${t('codePrefix')} ${p.id}`;
    document.getElementById('sheetDeleteProjBtn').classList.toggle('hidden', isSharedMode);
  }
  animateModalOpen('mobileProjectMenu', true);
}

/**
 * Closes the project options menu.
 */
function closeMobileProjectMenu() {
  animateModalClose('mobileProjectMenu', true);
}

/**
 * Reads the list of projects this browser has opened. Only a convenience:
 * access itself is enforced by the database.
 *
 * @returns {string[]}
 */
function getLocalAllowedProjectIds() {
  try {
    const raw = localStorage.getItem('enjaz_my_projects');
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * Remembers a project ID in this browser.
 *
 * @param {string} projId
 */
function addLocalAllowedProjectId(projId) {
  if (!projId) return;
  const list = getLocalAllowedProjectIds();
  if (!list.includes(projId)) {
    list.push(projId);
    localStorage.setItem('enjaz_my_projects', JSON.stringify(list));
  }
}

/**
 * Forgets a project ID in this browser.
 *
 * @param {string} projId
 */
function removeLocalAllowedProjectId(projId) {
  const list = getLocalAllowedProjectIds().filter(id => id !== projId);
  localStorage.setItem('enjaz_my_projects', JSON.stringify(list));
}

/**
 * Leaves shared-link mode and shows all of the user's projects.
 */
function exitSharedMode() {
  isSharedMode = false;
  sharedOnlyProjectId = null;
  activeProjectId = null;
  window.history.replaceState({}, '', window.location.pathname);
  loadAllData();
}

let _confirmResolver = null;
let _confirmPrevFocus = null;

/**
 * Shows the styled confirmation dialog.
 *
 * @param {object} [options]
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {string} [options.confirmText]
 * @param {string} [options.cancelText]
 * @param {'danger'|'warning'} [options.variant='danger']
 * @returns {Promise<boolean>} True if the user confirmed.
 */
function showConfirmDialog({
  title = '',
  message = '',
  confirmText = '',
  cancelText = '',
  variant = 'danger'
} = {}) {
  const modal = document.getElementById('confirmModal');
  const titleEl = document.getElementById('confirmModalTitle');
  const msgEl = document.getElementById('confirmModalMessage');
  const okBtn = document.getElementById('confirmModalOkBtn');
  const cancelBtn = document.getElementById('confirmModalCancelBtn');
  const iconWrap = document.getElementById('confirmModalIconWrap');

  if (!modal) return Promise.resolve(false);
  if (_confirmResolver) {
    _confirmResolver(false);
    _confirmResolver = null;
  }

  const isEn = currentLang === 'en';
  titleEl.textContent = title || (isEn ? 'Confirm Action' : 'تأكيد الإجراء');
  msgEl.textContent = message;
  okBtn.textContent = confirmText || (isEn ? 'Confirm' : 'تأكيد');
  cancelBtn.textContent = cancelText || (isEn ? 'Cancel' : 'إلغاء');

  if (variant === 'warning') {
    iconWrap.className = 'w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0';
    okBtn.className = 'btn-primary-gradient px-4 py-2 rounded-xl text-white text-xs font-bold transition';
  } else {
    iconWrap.className = 'w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0';
    okBtn.className = 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-[0_6px_18px_-4px_rgba(225,29,72,0.5)] transition';
  }

  _confirmPrevFocus = document.activeElement;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => cancelBtn.focus(), 40);

  return new Promise((resolve) => {
    _confirmResolver = resolve;
  });
}

/**
 * Closes the confirmation dialog and resolves its promise.
 *
 * @param {boolean} accepted
 */
function resolveConfirmDialog(accepted) {
  const modal = document.getElementById('confirmModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  if (_confirmPrevFocus && typeof _confirmPrevFocus.focus === 'function') {
    _confirmPrevFocus.focus();
  }
  _confirmPrevFocus = null;
  if (_confirmResolver) {
    const res = _confirmResolver;
    _confirmResolver = null;
    res(Boolean(accepted));
  }
}

/**
 * Leaves a project after confirmation (removes the user's own member row; the
 * project stays for others).
 *
 * @param {string} projId
 */
async function leaveProject(projId) {
  if (!projId) return;
  const p = projects.find(x => x.id === projId);
  const isEn = currentLang === 'en';
  const label = p ? `"${p.name}"` : (isEn ? 'this project' : 'هذا المشروع');
  const ok = await showConfirmDialog({
    title: isEn ? 'Leave Project' : 'مغادرة المشروع',
    message: isEn
      ? `Are you sure you want to leave ${label}?\nYou will be removed from the team list and the project will be hidden from your account only (it will not be deleted for others).`
      : `هل أنت متأكد من مغادرة مشروع ${label}؟\nسيتم إزالتك من قائمة الفريق وإخفاء المشروع من حسابك فقط (لن يتم حذف المشروع لباقي الفريق).`,
    confirmText: isEn ? 'Leave Project' : 'مغادرة',
    variant: 'warning'
  });
  if (!ok) return;

  const ident = getCurrentIdentity();
  if (ident.id) {
    await db.from('project_members').delete().eq('project_id', projId).eq('user_id', ident.id);
  }
  if (typeof _joinAttemptedCodes !== 'undefined') _joinAttemptedCodes.add(projId);

  removeLocalAllowedProjectId(projId);

  if (isSharedMode && sharedOnlyProjectId === projId) {
    isSharedMode = false;
    sharedOnlyProjectId = null;
  }

  if (activeProjectId === projId) {
    activeProjectId = null;
    window.history.replaceState({}, '', window.location.pathname);
  }

  showToast(`تمت مغادرة مشروع ${label} بنجاح 👋`);
  await loadAllData();
}

const ICONS = {
  edit: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  leave: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  trash: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  close: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
  login: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>',
  calendar: '<svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  check: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6 9 17l-5-5"/></svg>',
  play: '<svg class="w-3 h-3 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  circle: '<svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>',
  rocket: '<svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path stroke-linecap="round" stroke-linejoin="round" d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>',
  kanban: '<svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect width="6" height="14" x="3" y="5" rx="1.5"/><rect width="6" height="9" x="15" y="5" rx="1.5"/></svg>',
  link: '<svg class="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path stroke-linecap="round" stroke-linejoin="round" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  sparkles: '<svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'
};

const PROJECT_ICONS = {
  rocket: { label: 'إطلاق', path: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path stroke-linecap="round" stroke-linejoin="round" d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>' },
  code: { label: 'برمجة', path: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  cpu: { label: 'نظام', path: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>' },
  target: { label: 'أهداف', path: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
  smartphone: { label: 'موبايل', path: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>' },
  briefcase: { label: 'أعمال', path: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' },
  layers: { label: 'تصميم', path: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },
  globe: { label: 'ويب', path: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>' },
  sparkles: { label: 'إبداع', path: '<path stroke-linecap="round" stroke-linejoin="round" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' },
  shield: { label: 'أمان', path: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  chart: { label: 'تحليلات', path: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18"/><path stroke-linecap="round" stroke-linejoin="round" d="m19 9-5 5-4-4-3 3"/>' },
  folder: { label: 'مشروع', path: '<path stroke-linecap="round" stroke-linejoin="round" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' }
};

const LEGACY_EMOJI_TO_ICON = {
  '🚀': 'rocket',
  '💻': 'code',
  '⚙️': 'cpu',
  '🎯': 'target',
  '📱': 'smartphone',
  '📁': 'folder',
  '📂': 'folder'
};

/**
 * Whether a project icon value is an image (data or http URL) rather than a
 * built-in SVG key.
 *
 * @param {string} val
 * @returns {boolean}
 */
function isImageIcon(val) {
  return typeof val === 'string' && (val.startsWith('data:image/') || val.startsWith('http://') || val.startsWith('https://'));
}

/**
 * Normalizes a stored project icon to an image URL or a known 'svg:<key>' value
 * (legacy emoji icons are mapped).
 *
 * @param {string} val
 * @returns {string}
 */
function normalizeProjectIcon(val) {
  if (!val) return 'svg:rocket';
  if (isImageIcon(val)) return val;
  if (val.startsWith('svg:')) {
    const key = val.slice(4);
    return PROJECT_ICONS[key] ? val : 'svg:folder';
  }
  if (LEGACY_EMOJI_TO_ICON[val]) return 'svg:' + LEGACY_EMOJI_TO_ICON[val];
  return 'svg:folder';
}

/**
 * Returns the HTML for a project icon.
 *
 * @param {string} iconVal
 * @param {string} [sizeCls='w-4 h-4'] Tailwind size classes for SVG icons.
 * @returns {string}
 */
function renderProjectIconHtml(iconVal, sizeCls = 'w-4 h-4') {
  const normalized = normalizeProjectIcon(iconVal);
  if (isImageIcon(normalized)) {
    return `<img src="${escapeHtml(normalized)}" alt="Project logo" class="w-full h-full object-cover" />`;
  }
  const key = normalized.slice(4);
  const item = PROJECT_ICONS[key] || PROJECT_ICONS.folder;
  return `<svg class="${sizeCls} text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">${item.path}</svg>`;
}

/**
 * Renders the icon grid and logo preview in the project modal.
 *
 * @param {string} selectedVal
 */
function renderProjectIconPicker(selectedVal) {
  const normalized = normalizeProjectIcon(selectedVal);
  const isImg = isImageIcon(normalized);
  const preview = document.getElementById('pIconPreview');
  const removeBtn = document.getElementById('removeLogoBtn');
  const grid = document.getElementById('projectIconGrid');

  document.getElementById('pIcon').value = normalized;
  if (preview) {
    preview.innerHTML = renderProjectIconHtml(normalized, 'w-6 h-6');
    preview.classList.remove('animate-pop-in');
    void preview.offsetWidth;
    preview.classList.add('animate-pop-in');
  }
  if (removeBtn) removeBtn.classList.toggle('hidden', !isImg);

  if (grid) {
    grid.innerHTML = Object.entries(PROJECT_ICONS).map(([key, item]) => {
      const isSelected = !isImg && normalized === `svg:${key}`;
      return `
        <button type="button" onclick="selectProjectIcon('svg:${key}')" title="${item.label}" aria-label="${item.label}"
          class="h-10 rounded-xl border flex items-center justify-center transition ${isSelected
          ? 'bg-brand/15 border-brand text-brand shadow-[0_0_12px_rgba(252,106,13,0.25)] scale-[1.03]'
          : 'bg-obsidian hover:bg-surfaceHover border-borderSubtle text-zinc-400 hover:text-zinc-100 hover:border-white/15'
        }">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">${item.path}</svg>
        </button>
      `;
    }).join('');
  }
}

/**
 * Selects an icon in the project modal.
 *
 * @param {string} iconVal
 */
function selectProjectIcon(iconVal) {
  const fileInput = document.getElementById('pLogoFile');
  if (fileInput) fileInput.value = '';
  renderProjectIconPicker(iconVal);
}

/**
 * Removes an uploaded project logo and goes back to the default icon.
 */
function clearUploadedLogo() {
  selectProjectIcon('svg:rocket');
}

/**
 * Center-crops and downsizes an uploaded project logo to 128x128 (WebP, PNG
 * fallback).
 *
 * @param {Event} e File input change event.
 */
function handleProjectLogoUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('اختر ملف صورة صالح (PNG / JPG / WebP)');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('حجم الصورة كبير جداً (الحد الأقصى 5MB)');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Center-crop to square so logo fills nicely without distortion
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

      let dataUrl = canvas.toDataURL('image/webp', 0.85);
      if (!dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/png');
      }
      renderProjectIconPicker(dataUrl);
      showToast('تم تجهيز شعار المشروع بنجاح');
    };
    img.onerror = () => showToast('تعذّر قراءة الصورة، جرّب صورة أخرى');
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

/**
 * Translated label for a project status.
 *
 * @param {string} statusKey
 * @returns {string}
 */
function getProjectStatusLabel(statusKey) {
  const map = {
    todo: t('statusTodo'),
    in_progress: t('statusInProgress'),
    done: t('statusDone'),
    on_hold: t('statusOnHold')
  };
  return map[statusKey] || statusKey;
}

/**
 * Tutorial steps in the current language.
 *
 * @returns {object[]}
 */
function getTutorialSteps() {
  if (currentLang === 'en') {
    return [
      {
        icon: ICONS.rocket,
        title: '1. Create Your First Project & Track Status',
        desc: 'Click "+ New" in the sidebar, set your project name, status (To Do / In Progress / Done), and description. Private projects remain hidden until you share their link.',
        tips: [
          'Switch project status in one click from the top bar or mobile options menu.',
          'Each project gets a unique code (PRJ-XXXX) and an isolated invite link.'
        ]
      },
      {
        icon: ICONS.kanban,
        title: '2. Assign Tasks & Drag & Drop Across Columns',
        desc: 'Click "+ Task" to set title, priority, due date, and assignee. Drag tasks between columns or use the quick status toggle on mobile.',
        tips: [
          'When anyone marks a task Done, their name appears automatically.',
          'Overdue tasks highlight in red so nothing slips through the cracks.'
        ]
      },
      {
        icon: ICONS.link,
        title: '3. Share a Single Project with Your Team',
        desc: 'Click "Share" to copy a link for the current project only. Teammates who open it see only that project—never your other private workspaces—and can leave anytime.',
        tips: [
          'Guests cannot view your other projects or delete your workspace.',
          'All changes sync in real time across everyone on the team.'
        ]
      }
    ];
  }
  return TUTORIAL_STEPS;
}

const PROJECT_STATUS_META = {
  todo: {
    label: 'قيد الانتظار',
    dot: 'bg-zinc-400',
    selectCls: 'bg-white/[0.05] text-zinc-200 border-white/15 hover:border-white/25',
  },
  in_progress: {
    label: 'جاري العمل',
    dot: 'bg-brand',
    selectCls: 'bg-brand/15 text-brand border-brand/35 hover:border-brand',
  },
  done: {
    label: 'منتهي',
    dot: 'bg-emerald-400',
    selectCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 hover:border-emerald-400',
  },
  on_hold: {
    label: 'متوقف',
    dot: 'bg-rose-400',
    selectCls: 'bg-rose-500/12 text-rose-300 border-rose-500/30 hover:border-rose-400',
  }
};

/**
 * A project's status, defaulting to 'in_progress' for unknown values.
 *
 * @param {object} p Project.
 * @returns {string}
 */
function getProjectStatus(p) {
  if (p && p.status && PROJECT_STATUS_META[p.status]) return p.status;
  return 'in_progress';
}

const TUTORIAL_STEPS = [
  {
    icon: ICONS.rocket,
    title: '1. أنشئ مشروعك الأول وتابع حالته',
    desc: 'اضغط على "+ جديد" في القائمة الجانبية، اختار اسم المشروع وحالته (To Do / جاري العمل / منتهي) ووصفه. مشاريعك الخاصة لا تظهر لأي شخص آخر إلا لما تبعتله رابط المشروع.',
    tips: [
      'تقدر تغيّر حالة المشروع بضغطة واحدة من الشريط العلوي أو قائمة الخيارات على الموبايل.',
      'كل مشروع ليه كود خاص (PRJ-XXXX) ولينك مشاركة معزول تماماً.'
    ]
  },
  {
    icon: ICONS.kanban,
    title: '2. وزّع المهام وحرّكها بالـ Drag & Drop',
    desc: 'اضغط "+ تاسك" لتحديد العنوان، الأولوية، الموعد النهائي، واسم المسؤول. اسحب التاسكات بين الأعمدة أو استخدم زر التبديل السريع على الموبايل.',
    tips: [
      'أول ما أي حد يعلم Done، بيظهر اسمه تلقائياً على المهمة.',
      'المهام اللي فات ميعادها بتنوّر بالأحمر عشان تلحقها.'
    ]
  },
  {
    icon: ICONS.link,
    title: '3. شارك مشروع واحد بس مع فريقك',
    desc: 'اضغط على "مشاركة" لنسخ رابط المشروع الحالي فقط. لما صاحبك يفتح الرابط، هيشوف المشروع ده بس بدون ما يشوف باقي مشاريعك الخاصة، ويقدر يغادره في أي وقت.',
    tips: [
      'صاحبك مش هيقدر يشوف أي مشروع تاني عندك ولا يحذف مشروعك.',
      'كل التعديلات بتتزامن لحظياً (Real-time) عند كل الفريق.'
    ]
  }
];

/**
 * Escapes text for safe use in HTML content and attributes.
 *
 * @param {*} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Safely embeds a value as a JavaScript string argument inside a double-quoted
 * inline handler attribute (e.g. onclick="fn(${jsArg(id)})").
 *
 * @param {*} val
 * @returns {string}
 */
function jsArg(val) {
  return escapeHtml(JSON.stringify(String(val ?? '')));
}

/**
 * A task's status, falling back to the legacy 'done' flag.
 *
 * @param {object} t Task.
 * @returns {'todo'|'in_progress'|'done'}
 */
function getTaskStatus(t) {
  if (t.status && ['todo', 'in_progress', 'done'].includes(t.status)) return t.status;
  return t.done ? 'done' : 'todo';
}

/**
 * Whether a due date is before today and the task is not done.
 *
 * @param {string|null} dateStr YYYY-MM-DD.
 * @param {string} status
 * @returns {boolean}
 */
function isOverdue(dateStr, status) {
  if (!dateStr || status === 'done') return false;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return dateStr < `${y}-${m}-${d}`;
}

/**
 * Copies text to the clipboard, with a fallback for browsers without the
 * Clipboard API.
 *
 * @param {string} text
 * @param {string} [successMsg] Toast shown on success.
 * @returns {Promise<boolean>}
 */
async function copyTextSafe(text, successMsg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error('Clipboard API unavailable');
    }
    if (successMsg) showToast(successMsg);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok && successMsg) showToast(successMsg);
      else if (!ok) showToast(currentLang === 'en' ? 'Could not copy to clipboard' : 'تعذر النسخ إلى الحافظة');
      return ok;
    } catch {
      showToast(currentLang === 'en' ? 'Could not copy to clipboard' : 'تعذر النسخ إلى الحافظة');
      return false;
    }
  }
}

/**
 * Shows a toast message, optionally with an action button (e.g. Undo).
 *
 * @param {string} msg
 * @param {object} [opts]
 * @param {string} [opts.actionLabel] Button text.
 * @param {Function} [opts.onAction] Called when the button is clicked.
 * @param {number} [opts.duration=3200] Milliseconds before hiding.
 */
function showToast(msg, opts = {}) {
  const t = document.getElementById('toast');
  const { actionLabel = '', onAction = null, duration = 3200 } = opts || {};
  t.textContent = '';
  const textEl = document.createElement('span');
  textEl.textContent = msg;
  t.appendChild(textEl);
  if (actionLabel && typeof onAction === 'function') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = actionLabel;
    btn.className = 'ms-3 px-2.5 py-1 rounded-lg bg-brand/20 hover:bg-brand/30 border border-brand/40 text-brand font-bold transition';
    btn.onclick = () => {
      clearTimeout(window._toastTimer);
      t.classList.add('hidden');
      onAction();
    };
    t.appendChild(btn);
  }
  clearTimeout(window._toastTimer);
  clearTimeout(window._toastHideTimer);
  t.classList.remove('hidden', 'animate-toast-in', 'animate-toast-out');
  void t.offsetWidth;
  t.classList.add('animate-toast-in');
  window._toastTimer = setTimeout(() => {
    if (prefersReducedMotion()) {
      t.classList.add('hidden');
      return;
    }
    t.classList.remove('animate-toast-in');
    t.classList.add('animate-toast-out');
    window._toastHideTimer = setTimeout(() => {
      t.classList.add('hidden');
      t.classList.remove('animate-toast-out');
    }, 160);
  }, duration);
}

/**
 * Opens or closes the sidebar on mobile.
 *
 * @param {boolean} open
 */
function toggleMobileSidebar(open) {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('sidebarBackdrop');
  if (open) {
    sb.classList.remove('sidebar-closed');
    bd.classList.remove('hidden', 'animate-backdrop-out');
    bd.classList.add('animate-backdrop-in');
  } else {
    sb.classList.add('sidebar-closed');
    if (!bd.classList.contains('hidden')) {
      bd.classList.remove('animate-backdrop-in');
      bd.classList.add('animate-backdrop-out');
      setTimeout(() => bd.classList.add('hidden'), 150);
    }
  }
}

/**
 * Opens the onboarding tutorial at a given step.
 *
 * @param {number} [startStep=0]
 */
function openTutorialModal(startStep = 0) {
  tutorialStep = startStep;
  renderTutorialStep();
  animateModalOpen('tutorialModal');
}

/**
 * Closes the tutorial and remembers that it was seen.
 */
function skipTutorial() {
  localStorage.setItem('enjaz_tutorial_done', '1');
  animateModalClose('tutorialModal');
}

/**
 * Renders the current tutorial step.
 */
function renderTutorialStep() {
  const steps = getTutorialSteps();
  const step = steps[tutorialStep];
  document.getElementById('tutStepCounter').textContent = `${tutorialStep + 1} / ${steps.length}`;

  document.getElementById('tutContent').innerHTML = `
    <div class="w-12 h-12 rounded-2xl bg-brand/12 border border-brand/30 flex items-center justify-center">
      ${step.icon}
    </div>
    <div class="space-y-2">
      <h3 class="font-display text-base sm:text-lg font-extrabold text-white">${step.title}</h3>
      <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed">${step.desc}</p>
    </div>
    <div class="bg-obsidian/90 border border-borderSubtle rounded-2xl p-4 space-y-2.5">
      ${step.tips.map(tip => `
        <div class="flex items-start gap-2 text-xs text-zinc-300">
          <span class="text-brand mt-0.5 shrink-0">${ICONS.check}</span>
          <span>${tip}</span>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('tutDots').innerHTML = steps.map((_, idx) => `
    <span class="h-1.5 rounded-full transition-all ${idx === tutorialStep ? 'w-6 bg-brand' : 'w-1.5 bg-zinc-700'}"></span>
  `).join('');

  const prevBtn = document.getElementById('tutPrevBtn');
  const nextBtn = document.getElementById('tutNextBtn');
  prevBtn.classList.toggle('hidden', tutorialStep === 0);
  nextBtn.textContent = tutorialStep === steps.length - 1 ? t('startFirstProject') : t('nextBtn');
}

/**
 * Goes to the previous tutorial step.
 */
function prevTutorialStep() {
  if (tutorialStep > 0) {
    tutorialStep--;
    renderTutorialStep();
  }
}

/**
 * Goes to the next tutorial step, or finishes the tutorial.
 */
function nextTutorialStep() {
  if (tutorialStep < TUTORIAL_STEPS.length - 1) {
    tutorialStep++;
    renderTutorialStep();
  } else {
    skipTutorial();
    openProjectModal(null);
  }
}
