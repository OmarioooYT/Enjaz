function setViewMode(mode) {
  viewMode = mode;
  ['board', 'list', 'team'].forEach(m => {
    const dBtn = document.getElementById(`viewBtn-${m}`);
    const dBase = 'px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ';
    if (dBtn) dBtn.className = dBase + (m === mode ? 'bg-brand text-white shadow-sm' : 'text-zinc-400 hover:text-white');

    const mBtn = document.getElementById(`mViewBtn-${m}`);
    const mBase = 'py-1.5 rounded-lg text-[11px] font-semibold transition ' + (m === 'team' ? 'flex items-center justify-center gap-1 ' : 'text-center ');
    if (mBtn) mBtn.className = mBase + (m === mode ? 'bg-brand text-white' : 'text-zinc-400');
  });
  renderWorkspace();
  const activeViewId = mode === 'board' ? 'boardView' : mode === 'list' ? 'listView' : 'teamView';
  const panel = document.getElementById(activeViewId);
  if (panel) {
    panel.classList.remove('animate-view-enter');
    void panel.offsetWidth;
    panel.classList.add('animate-view-enter');
  }
}

function openTaskModal(taskId = null, defaultStatus = 'todo') {
  if (!activeProjectId) return showToast('أنشئ مشروعاً أولاً');
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
    delBtn.classList.add('hidden');
    if (aiTaskBtn) aiTaskBtn.classList.add('hidden');
  }
  animateModalOpen('taskModal');
  setTimeout(() => document.getElementById('fTaskTitle').focus(), 50);
}

function closeTaskModal() {
  animateModalClose('taskModal');
}

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
  const user = getCurrentIdentity().name || 'عضو';
  const isDone = status === 'done';

  if (!title) return;
  closeTaskModal();

  if (editId) {
    const updatePayload = {
      title, notes, status, priority, assignee, category, due_date,
      done: isDone,
      completed_by: isDone ? user : '',
      completed_at: isDone ? Date.now() : null
    };
    const { error } = await db.from('tasks').update(updatePayload).eq('id', editId);
    if (error) {
      await db.from('tasks').update({
        title, priority, assignee, category, done: isDone,
        completed_by: isDone ? user : '', completed_at: isDone ? Date.now() : null
      }).eq('id', editId);
    }
    showToast('تم تحديث المهمة بنجاح ✓');
  } else {
    const newTask = {
      id: 'TSK-' + Date.now(),
      project_id: activeProjectId,
      title, notes, status, priority, assignee, category, due_date,
      done: isDone,
      completed_by: isDone ? user : '',
      completed_at: isDone ? Date.now() : null,
      created_by: user,
      created_at: Date.now()
    };
    const { error } = await db.from('tasks').insert([newTask]);
    if (error) {
      const { notes: _n, status: _s, due_date: _d, ...legacyTask } = newTask;
      await db.from('tasks').insert([legacyTask]);
    }
    showToast('تمت إضافة المهمة بنجاح ⚡');
  }
  loadAllData();
}

async function deleteEditingTask() {
  const id = document.getElementById('editTaskId').value;
  if (!id) return;
  const isEn = currentLang === 'en';
  const ok = await showConfirmDialog({
    title: isEn ? 'Delete Task' : 'حذف المهمة',
    message: isEn ? 'Permanently delete this task? This action cannot be undone.' : 'هل أنت متأكد من حذف هذه المهمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
    confirmText: isEn ? 'Delete Task' : 'حذف نهائياً',
    variant: 'danger'
  });
  if (!ok) return;
  closeTaskModal();
  await db.from('tasks').delete().eq('id', id);
  showToast(isEn ? 'Task deleted' : 'تم حذف المهمة');
  loadAllData();
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
  if (editId) {
    const { error } = await db.from('projects').update({ name, status, description, icon }).eq('id', editId);
    if (error) {
      document.getElementById('schemaAlert').classList.remove('hidden');
      await db.from('projects').update({ name, description, icon }).eq('id', editId);
    }
    showToast('تم تحديث بيانات المشروع ✓');
  } else {
    const newId = 'PRJ-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const { error } = await db.from('projects').insert([{ id: newId, name, status, description, icon, created_at: Date.now() }]);
    if (error) {
      document.getElementById('schemaAlert').classList.remove('hidden');
      await db.from('projects').insert([{ id: newId, name, description, icon, created_at: Date.now() }]);
    }
    addLocalAllowedProjectId(newId);
    isSharedMode = false;
    sharedOnlyProjectId = null;
    activeProjectId = newId;
    window.history.replaceState({}, '', `?project=${newId}`);
    await registerCurrentUserInProject('Owner');
    showToast(`تم إنشاء مشروع "${name}" 🎉`);
  }
  loadAllData();
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

  await db.from('tasks').delete().eq('project_id', projId);
  await db.from('project_members').delete().eq('project_id', projId);
  await db.from('projects').delete().eq('id', projId);
  removeLocalAllowedProjectId(projId);

  if (activeProjectId === projId) {
    activeProjectId = null;
    window.history.replaceState({}, '', window.location.pathname);
  }
  showToast('تم حذف المشروع');
  loadAllData();
}

async function joinProjectByCode() {
  const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
  if (!code) return;

  const { data: found, error } = await db
    .from('projects')
    .select('*')
    .ilike('id', code)
    .maybeSingle();

  if (error || !found) {
    return showToast('لم يتم العثور على مشروع بهذا الكود');
  }

  addLocalAllowedProjectId(found.id);
  activeProjectId = found.id;
  window.history.replaceState({}, '', `?project=${found.id}`);
  document.getElementById('joinCodeInput').value = '';
  toggleMobileSidebar(false);
  await registerCurrentUserInProject('Member');
  await loadAllData();
  showToast(`تم الانضمام لمشروع: ${found.name}`);
}

function copyProjectCode() {
  if (!activeProjectId) return;
  navigator.clipboard.writeText(activeProjectId);
  showToast(`تم نسخ الكود: ${activeProjectId}`);
}

function shareCurrentProject() {
  if (!activeProjectId) return showToast('أنشئ مشروعاً أولاً');
  const shareUrl = `${window.location.origin}${window.location.pathname}?project=${activeProjectId}&shared=1`;
  navigator.clipboard.writeText(shareUrl);
  showToast(`تم نسخ رابط المشروع (${activeProjectId}) فقط! لن تظهر باقي مشاريعك 🔗`);
}
