/**
 * Enjaz — File attachments for the AI assistant: reads PDF, Word, Excel/CSV
 * and text/code files in the browser and turns them into text the AI can
 * read alongside the user's message. Libraries load only when needed.
 *
 * Copyright (C) 2026 Omariooo
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Enjaz, free software released under the GNU General
 * Public License v3.0 or later. See the LICENSE file for details.
 */

const AI_MAX_FILES = 5;
const AI_MAX_FILE_BYTES = 20 * 1024 * 1024;
const AI_FILE_CHAR_LIMIT = 60000;      // per file, sent to the model
const AI_CONTEXT_FILE_CHARS = 120000;  // all files across one request
const AI_PDF_MAX_PAGES = 300;

// Exact versions, loaded on first use only.
const AI_FILE_LIBS = {
  pdf: {
    url: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
    worker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
    global: 'pdfjsLib'
  },
  docx: { url: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js', global: 'mammoth' },
  sheet: { url: 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js', global: 'XLSX' }
};

// Keep in sync with the accept attribute of #aiImageInput in enjaz.html.
const AI_TEXT_EXTENSIONS = [
  'txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'xml', 'html', 'htm', 'css', 'js', 'mjs', 'ts', 'tsx', 'jsx',
  'py', 'java', 'c', 'h', 'cpp', 'hpp', 'cs', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'dart', 'sql', 'sh',
  'yaml', 'yml', 'toml', 'ini', 'env', 'log', 'rtf', 'tex', 'srt', 'vtt'
];

/** @type {{id: string, name: string, kind: string, size: number, status: 'reading'|'ready'|'error', text?: string, chars?: number, truncated?: boolean, pages?: number, error?: string}[]} */
let aiPendingFiles = [];

const _aiLibPromises = {};

/**
 * Loads a script once and resolves with the global it defines.
 *
 * @param {{url: string, global: string}} lib
 * @returns {Promise<*>}
 */
function loadAiFileLib(lib) {
  if (window[lib.global]) return Promise.resolve(window[lib.global]);
  if (!_aiLibPromises[lib.url]) {
    _aiLibPromises[lib.url] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = lib.url;
      s.async = true;
      s.onload = () => (window[lib.global] ? resolve(window[lib.global]) : reject(new Error('Library did not load')));
      s.onerror = () => {
        delete _aiLibPromises[lib.url];
        reject(new Error(currentLang === 'en' ? 'Could not load the file reader (check your connection)' : 'تعذر تحميل قارئ الملفات (تأكد من الاتصال بالإنترنت)'));
      };
      document.head.appendChild(s);
    });
  }
  return _aiLibPromises[lib.url];
}

/**
 * Decides how a file will be read.
 *
 * @param {File} file
 * @returns {'image'|'pdf'|'docx'|'sheet'|'text'|'unsupported'}
 */
function aiFileKind(file) {
  const name = (file.name || '').toLowerCase();
  const ext = name.includes('.') ? name.split('.').pop() : '';
  const type = file.type || '';
  if (type.startsWith('image/')) return 'image';
  if (ext === 'pdf' || type === 'application/pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  if (['xlsx', 'xls', 'ods'].includes(ext)) return 'sheet';
  if (AI_TEXT_EXTENSIONS.includes(ext) || type.startsWith('text/') || type === 'application/json') return 'text';
  return 'unsupported';
}

/**
 * Human-readable file size.
 *
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Extracts the text of every page of a PDF. Fonts are not loaded and eval is
 * disabled, which is all text extraction needs and keeps untrusted PDFs safe.
 *
 * @param {File} file
 * @returns {Promise<{text: string, pages: number}>}
 */
async function extractPdfText(file) {
  const pdfjs = await loadAiFileLib(AI_FILE_LIBS.pdf);
  pdfjs.GlobalWorkerOptions.workerSrc = AI_FILE_LIBS.pdf.worker;
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    isEvalSupported: false,
    disableFontFace: true
  }).promise;
  const parts = [];
  let chars = 0;
  const pageCount = Math.min(doc.numPages, AI_PDF_MAX_PAGES);
  for (let i = 1; i <= pageCount && chars < AI_FILE_CHAR_LIMIT; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(it => (it.str || '') + (it.hasEOL ? '\n' : ' ')).join('').trim();
    if (text) {
      parts.push(`--- Page ${i} ---\n${text}`);
      chars += text.length;
    }
  }
  await doc.destroy();
  return { text: parts.join('\n\n'), pages: doc.numPages };
}

/**
 * Extracts the plain text of a Word document.
 *
 * @param {File} file
 * @returns {Promise<{text: string}>}
 */
async function extractDocxText(file) {
  const mammoth = await loadAiFileLib(AI_FILE_LIBS.docx);
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return { text: result.value || '' };
}

/**
 * Converts every sheet of a spreadsheet to CSV text.
 *
 * @param {File} file
 * @returns {Promise<{text: string, pages: number}>} pages = number of sheets.
 */
