// True only for a real (OAuth) account. Guests also have a Supabase
// session, but it is anonymous.
function isSignedInUser() {
  return Boolean(currentUser && !currentUser.is_anonymous);
}

function hasIdentity() {
  return Boolean(isSignedInUser() || (localStorage.getItem('enjaz_username') || '').trim());
}

// Every visitor needs a Supabase session so row-level security can identify
// them. Guests get an anonymous session (enable "Allow anonymous sign-ins").
async function ensureSession() {
  const { data: { session } } = await db.auth.getSession();
  if (session) return session.user;
  const { data, error } = await db.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}

function resolveActiveOAuthProvider(user) {
  if (!user) return 'guest';
  const identities = Array.isArray(user.identities) ? user.identities : [];
  const linkedProviders = new Set([
    ...(Array.isArray(user.app_metadata?.providers) ? user.app_metadata.providers : []),
    ...identities.map(i => i.provider).filter(Boolean)
  ]);
  const chosen = localStorage.getItem('enjaz_last_oauth_provider');
  if (chosen && (linkedProviders.size === 0 || linkedProviders.has(chosen))) {
    return chosen;
  }
  if (identities.length > 0) {
    const latest = [...identities].sort((a, b) => {
      const ta = Date.parse(a.last_sign_in_at || a.updated_at || a.created_at || 0) || 0;
      const tb = Date.parse(b.last_sign_in_at || b.updated_at || b.created_at || 0) || 0;
      return tb - ta;
    })[0];
    if (latest && latest.provider) return latest.provider;
  }
  return (user.app_metadata && user.app_metadata.provider) || 'oauth';
}

