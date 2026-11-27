function setViewMode(mode) {
  viewMode = mode;
  ['board', 'list', 'calendar', 'activity', 'team'].forEach(m => {
    const dBtn = document.getElementById(`viewBtn-${m}`);
    const dBase = 'px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ';
    if (dBtn) dBtn.className = dBase + (m === mode ? 'bg-brand text-white shadow-sm' : 'text-zinc-400 hover:text-white');

    const mBtn = document.getElementById(`mViewBtn-${m}`);
    const mBase = 'py-1.5 rounded-lg text-[11px] font-semibold transition truncate ' + (m === 'team' ? 'flex items-center justify-center gap-1 ' : 'text-center ');
    if (mBtn) mBtn.className = mBase + (m === mode ? 'bg-brand text-white' : 'text-zinc-400');
  });
  renderWorkspace();
  const activeViewId = { board: 'boardView', list: 'listView', calendar: 'calendarView', activity: 'activityView', team: 'teamView' }[mode] || 'boardView';
  const panel = document.getElementById(activeViewId);
  if (panel) {
    panel.classList.remove('animate-view-enter');
    void panel.offsetWidth;
    panel.classList.add('animate-view-enter');
  }
}

function openTaskModal(taskId = null, defaultStatus = 'todo', defaultDueDate = '') {
  if (!activeProjectId) return showToast(currentLang === 'en' ? 'Create a project first' : 'أنشئ مشروعاً أولاً');
  const modal = document.getElementById('taskModal');
  const delBtn = document.getElementById('deleteTaskBtn');
  const aiTaskBtn = document.getElementById('askAiTaskModalBtn');
  if (taskId) {
    const task = tasks.find(x => x.id === taskId);
    if (!task) return;
    document.getElementById('taskModalTitle').textContent = t('editTaskTitle');
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('fTaskTitle').value = task.title || '';
    document.getElementById('fTaskNotes').value = task.notes || '';
    document.getElementById('fTaskStatus').value = getTaskStatus(task);
    document.getElementById('fTaskPriority').value = task.priority || 'medium';
    document.getElementById('fTaskAssignee').value = task.assignee || '';
    document.getElementById('fTaskCategory').value = task.category || '';
    document.getElementById('fTaskDueDate').value = task.due_date || '';
    delBtn.classList.remove('hidden');
    if (aiTaskBtn) aiTaskBtn.classList.remove('hidden');
  } else {
    document.getElementById('taskModalTitle').textContent = t('newTaskTitle');
    document.getElementById('editTaskId').value = '';
    document.getElementById('taskForm').reset();
    document.getElementById('fTaskStatus').value = defaultStatus;
    document.getElementById('fTaskPriority').value = 'medium';
    document.getElementById('fTaskDueDate').value = defaultDueDate || '';
    delBtn.classList.add('hidden');
    if (aiTaskBtn) aiTaskBtn.classList.add('hidden');
  }
  initModalSubtasks(taskId ? tasks.find(x => x.id === taskId) : null);
  const commentInput = document.getElementById('commentInput');
  if (commentInput) commentInput.value = '';
  hideMentionSuggest();
  renderModalComments();
  animateModalOpen('taskModal');
  setTimeout(() => document.getElementById('fTaskTitle').focus(), 50);
}

function closeTaskModal() {
  animateModalClose('taskModal');
}

// Tries the full payload, then without newer columns, for databases that
// have not run the latest schema yet. Returns the final error (or null).
async function writeTaskWithFallback(kind, payload, id) {
  const run = (p) => (kind === 'insert'
    ? db.from('tasks').insert([p])
    : db.from('tasks').update(p).eq('id', id));
  let { error } = await run(payload);
  if (error) {
    const { subtasks: _st, ...noSubtasks } = payload;
    ({ error } = await run(noSubtasks));
    if (error) {
      const { notes: _n, status: _s, due_date: _d, ...legacy } = noSubtasks;
      ({ error } = await run(legacy));
    }
  }
  return error;
}

