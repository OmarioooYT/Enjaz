async function boot() {
  applyLanguage(currentLang, false);

  try {
    if (!window.supabase || typeof db === 'undefined') {
      throw new Error('Supabase SDK failed to load');
    }

    const { data: { session } } = await db.auth.getSession();
    currentUser = session ? session.user : null;
    renderAuthUI();

    db.auth.onAuthStateChange((event, session) => {
      currentUser = session ? session.user : null;
      renderAuthUI();
      // Ignore INITIAL_SESSION (boot() loads right below) and defer outside Supabase auth lock to prevent deadlock
      if (event === 'SIGNED_IN' && currentUser) {
        setTimeout(() => loadAllData(), 0);
      }
    });

    await loadAllData();
    subscribeRealtime();

    if (!hasIdentity()) {
      openAuthModal(true);
    } else {
      maybeTriggerTutorial();
    }
  } catch (err) {
    console.error('Boot error:', err);
    const syncDot = document.getElementById('syncDot');
    const syncText = document.getElementById('syncText');
    if (syncDot) syncDot.className = 'w-1.5 h-1.5 rounded-full bg-rose-500';
    if (syncText) {
      syncText.dataset.state = 'connectionError';
      syncText.textContent = t('connectionError');
    }
  }
}

// Keyboard shortcuts: Alt+A toggles AI Assistant, Escape closes modals & drawers
document.addEventListener('keydown', (e) => {
  if (e.altKey && (e.key === 'a' || e.key === 'A')) {
    e.preventDefault();
    if (aiDrawerOpen) closeAiChat();
    else openAiChat('project');
    return;
  }
  if (e.key !== 'Escape') return;
  if (_confirmResolver) {
    resolveConfirmDialog(false);
    return;
  }
  closeTaskModal();
  closeProjectModal();
  closeAddMemberModal();
  closeEditProfileModal();
  closeMobileProjectMenu();
  closeAiChat();
  toggleMobileSidebar(false);
  const authClose = document.getElementById('authModalCloseBtn');
  if (authClose && !authClose.classList.contains('hidden')) closeAuthModal();
  const tut = document.getElementById('tutorialModal');
  if (tut && !tut.classList.contains('hidden')) skipTutorial();
});

boot();
