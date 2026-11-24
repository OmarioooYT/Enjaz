async function boot() {
  applyLanguage(currentLang, false);
  const { data: { session } } = await db.auth.getSession();
  currentUser = session ? session.user : null;
  renderAuthUI();

  db.auth.onAuthStateChange((_event, session) => {
    currentUser = session ? session.user : null;
    renderAuthUI();
    if (currentUser) {
      loadAllData();
    }
  });

  await loadAllData();
  subscribeRealtime();

  if (!hasIdentity()) {
    openAuthModal(true);
  } else {
    maybeTriggerTutorial();
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
