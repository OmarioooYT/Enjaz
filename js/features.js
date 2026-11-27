/**
 * Enjaz — Collaboration and UX features: undo delete, task checklists (+AI), comments
 * with @mentions, activity feed, notifications, calendar view, daily summary
 * (+AI), offline snapshot and PWA install.
 *
 * Copyright (C) 2026 Omariooo
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Enjaz, free software released under the GNU General
 * Public License v3.0 or later. See the LICENSE file for details.
 */

Object.assign(I18N.ar, {
  undoBtn: 'تراجع',
  taskDeletedUndo: 'تم حذف المهمة',
  taskRestored: 'تمت استعادة المهمة ↩',
  taskDeleteFailed: 'تعذر حذف المهمة، تمت استعادتها',
  calendarTab: 'تقويم',
  activityTab: 'النشاط',
  subtasksLabel: 'خطوات المهمة',
  subtaskPlaceholder: 'أضف خطوة واضغط Enter...',
  subtaskAddBtn: 'إضافة',
  subtasksAiBtn: 'قسّمها بالذكاء الاصطناعي',
  subtasksAiWorking: 'جاري التقسيم...',
  subtasksAiNeedTitle: 'اكتب عنوان المهمة الأول',
  subtasksAiFailed: 'تعذر توليد الخطوات، حاول تاني',
  subtasksSaveFailed: 'تعذر حفظ الخطوات',
  subtasksEmpty: 'مفيش خطوات لسه',
  commentsLabel: 'التعليقات',
  commentPlaceholder: 'اكتب تعليق... استخدم @ للإشارة لعضو',
  commentSendBtn: 'إرسال',
  commentsEmpty: 'مفيش تعليقات لسه. ابدأ النقاش!',
  commentFailed: 'تعذر إرسال التعليق',
  commentDeleteFailed: 'تعذر حذف التعليق',
  commentNeedsSave: 'احفظ المهمة الأول عشان تقدر تعلّق عليها',
  justNow: 'الآن',
  minutesAgo: 'منذ {n} د',
  hoursAgo: 'منذ {n} س',
  daysAgo: 'منذ {n} يوم',
  today: 'النهارده',
  yesterday: 'امبارح',
  someone: 'عضو',
  activityTitle: 'سجل النشاط',
  activityDesc: 'كل اللي بيحصل في المشروع لحظة بلحظة',
  activityEmpty: 'مفيش نشاط لسه. أي تغيير في المهام هيظهر هنا.',
  activityNeedsSchema: 'شغّل ملف supabase/schema.sql المحدّث عشان سجل النشاط يشتغل',
  actTaskCreated: '{actor} أضاف المهمة {task}',
  actTaskStatus: '{actor} نقل {task} إلى {status}',
  actTaskAssigned: '{actor} أسند {task} إلى {assignee}',
  actTaskDue: '{actor} غيّر موعد {task} إلى {date}',
  actTaskDueRemoved: '{actor} شال موعد {task}',
  actTaskDeleted: '{actor} حذف المهمة {task}',
  actComment: '{actor} علّق على {task}',
  actMemberJoined: '{actor} انضم للمشروع',
  notifyBtnTitle: 'الإشعارات',
  notifyEnabled: 'تم تفعيل الإشعارات 🔔',
  notifyDisabled: 'تم إيقاف الإشعارات',
  notifyBlocked: 'الإشعارات محظورة من المتصفح. فعّلها من إعدادات الموقع.',
  notifyUnsupported: 'المتصفح ده مش بيدعم الإشعارات',
  notifAssignedTitle: 'مهمة جديدة ليك',
  notifAssignedBody: '{actor} أسند لك: {task}',
  notifMentionTitle: 'حد أشار ليك',
  notifMentionBody: '{actor} في {task}: {text}',
  notifCommentTitle: 'تعليق على مهمتك',
  notifCommentBody: '{actor} على {task}: {text}',
  calToday: 'اليوم',
  calPrev: 'الشهر السابق',
  calNext: 'الشهر التالي',
  calUndated: 'مهام بدون موعد',
  calUndatedHint: 'اسحب أي مهمة لأي يوم في التقويم',
  calNoTasksDay: 'مفيش مهام في اليوم ده',
  calAddOnDay: 'مهمة في اليوم ده',
  calMore: '+{n}',
  dueDateUpdated: 'تم تغيير الموعد 📅',
  dueDateFailed: 'تعذر تغيير الموعد',
  goodMorning: 'صباح الخير',
  goodEvening: 'مساء الخير',
  summaryTitle: 'ملخص اليوم',
  summaryDueToday: 'مستحقة النهارده',
  summaryOverdue: 'متأخرة',
  summaryDoneByTeam: 'خلّصها الفريق آخر ٢٤ ساعة',
  summaryYourTasks: 'مهامك',
  summaryProjectTasks: 'مهام المشروع',
  summaryAllClear: 'مفيش حاجة مستعجلة النهارده. يوم هادي 🎉',
  summaryAiBtn: 'ملخص ذكي',
  summaryAiRefresh: 'تحديث',
  summaryAiWorking: 'جاري الكتابة...',
  summaryAiFailed: 'تعذر توليد الملخص',
  summaryHide: 'إخفاء لليوم',
  offlineMode: 'أوفلاين — بيانات محفوظة',
  installApp: 'تثبيت التطبيق',
  aiUnavailable: 'مكتبة الذكاء الاصطناعي مش متاحة دلوقتي',
  statusTodoShort: 'قيد الانتظار',
  statusInProgressShort: 'جاري العمل',
  statusDoneShort: 'تم'
});

Object.assign(I18N.en, {
  undoBtn: 'Undo',
  taskDeletedUndo: 'Task deleted',
  taskRestored: 'Task restored ↩',
  taskDeleteFailed: 'Could not delete the task, restored it',
  calendarTab: 'Calendar',
  activityTab: 'Activity',
  subtasksLabel: 'Checklist',
  subtaskPlaceholder: 'Add a step and press Enter...',
  subtaskAddBtn: 'Add',
  subtasksAiBtn: 'Break down with AI',
  subtasksAiWorking: 'Breaking down...',
  subtasksAiNeedTitle: 'Write the task title first',
  subtasksAiFailed: 'Could not generate steps, try again',
  subtasksSaveFailed: 'Could not save checklist',
  subtasksEmpty: 'No steps yet',
  commentsLabel: 'Comments',
  commentPlaceholder: 'Write a comment... use @ to mention someone',
  commentSendBtn: 'Send',
  commentsEmpty: 'No comments yet. Start the discussion!',
  commentFailed: 'Could not send comment',
  commentDeleteFailed: 'Could not delete comment',
  commentNeedsSave: 'Save the task first to comment on it',
  justNow: 'just now',
  minutesAgo: '{n}m ago',
  hoursAgo: '{n}h ago',
  daysAgo: '{n}d ago',
  today: 'Today',
  yesterday: 'Yesterday',
  someone: 'Someone',
  activityTitle: 'Activity',
  activityDesc: 'Everything happening in this project, live',
  activityEmpty: 'No activity yet. Task changes will show up here.',
  activityNeedsSchema: 'Run the updated supabase/schema.sql to enable the activity feed',
  actTaskCreated: '{actor} added {task}',
  actTaskStatus: '{actor} moved {task} to {status}',
  actTaskAssigned: '{actor} assigned {task} to {assignee}',
  actTaskDue: '{actor} set the due date of {task} to {date}',
  actTaskDueRemoved: '{actor} removed the due date of {task}',
  actTaskDeleted: '{actor} deleted {task}',
  actComment: '{actor} commented on {task}',
  actMemberJoined: '{actor} joined the project',
  notifyBtnTitle: 'Notifications',
  notifyEnabled: 'Notifications enabled 🔔',
  notifyDisabled: 'Notifications turned off',
  notifyBlocked: 'Notifications are blocked by the browser. Allow them in site settings.',
  notifyUnsupported: 'This browser does not support notifications',
  notifAssignedTitle: 'New task for you',
  notifAssignedBody: '{actor} assigned you: {task}',
  notifMentionTitle: 'You were mentioned',
  notifMentionBody: '{actor} in {task}: {text}',
  notifCommentTitle: 'Comment on your task',
  notifCommentBody: '{actor} on {task}: {text}',
  calToday: 'Today',
  calPrev: 'Previous month',
  calNext: 'Next month',
  calUndated: 'No due date',
  calUndatedHint: 'Drag any task onto a day',
  calNoTasksDay: 'No tasks on this day',
  calAddOnDay: 'Task on this day',
  calMore: '+{n}',
  dueDateUpdated: 'Due date updated 📅',
  dueDateFailed: 'Could not change the due date',
  goodMorning: 'Good morning',
  goodEvening: 'Good evening',
  summaryTitle: 'Today at a glance',
  summaryDueToday: 'Due today',
  summaryOverdue: 'Overdue',
  summaryDoneByTeam: 'Done by the team (24h)',
  summaryYourTasks: 'Your tasks',
  summaryProjectTasks: 'Project tasks',
  summaryAllClear: 'Nothing urgent today. Enjoy the calm 🎉',
  summaryAiBtn: 'AI summary',
  summaryAiRefresh: 'Refresh',
  summaryAiWorking: 'Writing...',
  summaryAiFailed: 'Could not generate the summary',
  summaryHide: 'Hide for today',
  offlineMode: 'Offline — saved data',
  installApp: 'Install app',
  aiUnavailable: 'The AI library is not available right now',
  statusTodoShort: 'To Do',
  statusInProgressShort: 'In Progress',
  statusDoneShort: 'Done'
});