// Optimistic save: the change shows immediately and is rolled back if the
// database rejects it. Realtime then syncs everyone else.
async function saveTask(e) {
  e.preventDefault();
  const editId = document.getElementById('editTaskId').value;
  const title = document.getElementById('fTaskTitle').value.trim();
  const notes = document.getElementById('fTaskNotes').value.trim();
  const status = document.getElementById('fTaskStatus').value;
  const priority = document.getElementById('fTaskPriority').value;
  const assignee = document.getElementById('fTaskAssignee').value.trim();
  const category = document.getElementById('fTaskCategory').value.trim();
  const due_date = document.getElementById('fTaskDueDate').value || null;
  const subtasks = getModalSubtasks();
  const user = getCurrentIdentity().name || (currentLang === 'en' ? 'Member' : 'عضو');
  const isDone = status === 'done';
  const isEn = currentLang === 'en';

  if (!title) return;
  closeTaskModal();

  if (editId) {
    const task = tasks.find(x => x.id === editId);
    const before = task ? { ...task } : null;
    const wasDone = Boolean(task && getTaskStatus(task) === 'done');
    const updatePayload = {
      title, notes, status, priority, assignee, category, due_date, subtasks,
      done: isDone,
      completed_by: isDone ? ((wasDone && task.completed_by) || user) : '',
      completed_at: isDone ? ((wasDone && task.completed_at) || Date.now()) : null
    };
    if (task) {
      Object.assign(task, updatePayload);
      if (isDone && !wasDone) lastCompletedTaskId = editId;
      renderAll();
    }
    const error = task
      ? await trackPendingWrite(pendingTaskWrites, editId, task, () => writeTaskWithFallback('update', updatePayload, editId))
      : await writeTaskWithFallback('update', updatePayload, editId);
    if (error) {
      if (task && before) {
        Object.keys(task).forEach(k => delete task[k]);
        Object.assign(task, before);
      }
      renderAll();
      showToast(isEn ? 'Failed to update task' : 'تعذر تحديث المهمة');
    } else {
      showToast(isEn ? 'Task updated ✓' : 'تم تحديث المهمة بنجاح ✓');
    }
  } else {
    const newTask = {
      id: randomId('TSK'),
      project_id: activeProjectId,
      title, notes, status, priority, assignee, category, due_date, subtasks,
      done: isDone,
      completed_by: isDone ? user : '',
      completed_at: isDone ? Date.now() : null,
      created_by: user,
      created_at: Date.now()
    };
    tasks.unshift(newTask);
    renderAll();
    const error = await trackPendingWrite(pendingTaskWrites, newTask.id, newTask, () => writeTaskWithFallback('insert', newTask));
    if (error) {
      tasks = tasks.filter(x => x.id !== newTask.id);
      renderAll();
      showToast(isEn ? 'Failed to add task' : 'تعذر إضافة المهمة');
    } else {
      showToast(isEn ? 'Task added ⚡' : 'تمت إضافة المهمة بنجاح ⚡');
    }
  }
}

// No confirmation dialog: the task disappears at once and can be restored
// from the toast for a few seconds.
function deleteEditingTask() {
  const id = document.getElementById('editTaskId').value;
  if (!id) return;
  closeTaskModal();
  deleteTaskWithUndo(id);
}

async function quickChangeProjectStatus(newStatus) {
  if (!activeProjectId) return;
  const p = projects.find(x => x.id === activeProjectId);
  if (p) {
    p.status = newStatus;
    renderAll();
  }
  const { error } = await db.from('projects').update({ status: newStatus }).eq('id', activeProjectId);
  if (error) {
    document.getElementById('schemaAlert').classList.remove('hidden');
    showToast('شغّل كود SQL لإضافة عمود status لجدول المشاريع');
  } else {
    const lbl = getProjectStatusLabel(newStatus);
    showToast(currentLang === 'en' ? `Project status updated: ${lbl}` : `تم تغيير حالة المشروع إلى: ${lbl}`);
  }
}

function openProjectModal(projectIdToEdit = null) {
  const modal = document.getElementById('projectModal');
  const delBtn = document.getElementById('deleteProjBtn');
  const fileInput = document.getElementById('pLogoFile');
  if (fileInput) fileInput.value = '';
  if (projectIdToEdit) {
    const p = projects.find(x => x.id === projectIdToEdit);
    if (!p) return;
    document.getElementById('projectModalTitle').textContent = t('editProjectModalTitle');
    document.getElementById('editProjectId').value = p.id;
    document.getElementById('pName').value = p.name || '';
    document.getElementById('pStatus').value = getProjectStatus(p);
    document.getElementById('pDesc').value = p.description || '';
    renderProjectIconPicker(p.icon || 'svg:rocket');
    delBtn.classList.toggle('hidden', isSharedMode);
  } else {
    document.getElementById('projectModalTitle').textContent = t('createProjectTitle');
    document.getElementById('editProjectId').value = '';
    document.getElementById('pName').value = '';
    document.getElementById('pStatus').value = 'in_progress';
    document.getElementById('pDesc').value = '';
    renderProjectIconPicker('svg:rocket');
    delBtn.classList.add('hidden');
  }
  animateModalOpen('projectModal');
  setTimeout(() => document.getElementById('pName').focus(), 50);
}

function closeProjectModal() {
  animateModalClose('projectModal');
}