async function extractSheetText(file) {
  const XLSX = await loadAiFileLib(AI_FILE_LIBS.sheet);
  const wb = XLSX.read(new Uint8Array(await file.arrayBuffer()), { type: 'array' });
  const text = wb.SheetNames.map(name => {
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name], { blankrows: false });
    return `--- Sheet: ${name} ---\n${csv}`;
  }).join('\n\n');
  return { text, pages: wb.SheetNames.length };
}

/**
 * Reads an attached document, adds it to the pending list and updates the
 * chips while it is being read.
 *
 * @param {File} file
 */
async function processAiDocFile(file) {
  const isEn = currentLang === 'en';
  const kind = aiFileKind(file);
  if (kind === 'unsupported') {
    showToast(isEn
      ? `"${file.name}" isn't supported. Use PDF, Word (.docx), Excel, CSV, text/code files or images.`
      : `الملف "${file.name}" غير مدعوم. استخدم PDF أو Word (.docx) أو Excel أو CSV أو ملفات نصية/أكواد أو صور.`, { duration: 6000 });
    return;
  }
  if (file.size > AI_MAX_FILE_BYTES) {
    showToast(isEn ? `"${file.name}" is too large (max 20MB)` : `الملف "${file.name}" كبير جداً (الحد الأقصى 20MB)`);
    return;
  }
  if (aiPendingFiles.length >= AI_MAX_FILES) {
    showToast(isEn ? `You can attach up to ${AI_MAX_FILES} files per message` : `تقدر ترفق ${AI_MAX_FILES} ملفات بحد أقصى في الرسالة`);
    return;
  }

  const entry = { id: randomId('file'), name: file.name || 'file', kind, size: file.size, status: 'reading' };
  aiPendingFiles.push(entry);
  renderAiFileChips();

  try {
    const result = kind === 'pdf' ? await extractPdfText(file)
      : kind === 'docx' ? await extractDocxText(file)
        : kind === 'sheet' ? await extractSheetText(file)
          : { text: await file.text() };
    let text = (result.text || '').replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!text) {
      throw new Error(kind === 'pdf'
        ? (isEn ? 'No text found — it may be a scanned PDF. Attach it as an image instead.' : 'مفيش نص في الملف — غالباً PDF متصوّر. ارفعه كصورة بدل كده.')
        : (isEn ? 'The file is empty' : 'الملف فاضي'));
    }
    entry.chars = text.length;
    entry.truncated = text.length > AI_FILE_CHAR_LIMIT;
    if (entry.truncated) text = text.slice(0, AI_FILE_CHAR_LIMIT);
    entry.text = text;
    entry.pages = result.pages;
    entry.status = 'ready';
    if (entry.truncated) {
      showToast(isEn
        ? `"${entry.name}" is long; the AI will read the first ${AI_FILE_CHAR_LIMIT.toLocaleString('en')} characters.`
        : `الملف "${entry.name}" طويل؛ المساعد هيقرا أول ${AI_FILE_CHAR_LIMIT.toLocaleString('en')} حرف منه.`, { duration: 6000 });
    }
  } catch (err) {
    console.warn('Could not read file:', err);
    entry.status = 'error';
    entry.error = (err && err.message) || String(err);
    if (/password/i.test(entry.error)) {
      entry.error = isEn ? 'The file is password-protected' : 'الملف محمي بكلمة سر';
    }
  }
  if (aiPendingFiles.includes(entry)) renderAiFileChips();
}

/**
 * Routes attached files: images go to the image flow (one per message),
 * everything else is read as a document.
 *
 * @param {FileList|File[]} files
 */
function processAiAttachments(files) {
  Array.from(files || []).forEach(file => {
    if (aiFileKind(file) === 'image') processAiImageFile(file);
    else processAiDocFile(file);
  });
  const input = document.getElementById('aiImageInput');
  if (input) input.value = '';
}

/**
 * Removes one pending file.
 *
 * @param {string} id
 */
function removeAiPendingFile(id) {
  aiPendingFiles = aiPendingFiles.filter(f => f.id !== id);
  renderAiFileChips();
}

/** Removes every pending file. */
function clearAiPendingFiles() {
  aiPendingFiles = [];
  renderAiFileChips();
}

/** Whether any attached file is still being read. */
function aiFilesBusy() {
  return aiPendingFiles.some(f => f.status === 'reading');
}

/** Files that were read successfully, ready to send. */
function takeReadyAiFiles() {
  const ready = aiPendingFiles.filter(f => f.status === 'ready');
  clearAiPendingFiles();
  return ready.map(({ name, kind, size, text, chars, truncated, pages }) => ({ name, kind, size, text, chars, truncated, pages }));
}

