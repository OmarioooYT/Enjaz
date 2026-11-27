async function boot() {
  applyLanguage(currentLang, false);

  try {
    if (!window.supabase || typeof db === 'undefined') {
      throw new Error('Supabase SDK failed to load');
    }

    // Linking an OAuth identity that already belongs to another account fails;
    // in that case sign in to that existing account instead.
    const authErr = new URLSearchParams(window.location.hash.slice(1) || window.location.search).get('error_code');
    const lastProvider = localStorage.getItem('enjaz_last_oauth_provider');
    if (authErr === 'identity_already_exists' && lastProvider) {
      const cleanParams = new URLSearchParams(window.location.search);
      ['error', 'error_code', 'error_description'].forEach(k => cleanParams.delete(k));
      const cleanSearch = cleanParams.toString() ? `?${cleanParams}` : '';
      await db.auth.signInWithOAuth({
        provider: lastProvider,
        options: { redirectTo: `${window.location.origin}${window.location.pathname}${cleanSearch}` }
      });
      return;
    }

    currentUser = await ensureSession();
    renderAuthUI();

    db.auth.onAuthStateChange((event, session) => {
      currentUser = session ? session.user : null;
      renderAuthUI();
      if (event === 'USER_UPDATED' && currentUser) {
        setTimeout(() => registerCurrentUserInProject(), 0);
      }
      // Ignore INITIAL_SESSION (boot() loads right below) and defer outside Supabase auth lock to prevent deadlock
      if (event === 'SIGNED_IN' && currentUser) {
        setTimeout(() => loadAllData(), 0);
      }
    });

    await loadAllData();
    subscribeRealtime();
    updateNotifyButton();

    if (!hasIdentity()) {
      openAuthModal(true);
    } else {
      maybeTriggerTutorial();
    }
  } catch (err) {
    console.error('Boot error:', err);
    window._enjazBootFailed = true;
    if (loadOfflineSnapshot()) return;
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