async function saveProject() {
  const editId = document.getElementById('editProjectId').value;
  const name = document.getElementById('pName').value.trim();
  const status = document.getElementById('pStatus').value;
  const description = document.getElementById('pDesc').value.trim();
  const icon = document.getElementById('pIcon').value.trim() || 'svg:rocket';
  if (!name) return showToast('اكتب اسم المشروع');

  closeProjectModal();
  const isEn = currentLang === 'en';
  if (editId) {
    const proj = projects.find(p => p.id === editId);
    const before = proj ? { ...proj } : null;
    if (proj) {
      Object.assign(proj, { name, status, description, icon });
      renderAll();
    }
    let { error } = await db.from('projects').update({ name, status, description, icon }).eq('id', editId);
    if (error) {
      document.getElementById('schemaAlert').classList.remove('hidden');
      ({ error } = await db.from('projects').update({ name, description, icon }).eq('id', editId));
    }
    if (error && proj && before) {
      Object.assign(proj, before);
      renderAll();
    }
    showToast(error
      ? (isEn ? 'Failed to update project' : 'تعذر تحديث المشروع')
      : (isEn ? 'Project updated ✓' : 'تم تحديث بيانات المشروع ✓'));
    return;
  } else {
    const newId = generateProjectCode();
    let { error } = await db.from('projects').insert([{ id: newId, name, status, description, icon, created_at: Date.now() }]);
    if (error) {
      document.getElementById('schemaAlert').classList.remove('hidden');
      ({ error } = await db.from('projects').insert([{ id: newId, name, description, icon, created_at: Date.now() }]));
    }
    if (error) {
      console.error('Project insert failed:', error);
      showToast(isEn ? 'Failed to create project' : 'تعذر إنشاء المشروع');
      loadAllData();
      return;
    }
    addLocalAllowedProjectId(newId);
    isSharedMode = false;
    sharedOnlyProjectId = null;
    activeProjectId = newId;
    window.history.replaceState({}, '', `?project=${encodeURIComponent(newId)}`);
    await registerCurrentUserInProject('Owner');
    showToast(`تم إنشاء مشروع "${name}" 🎉`);
  }
  loadAllData();
}

// Project codes double as invitations, so they must not be guessable:
// 12 characters from a 32-symbol alphabet = 60 bits of randomness
// (32 divides 256, so the modulo below has no bias).
function generateProjectCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let code = '';
  for (const b of bytes) code += alphabet[b % alphabet.length];
  return `PRJ-${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}`;
}

async function deleteEditingProject() {
  const id = document.getElementById('editProjectId').value;
  if (!id) return;
  closeProjectModal();
  await deleteProjectById(id);
}

async function deleteProjectById(projId) {
  if (!projId || isSharedMode) return;
  const p = projects.find(x => x.id === projId);
  const isEn = currentLang === 'en';
  const label = p ? `"${p.name}"` : (isEn ? 'this project' : 'هذا المشروع');
  const ok = await showConfirmDialog({
    title: isEn ? 'Delete Project' : 'حذف المشروع نهائياً',
    message: isEn
      ? `Are you sure you want to permanently delete ${label} along with all its tasks and team members?`
      : `هل أنت متأكد من حذف مشروع ${label} بكل مهامه وأعضائه نهائياً؟`,
    confirmText: isEn ? 'Delete Project' : 'حذف المشروع',
    variant: 'danger'
  });
  if (!ok) return;

  // Tasks and members are removed by ON DELETE CASCADE in the database.
  // Only the project owner is allowed to delete (enforced by RLS), so check
  // that a row was actually deleted.
  const { data: deleted, error: projDelErr } = await db.from('projects').delete().eq('id', projId).select('id');
  if (projDelErr || !deleted || deleted.length === 0) {
    showToast(isEn ? 'Only the project owner can delete it' : 'فقط مالك المشروع يمكنه حذفه');
    loadAllData();
    return;
  }
  removeLocalAllowedProjectId(projId);

  if (activeProjectId === projId) {
    activeProjectId = null;
    window.history.replaceState({}, '', window.location.pathname);
  }
  showToast(isEn ? 'Project deleted' : 'تم حذف المشروع');
  loadAllData();
}

async function joinProjectByCode() {
  const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
  if (!code) return;

  const found = await joinProjectRpc(code, 'Member');
  if (!found) {
    return showToast(currentLang === 'en' ? 'No project found with this code' : 'لم يتم العثور على مشروع بهذا الكود');
  }

  addLocalAllowedProjectId(found.id);
  activeProjectId = found.id;
  window.history.replaceState({}, '', `?project=${encodeURIComponent(found.id)}`);
  document.getElementById('joinCodeInput').value = '';
  toggleMobileSidebar(false);
  await loadAllData();
  showToast(`تم الانضمام لمشروع: ${found.name}`);
}

function copyProjectCode() {
  if (!activeProjectId) return;
  copyTextSafe(
    activeProjectId,
    currentLang === 'en' ? `Code copied: ${activeProjectId}` : `تم نسخ الكود: ${activeProjectId}`
  );
}

function shareCurrentProject() {
  if (!activeProjectId) return showToast(currentLang === 'en' ? 'Create a project first' : 'أنشئ مشروعاً أولاً');
  const shareUrl = `${window.location.origin}${window.location.pathname}?project=${activeProjectId}&shared=1`;
  copyTextSafe(
    shareUrl,
    currentLang === 'en'
      ? `Project link (${activeProjectId}) copied! Other projects stay private 🔗`
      : `تم نسخ رابط المشروع (${activeProjectId}) فقط! لن تظهر باقي مشاريعك 🔗`
  );
}