// ---------- Small helpers ------------------------------------------------

/**
 * Replaces {name} placeholders in a translated string.
 *
 * @param {string} str
 * @param {Object<string, string>} values
 * @returns {string}
 */
function fillTemplate(str, values) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (values[k] !== undefined ? values[k] : ''));
}

/**
 * Formats a date as local YYYY-MM-DD.
 *
 * @param {Date} d
 * @returns {string}
 */
function dateToStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Today's date as local YYYY-MM-DD.
 *
 * @returns {string}
 */
function todayStr() {
  return dateToStr(new Date());
}

/**
 * Case- and space-insensitive name comparison (empty names never match).
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function sameName(a, b) {
  const x = (a || '').trim().toLowerCase();
  const y = (b || '').trim().toLowerCase();
  return Boolean(x) && x === y;
}

/**
 * Short relative time such as "5m ago".
 *
 * @param {number} ms Timestamp in milliseconds.
 * @returns {string}
 */
function timeAgo(ms) {
  const diff = Math.max(0, Date.now() - Number(ms || 0));
  const min = Math.floor(diff / 60000);
  if (min < 1) return t('justNow');
  if (min < 60) return fillTemplate(t('minutesAgo'), { n: min });
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return fillTemplate(t('hoursAgo'), { n: hrs });
  return fillTemplate(t('daysAgo'), { n: Math.floor(hrs / 24) });
}

/**
 * Locale used for dates in the current language.
 *
 * @returns {string}
 */
function uiLocale() {
  return currentLang === 'en' ? 'en-US' : 'ar-EG';
}

/**
 * Short translated label for a task status.
 *
 * @param {string} st
 * @returns {string}
 */
function statusShortLabel(st) {
  return st === 'done' ? t('statusDoneShort') : st === 'in_progress' ? t('statusInProgressShort') : t('statusTodoShort');
}

/**
 * Names of the active project's members and assignees, used for @mentions.
 *
 * @returns {string[]}
 */
function projectMemberNames() {
  const names = new Set();
  members.filter(m => m.project_id === activeProjectId).forEach(m => { if (m.name) names.add(m.name.trim()); });
  tasks.filter(x => x.project_id === activeProjectId).forEach(x => { if (x.assignee) names.add(x.assignee.trim()); });
  return Array.from(names).filter(Boolean);
}

/**
 * Generates a unique ID such as TSK-1700000000000-a1b2c3d4e5f6.
 *
 * @param {string} prefix
 * @returns {string}
 */
