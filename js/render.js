function renderAll() {
  renderSidebar();
  renderWorkspace();
  if (aiDrawerOpen && typeof renderAiDrawerUI === 'function') {
    renderAiDrawerUI();
  }
}

function renderSidebar() {
  document.getElementById('sharedModeSidebarNotice').classList.toggle('hidden', !isSharedMode);
  document.getElementById('sidebarNewProjBtn').classList.toggle('hidden', isSharedMode);
  document.getElementById('sidebarFooterTools').classList.toggle('hidden', isSharedMode);
  document.getElementById('sidebarProjectsLabel').textContent = isSharedMode ? t('sharedProject') : t('myProjects');

  const container = document.getElementById('sidebarProjects');
  container.innerHTML = '';

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="px-3 py-4 text-center border border-dashed border-borderSubtle rounded-xl text-[11px] text-zinc-500">
        ${t('noProjectsYet')}
      </div>`;
  } else {
    projects.forEach((p, idx) => {
      const isActive = p.id === activeProjectId;
      const pTasks = tasks.filter(t => t.project_id === p.id);
      const doneCount = pTasks.filter(t => getTaskStatus(t) === 'done').length;
      const pStatus = getProjectStatus(p);
      const stMeta = PROJECT_STATUS_META[pStatus];
      const stLabel = getProjectStatusLabel(pStatus);

      const row = document.createElement('div');
      row.className = `group relative animate-slide-rtl rounded-xl flex items-center justify-between gap-1.5 px-2.5 py-2 transition cursor-pointer border ${isActive
        ? 'bg-brand/12 text-white border-brand/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100 border-transparent'
        }`;
      row.style.animationDelay = `${Math.min(idx * 35, 210)}ms`;
      row.onclick = (e) => {
        if (e.target.closest('button')) return;
        activeProjectId = p.id;
        selectedAssignee = 'all';
        if (!isSharedMode) {
          window.history.replaceState({}, '', `?project=${p.id}`);
        }
        toggleMobileSidebar(false);
        renderAll();
        registerCurrentUserInProject();
      };

      const rowControls = isSharedMode
        ? `<div class="flex items-center gap-0.5 shrink-0">
             <button onclick="leaveProject(${jsArg(p.id)})" title="${t('leaveProjectBtn')}" aria-label="${t('leaveProjectBtn')}"
               class="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition">${ICONS.leave}</button>
           </div>`
        : `<div class="flex items-center gap-0.5 opacity-90 lg:opacity-0 group-hover:opacity-100 transition shrink-0">
             <button onclick="openProjectModal(${jsArg(p.id)})" title="${t('editProjectBtn')}" aria-label="${t('editProjectBtn')}"
               class="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition">${ICONS.edit}</button>
             <button onclick="leaveProject(${jsArg(p.id)})" title="${t('leaveProjectBtn')}" aria-label="${t('leaveProjectBtn')}"
               class="p-1.5 rounded-lg hover:bg-brand/20 text-zinc-400 hover:text-brand transition">${ICONS.leave}</button>
             <button onclick="deleteProjectById(${jsArg(p.id)})" title="${t('deleteProjectTitle')}" aria-label="${t('deleteProjectTitle')}"
               class="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition">${ICONS.trash}</button>
           </div>`;

      row.innerHTML = `
        ${isActive ? '<span class="absolute start-0 top-2 bottom-2 w-0.5 rounded-full bg-brand"></span>' : ''}
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <span class="w-7 h-7 rounded-lg bg-obsidian/90 border border-borderSubtle flex items-center justify-center shrink-0 overflow-hidden">${renderProjectIconHtml(p.icon, 'w-3.5 h-3.5')}</span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full shrink-0 ${stMeta.dot}" title="${stLabel}"></span>
              <span class="text-xs font-semibold truncate ${pStatus === 'done' ? 'line-through text-zinc-400' : ''}">${escapeHtml(p.name)}</span>
            </div>
            <span class="text-[10px] text-zinc-400 font-mono tabular-nums">${stLabel} · ${doneCount}/${pTasks.length}</span>
          </div>
        </div>
        ${rowControls}
      `;
      container.appendChild(row);
    });
  }

  const activeProj = projects.find(p => p.id === activeProjectId);
  const statusEl = document.getElementById('headerProjStatus');
  const mobileStatusEl = document.getElementById('mobileProjStatus');
  const actionsEl = document.getElementById('headerProjectActions');
  const mobileSubEl = document.getElementById('mobileSubHeader');
  const doneBanner = document.getElementById('projectDoneBanner');

  if (activeProj) {
    const st = getProjectStatus(activeProj);
    const stMeta = PROJECT_STATUS_META[st];
    document.getElementById('headerProjIcon').innerHTML = renderProjectIconHtml(activeProj.icon, 'w-4 h-4');
    document.getElementById('headerProjTitle').textContent = activeProj.name;

    statusEl.value = st;
    statusEl.className = `hidden lg:inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none transition shrink-0 ${stMeta.selectCls}`;

    mobileStatusEl.value = st;
    mobileStatusEl.className = `text-[11px] font-bold px-2 py-1.5 rounded-xl border focus:outline-none shrink-0 ${stMeta.selectCls}`;

    actionsEl.classList.remove('hidden');
    mobileSubEl.classList.remove('hidden');
    doneBanner.classList.toggle('hidden', st !== 'done');
    document.getElementById('projDescLine').textContent = activeProj.description || t('noProjDesc');
  } else {
    document.getElementById('headerProjIcon').innerHTML = renderProjectIconHtml('svg:folder', 'w-4 h-4');
    document.getElementById('headerProjTitle').textContent = t('workspace');
    statusEl.className = 'hidden';
    actionsEl.classList.add('hidden');
    mobileSubEl.classList.add('hidden');
    doneBanner.classList.add('hidden');
  }
}

function renderWorkspace() {
  const emptyEl = document.getElementById('emptyProjectsState');
  const activeEl = document.getElementById('activeWorkspaceContent');

  if (!activeProjectId) {
    emptyEl.classList.remove('hidden');
    activeEl.classList.add('hidden');
    if (isSharedMode) {
      document.getElementById('emptyStateTitle').textContent = t('emptySharedTitle');
      document.getElementById('emptyStateDesc').textContent = t('emptySharedDesc');
    } else {
      document.getElementById('emptyStateTitle').textContent = t('emptyTitle');
      document.getElementById('emptyStateDesc').textContent = t('emptyDesc');
    }
    return;
  }

  emptyEl.classList.add('hidden');
  activeEl.classList.remove('hidden');

  const projTasks = tasks.filter(t => t.project_id === activeProjectId);
  const projMembers = members.filter(m => m.project_id === activeProjectId);

  // Update Datalist
  const dl = document.getElementById('teamMembersDatalist');
  const uniqueNames = new Set();
  projMembers.forEach(m => uniqueNames.add(m.name));
  projTasks.forEach(t => { if (t.assignee) uniqueNames.add(t.assignee.trim()); });
  dl.innerHTML = Array.from(uniqueNames).map(n => `<option value="${escapeHtml(n)}"></option>`).join('');

  // KPIs with smooth count-up interpolation & one-shot progress sweep
  const total = projTasks.length;
  const done = projTasks.filter(t => getTaskStatus(t) === 'done').length;
  const urgent = projTasks.filter(t => {
    const st = getTaskStatus(t);
    return st !== 'done' && (t.priority === 'high' || isOverdue(t.due_date, st));
  }).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  animateNumber('kpiTotal', lastKpiState.total, total);
  animateNumber('kpiMembers', lastKpiState.members, projMembers.length);
  animateNumber('kpiPercent', lastKpiState.percent, percent, '%');
  animateNumber('kpiUrgent', lastKpiState.urgent, urgent);

  const bar = document.getElementById('kpiProgressBar');
  bar.style.width = `${percent}%`;
  if (percent > lastKpiState.percent) {
    bar.classList.remove('sweep-once');
    void bar.offsetWidth;
    bar.classList.add('sweep-once');
  }
  lastKpiState = { total, members: projMembers.length, percent, urgent };

  document.getElementById('teamTabCount').textContent = projMembers.length;
  document.getElementById('mTeamTabCount').textContent = projMembers.length;

  // Team Pills
  const teamPills = document.getElementById('teamPills');
  teamPills.innerHTML = '';

  const allPill = document.createElement('button');
  allPill.className = `px-2.5 py-1 rounded-lg text-[11px] font-bold transition border shrink-0 ${selectedAssignee === 'all'
    ? 'bg-brand/15 text-brand border-brand/40'
    : 'bg-surface text-zinc-400 border-borderSubtle hover:text-white'
    }`;
  allPill.textContent = `${t('allFilter')} (${total})`;
  allPill.onclick = () => { selectedAssignee = 'all'; renderWorkspace(); };
  teamPills.appendChild(allPill);

  Array.from(uniqueNames).forEach(memberName => {
    const count = projTasks.filter(t => (t.assignee || '').trim() === memberName).length;
    const pill = document.createElement('button');
    pill.className = `px-2.5 py-1 rounded-lg text-[11px] font-bold transition border flex items-center gap-1.5 shrink-0 ${selectedAssignee === memberName
      ? 'bg-brand/15 text-brand border-brand/40'
      : 'bg-surface text-zinc-400 border-borderSubtle hover:text-white'
      }`;
    pill.innerHTML = `<span class="w-4 h-4 rounded-full bg-zinc-800 text-[9px] flex items-center justify-center text-zinc-200">${escapeHtml(memberName.charAt(0))}</span><span>${escapeHtml(memberName)} (${count})</span>`;
    pill.onclick = () => { selectedAssignee = memberName; renderWorkspace(); };
    teamPills.appendChild(pill);
  });

  // Apply Filters
  const searchQ = searchQuery.trim().toLowerCase();
  const prioFlt = document.getElementById('priorityFilter').value;

  const filtered = projTasks.filter(t => {
    if (selectedAssignee !== 'all' && (t.assignee || '').trim() !== selectedAssignee) return false;
    if (prioFlt !== 'all' && (t.priority || 'medium') !== prioFlt) return false;
    if (searchQ) {
      const hay = `${t.title || ''} ${t.notes || ''} ${t.category || ''} ${t.assignee || ''}`.toLowerCase();
      if (!hay.includes(searchQ)) return false;
    }
    return true;
  });

  document.getElementById('boardView').classList.toggle('hidden', viewMode !== 'board');
  document.getElementById('listView').classList.toggle('hidden', viewMode !== 'list');
  document.getElementById('teamView').classList.toggle('hidden', viewMode !== 'team');
  document.getElementById('filterBar').classList.toggle('hidden', viewMode === 'team');

  if (viewMode === 'board') renderKanban(filtered);
  else if (viewMode === 'list') renderList(filtered);
  else renderTeamView(projMembers, projTasks);

  if (typeof renderAiContextOptions === 'function') renderAiContextOptions();
}

function renderTeamView(projMembers, projTasks) {
  const grid = document.getElementById('teamCardsGrid');
  grid.innerHTML = '';

  if (projMembers.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-surface border border-dashed border-borderSubtle rounded-2xl p-10 text-center space-y-2">
        <p class="text-sm font-bold text-zinc-300">${t('noMembersTitle')}</p>
        <p class="text-xs text-zinc-500">${t('noMembersDesc')}</p>
      </div>`;
    return;
  }

  const myIdent = getCurrentIdentity();

  projMembers.forEach((m, idx) => {
    const isMe = m.user_id === myIdent.id;
    const assignedTasks = projTasks.filter(t => (t.assignee || '').trim().toLowerCase() === (m.name || '').trim().toLowerCase());
    const completedByMember = projTasks.filter(t => getTaskStatus(t) === 'done' && (
      (t.completed_by || '').trim().toLowerCase() === (m.name || '').trim().toLowerCase() ||
      (t.assignee || '').trim().toLowerCase() === (m.name || '').trim().toLowerCase()
    ));
    const inProgCount = assignedTasks.filter(t => getTaskStatus(t) === 'in_progress').length;
    const joinDate = m.joined_at ? new Date(m.joined_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ar-EG', { month: 'short', day: 'numeric' }) : '';

    const card = document.createElement('div');
    card.className = `card-surface spotlight-card animate-fade-up border rounded-2xl p-5 flex flex-col justify-between gap-4 transition ${isMe ? 'border-brand/40' : 'border-borderSubtle hover:border-white/15'}`;
    card.style.animationDelay = `${Math.min(idx * 40, 200)}ms`;
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand/25 to-brand/10 border border-brand/35 text-brand flex items-center justify-center text-base font-extrabold shrink-0 overflow-hidden">
            ${m.avatar_url
        ? `<img src="${escapeHtml(m.avatar_url)}" class="w-full h-full object-cover" />`
        : escapeHtml((m.name || '؟').charAt(0).toUpperCase())}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <h3 class="font-display font-extrabold text-sm text-white truncate">${escapeHtml(m.name)}</h3>
              ${isMe ? `<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-brand/15 text-brand border border-brand/25">${t('youBadge')}</span>` : ''}
            </div>
            <p class="text-[11px] text-zinc-400 truncate mt-0.5">${escapeHtml(m.role || t('teamMemberDefault'))}</p>
            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              ${m.role ? `<span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-obsidian text-zinc-300 border border-borderSubtle">${escapeHtml(m.role)}</span>` : ''}
              ${joinDate ? `<span class="text-[10px] text-zinc-400">${t('joinedLabel')} ${joinDate}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          ${isMe ? `
            <button type="button" data-action="edit-profile"
              title="${escapeHtml(t('editProfileBtn'))}"
              aria-label="${escapeHtml(t('editProfileBtn'))}"
              class="text-zinc-300 hover:text-brand p-1.5 rounded-lg hover:bg-brand/12 transition">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>` : ''}
          <button type="button" data-action="leave-or-remove"
            title="${escapeHtml(isMe ? t('leaveProjectBtn') : t('removeMemberTitle'))}"
            aria-label="${escapeHtml(isMe ? t('leaveProjectBtn') : t('removeMemberTitle'))}"
            class="text-zinc-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition">${isMe ? ICONS.leave : ICONS.close}</button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 bg-obsidian/90 border border-borderSubtle rounded-xl p-3 text-center">
        <div>
          <p class="text-sm font-extrabold text-white font-mono tabular-nums">${assignedTasks.length}</p>
          <p class="text-[10px] text-zinc-400 mt-0.5">${t('statAssigned')}</p>
        </div>
        <div class="border-x border-borderSubtle">
          <p class="text-sm font-extrabold text-brand font-mono tabular-nums">${inProgCount}</p>
          <p class="text-[10px] text-zinc-400 mt-0.5">${t('statInProgress')}</p>
        </div>
        <div>
          <p class="text-sm font-extrabold text-emerald-400 font-mono tabular-nums">${completedByMember.length}</p>
          <p class="text-[10px] text-zinc-400 mt-0.5">${t('statCompleted')}</p>
        </div>
      </div>

      <button type="button" data-action="filter-member"
        class="w-full py-2.5 rounded-xl bg-obsidian/90 hover:bg-surfaceHover border border-borderSubtle hover:border-brand/35 text-xs font-semibold text-zinc-200 hover:text-brand transition">
        ${t('viewMemberTasks')} ${escapeHtml(m.name)} ${t('inBoardSuffix')}
      </button>
    `;
    const editBtn = card.querySelector('[data-action="edit-profile"]');
    if (editBtn) editBtn.onclick = () => openEditProfileModal(m.user_id);
    const removeBtn = card.querySelector('[data-action="leave-or-remove"]');
    if (removeBtn) removeBtn.onclick = () => (isMe ? leaveProject(activeProjectId) : removeMember(m.id));
    const filterBtn = card.querySelector('[data-action="filter-member"]');
    if (filterBtn) filterBtn.onclick = () => filterByMemberAndOpenBoard(m.name);
    grid.appendChild(card);
  });
}

function filterByMemberAndOpenBoard(name) {
  selectedAssignee = name;
  setViewMode('board');
}

function openAddMemberModal() {
  if (!activeProjectId) return showToast('أنشئ مشروعاً أولاً');
  document.getElementById('mName').value = '';
  document.getElementById('mRole').value = '';
  animateModalOpen('addMemberModal');
  setTimeout(() => document.getElementById('mName').focus(), 50);
}

function closeAddMemberModal() {
  animateModalClose('addMemberModal');
}

async function saveManualMember() {
  const name = document.getElementById('mName').value.trim();
  const role = document.getElementById('mRole').value.trim() || 'Member';
  if (!name) return showToast('اكتب اسم العضو');

  closeAddMemberModal();
  const uid = 'manual_' + Date.now();
  const payload = {
    id: `${activeProjectId}_${uid}`,
    project_id: activeProjectId,
    user_id: uid,
    name,
    email: '',
    avatar_url: '',
    provider: 'manual',
    role,
    joined_at: Date.now()
  };
  const { error } = await db.from('project_members').insert([payload]);
  if (error) {
    showToast('تأكد من وجود جدول project_members في Supabase');
  } else {
    showToast(`تمت إضافة ${name} للفريق ✓`);
    loadMembersOnly();
  }
}

async function removeMember(memberId) {
  const isEn = currentLang === 'en';
  const ok = await showConfirmDialog({
    title: isEn ? 'Remove Team Member' : 'إزالة عضو من الفريق',
    message: isEn ? 'Remove this member from the project team list?' : 'هل تريد إزالة هذا العضو من قائمة الفريق؟',
    confirmText: isEn ? 'Remove' : 'إزالة',
    variant: 'danger'
  });
  if (!ok) return;
  // RLS lets owners remove anyone, and members remove only manual entries;
  // a filtered-out delete returns no error, so check what was deleted.
  const { data: removed, error } = await db.from('project_members').delete().eq('id', memberId).select('id');
  if (error || !removed || removed.length === 0) {
    showToast(isEn ? 'Only the project owner can remove this member' : 'فقط مالك المشروع يمكنه إزالة هذا العضو');
  } else {
    showToast(isEn ? 'Member removed' : 'تمت إزالة العضو');
  }
  loadMembersOnly();
}

function renderKanban(list) {
  const cols = { todo: [], in_progress: [], done: [] };
  list.forEach(item => cols[getTaskStatus(item)].push(item));

  const prioMeta = {
    high: { label: t('prioHigh'), dot: 'bg-rose-400', cls: 'bg-rose-500/12 text-rose-300 border-rose-500/25' },
    medium: { label: t('prioMed'), dot: 'bg-brand', cls: 'bg-brand/12 text-orange-300 border-brand/25' },
    low: { label: t('prioLow'), dot: 'bg-zinc-400', cls: 'bg-white/[0.06] text-zinc-300 border-white/10' }
  };

  ['todo', 'in_progress', 'done'].forEach(status => {
    document.getElementById(`count-${status}`).textContent = cols[status].length;
    const container = document.getElementById(`col-${status}`);
    container.innerHTML = '';

    if (cols[status].length === 0) {
      container.innerHTML = `<div class="border border-dashed border-white/10 rounded-xl p-5 lg:p-7 text-center text-xs text-zinc-500">${t('emptyColHint')}</div>`;
      return;
    }

    cols[status].forEach((task, idx) => {
      const pr = prioMeta[task.priority] || prioMeta.medium;
      const overdue = isOverdue(task.due_date, status);

      const card = document.createElement('div');
      card.draggable = true;
      const justCompleted = lastCompletedTaskId && lastCompletedTaskId === task.id && status === 'done';
      card.className = `task-card animate-fade-up border border-borderSubtle rounded-xl p-3.5 cursor-pointer space-y-2.5 ${justCompleted ? 'animate-done-pulse border-emerald-500/45' : ''}`;
      card.style.animationDelay = `${Math.min(idx * 30, 180)}ms`;
      if (justCompleted) lastCompletedTaskId = null;
      card.ondragstart = (e) => {
        draggedTaskId = task.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      };
      card.ondragend = () => {
        card.classList.remove('dragging');
        draggedTaskId = null;
      };
      card.onclick = (e) => {
        if (e.target.closest('button')) return;
        openTaskModal(task.id);
      };

      card.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${pr.cls}">
              <span class="w-1.5 h-1.5 rounded-full ${pr.dot}"></span>
              <span>${pr.label}</span>
            </span>
            ${task.category ? `<span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300">${escapeHtml(task.category)}</span>` : ''}
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button onclick="openAiChat(${jsArg(task.id)})" title="${t('aiAskAboutTaskTitle')}" aria-label="${t('aiAskAboutTaskTitle')}"
              class="w-7 h-7 sm:w-6 sm:h-6 rounded-lg border border-brand/25 bg-brand/10 text-brand hover:bg-brand/25 hover:border-brand/50 flex items-center justify-center transition shrink-0">
              ${ICONS.sparkles}
            </button>
            <button onclick="quickCycleStatus(${jsArg(task.id)})" title="${t('quickStatusTitle')}" aria-label="${t('quickStatusTitle')}"
              class="w-7 h-7 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${status === 'done'
          ? 'bg-emerald-500 border-emerald-500 text-obsidian'
          : status === 'in_progress'
            ? 'bg-brand/15 border-brand/45 text-brand hover:bg-brand/25'
            : 'border-white/15 text-zinc-400 hover:border-brand hover:text-brand'
        }">
              ${status === 'done' ? ICONS.check : status === 'in_progress' ? ICONS.play : ICONS.circle}
            </button>
          </div>
        </div>

        <p class="text-[13px] font-bold leading-relaxed ${status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-100'}">
          ${escapeHtml(task.title)}
        </p>

        ${task.notes ? `<p class="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">${escapeHtml(task.notes)}</p>` : ''}

        <div class="pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-[11px]">
          <div class="flex items-center gap-2 min-w-0">
            ${task.assignee ? `
              <span class="inline-flex items-center gap-1.5 text-zinc-300 font-medium truncate">
                <span class="w-5 h-5 rounded-full bg-brand/15 border border-brand/30 text-brand flex items-center justify-center text-[10px] font-bold shrink-0">${escapeHtml(task.assignee.charAt(0))}</span>
                <span class="truncate">${escapeHtml(task.assignee)}</span>
              </span>` : `<span class="text-zinc-500">${t('unassigned')}</span>`}
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            ${task.due_date ? `
              <span class="inline-flex items-center gap-1 font-mono tabular-nums text-[10px] px-2 py-0.5 rounded-md ${overdue ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold' : 'bg-white/[0.05] text-zinc-300 border border-white/[0.06]'}">
                ${ICONS.calendar}
                <span>${escapeHtml(task.due_date)}</span>
              </span>` : ''}
            ${status === 'done' && task.completed_by ? `
              <span class="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">${ICONS.check}<span>${escapeHtml(task.completed_by)}</span></span>` : ''}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  });
}

function renderList(list) {
  const tbody = document.getElementById('listTableBody');
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-12 text-center text-zinc-400">${t('noMatchingTasks')}</td></tr>`;
    return;
  }

  const statusLabels = {
    todo: `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/[0.06] text-zinc-200 border border-white/10"><span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>${t('statusTodo')}</span>`,
    in_progress: `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand/15 text-orange-300 border border-brand/25"><span class="w-1.5 h-1.5 rounded-full bg-brand"></span>${t('statusInProgress')}</span>`,
    done: `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>${t('statusDone')}</span>`
  };
  const prioLabels = {
    high: `<span class="inline-flex items-center gap-1.5 text-rose-400 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>${t('prioHigh')}</span>`,
    medium: `<span class="inline-flex items-center gap-1.5 text-orange-300 font-medium"><span class="w-1.5 h-1.5 rounded-full bg-brand"></span>${t('prioMed')}</span>`,
    low: `<span class="inline-flex items-center gap-1.5 text-zinc-400"><span class="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>${t('prioLow')}</span>`
  };

  list.forEach((task, idx) => {
    const st = getTaskStatus(task);
    const overdue = isOverdue(task.due_date, st);
    const tr = document.createElement('tr');
    tr.className = 'animate-slide-rtl hover:bg-white/[0.03] transition cursor-pointer';
    tr.style.animationDelay = `${Math.min(idx * 25, 200)}ms`;
    tr.onclick = (e) => {
      if (e.target.closest('button')) return;
      openTaskModal(task.id);
    };
    tr.innerHTML = `
      <td class="py-3.5 px-4">
        <button onclick="quickCycleStatus(${jsArg(task.id)})" aria-label="${t('quickStatusTitle')}"
          class="w-6 h-6 rounded-lg border flex items-center justify-center transition ${st === 'done' ? 'bg-emerald-500 border-emerald-500 text-obsidian' : 'border-white/20 text-zinc-400 hover:border-brand'
      }">${st === 'done' ? ICONS.check : ''}</button>
      </td>
      <td class="py-3.5 px-4">
        <p class="font-semibold ${st === 'done' ? 'line-through text-zinc-500' : 'text-zinc-100'}">${escapeHtml(task.title)}</p>
        ${st === 'done' && task.completed_by ? `<span class="text-[10px] text-emerald-400">${t('completedBy')} ${escapeHtml(task.completed_by)}</span>` : ''}
      </td>
      <td class="py-3.5 px-4">${statusLabels[st]}</td>
      <td class="py-3.5 px-4">${prioLabels[task.priority] || prioLabels.medium}</td>
      <td class="py-3.5 px-4 text-zinc-200">${escapeHtml(task.assignee || '—')}</td>
      <td class="py-3.5 px-4 font-mono tabular-nums ${overdue ? 'text-rose-400 font-semibold' : 'text-zinc-400'}">${escapeHtml(task.due_date || '—')}</td>
      <td class="py-3.5 px-4 text-zinc-300">${escapeHtml(task.category || '—')}</td>
      <td class="py-3.5 px-4 text-end">
        <div class="inline-flex items-center gap-1">
          <button onclick="openAiChat(${jsArg(task.id)})" title="${t('aiAskAboutTaskTitle')}" aria-label="${t('aiAskAboutTaskTitle')}"
            class="text-brand hover:text-white p-1.5 rounded-lg bg-brand/10 hover:bg-brand/25 border border-brand/25 transition">${ICONS.sparkles}</button>
          <button onclick="openTaskModal(${jsArg(task.id)})" class="text-zinc-300 hover:text-brand px-2.5 py-1 rounded-lg hover:bg-brand/10 font-semibold transition">${t('editBtn')}</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function handleDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
async function handleDrop(e, newStatus) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!draggedTaskId) return;
  await updateTaskStatus(draggedTaskId, newStatus);
}

async function quickCycleStatus(taskId) {
  const t = tasks.find(x => x.id === taskId);
  if (!t) return;
  const cur = getTaskStatus(t);
  const next = cur === 'todo' ? 'in_progress' : cur === 'in_progress' ? 'done' : 'todo';
  await updateTaskStatus(taskId, next);
}

async function updateTaskStatus(taskId, newStatus) {
  const user = getCurrentIdentity().name || 'عضو';
  const isDone = newStatus === 'done';
  const target = tasks.find(t => t.id === taskId);
  if (target) {
    target.status = newStatus;
    target.done = isDone;
    target.completed_by = isDone ? user : '';
    if (isDone) lastCompletedTaskId = taskId;
    renderAll();
  }

  const payload = {
    status: newStatus,
    done: isDone,
    completed_by: isDone ? user : '',
    completed_at: isDone ? Date.now() : null
  };

  let { error } = await db.from('tasks').update(payload).eq('id', taskId);
  if (error) {
    ({ error } = await db.from('tasks').update({
      done: isDone,
      completed_by: isDone ? user : '',
      completed_at: isDone ? Date.now() : null
    }).eq('id', taskId));
  }
  if (error) {
    showToast(currentLang === 'en' ? 'Failed to update task status' : 'تعذر تحديث حالة المهمة');
    loadAllData();
  } else if (isDone) {
    showToast(currentLang === 'en' ? `Nice work, ${user}! Task completed ✅` : `عاش يا ${user}! تم إنجاز المهمة ✅`);
  }
}
