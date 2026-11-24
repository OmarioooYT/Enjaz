async function resolveAccessibleProjectIds() {
  if (isSharedMode && sharedOnlyProjectId) {
    return [sharedOnlyProjectId];
  }

  const idSet = new Set();
  getLocalAllowedProjectIds().forEach(id => idSet.add(id));

  if (urlProjectParam && activeProjectId === urlProjectParam) {
    idSet.add(urlProjectParam);
  }

  const ident = getCurrentIdentity();
  if (ident.id) {
    const { data: myMemberships } = await db
      .from('project_members')
      .select('project_id')
      .eq('user_id', ident.id);
    if (myMemberships) {
      myMemberships.forEach(row => {
        if (row.project_id) idSet.add(row.project_id);
      });
    }
  }

  return Array.from(idSet);
}

async function loadMembersOnly() {
  const allowedIds = projects.map(p => p.id);
  if (allowedIds.length === 0) {
    members = [];
    renderAll();
    return;
  }
  const { data, error } = await db
    .from('project_members')
    .select('*')
    .in('project_id', allowedIds)
    .order('joined_at', { ascending: true });
  if (!error && data) {
    members = data;
    renderAll();
  }
}

async function loadAllData() {
  const syncDot = document.getElementById('syncDot');
  const syncText = document.getElementById('syncText');
  try {
    const allowedIds = await resolveAccessibleProjectIds();

    if (allowedIds.length === 0) {
      projects = [];
      tasks = [];
      members = [];
      activeProjectId = null;
      syncDot.className = 'w-1.5 h-1.5 rounded-full bg-brand';
      syncText.dataset.state = 'connectedLive';
      syncText.textContent = t('connectedLive');
      renderAll();
      return;
    }

    const { data: projData, error: projErr } = await db
      .from('projects')
      .select('*')
      .in('id', allowedIds)
      .order('created_at', { ascending: true });
    if (projErr) throw projErr;

    projects = projData || [];

    if (projects.length === 0) {
      activeProjectId = null;
    } else if (!activeProjectId || !projects.some(p => p.id === activeProjectId)) {
      activeProjectId = projects[0].id;
    }

    const validIds = projects.map(p => p.id);
    if (validIds.length > 0) {
      const { data: taskData, error: taskErr } = await db
        .from('tasks')
        .select('*')
        .in('project_id', validIds)
        .order('created_at', { ascending: false });
      if (taskErr) throw taskErr;
      tasks = taskData || [];

      const { data: memData, error: memErr } = await db
        .from('project_members')
        .select('*')
        .in('project_id', validIds)
        .order('joined_at', { ascending: true });
      members = memErr ? [] : (memData || []);
    } else {
      tasks = [];
      members = [];
    }

    syncDot.className = 'w-1.5 h-1.5 rounded-full bg-brand';
    syncText.dataset.state = 'connectedLive';
    syncText.textContent = t('connectedLive');

    renderAll();
    if (activeProjectId && hasIdentity()) {
      registerCurrentUserInProject();
    }
  } catch (err) {
    console.error(err);
    syncDot.className = 'w-1.5 h-1.5 rounded-full bg-rose-500';
    syncText.dataset.state = 'connectionError';
    syncText.textContent = t('connectionError');
  }
}

function subscribeRealtime() {
  db.channel('enjaz-teams-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => loadAllData())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadAllData())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'project_members' }, () => loadMembersOnly())
    .subscribe();
}