function randomId(prefix) {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `${prefix}-${Date.now()}-${Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Turns a Supabase/PostgREST error into a short, actionable reason for the
 * user.
 *
 * @param {object} error
 * @returns {string}
 */
function describeDbError(error) {
  if (!error) return '';
  const code = error.code || '';
  const msg = error.message || String(error);
  if (code === 'PGRST205' || code === '42P01' || /schema cache|does not exist/i.test(msg)) {
    return currentLang === 'en'
      ? 'database table missing — run supabase/schema.sql again'
      : 'جدول ناقص في قاعدة البيانات — شغّل supabase/schema.sql تاني';
  }
  if (/permission denied for (table|schema|function)/i.test(msg)) {
    return currentLang === 'en'
      ? 'the API has no access to this table — run supabase/schema.sql again'
      : 'التطبيق مالوش صلاحية على الجدول — شغّل supabase/schema.sql تاني';
  }
  if (code === '42501' || /row-level security/i.test(msg)) {
    return currentLang === 'en'
      ? 'permission denied by the database (are you a member of this project?)'
      : 'قاعدة البيانات رفضت الصلاحية (اتأكد إنك عضو في المشروع)';
  }
  return `${msg}${code ? ` (${code})` : ''}`;
}

/**
 * Sends a one-off prompt to Puter AI using the user's chosen model, falling
 * back through other models like the chat does.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<string>} The reply text.
 * @throws When every model fails or the AI library is unavailable.
 */
async function aiQuickText(systemPrompt, userPrompt) {
  if (!window.puter || !window.puter.ai || typeof window.puter.ai.chat !== 'function') {
    throw new Error(t('aiUnavailable'));
  }
  const models = [aiModel, ...AI_FALLBACK_CHAIN.filter(m => m !== aiModel)];
  let lastErr = null;
  for (const model of models) {
    try {
      const resp = await window.puter.ai.chat(
        [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        { model, normalize: true }
      );
      const text = extractPuterReplyText(resp);
      if (text) return text;
    } catch (err) {
      lastErr = err;
      const msg = (err && (err.message || err.error?.message)) || String(err);
      if (/cancel|closed|denied|abort|auth/i.test(msg)) break;
    }
  }
  throw lastErr || new Error(t('aiUnavailable'));
}

// =========================================================================
// 0) OPTIMISTIC WRITE TRACKING
// A background refresh that started before a local change was saved would
// otherwise overwrite it with stale data. While a write is in flight, the
// local copy wins; once it finishes, one more refresh picks up the truth.
// =========================================================================

const pendingTaskWrites = new Map();    // taskId -> local task object
const pendingCommentWrites = new Map(); // commentId -> local comment

/**
 * Runs a database write while marking the local object as pending, so a
 * background refresh that started earlier does not overwrite it with stale
 * data. Schedules one more refresh if a load was in flight.
 *
 * @param {Map} map pendingTaskWrites or pendingCommentWrites.
 * @param {string} id
 * @param {object|null} obj Local copy (null for a pending delete).
 * @param {Function} fn Performs the write.
 * @returns {Promise<*>} Whatever fn returns.
 */
async function trackPendingWrite(map, id, obj, fn) {
  map.set(id, obj);
  try {
    return await fn();
  } finally {
    if (map.get(id) === obj) map.delete(id);
    if (typeof _dataLoadInFlight !== 'undefined' && _dataLoadInFlight) _dataLoadPending = true;
  }
}

/**
 * Applies local pending writes on top of freshly fetched tasks and comments
 * (mutates the arrays).
 *
 * @param {object[]} fetchedTasks
 * @param {object[]} fetchedComments
 * @param {string[]} projectIds Loaded project IDs.
 */
function mergePendingWrites(fetchedTasks, fetchedComments, projectIds) {
  pendingTaskWrites.forEach((local, id) => {
    const i = fetchedTasks.findIndex(x => x.id === id);
    if (i >= 0) fetchedTasks[i] = local;
    else if (projectIds.includes(local.project_id)) fetchedTasks.unshift(local);
  });
  pendingCommentWrites.forEach((local, id) => {
    if (local === null) {
      const i = fetchedComments.findIndex(x => x.id === id);
      if (i >= 0) fetchedComments.splice(i, 1); // pending delete
    } else if (!fetchedComments.some(x => x.id === id) && projectIds.includes(local.project_id)) {
      fetchedComments.push(local);
    }
  });
}

// =========================================================================
// 1) UNDO DELETE
// =========================================================================

const TASK_UNDO_MS = 5000;
const pendingTaskDeletes = new Map(); // taskId -> { task, timer, committing }

/**
 * Removes a task from the screen immediately and deletes it from the database
 * after the undo window, unless Undo is pressed.
 *
 * @param {string} taskId
 */
function deleteTaskWithUndo(taskId) {
  const idx = tasks.findIndex(x => x.id === taskId);
  if (idx < 0) return;
  const task = tasks[idx];
  tasks.splice(idx, 1);
  renderAll();

  const timer = setTimeout(() => commitTaskDelete(taskId), TASK_UNDO_MS);
  pendingTaskDeletes.set(taskId, { task, timer, committing: false });
  showToast(t('taskDeletedUndo'), {
    actionLabel: t('undoBtn'),
    onAction: () => undoTaskDelete(taskId),
    duration: TASK_UNDO_MS
  });
}

/**
 * Puts a task back into the local list and re-renders.
 *
 * @param {object} task
 */
function restoreTaskLocally(task) {
  if (!tasks.some(x => x.id === task.id)) {
    tasks.push(task);
    tasks.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  }
  renderAll();
}

/**
 * Cancels a pending delete and restores the task.
 *
 * @param {string} taskId
 */
function undoTaskDelete(taskId) {
  const pending = pendingTaskDeletes.get(taskId);
  if (!pending || pending.committing) return;
  clearTimeout(pending.timer);
  pendingTaskDeletes.delete(taskId);
  restoreTaskLocally(pending.task);
  showToast(t('taskRestored'));
}

/**
 * Deletes a task from the database now; restores it locally if that fails.
 *
 * @param {string} taskId
 */
async function commitTaskDelete(taskId) {
  const pending = pendingTaskDeletes.get(taskId);
  if (!pending || pending.committing) return;
  clearTimeout(pending.timer);
  pending.committing = true;
  const { error } = await db.from('tasks').delete().eq('id', taskId);
  pendingTaskDeletes.delete(taskId);
  if (error) {
    restoreTaskLocally(pending.task);
    showToast(t('taskDeleteFailed'));
  }
}

/**
 * Commits every pending delete immediately (when the page is hidden or closed),
 * so deleted really means deleted.
 */
function flushPendingTaskDeletes() {
  Array.from(pendingTaskDeletes.keys()).forEach(id => commitTaskDelete(id));
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushPendingTaskDeletes();
});
window.addEventListener('pagehide', flushPendingTaskDeletes);

// =========================================================================
// 2) SUBTASKS / CHECKLIST
// =========================================================================

let modalSubtasks = [];

/**
 * Validates a checklist value from the database (array or JSON string).
 *
 * @param {*} val
 * @returns {{id: string, text: string, done: boolean}[]}
 */
function normalizeSubtasks(val) {
  let arr = val;
  if (typeof arr === 'string') {
    try { arr = JSON.parse(arr); } catch { arr = []; }
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(x => x && typeof x.text === 'string' && x.text.trim())
    .map(x => ({ id: String(x.id || randomId('st')), text: x.text.trim().slice(0, 300), done: Boolean(x.done) }));
}

/**
 * A copy of the checklist being edited in the task modal.
 *
 * @returns {object[]}
 */
function getModalSubtasks() {
  return modalSubtasks.map(s => ({ ...s }));
}

/**
 * Loads a task's checklist into the task modal.
 *
 * @param {object|null} task
 */
function initModalSubtasks(task) {
  modalSubtasks = task ? normalizeSubtasks(task.subtasks) : [];
  const input = document.getElementById('subtaskInput');
  if (input) input.value = '';
  renderModalSubtasks();
}

/**
 * Renders the checklist and its progress bar in the task modal.
 */
function renderModalSubtasks() {
  const list = document.getElementById('subtaskList');
  const progress = document.getElementById('subtaskProgress');
  if (!list) return;
  const done = modalSubtasks.filter(s => s.done).length;
  if (progress) {
    progress.textContent = modalSubtasks.length ? `${done}/${modalSubtasks.length}` : '';
  }
  const bar = document.getElementById('subtaskProgressBar');
  if (bar) bar.style.width = modalSubtasks.length ? `${Math.round((done / modalSubtasks.length) * 100)}%` : '0%';

  if (modalSubtasks.length === 0) {
    list.innerHTML = `<p class="text-[11px] text-zinc-500 py-1">${escapeHtml(t('subtasksEmpty'))}</p>`;
    return;
  }
  list.innerHTML = modalSubtasks.map(s => `
    <div class="group flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-white/[0.03]">
      <button type="button" data-subtask-toggle="${escapeHtml(s.id)}" aria-label="toggle"
        class="w-[18px] h-[18px] shrink-0 rounded-md border flex items-center justify-center transition ${s.done ? 'bg-emerald-500 border-emerald-500 text-obsidian' : 'border-white/20 hover:border-brand'}">
        ${s.done ? '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : ''}
      </button>
      <span class="flex-1 text-xs leading-relaxed ${s.done ? 'line-through text-zinc-500' : 'text-zinc-200'}">${escapeHtml(s.text)}</span>
      <button type="button" data-subtask-remove="${escapeHtml(s.id)}" aria-label="remove"
        class="opacity-60 sm:opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-1 rounded transition">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>`).join('');
}

/**
 * Saves the modal checklist optimistically for an existing task (new tasks save
 * it with the form).
 */
async function persistModalSubtasks() {
  renderModalSubtasks();
  const editId = document.getElementById('editTaskId').value;
  if (!editId) return; // new task: saved together with the form
  const task = tasks.find(x => x.id === editId);
  if (!task) return;
  const prev = task.subtasks;
  const next = getModalSubtasks();
  task.subtasks = next;
  renderWorkspace();
  const { error } = await trackPendingWrite(pendingTaskWrites, editId, task,
    () => db.from('tasks').update({ subtasks: next }).eq('id', editId));
  if (error) {
    task.subtasks = prev;
    if (document.getElementById('editTaskId').value === editId) {
      modalSubtasks = normalizeSubtasks(prev);
      renderModalSubtasks();
    }
    renderWorkspace();
    showToast(t('subtasksSaveFailed'));
  }
}

/**
 * Adds a step to the modal checklist.
 *
 * @param {string} text
 */
function addModalSubtask(text) {
  const clean = (text || '').trim();
  if (!clean) return;
  modalSubtasks.push({ id: randomId('st'), text: clean.slice(0, 300), done: false });
  persistModalSubtasks();
}

/**
 * Adds the step typed in the checklist input.
 */
function addSubtaskFromInput() {
  const input = document.getElementById('subtaskInput');
  if (!input) return;
  addModalSubtask(input.value);
  input.value = '';
  input.focus();
}

/**
 * Asks the AI to break the task into 3 to 7 steps and appends them to the
 * checklist.
 */
async function generateSubtasksWithAi() {
  const title = document.getElementById('fTaskTitle').value.trim();
  const notes = document.getElementById('fTaskNotes').value.trim();
  if (!title) {
    showToast(t('subtasksAiNeedTitle'));
    document.getElementById('fTaskTitle').focus();
    return;
  }
  const btn = document.getElementById('subtaskAiBtn');
  const label = document.getElementById('subtaskAiBtnLabel');
  if (btn) btn.disabled = true;
  if (label) label.textContent = t('subtasksAiWorking');
  try {
    const lang = currentLang === 'en' ? 'English' : 'Arabic';
    const existing = modalSubtasks.map(s => s.text);
    const reply = await aiQuickText(
      `You break project tasks into short, concrete, actionable checklist steps. Reply with ONLY a JSON array of strings (3 to 7 items), written in ${lang}. No explanations, no markdown.`,
      `Task: ${title}\nDetails: ${notes || '-'}${existing.length ? `\nAlready listed (do not repeat): ${existing.join(' | ')}` : ''}`
    );
    const match = reply.match(/\[[\s\S]*\]/);
    const steps = match ? JSON.parse(match[0]) : [];
    const clean = (Array.isArray(steps) ? steps : [])
      .map(s => (typeof s === 'string' ? s : (s && s.text) || ''))
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    if (clean.length === 0) throw new Error('empty');
    clean.forEach(text => modalSubtasks.push({ id: randomId('st'), text: text.slice(0, 300), done: false }));
    await persistModalSubtasks();
  } catch (err) {
    console.warn('AI subtasks failed:', err);
    showToast(t('subtasksAiFailed'));
  } finally {
    if (btn) btn.disabled = false;
    if (label) label.textContent = t('subtasksAiBtn');
  }
}

document.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-subtask-toggle]');
  if (toggle) {
    const s = modalSubtasks.find(x => x.id === toggle.getAttribute('data-subtask-toggle'));
    if (s) { s.done = !s.done; persistModalSubtasks(); }
    return;
  }
  const remove = e.target.closest('[data-subtask-remove]');
  if (remove) {
    modalSubtasks = modalSubtasks.filter(x => x.id !== remove.getAttribute('data-subtask-remove'));
    persistModalSubtasks();
  }
});

/**
 * HTML for the checklist progress and comment count shown on task cards (empty
 * when there are neither).
 *
 * @param {object} task
 * @returns {string}
 */
function renderTaskMetaRow(task) {
  const subs = normalizeSubtasks(task.subtasks);
  const done = subs.filter(s => s.done).length;
  const commentCount = comments.filter(c => c.task_id === task.id).length;
  if (!subs.length && !commentCount) return '';
  const pct = subs.length ? Math.round((done / subs.length) * 100) : 0;
  return `
    <div class="flex items-center gap-3 text-[10px] text-zinc-400">
      ${subs.length ? `
        <span class="inline-flex items-center gap-1.5 font-mono tabular-nums ${done === subs.length ? 'text-emerald-400' : ''}">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          ${done}/${subs.length}
          <span class="w-10 h-1 rounded-full bg-white/10 overflow-hidden"><span class="block h-full ${done === subs.length ? 'bg-emerald-400' : 'bg-brand'}" style="width:${pct}%"></span></span>
        </span>` : ''}
      ${commentCount ? `
        <span class="inline-flex items-center gap-1 font-mono tabular-nums">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${commentCount}
        </span>` : ''}
    </div>`;
}

// =========================================================================
// 3) COMMENTS WITH @MENTIONS
// =========================================================================

/**
 * Escapes a comment and highlights @mentions of project members.
 *
 * @param {string} body
 * @returns {string} HTML.
 */
function formatCommentBody(body) {
  let html = escapeHtml(body);
  const names = projectMemberNames().sort((a, b) => b.length - a.length);
  names.forEach(name => {
    const escName = escapeHtml('@' + name);
    html = html.split(escName).join(`<span class="text-brand font-semibold">${escName}</span>`);
  });
  return html.replace(/\n/g, '<br>');
}

/**
 * Project member names mentioned with @ in a comment.
 *
 * @param {string} body
 * @returns {string[]}
 */
function extractMentions(body) {
  return projectMemberNames().filter(name => body.includes('@' + name));
}

/**
 * Renders the comment thread in the task modal (hidden for new tasks).
 */
function renderModalComments() {
  const section = document.getElementById('taskCommentsSection');
  const list = document.getElementById('taskCommentsList');
  const countEl = document.getElementById('taskCommentsCount');
  if (!section || !list) return;
  const taskId = document.getElementById('editTaskId').value;
  section.classList.toggle('hidden', !taskId);
  if (!taskId) return;

  const items = comments
    .filter(c => c.task_id === taskId)
    .sort((a, b) => (a.created_at || 0) - (b.created_at || 0));
  if (countEl) countEl.textContent = items.length ? String(items.length) : '';

  if (items.length === 0) {
    list.innerHTML = `<p class="text-[11px] text-zinc-500 py-2">${escapeHtml(t('commentsEmpty'))}</p>`;
    return;
  }
  const me = getCurrentIdentity();
  list.innerHTML = items.map(c => {
    const member = members.find(m => m.project_id === c.project_id && m.user_id === c.user_id);
    const avatar = member && member.avatar_url
      ? `<img src="${escapeHtml(member.avatar_url)}" class="w-full h-full object-cover" alt="" />`
      : escapeHtml((c.author_name || '؟').charAt(0).toUpperCase());
    const mine = c.user_id === me.id;
    return `
      <div class="group flex items-start gap-2.5">
        <span class="w-7 h-7 rounded-full bg-brand/15 border border-brand/30 text-brand flex items-center justify-center text-[11px] font-bold shrink-0 overflow-hidden">${avatar}</span>
        <div class="flex-1 min-w-0 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-[11px] font-bold text-zinc-100 truncate">${escapeHtml(c.author_name || t('someone'))}</span>
            <span class="text-[10px] text-zinc-500 shrink-0">${escapeHtml(timeAgo(c.created_at))}</span>
            ${mine ? `<button type="button" data-comment-delete="${escapeHtml(c.id)}" aria-label="delete"
              class="ms-auto opacity-60 sm:opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>` : ''}
          </div>
          <p class="text-xs text-zinc-300 leading-relaxed break-words">${formatCommentBody(c.body)}</p>
        </div>
      </div>`;
  }).join('');
  list.scrollTop = list.scrollHeight;
}

/**
 * Posts the typed comment optimistically; restores the text and shows the
 * reason if saving fails.
 */
async function postComment() {
  const input = document.getElementById('commentInput');
  const taskId = document.getElementById('editTaskId').value;
  if (!input) return;
  const body = input.value.trim();
  if (!body) return;
  if (!taskId) return showToast(t('commentNeedsSave'));

  const ident = getCurrentIdentity();
  const comment = {
    id: randomId('CMT'),
    task_id: taskId,
    project_id: activeProjectId,
    user_id: ident.id,
    author_name: ident.name || t('someone'),
    body: body.slice(0, 4000),
    mentions: extractMentions(body),
    created_at: Date.now()
  };
  comments.push(comment);
  input.value = '';
  hideMentionSuggest();
  renderModalComments();
  renderWorkspace();

  const { error } = await trackPendingWrite(pendingCommentWrites, comment.id, comment,
    () => db.from('task_comments').insert([comment]));
  if (error) {
    console.error('Comment insert failed:', error);
    comments = comments.filter(c => c.id !== comment.id);
    if (!input.value) input.value = body;
    renderModalComments();
    renderWorkspace();
    showToast(`${t('commentFailed')}: ${describeDbError(error)}`, { duration: 8000 });
  }
}

/**
 * Deletes one of the user's own comments optimistically.
 *
 * @param {string} commentId
 */
async function deleteComment(commentId) {
  const c = comments.find(x => x.id === commentId);
  if (!c) return;
  comments = comments.filter(x => x.id !== commentId);
  renderModalComments();
  renderWorkspace();
  const { error } = await trackPendingWrite(pendingCommentWrites, commentId, null,
    () => db.from('task_comments').delete().eq('id', commentId));
  if (error) {
    comments.push(c);
    renderModalComments();
    renderWorkspace();
    showToast(t('commentDeleteFailed'));
  }
}

document.addEventListener('click', (e) => {
  const del = e.target.closest('[data-comment-delete]');
  if (del) deleteComment(del.getAttribute('data-comment-delete'));
  const pick = e.target.closest('[data-mention-pick]');
  if (pick) {
    e.preventDefault();
    insertMention(pick.getAttribute('data-mention-pick'));
  }
});

// ---- @mention autocomplete ----
let _mentionMatches = [];

/**
 * The text typed after an @ just before the cursor, or null if the cursor is
 * not in a mention.
 *
 * @param {HTMLTextAreaElement} input
 * @returns {string|null}
 */
function currentMentionQuery(input) {
  const upto = input.value.slice(0, input.selectionStart);
  const m = upto.match(/@([^\s@]*)$/);
  return m ? m[1] : null;
}

/**
 * Hides the @mention suggestion list.
 */
function hideMentionSuggest() {
  _mentionMatches = [];
  const box = document.getElementById('mentionSuggest');
  if (box) box.classList.add('hidden');
}

/**
 * Shows matching member names while an @mention is being typed.
 */
function updateMentionSuggest() {
  const input = document.getElementById('commentInput');
  const box = document.getElementById('mentionSuggest');
  if (!input || !box) return;
  const q = currentMentionQuery(input);
  if (q === null) return hideMentionSuggest();
  const ql = q.toLowerCase();
  _mentionMatches = projectMemberNames().filter(n => n.toLowerCase().includes(ql)).slice(0, 6);
  if (_mentionMatches.length === 0) return hideMentionSuggest();
  box.innerHTML = _mentionMatches.map((n, i) => `
    <button type="button" data-mention-pick="${escapeHtml(n)}"
      class="w-full text-start px-3 py-1.5 text-xs flex items-center gap-2 ${i === 0 ? 'bg-brand/12 text-white' : 'text-zinc-300'} hover:bg-brand/15 hover:text-white transition">
      <span class="w-5 h-5 rounded-full bg-brand/15 text-brand text-[10px] font-bold flex items-center justify-center">${escapeHtml(n.charAt(0).toUpperCase())}</span>
      ${escapeHtml(n)}
    </button>`).join('');
  box.classList.remove('hidden');
}

/**
 * Replaces the @mention being typed with the chosen name.
 *
 * @param {string} name
 */
function insertMention(name) {
  const input = document.getElementById('commentInput');
  if (!input) return;
  const caret = input.selectionStart;
  const before = input.value.slice(0, caret).replace(/@([^\s@]*)$/, `@${name} `);
  input.value = before + input.value.slice(caret);
  input.focus();
  input.setSelectionRange(before.length, before.length);
  hideMentionSuggest();
}

/**
 * Comment box keys: Enter sends (Shift+Enter adds a line); Enter/Tab picks a
 * suggestion; Escape closes the suggestions.
 *
 * @param {KeyboardEvent} e
 */
function handleCommentKeydown(e) {
  const suggestOpen = _mentionMatches.length > 0;
  if (e.key === 'Escape' && suggestOpen) {
    e.preventDefault();
    e.stopPropagation();
    hideMentionSuggest();
    return;
  }
  if ((e.key === 'Enter' || e.key === 'Tab') && suggestOpen) {
    e.preventDefault();
    insertMention(_mentionMatches[0]);
    return;
  }
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    postComment();
  }
}

// =========================================================================
// 4) ACTIVITY FEED
// =========================================================================

let activityAvailable = true;

/**
 * Builds the HTML sentence for one activity-log entry.
 *
 * @param {object} a activity_log row.
 * @returns {string}
 */
function describeActivity(a) {
  const d = a.details || {};
  const b = (txt) => `<span class="font-bold text-zinc-100">${escapeHtml(txt)}</span>`;
  const vals = {
    actor: b(a.actor_name || t('someone')),
    task: `<span class="font-semibold text-orange-200">${escapeHtml(a.task_title || '—')}</span>`,
    status: b(statusShortLabel(d.to)),
    assignee: b(d.assignee || ''),
    date: `<span class="font-mono">${escapeHtml(d.to || '')}</span>`
  };
  const map = {
    task_created: 'actTaskCreated',
    task_status: 'actTaskStatus',
    task_assigned: 'actTaskAssigned',
    task_due_changed: d.to ? 'actTaskDue' : 'actTaskDueRemoved',
    task_deleted: 'actTaskDeleted',
    comment_added: 'actComment',
    member_joined: 'actMemberJoined'
  };
  let html = fillTemplate(t(map[a.action] || 'actTaskCreated'), vals);
  if (a.action === 'comment_added' && d.excerpt) {
    html += `<span class="block mt-1 text-[11px] text-zinc-400 border-s-2 border-white/10 ps-2 line-clamp-2">${escapeHtml(d.excerpt)}</span>`;
  }
  return html;
}

const ACTIVITY_ICONS = {
  task_created: { cls: 'bg-brand/15 text-brand', path: 'M12 5v14M5 12h14' },
  task_status: { cls: 'bg-emerald-500/15 text-emerald-400', path: 'M5 13l4 4L19 7' },
  task_assigned: { cls: 'bg-indigo-500/15 text-indigo-300', path: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  task_due_changed: { cls: 'bg-amber-500/15 text-amber-300', path: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  task_deleted: { cls: 'bg-rose-500/15 text-rose-400', path: 'M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' },
  comment_added: { cls: 'bg-sky-500/15 text-sky-300', path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  member_joined: { cls: 'bg-fuchsia-500/15 text-fuchsia-300', path: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6' }
};

/**
 * Renders the activity feed grouped by day.
 */
function renderActivityView() {
  const list = document.getElementById('activityList');
  if (!list) return;
  if (!activityAvailable) {
    list.innerHTML = `<div class="border border-dashed border-white/10 rounded-2xl p-8 text-center text-xs text-zinc-400">${escapeHtml(t('activityNeedsSchema'))}</div>`;
    return;
  }
  const items = activity.filter(a => a.project_id === activeProjectId).slice(0, 150);
  if (items.length === 0) {
    list.innerHTML = `<div class="border border-dashed border-white/10 rounded-2xl p-8 text-center text-xs text-zinc-400">${escapeHtml(t('activityEmpty'))}</div>`;
    return;
  }
  const today = todayStr();
  const yesterday = dateToStr(new Date(Date.now() - 86400000));
  let html = '';
  let lastDay = '';
  items.forEach(a => {
    const day = dateToStr(new Date(Number(a.created_at)));
    if (day !== lastDay) {
      lastDay = day;
      const label = day === today ? t('today') : day === yesterday ? t('yesterday')
        : new Date(Number(a.created_at)).toLocaleDateString(uiLocale(), { weekday: 'long', day: 'numeric', month: 'long' });
      html += `<h4 class="text-[11px] font-bold text-zinc-500 uppercase tracking-wide pt-3 pb-1 px-1">${escapeHtml(label)}</h4>`;
    }
    const icon = ACTIVITY_ICONS[a.action] || ACTIVITY_ICONS.task_created;
    const taskExists = a.task_id && tasks.some(x => x.id === a.task_id);
    html += `
      <div ${taskExists ? `data-activity-task="${escapeHtml(a.task_id)}"` : ''}
        class="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-transparent ${taskExists ? 'cursor-pointer hover:bg-white/[0.03] hover:border-white/[0.06]' : ''} transition">
        <span class="w-7 h-7 rounded-lg ${icon.cls} flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="${icon.path}"/></svg>
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-zinc-300 leading-relaxed">${describeActivity(a)}</p>
          <span class="text-[10px] text-zinc-500">${escapeHtml(timeAgo(a.created_at))}</span>
        </div>
      </div>`;
  });
  list.innerHTML = html;
}

document.addEventListener('click', (e) => {
  const row = e.target.closest('[data-activity-task]');
  if (row) openTaskModal(row.getAttribute('data-activity-task'));
});

// =========================================================================
// 5) NOTIFICATIONS
// =========================================================================

const NOTIFY_PREF_KEY = 'enjaz_notify_enabled';

/**
 * Whether the browser supports notifications.
 *
 * @returns {boolean}
 */
function notificationsSupported() {
  return 'Notification' in window;
}

/**
 * Whether the user granted permission and has not muted notifications.
 *
 * @returns {boolean}
 */
function notificationsEnabled() {
  return notificationsSupported() && Notification.permission === 'granted' && localStorage.getItem(NOTIFY_PREF_KEY) !== '0';
}

/**
 * Updates the bell button to show whether notifications are on.
 */
function updateNotifyButton() {
  const btn = document.getElementById('notifyBtn');
  if (!btn) return;
  const on = notificationsEnabled();
  btn.classList.toggle('text-brand', on);
  btn.classList.toggle('border-brand/40', on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.title = t('notifyBtnTitle');
  const slash = document.getElementById('notifyBtnSlash');
  if (slash) slash.classList.toggle('hidden', on);
}

/**
 * Asks for notification permission the first time, then toggles notifications
 * on and off.
 */
async function toggleNotifications() {
  if (!notificationsSupported()) return showToast(t('notifyUnsupported'));
  if (Notification.permission === 'denied') return showToast(t('notifyBlocked'));
  if (Notification.permission === 'default') {
    const result = await Notification.requestPermission();
    if (result !== 'granted') {
      updateNotifyButton();
      return showToast(result === 'denied' ? t('notifyBlocked') : t('notifyDisabled'));
    }
    localStorage.setItem(NOTIFY_PREF_KEY, '1');
    showToast(t('notifyEnabled'));
  } else {
    const nowOn = localStorage.getItem(NOTIFY_PREF_KEY) === '0';
    localStorage.setItem(NOTIFY_PREF_KEY, nowOn ? '1' : '0');
    showToast(nowOn ? t('notifyEnabled') : t('notifyDisabled'));
  }
  updateNotifyButton();
}

/**
 * Notifies the user: an in-app toast while the tab is visible, otherwise a
 * system notification (if enabled).
 *
 * @param {string} title
 * @param {string} body
 * @param {string} [taskId] Task to open from the toast.
 */
async function notifyUser(title, body, taskId) {
  // In-app toast while the tab is visible; system notification otherwise.
  if (document.visibilityState === 'visible') {
    showToast(`${title} — ${body}`, taskId ? {
      actionLabel: currentLang === 'en' ? 'Open' : 'فتح',
      onAction: () => openTaskModal(taskId),
      duration: 6000
    } : {});
    return;
  }
  if (!notificationsEnabled()) return;
  const url = `${location.origin}${location.pathname}?project=${encodeURIComponent(activeProjectId || '')}`;
  const options = { body, icon: 'assets/icon-192.png', badge: 'assets/icon-192.png', tag: taskId || undefined, data: { url } };
  try {
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if (reg) await reg.showNotification(title, options);
    else new Notification(title, options);
  } catch (err) {
    console.warn('Notification failed:', err);
  }
}

/**
 * Handles a new activity_log row from realtime: updates the feed and summary,
 * and notifies the user about assignments, mentions and comments on their tasks
 * by someone else.
 *
 * @param {object} payload Supabase realtime payload.
 */
function handleActivityRealtime(payload) {
  const a = payload && payload.new;
  if (!a || !a.id) return;
  if (!activity.some(x => x.id === a.id)) {
    activity.unshift(a);
    if (activity.length > 300) activity.length = 300;
  }
  if (a.project_id === activeProjectId) {
    if (viewMode === 'activity') renderActivityView();
    renderDailySummary();
  }

  const me = getCurrentIdentity();
  if (!a.user_id || a.user_id === me.id) return;
  const d = a.details || {};
  const proj = projects.find(p => p.id === a.project_id);
  const taskLabel = `${a.task_title || ''}${proj && a.project_id !== activeProjectId ? ` (${proj.name})` : ''}`;
  const actor = a.actor_name || t('someone');

  if (a.action === 'task_assigned' && sameName(d.assignee, me.name)) {
    notifyUser(t('notifAssignedTitle'), fillTemplate(t('notifAssignedBody'), { actor, task: taskLabel }), a.task_id);
  } else if (a.action === 'comment_added') {
    const mentioned = Array.isArray(d.mentions) && d.mentions.some(n => sameName(n, me.name));
    const task = tasks.find(x => x.id === a.task_id);
    const vals = { actor, task: taskLabel, text: d.excerpt || '' };
    if (mentioned) notifyUser(t('notifMentionTitle'), fillTemplate(t('notifMentionBody'), vals), a.task_id);
    else if (task && sameName(task.assignee, me.name)) notifyUser(t('notifCommentTitle'), fillTemplate(t('notifCommentBody'), vals), a.task_id);
  }
}

let _commentsRenderTimer = null;
/**
 * Applies a realtime comment insert, update or delete and re-renders.
 *
 * @param {object} payload Supabase realtime payload.
 */
function handleCommentsRealtime(payload) {
  if (!payload) return;
  if (payload.eventType === 'DELETE') {
    const id = payload.old && payload.old.id;
    if (id) comments = comments.filter(c => c.id !== id);
  } else if (payload.new && payload.new.id) {
    const idx = comments.findIndex(c => c.id === payload.new.id);
    if (idx >= 0) comments[idx] = payload.new;
    else comments.push(payload.new);
  }
  clearTimeout(_commentsRenderTimer);
  _commentsRenderTimer = setTimeout(() => {
    const modal = document.getElementById('taskModal');
    if (modal && !modal.classList.contains('hidden')) renderModalComments();
    renderWorkspace();
  }, 120);
}

// =========================================================================
// 6) CALENDAR VIEW
// =========================================================================

let calendarCursor = (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); })();
let calendarSelectedDay = null;
let _calendarList = [];

/**
 * Moves the calendar by a number of months, or back to today when delta is 0.
 *
 * @param {number} delta
 */
function calendarShift(delta) {
  if (delta === 0) {
    const d = new Date();
    calendarCursor = new Date(d.getFullYear(), d.getMonth(), 1);
    calendarSelectedDay = todayStr();
  } else {
    calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + delta, 1);
  }
  renderCalendar(_calendarList);
}

/**
 * HTML for a draggable task chip in the calendar.
 *
 * @param {object} task
 * @param {boolean} [compact=false]
 * @returns {string}
 */
function calendarChipHtml(task, compact = false) {
  const st = getTaskStatus(task);
  const overdue = isOverdue(task.due_date, st);
  const prDot = task.priority === 'high' ? 'bg-rose-400' : task.priority === 'low' ? 'bg-zinc-400' : 'bg-brand';
  const tone = st === 'done'
    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300/80 line-through'
    : overdue ? 'bg-rose-500/12 border-rose-500/30 text-rose-200'
      : 'bg-white/[0.05] border-white/[0.08] text-zinc-200 hover:border-brand/40';
  return `<div draggable="true" data-cal-task="${escapeHtml(task.id)}" title="${escapeHtml(task.title)}"
    class="cal-chip flex items-center gap-1.5 ${compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1.5 text-xs'} rounded-md border ${tone} cursor-grab active:cursor-grabbing transition truncate">
    <span class="w-1.5 h-1.5 rounded-full shrink-0 ${prDot}"></span><span class="truncate">${escapeHtml(task.title)}</span></div>`;
}

/**
 * Renders the month grid (week starts Saturday in Arabic, Sunday in English),
 * the selected day's tasks and the undated tasks.
 *
 * @param {object[]} list Filtered tasks of the active project.
 */
function renderCalendar(list) {
  _calendarList = list;
  const root = document.getElementById('calendarView');
  if (!root) return;
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const locale = uiLocale();
  const weekStart = currentLang === 'ar' ? 6 : 0; // Saturday for Arabic, Sunday for English
  const today = todayStr();

  const byDate = {};
  const undated = [];
  list.forEach(task => {
    if (task.due_date) (byDate[task.due_date] = byDate[task.due_date] || []).push(task);
    else if (getTaskStatus(task) !== 'done') undated.push(task);
  });
  Object.values(byDate).forEach(arr => arr.sort((a, b) => {
    const rank = x => (getTaskStatus(x) === 'done' ? 1 : 0);
    return rank(a) - rank(b);
  }));

  const weekdayNames = [];
  for (let i = 0; i < 7; i++) {
    const day = (weekStart + i) % 7;
    weekdayNames.push(new Date(2024, 0, 7 + day).toLocaleDateString(locale, { weekday: 'short' }));
  }

  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStart + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  let cells = '';
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - offset + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells += '<div class="min-h-[64px] sm:min-h-[104px] rounded-xl bg-white/[0.01]"></div>';
      continue;
    }
    const ds = dateToStr(new Date(year, month, dayNum));
    const dayTasks = byDate[ds] || [];
    const isToday = ds === today;
    const isSelected = ds === calendarSelectedDay;
    const shown = dayTasks.slice(0, 3);
    const more = dayTasks.length - shown.length;
    const hasOverdue = dayTasks.some(x => isOverdue(x.due_date, getTaskStatus(x)));
    cells += `
      <div data-cal-day="${ds}"
        class="cal-cell min-h-[64px] sm:min-h-[104px] rounded-xl border p-1 sm:p-1.5 flex flex-col gap-1 cursor-pointer transition
          ${isSelected ? 'border-brand/60 bg-brand/[0.06]' : 'border-white/[0.06] bg-[#0D0D12]/80 hover:border-white/15'}">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-mono tabular-nums w-6 h-6 rounded-lg flex items-center justify-center ${isToday ? 'bg-brand text-white font-bold' : 'text-zinc-400'}">${dayNum}</span>
          ${dayTasks.length ? `<span class="sm:hidden w-1.5 h-1.5 rounded-full ${hasOverdue ? 'bg-rose-400' : 'bg-brand'}"></span>` : ''}
        </div>
        <div class="hidden sm:flex flex-col gap-1 min-w-0">
          ${shown.map(x => calendarChipHtml(x, true)).join('')}
          ${more > 0 ? `<span class="text-[10px] text-zinc-400 px-1">${fillTemplate(t('calMore'), { n: more })}</span>` : ''}
        </div>
        ${dayTasks.length ? `<span class="sm:hidden text-[10px] font-mono text-zinc-400 text-center">${dayTasks.length}</span>` : ''}
      </div>`;
  }

  let dayPanel = '';
  if (calendarSelectedDay) {
    const dayTasks = byDate[calendarSelectedDay] || [];
    const label = new Date(`${calendarSelectedDay}T00:00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
    dayPanel = `
      <div class="card-surface border border-borderSubtle rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h4 class="text-sm font-bold text-white">${escapeHtml(label)}</h4>
          <button type="button" data-cal-add="${calendarSelectedDay}"
            class="text-xs font-semibold text-brand hover:text-white px-2.5 py-1.5 rounded-lg bg-brand/10 hover:bg-brand/20 border border-brand/25 transition flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
            ${escapeHtml(t('calAddOnDay'))}
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          ${dayTasks.length ? dayTasks.map(x => calendarChipHtml(x)).join('') : `<p class="text-xs text-zinc-500">${escapeHtml(t('calNoTasksDay'))}</p>`}
        </div>
      </div>`;
  }

  root.innerHTML = `
    <div class="card-surface border border-borderSubtle rounded-2xl p-3 sm:p-4 space-y-3">
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-display text-sm sm:text-base font-extrabold text-white">${escapeHtml(first.toLocaleDateString(locale, { month: 'long', year: 'numeric' }))}</h3>
        <div class="flex items-center gap-1" dir="ltr">
          <button type="button" data-cal-shift="${currentLang === 'ar' ? 1 : -1}" aria-label="${escapeHtml(currentLang === 'ar' ? t('calNext') : t('calPrev'))}"
            class="w-8 h-8 rounded-lg bg-surface border border-borderSubtle text-zinc-300 hover:text-white hover:border-brand/40 flex items-center justify-center transition">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button type="button" data-cal-shift="0"
            class="h-8 px-3 rounded-lg bg-surface border border-borderSubtle text-xs font-semibold text-zinc-200 hover:text-white hover:border-brand/40 transition">${escapeHtml(t('calToday'))}</button>
          <button type="button" data-cal-shift="${currentLang === 'ar' ? -1 : 1}" aria-label="${escapeHtml(currentLang === 'ar' ? t('calPrev') : t('calNext'))}"
            class="w-8 h-8 rounded-lg bg-surface border border-borderSubtle text-zinc-300 hover:text-white hover:border-brand/40 flex items-center justify-center transition">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1 sm:gap-1.5">
        ${weekdayNames.map(n => `<div class="text-center text-[10px] sm:text-[11px] font-semibold text-zinc-500 py-1 truncate">${escapeHtml(n)}</div>`).join('')}
        ${cells}
      </div>
    </div>
    ${dayPanel}
    <div data-cal-undated class="cal-cell card-surface border border-dashed border-borderSubtle rounded-2xl p-4 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <h4 class="text-xs font-bold text-zinc-200">${escapeHtml(t('calUndated'))} <span class="font-mono text-zinc-500">${undated.length}</span></h4>
        <span class="hidden sm:inline text-[10px] text-zinc-500">${escapeHtml(t('calUndatedHint'))}</span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        ${undated.slice(0, 40).map(x => `<div class="max-w-[220px]">${calendarChipHtml(x)}</div>`).join('')}
      </div>
    </div>`;
}