function getSavedProfileOverride(userId) {
  if (!userId) return {};
  try {
    const raw = JSON.parse(localStorage.getItem(`enjaz_profile_${userId}`) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function saveProfileOverride(userId, data) {
  if (!userId) return;
  try {
    localStorage.setItem(`enjaz_profile_${userId}`, JSON.stringify(data || {}));
  } catch {
    // Ignore storage quota errors
  }
}

function getCurrentIdentity() {
  if (isSignedInUser()) {
    const provider = resolveActiveOAuthProvider(currentUser);
    const identities = Array.isArray(currentUser.identities) ? currentUser.identities : [];
    const activeIdent = identities.find(i => i.provider === provider);
    const idData = (activeIdent && activeIdent.identity_data) || {};
    const meta = currentUser.user_metadata || {};
    const localProf = getSavedProfileOverride(currentUser.id);
    const defaultName = idData.full_name || idData.name || meta.full_name || meta.name || idData.user_name || meta.user_name || meta.preferred_username || (currentUser.email ? currentUser.email.split('@')[0] : 'عضو');
    const defaultAvatar = idData.avatar_url || idData.picture || meta.avatar_url || meta.picture || '';
    const name = (localProf.name || meta.custom_name || defaultName || '').trim();
    const avatar = localProf.avatar_cleared
      ? ''
      : (localProf.avatar_url !== undefined ? localProf.avatar_url : (meta.custom_avatar_url !== undefined ? meta.custom_avatar_url : defaultAvatar));
    const role = (localProf.role || meta.custom_role || '').trim();
    return {
      id: currentUser.id,
      name,
      email: currentUser.email || '',
      avatar_url: avatar,
      role,
      provider
    };
  }
  let guestId = currentUser ? currentUser.id : localStorage.getItem('enjaz_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('enjaz_guest_id', guestId);
  }
  const localProf = getSavedProfileOverride(guestId);
  const name = (localProf.name || document.getElementById('userNameInput').value || localStorage.getItem('enjaz_username') || '').trim();
  return {
    id: guestId,
    name,
    email: '',
    avatar_url: localProf.avatar_cleared ? '' : (localProf.avatar_url || ''),
    role: (localProf.role || '').trim(),
    provider: 'guest'
  };
}

function renderAuthUI() {
  const ident = getCurrentIdentity();
  const avatarWrap = document.getElementById('userAvatarWrap');
  const nameInput = document.getElementById('userNameInput');
  const emailDisplay = document.getElementById('userEmailDisplay');
  const badge = document.getElementById('authProviderBadge');
  const btn = document.getElementById('authActionBtn');

  if (ident.avatar_url) {
    avatarWrap.innerHTML = `<img src="${escapeHtml(ident.avatar_url)}" class="w-full h-full object-cover" alt="avatar" />`;
  } else {
    avatarWrap.textContent = (ident.name || '؟').charAt(0).toUpperCase();
  }

  if (isSignedInUser()) {
    nameInput.value = ident.name;
    nameInput.readOnly = true;
    emailDisplay.textContent = ident.email || `${t('connectedVia')} ${ident.provider}`;
    const provStyles = {
      google: { text: 'Google', cls: 'bg-blue-500/15 text-blue-300 border border-blue-400/25' },
      discord: { text: 'Discord', cls: 'bg-[#5865F2]/20 text-[#8ea1e1]' },
      github: { text: 'GitHub', cls: 'bg-zinc-700/60 text-zinc-200' }
    };
    const ps = provStyles[ident.provider] || { text: ident.provider, cls: 'bg-brand/15 text-brand' };
    badge.textContent = ps.text;
    badge.className = `text-[10px] font-bold px-2 py-0.5 rounded-md ${ps.cls}`;

    btn.innerHTML = `${ICONS.leave}<span>${t('signOut')}</span>`;
    btn.className = 'w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 text-xs font-semibold transition flex items-center justify-center gap-2';
    btn.onclick = signOutUser;
  } else {
    nameInput.readOnly = false;
    nameInput.value = ident.name;
    emailDisplay.textContent = ident.name ? t('guestModeShort') : t('noUsernameYet');
    badge.textContent = t('guest');
    badge.className = 'text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 border border-white/[0.06]';

    btn.innerHTML = `${ICONS.login}<span>${t('signInProviders')}</span>`;
    btn.className = 'w-full py-2 px-3 rounded-xl bg-brand/12 hover:bg-brand/20 border border-brand/25 hover:border-brand/40 text-brand text-xs font-semibold transition flex items-center justify-center gap-2';
    btn.onclick = () => openAuthModal(false);
  }
}

function openAuthModal(required = false) {
  document.getElementById('guestNameModalInput').value = (localStorage.getItem('enjaz_username') || '').trim();
  document.getElementById('authModalCloseBtn').classList.toggle('hidden', required);
  animateModalOpen('authModal');
  setTimeout(() => document.getElementById('guestNameModalInput').focus(), 50);
}

function closeAuthModal() {
  animateModalClose('authModal');
}

async function handleGuestSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('guestNameModalInput').value.trim();
  if (!name) return showToast('اكتب اسم المستخدم أولاً');
  localStorage.setItem('enjaz_username', name);
  document.getElementById('userNameInput').value = name;
  closeAuthModal();
  renderAuthUI();
  await registerCurrentUserInProject();
  await loadAllData();
  showToast(`أهلاً يا ${name}!`);
  maybeTriggerTutorial();
}

async function signInWithProvider(provider) {
  if (window.location.protocol === 'file:') {
    showToast('ارفع الموقع على GitHub Pages أو Netlify أو شغّله على localhost عشان OAuth يشتغل');
    return;
  }
  localStorage.setItem('enjaz_last_oauth_provider', provider);
  const redirectUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
  const options = { redirectTo: redirectUrl };
  if (provider === 'google') {
    options.queryParams = { access_type: 'offline', prompt: 'select_account' };
  }
  // A guest links the OAuth identity to their anonymous account so they
  // keep their projects (requires "Allow manual linking" in Supabase).
  let error = null;
  if (currentUser && currentUser.is_anonymous && typeof db.auth.linkIdentity === 'function') {
    ({ error } = await db.auth.linkIdentity({ provider, options }));
    if (error) console.warn('linkIdentity failed, falling back to sign-in:', error);
  }
  if (!currentUser || !currentUser.is_anonymous || error) {
    ({ error } = await db.auth.signInWithOAuth({ provider, options }));
  }
  if (error) {
    localStorage.removeItem('enjaz_last_oauth_provider');
    console.error(error);
    showToast(`تأكد من تفعيل ${provider} في Supabase Authentication`);
  }
}

async function signOutUser() {
  localStorage.removeItem('enjaz_last_oauth_provider');
  await db.auth.signOut();
  currentUser = null;
  try {
    currentUser = await ensureSession();
  } catch (err) {
    console.error('Anonymous sign-in failed:', err);
  }
  renderAuthUI();
  await loadAllData();
  showToast('تم تسجيل الخروج');
}

function maybeTriggerTutorial() {
  if (isSharedMode || urlProjectParam) return;
  if (!localStorage.getItem('enjaz_tutorial_done') && projects.length === 0) {
    openTutorialModal(0);
  }
}

async function registerCurrentUserInProject(role = 'Member') {
  if (!activeProjectId) return;
  const ident = getCurrentIdentity();

  const memberId = `${activeProjectId}_${ident.id}`;
  const existing = members.find(m => m.id === memberId);

  const desiredRole = ident.role || (existing ? existing.role : role);
  if (existing) {
    if (existing.name === ident.name && existing.avatar_url === ident.avatar_url && existing.role === desiredRole && existing.provider === ident.provider) {
      return;
    }
    // Row-level security only allows editing your own member row.
    const { error } = await db.from('project_members').update({
      name: ident.name,
      email: ident.email,
      avatar_url: ident.avatar_url,
      provider: ident.provider,
      role: desiredRole
    }).eq('id', memberId);
    if (!error) loadMembersOnly();
    return;
  }

  const joined = await joinProjectRpc(activeProjectId, desiredRole);
  if (joined) loadMembersOnly();
}

// Membership is created server-side by join_project(); knowing the project
// code is the invitation. Returns { id, name } or null if the code is unknown.
async function joinProjectRpc(code, role = 'Member') {
  const ident = getCurrentIdentity();
  const { data, error } = await db.rpc('join_project', {
    p_code: code,
    p_name: ident.name || (currentLang === 'en' ? 'Member' : 'عضو'),
    p_email: ident.email || '',
    p_avatar_url: ident.avatar_url || '',
    p_provider: ident.provider || '',
    p_role: role
  });
  if (error) {
    console.warn('join_project failed:', error);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return row && row.id ? row : null;
}

function updateProfileAvatarPreview(avatarUrl, nameStr) {
  const prev = document.getElementById('profileAvatarPreview');
  const removeBtn = document.getElementById('removeProfileAvatarBtn');
  if (!prev) return;
  if (avatarUrl) {
    prev.innerHTML = `<img src="${escapeHtml(avatarUrl)}" class="w-full h-full object-cover" alt="Profile avatar" />`;
    if (removeBtn) removeBtn.classList.remove('hidden');
  } else {
    prev.textContent = (nameStr || '؟').charAt(0).toUpperCase();
    if (removeBtn) removeBtn.classList.add('hidden');
  }
}

function openEditProfileModal(targetUserId = null) {
  const ident = getCurrentIdentity();
  // Strictly enforce: a user can ONLY edit their own profile
  if (targetUserId && targetUserId !== ident.id) {
    showToast(currentLang === 'en' ? 'You can only edit your own profile' : 'يمكنك تعديل ملفك الشخصي فقط');
    return;
  }

  const myMember = members.find(m => m.project_id === activeProjectId && m.user_id === ident.id);
  const currentName = ident.name || (myMember && myMember.name) || '';
  const currentRole = ident.role || (myMember && myMember.role) || 'Member';
  const currentAvatar = ident.avatar_url || (myMember && myMember.avatar_url) || '';

  document.getElementById('profileNameInput').value = currentName;
  document.getElementById('profileRoleInput').value = currentRole;
  document.getElementById('profileAvatarData').value = currentAvatar;
  document.getElementById('profileAvatarFile').value = '';
  updateProfileAvatarPreview(currentAvatar, currentName);

  animateModalOpen('editProfileModal');
  setTimeout(() => document.getElementById('profileNameInput').focus(), 60);
}

function closeEditProfileModal() {
  animateModalClose('editProfileModal');
}

function handleProfileAvatarUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast(currentLang === 'en' ? 'Please choose a valid image file' : 'يرجى اختيار ملف صورة صالح');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 160;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
      const dataUrl = canvas.toDataURL('image/webp', 0.85);
      document.getElementById('profileAvatarData').value = dataUrl;
      updateProfileAvatarPreview(dataUrl, document.getElementById('profileNameInput').value.trim());
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function clearProfileAvatar() {
  document.getElementById('profileAvatarData').value = '__CLEARED__';
  document.getElementById('profileAvatarFile').value = '';
  updateProfileAvatarPreview('', document.getElementById('profileNameInput').value.trim());
}

async function saveOwnProfile(e) {
  e.preventDefault();
  const ident = getCurrentIdentity();
  if (!ident.id) return;

  const newName = document.getElementById('profileNameInput').value.trim();
  const newRole = document.getElementById('profileRoleInput').value.trim() || 'Member';
  const rawAvatar = document.getElementById('profileAvatarData').value;
  const avatarCleared = rawAvatar === '__CLEARED__';
  const newAvatar = avatarCleared ? '' : rawAvatar;

  if (!newName) {
    return showToast(currentLang === 'en' ? 'Please enter your display name' : 'اكتب اسمك أولاً');
  }

  const saveBtn = document.getElementById('saveProfileBtn');
  if (saveBtn) saveBtn.disabled = true;

  try {
    // Persist profile override locally for instant UI sync
    saveProfileOverride(ident.id, {
      name: newName,
      role: newRole,
      avatar_url: newAvatar,
      avatar_cleared: avatarCleared
    });

    if (!isSignedInUser()) {
      localStorage.setItem('enjaz_username', newName);
      document.getElementById('userNameInput').value = newName;
    } else {
      // Persist custom profile metadata on the signed-in user's own Supabase account
      const { data: updated } = await db.auth.updateUser({
        data: {
          custom_name: newName,
          custom_role: newRole,
          custom_avatar_url: newAvatar
        }
      });
      if (updated && updated.user) {
        currentUser = updated.user;
      }
    }

    // Update ONLY this user's own rows in project_members
    await db
      .from('project_members')
      .update({
        name: newName,
        role: newRole,
        avatar_url: newAvatar
      })
      .eq('user_id', ident.id);

    if (activeProjectId) {
      await registerCurrentUserInProject(newRole);
    }

    renderAuthUI();
    await loadMembersOnly();
    closeEditProfileModal();
    showToast(t('profileSavedToast'));
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}

const userNameInput = document.getElementById('userNameInput');
userNameInput.value = localStorage.getItem('enjaz_username') || '';
let _nameDebounce = null;
userNameInput.addEventListener('input', (e) => {
  if (isSignedInUser()) return;
  const v = e.target.value.trim();
  localStorage.setItem('enjaz_username', v);
  const guestId = currentUser ? currentUser.id : localStorage.getItem('enjaz_guest_id');
  if (guestId) {
    const prev = getSavedProfileOverride(guestId);
    saveProfileOverride(guestId, { ...prev, name: v });
  }
  renderAuthUI();
  clearTimeout(_nameDebounce);
  _nameDebounce = setTimeout(() => registerCurrentUserInProject(), 800);
});
