let _dataLoadInFlight = false;
let _dataLoadPending = false;
let _realtimeDataTimer = null;
let _realtimeMembersTimer = null;

// Project codes from the URL that we already tried to join this page load,
// so leaving a project during this visit does not immediately re-join it.
const _joinAttemptedCodes = new Set();

// Access is enforced by Supabase row-level security: the only projects a
// user can read are the ones they are a member of.
async function resolveAccessibleProjectIds() {
  const ident = getCurrentIdentity();
  if (!currentUser || !ident.id) return [];

  const { data: myMemberships, error } = await db
    .from('project_members')
    .select('project_id')
    .eq('user_id', ident.id);
  if (error) throw error;

  const idSet = new Set((myMemberships || []).map(row => row.project_id).filter(Boolean));

  // Opening a share link (?project=CODE) joins that project once.
  if (urlProjectParam && !idSet.has(urlProjectParam) && !_joinAttemptedCodes.has(urlProjectParam) && hasIdentity()) {
    _joinAttemptedCodes.add(urlProjectParam);
    const joined = await joinProjectRpc(urlProjectParam);
    if (joined) idSet.add(joined.id);
  }

  if (isSharedMode && sharedOnlyProjectId) {
    return idSet.has(sharedOnlyProjectId) ? [sharedOnlyProjectId] : [];
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
  if (_dataLoadInFlight) {
    _dataLoadPending = true;
    return;
  }
  _dataLoadInFlight = true;

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
      const [taskRes, memRes] = await Promise.all([
        db.from('tasks').select('*').in('project_id', validIds).order('created_at', { ascending: false }),
        db.from('project_members').select('*').in('project_id', validIds).order('joined_at', { ascending: true })
      ]);
      if (taskRes.error) throw taskRes.error;
      tasks = taskRes.data || [];
      members = memRes.error ? [] : (memRes.data || []);
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
  } finally {
    _dataLoadInFlight = false;
    if (_dataLoadPending) {
      _dataLoadPending = false;
      loadAllData();
    }
  }
}

function scheduleRealtimeReload() {
  clearTimeout(_realtimeDataTimer);
  _realtimeDataTimer = setTimeout(() => loadAllData(), 250);
}

function scheduleMembersReload() {
  clearTimeout(_realtimeMembersTimer);
  _realtimeMembersTimer = setTimeout(() => loadMembersOnly(), 250);
}

function subscribeRealtime() {
  db.channel('enjaz-teams-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, scheduleRealtimeReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, scheduleRealtimeReload)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'project_members' }, scheduleMembersReload)
    .subscribe();
}