/**
 * Changes a task's due date optimistically (null removes it).
 *
 * @param {string} taskId
 * @param {string|null} dateStr YYYY-MM-DD.
 */
async function setTaskDueDate(taskId, dateStr) {
  const task = tasks.find(x => x.id === taskId);
  if (!task || (task.due_date || null) === (dateStr || null)) return;
  const prev = task.due_date;
  task.due_date = dateStr || null;
  renderWorkspace();
  const { error } = await trackPendingWrite(pendingTaskWrites, taskId, task,
    () => db.from('tasks').update({ due_date: dateStr || null }).eq('id', taskId));
  if (error) {
    task.due_date = prev;
    renderWorkspace();
    showToast(t('dueDateFailed'));
  } else {
    showToast(t('dueDateUpdated'));
  }
}

(function wireCalendarEvents() {
  let calDragId = null;
  document.addEventListener('dragstart', (e) => {
    const chip = e.target.closest && e.target.closest('[data-cal-task]');
    if (!chip) return;
    calDragId = chip.getAttribute('data-cal-task');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', calDragId); } catch { /* ignore */ }
    chip.classList.add('opacity-50');
  });
  document.addEventListener('dragend', (e) => {
    const chip = e.target.closest && e.target.closest('[data-cal-task]');
    if (chip) chip.classList.remove('opacity-50');
    calDragId = null;
    document.querySelectorAll('.cal-cell.drag-over').forEach(el => el.classList.remove('drag-over'));
  });
  document.addEventListener('dragover', (e) => {
    if (!calDragId) return;
    const cell = e.target.closest && e.target.closest('[data-cal-day],[data-cal-undated]');
    if (!cell) return;
    e.preventDefault();
    document.querySelectorAll('.cal-cell.drag-over').forEach(el => { if (el !== cell) el.classList.remove('drag-over'); });
    cell.classList.add('drag-over');
  });
  document.addEventListener('drop', (e) => {
    if (!calDragId) return;
    const cell = e.target.closest && e.target.closest('[data-cal-day],[data-cal-undated]');
    if (!cell) return;
    e.preventDefault();
    const id = calDragId;
    calDragId = null;
    cell.classList.remove('drag-over');
    setTaskDueDate(id, cell.hasAttribute('data-cal-undated') ? null : cell.getAttribute('data-cal-day'));
  });
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cal-task]');
    if (chip) return openTaskModal(chip.getAttribute('data-cal-task'));
    const shift = e.target.closest('[data-cal-shift]');
    if (shift) return calendarShift(Number(shift.getAttribute('data-cal-shift')));
    const add = e.target.closest('[data-cal-add]');
    if (add) return openTaskModal(null, 'todo', add.getAttribute('data-cal-add'));
    const day = e.target.closest('[data-cal-day]');
    if (day) {
      const ds = day.getAttribute('data-cal-day');
      calendarSelectedDay = calendarSelectedDay === ds ? null : ds;
      renderCalendar(_calendarList);
    }
  });
})();