const AI_FILE_KIND_META = {
  pdf: { label: 'PDF', cls: 'bg-rose-500/15 text-rose-300 border-rose-400/25' },
  docx: { label: 'Word', cls: 'bg-sky-500/15 text-sky-300 border-sky-400/25' },
  sheet: { label: 'Excel', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25' },
  text: { label: 'TXT', cls: 'bg-zinc-500/15 text-zinc-300 border-white/15' }
};

/**
 * HTML for one file chip (used in the composer and in sent messages).
 *
 * @param {object} f File entry.
 * @param {boolean} [removable=false]
 * @returns {string}
 */
function aiFileChipHtml(f, removable = false) {
  const isEn = currentLang === 'en';
  const meta = AI_FILE_KIND_META[f.kind] || AI_FILE_KIND_META.text;
  const ext = (f.name.split('.').pop() || '').toUpperCase().slice(0, 4);
  const label = f.kind === 'text' ? (ext || meta.label) : meta.label;
  let sub = formatFileSize(f.size);
  if (f.status === 'reading') sub = isEn ? 'Reading…' : 'جاري القراءة…';
  else if (f.status === 'error') sub = f.error || (isEn ? 'Could not read' : 'تعذرت القراءة');
  else {
    if (f.pages && f.kind === 'pdf') sub += ` · ${f.pages} ${isEn ? 'pages' : 'صفحة'}`;
    if (f.pages && f.kind === 'sheet') sub += ` · ${f.pages} ${isEn ? 'sheets' : 'شيت'}`;
    if (f.truncated) sub += isEn ? ' · first part only' : ' · أول جزء بس';
    if (f.textDropped) sub += isEn ? ' · content no longer stored' : ' · المحتوى مبقاش محفوظ';
  }
  return `
    <div class="flex items-center gap-2 min-w-0 max-w-full px-2 py-1.5 rounded-xl border ${f.status === 'error' ? 'border-rose-500/35 bg-rose-500/[0.06]' : 'border-white/[0.08] bg-white/[0.04]'}">
      <span class="text-[9px] font-mono font-bold px-1.5 py-1 rounded-md border ${meta.cls} shrink-0">${escapeHtml(label)}</span>
      <div class="min-w-0 flex-1">
        <p class="text-[11px] font-semibold text-zinc-100 truncate" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</p>
        <p class="text-[10px] ${f.status === 'error' ? 'text-rose-300' : 'text-zinc-400'} truncate">${f.status === 'reading' ? '<span class="inline-block w-2 h-2 me-1 rounded-full border border-brand border-t-transparent animate-spin align-middle"></span>' : ''}${escapeHtml(sub)}</p>
      </div>
      ${removable ? `<button type="button" data-ai-file-remove="${escapeHtml(f.id)}" aria-label="${isEn ? 'Remove file' : 'إزالة الملف'}"
        class="w-6 h-6 rounded-lg hover:bg-rose-500/15 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition shrink-0">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>` : ''}
    </div>`;
}

/** Renders the pending-file chips above the AI composer. */
function renderAiFileChips() {
  const wrap = document.getElementById('aiFileChips');
  if (!wrap) return;
  wrap.innerHTML = aiPendingFiles.map(f => aiFileChipHtml(f, true)).join('');
  wrap.classList.toggle('hidden', aiPendingFiles.length === 0);
}

/**
 * Builds the text sent to the model for a message's attached files. Content
 * is fenced and labeled so the model treats it as data, not instructions.
 *
 * @param {object[]} files
 * @param {number} budget Remaining characters allowed for file content.
 * @returns {{text: string, used: number}}
 */
function buildAiFileContext(files, budget) {
  let used = 0;
  const blocks = files.map(f => {
    const kindLabel = (AI_FILE_KIND_META[f.kind] || AI_FILE_KIND_META.text).label;
    const header = `[Attached file: ${f.name} (${kindLabel}${f.pages ? `, ${f.pages} ${f.kind === 'sheet' ? 'sheets' : 'pages'}` : ''}${f.truncated ? ', truncated' : ''})]`;
    if (!f.text) return `${header}\n(The file content is no longer available in this chat.)`;
    if (used + f.text.length > budget) {
      return `${header}\n(Content omitted to stay within the context limit; ask the user to re-attach it if needed.)`;
    }
    used += f.text.length;
    return `${header}\n<<<FILE_CONTENT\n${f.text}\nFILE_CONTENT>>>`;
  });
  return { text: blocks.join('\n\n'), used };
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-ai-file-remove]');
  if (btn) removeAiPendingFile(btn.getAttribute('data-ai-file-remove'));
});

// Drag and drop files onto the AI drawer.
(function wireAiDrawerDrop() {
  const hasFiles = e => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
  document.addEventListener('dragover', (e) => {
    const drawer = e.target.closest && e.target.closest('#aiDrawer');
    if (!drawer || !hasFiles(e)) return;
    e.preventDefault();
    drawer.classList.add('ai-drop-active');
  });
  document.addEventListener('dragleave', (e) => {
    const drawer = document.getElementById('aiDrawer');
    if (drawer && (!e.relatedTarget || !drawer.contains(e.relatedTarget))) drawer.classList.remove('ai-drop-active');
  });
  document.addEventListener('drop', (e) => {
    const drawer = e.target.closest && e.target.closest('#aiDrawer');
    if (!drawer || !hasFiles(e)) return;
    e.preventDefault();
    drawer.classList.remove('ai-drop-active');
    processAiAttachments(e.dataTransfer.files);
  });
})();