// =========================================================================
// 7) DAILY SUMMARY (+ AI)
// =========================================================================

/**
 * localStorage key for per-project, per-day summary state.
 *
 * @param {'hidden'|'ai'} kind
 * @returns {string}
 */
function summaryKey(kind) {
  return `enjaz_summary_${kind}_${activeProjectId}_${todayStr()}`;
}

/**
 * Collects today's numbers for the summary: the user's own open tasks if they
 * have any (else the whole project), due today, overdue, and tasks teammates
 * finished in the last 24 hours.
 *
 * @returns {object}
 */
function computeDailySummary() {
  const me = getCurrentIdentity();
  const today = todayStr();
  const projTasks = tasks.filter(x => x.project_id === activeProjectId);
  const open = projTasks.filter(x => getTaskStatus(x) !== 'done');
  const mine = open.filter(x => sameName(x.assignee, me.name));
  const scope = mine.length ? mine : open;
  const since = Date.now() - 86400000;
  const doneByTeam = activity.filter(a =>
    a.project_id === activeProjectId && a.action === 'task_status' && a.details && a.details.to === 'done'
    && a.user_id !== me.id && Number(a.created_at) > since);
  return {
    me,
    usingMine: mine.length > 0,
    dueToday: scope.filter(x => x.due_date === today),
    overdue: scope.filter(x => x.due_date && x.due_date < today),
    doneByTeam,
    openCount: open.length
  };
}

/**
 * Renders the daily summary card, unless it was hidden for today.
 */
function renderDailySummary() {
  const card = document.getElementById('dailySummaryCard');
  if (!card) return;
  if (!activeProjectId || localStorage.getItem(summaryKey('hidden')) === '1') {
    card.classList.add('hidden');
    return;
  }
  const s = computeDailySummary();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : t('goodEvening');
  const firstName = (s.me.name || '').split(' ')[0];
  const aiText = localStorage.getItem(summaryKey('ai')) || '';
  const chip = (x, tone) => `<button type="button" data-summary-task="${escapeHtml(x.id)}"
    class="max-w-full truncate text-[11px] px-2 py-0.5 rounded-md border ${tone} hover:brightness-125 transition">${escapeHtml(x.title)}</button>`;
  const stat = (n, label, tone, list, chipTone) => `
    <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2 sm:p-2.5 space-y-1.5 min-w-0">
      <div class="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5"><span class="font-display text-lg font-extrabold tabular-nums ${tone}">${n}</span><span class="text-[10px] sm:text-[11px] text-zinc-400 leading-tight">${escapeHtml(label)}</span></div>
      ${list && list.length ? `<div class="hidden sm:flex flex-wrap gap-1">${list.slice(0, 3).map(x => chip(x, chipTone)).join('')}</div>` : ''}
    </div>`;
  const allClear = !s.dueToday.length && !s.overdue.length;

  card.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-[11px] font-semibold text-brand">${escapeHtml(t('summaryTitle'))} · ${escapeHtml(s.usingMine ? t('summaryYourTasks') : t('summaryProjectTasks'))}</p>
        <h3 class="font-display text-sm sm:text-base font-extrabold text-white truncate">${escapeHtml(greeting)}${firstName ? escapeHtml(currentLang === 'en' ? `, ${firstName}` : ` يا ${firstName}`) : ''} 👋</h3>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" id="summaryAiBtn" onclick="generateAiDailySummary()"
          class="ai-cta-btn h-8 px-2.5 rounded-lg text-[11px] font-bold text-zinc-100 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-brand" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c.45 3.65 1.85 5.05 5.5 5.5-3.65.45-5.05 1.85-5.5 5.5-.45-3.65-1.85-5.05-5.5-5.5 3.65-.45 5.05-1.85 5.5-5.5Z"/></svg>
          <span id="summaryAiBtnLabel">${escapeHtml(aiText ? t('summaryAiRefresh') : t('summaryAiBtn'))}</span>
        </button>
        <button type="button" onclick="hideDailySummary()" title="${escapeHtml(t('summaryHide'))}" aria-label="${escapeHtml(t('summaryHide'))}"
          class="w-8 h-8 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 flex items-center justify-center transition">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
    ${aiText ? `<p class="text-xs text-zinc-200 leading-relaxed bg-gradient-to-br from-brand/10 to-indigo-500/5 border border-brand/20 rounded-xl px-3 py-2.5 whitespace-pre-line">${escapeHtml(aiText)}</p>` : ''}
    ${allClear && !s.doneByTeam.length ? `<p class="text-xs text-zinc-300">${escapeHtml(t('summaryAllClear'))}</p>` : `
    <div class="grid grid-cols-3 gap-2">
      ${stat(s.dueToday.length, t('summaryDueToday'), 'text-brand', s.dueToday, 'bg-brand/10 border-brand/25 text-orange-200')}
      ${stat(s.overdue.length, t('summaryOverdue'), s.overdue.length ? 'text-rose-400' : 'text-zinc-400', s.overdue, 'bg-rose-500/10 border-rose-500/25 text-rose-200')}
      ${stat(s.doneByTeam.length, t('summaryDoneByTeam'), 'text-emerald-400', null)}
    </div>`}`;
  card.classList.remove('hidden');
}

/**
 * Hides the daily summary until tomorrow.
 */
function hideDailySummary() {
  try { localStorage.setItem(summaryKey('hidden'), '1'); } catch { /* ignore */ }
  renderDailySummary();
}

/**
 * Asks the AI for a short daily brief and caches it for today.
 */
async function generateAiDailySummary() {
  const btn = document.getElementById('summaryAiBtn');
  const label = document.getElementById('summaryAiBtnLabel');
  if (btn) btn.disabled = true;
  if (label) label.textContent = t('summaryAiWorking');
  const projectId = activeProjectId;
  try {
    const s = computeDailySummary();
    const proj = projects.find(p => p.id === projectId);
    const open = tasks.filter(x => x.project_id === projectId && getTaskStatus(x) !== 'done');
    const fmt = x => `- ${x.title} [${x.priority || 'medium'}${x.assignee ? `, ${x.assignee}` : ''}${x.due_date ? `, due ${x.due_date}` : ''}, ${getTaskStatus(x)}]`;
    const data = [
      `Project: ${proj ? proj.name : ''}`,
      `Reader: ${s.me.name || 'team member'} (summary of ${s.usingMine ? 'their own tasks' : 'the whole project'})`,
      `Today: ${todayStr()}`,
      `Due today:\n${s.dueToday.map(fmt).join('\n') || '- none'}`,
      `Overdue:\n${s.overdue.map(fmt).join('\n') || '- none'}`,
      `Completed by teammates in the last 24h:\n${s.doneByTeam.map(a => `- ${a.task_title} (by ${a.actor_name || 'someone'})`).join('\n') || '- none'}`,
      `Other open tasks (top 15):\n${open.slice(0, 15).map(fmt).join('\n') || '- none'}`
    ].join('\n\n');
    const lang = currentLang === 'en' ? 'English' : 'Egyptian-friendly Modern Arabic';
    const text = await aiQuickText(
      `You are a concise, encouraging project assistant. Write a daily brief in ${lang}: 2 to 4 short sentences, plain text, no markdown or bullet symbols. Mention the most urgent items by name and suggest what to focus on first.`,
      data
    );
    if (activeProjectId === projectId) {
      try { localStorage.setItem(summaryKey('ai'), text.trim().slice(0, 1200)); } catch { /* ignore */ }
    }
  } catch (err) {
    console.warn('AI summary failed:', err);
    showToast(t('summaryAiFailed'));
  } finally {
    renderDailySummary();
  }
}

document.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-summary-task]');
  if (chip) openTaskModal(chip.getAttribute('data-summary-task'));
});

// =========================================================================
// 8) OFFLINE SNAPSHOT + PWA
// =========================================================================

const OFFLINE_SNAPSHOT_KEY = 'enjaz_offline_snapshot_v1';

/**
 * Saves the loaded data to localStorage so the app can be browsed offline
 * (large inline images are dropped).
 */
function saveOfflineSnapshot() {
  try {
    const stripData = url => (typeof url === 'string' && url.startsWith('data:') && url.length > 20000 ? '' : url);
    localStorage.setItem(OFFLINE_SNAPSHOT_KEY, JSON.stringify({
      uid: currentUser ? currentUser.id : null,
      ts: Date.now(),
      activeProjectId,
      projects: projects.map(p => ({ ...p, icon: stripData(p.icon) || 'svg:folder' })),
      tasks,
      members: members.map(m => ({ ...m, avatar_url: stripData(m.avatar_url) })),
      comments,
      activity: activity.slice(0, 100)
    }));
  } catch (err) {
    console.warn('Offline snapshot not saved:', err);
  }
}

/**
 * Restores the last saved data and marks the app as offline.
 *
 * @returns {boolean} True if a snapshot was loaded.
 */
function loadOfflineSnapshot() {
  try {
    const snap = JSON.parse(localStorage.getItem(OFFLINE_SNAPSHOT_KEY) || 'null');
    if (!snap || !Array.isArray(snap.projects)) return false;
    if (currentUser && snap.uid && snap.uid !== currentUser.id) return false;
    projects = snap.projects;
    tasks = snap.tasks || [];
    members = snap.members || [];
    comments = snap.comments || [];
    activity = snap.activity || [];
    if (!activeProjectId || !projects.some(p => p.id === activeProjectId)) {
      activeProjectId = snap.activeProjectId && projects.some(p => p.id === snap.activeProjectId)
        ? snap.activeProjectId
        : (projects[0] ? projects[0].id : null);
    }
    const syncDot = document.getElementById('syncDot');
    const syncText = document.getElementById('syncText');
    if (syncDot) syncDot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400';
    if (syncText) {
      syncText.dataset.state = 'offlineMode';
      syncText.textContent = t('offlineMode');
    }
    renderAll();
    return true;
  } catch {
    return false;
  }
}

window.addEventListener('online', () => {
  if (window._enjazBootFailed) location.reload();
  else loadAllData();
});

let _deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.classList.remove('hidden');
});
window.addEventListener('appinstalled', () => {
  _deferredInstallPrompt = null;
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.classList.add('hidden');
});

/**
 * Shows the browser's install prompt for the PWA.
 */
async function installApp() {
  if (!_deferredInstallPrompt) return;
  _deferredInstallPrompt.prompt();
  await _deferredInstallPrompt.userChoice.catch(() => null);
  _deferredInstallPrompt = null;
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.classList.add('hidden');
}

if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('Service worker registration failed:', err));
  });
}
