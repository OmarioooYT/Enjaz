/**
 * Enjaz — AI chat assistant and task divider, powered by Puter.js.
 *
 * Copyright (C) 2026 Omariooo
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Enjaz, free software released under the GNU General
 * Public License v3.0 or later. See the LICENSE file for details.
 */

    const AI_STORAGE_KEY_CHATS = 'enjaz_ai_chats_v1';
    const AI_STORAGE_KEY_MODEL = 'enjaz_puter_model_v1';
    const AI_ALLOWED_MODELS = [
      'google/gemini-4-hydrogen',
      'google/gemini-4-neon',
      'google/gemini-4-carbon',
      'google/gemini-3.8-flash',
      'google/gemini-3.5-flash-lite',
      'claude-sonnet-5',
      'anthropic/claude-haiku-5-5',
      'gpt-5.4-nano',
      'openai/gpt-5.4',
      'openai/gpt-4o'
    ];
    const AI_FALLBACK_CHAIN = [
      'google/gemini-4-hydrogen',
      'gpt-5.4-nano',
      'claude-sonnet-5',
      'openai/gpt-4o',
      'google/gemini-3.8-flash'
    ];

    let aiDrawerOpen = false;
    let aiSelectedScope = 'project'; // 'project' or specific task.id
    let aiSending = false;
    let aiPendingImage = null; // { dataUrl, name }
    let aiChatGen = {}; // Tracks clear-chat generations per chat key to discard stale in-flight replies
    let aiModel = AI_ALLOWED_MODELS.includes(localStorage.getItem(AI_STORAGE_KEY_MODEL))
      ? localStorage.getItem(AI_STORAGE_KEY_MODEL)
      : 'google/gemini-4-hydrogen';
    let aiChats = (() => {
      try {
        const parsed = JSON.parse(localStorage.getItem(AI_STORAGE_KEY_CHATS) || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch {
        return {};
      }
    })();

    /**
     * Saves AI chat histories to localStorage, keeping the last 40 messages per
     * chat. If storage is full, saves a text-only copy without attached images.
     */
    function saveAiChatsToStorage() {
      try {
        Object.keys(aiChats).forEach((k) => {
          if (Array.isArray(aiChats[k]) && aiChats[k].length > 40) {
            aiChats[k] = aiChats[k].slice(-40);
          }
        });
        localStorage.setItem(AI_STORAGE_KEY_CHATS, JSON.stringify(aiChats));
      } catch {
        // If quota exceeded due to attached images, persist text-only copy as fallback
        try {
          const slim = {};
          Object.keys(aiChats).forEach((k) => {
            if (Array.isArray(aiChats[k])) {
              slim[k] = aiChats[k].slice(-30).map(({ image: _img, ...rest }) => rest);
            }
          });
          localStorage.setItem(AI_STORAGE_KEY_CHATS, JSON.stringify(slim));
        } catch {
          // Ignore storage quota errors
        }
      }
    }

    /**
     * Shows or hides the preview of the image attached to the next AI message.
     */
    function updateAiImagePreviewUI() {
      const wrap = document.getElementById('aiImagePreviewWrap');
      const imgEl = document.getElementById('aiImagePreviewImg');
      const nameEl = document.getElementById('aiImagePreviewName');
      if (!wrap || !imgEl || !nameEl) return;
      if (aiPendingImage && aiPendingImage.dataUrl) {
        imgEl.src = aiPendingImage.dataUrl;
        nameEl.textContent = aiPendingImage.name || (currentLang === 'en' ? 'Attached photo' : 'صورة مرفقة');
        wrap.classList.remove('hidden');
        wrap.classList.add('flex');
      } else {
        imgEl.src = '';
        nameEl.textContent = '';
        wrap.classList.add('hidden');
        wrap.classList.remove('flex');
      }
    }

    /**
     * Removes the image attached to the next AI message.
     */
    function clearAiPendingImage() {
      aiPendingImage = null;
      const input = document.getElementById('aiImageInput');
      if (input) input.value = '';
      updateAiImagePreviewUI();
    }

    /**
     * Validates an image (max 10MB), downsizes it to at most 1024px JPEG and
     * attaches it to the next AI message.
     *
     * @param {File} file
     */
    function processAiImageFile(file) {
      if (!file) return;
      if (!file.type || !file.type.startsWith('image/')) {
        showToast(currentLang === 'en' ? 'Please choose a valid image file' : 'يرجى اختيار ملف صورة صالح');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast(currentLang === 'en' ? 'Image is too large (max 10MB)' : 'حجم الصورة كبير جداً (الحد الأقصى 10MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            const scale = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          aiPendingImage = { dataUrl, name: file.name || 'image.jpg' };
          updateAiImagePreviewUI();
        };
        img.onerror = () => {
          showToast(currentLang === 'en' ? 'Could not read image' : 'تعذر قراءة الصورة');
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }

    /**
     * Handles an image chosen with the attach button.
     *
     * @param {Event} e
     */
    function handleAiImageSelect(e) {
      const file = e.target && e.target.files && e.target.files[0];
      processAiImageFile(file);
    }

    /**
     * Attaches an image pasted into the AI chat input.
     *
     * @param {ClipboardEvent} e
     */
    function handleAiInputPaste(e) {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processAiImageFile(file);
            break;
          }
        }
      }
    }

    /**
     * Storage key for the current chat: one history per project and scope
     * (whole project or a single task).
     *
     * @returns {string}
     */
    function getAiChatKey() {
      return `${activeProjectId || 'none'}::${aiSelectedScope || 'project'}`;
    }

    /**
     * The message history of the current chat (created if missing).
     *
     * @returns {object[]}
     */
    function getCurrentAiHistory() {
      const key = getAiChatKey();
      if (!Array.isArray(aiChats[key])) aiChats[key] = [];
      return aiChats[key];
    }

    const AI_MODEL_SHORT_LABELS = {
      'google/gemini-4-hydrogen': 'Gemini 4 Hydrogen',
      'google/gemini-4-neon': 'Gemini 4 Neon',
      'google/gemini-4-carbon': 'Gemini 4 Carbon',
      'google/gemini-3.8-flash': 'Gemini 3.8 Flash',
      'google/gemini-3.5-flash-lite': 'Gemini 3.5 Lite',
      'claude-sonnet-5': 'Claude Sonnet 5',
      'anthropic/claude-haiku-5-5': 'Claude Haiku 5.5',
      'gpt-5.4-nano': 'GPT-5.4 Nano',
      'openai/gpt-5.4': 'GPT-5.4',
      'openai/gpt-4o': 'GPT-4o'
    };

    const AI_SVG_ICONS = {
      sparkle: '<svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c.45 3.65 1.85 5.05 5.5 5.5-3.65.45-5.05 1.85-5.5 5.5-.45-3.65-1.85-5.05-5.5-5.5 3.65-.45 5.05-1.85 5.5-5.5Zm6.5 11.5c.25 1.9 1 2.65 2.9 2.9-1.9.25-2.65 1-2.9 2.9-.25-1.9-1-2.65-2.9-2.9 1.9-.25 2.65-1 2.9-2.9Z"/></svg>',
      split: '<svg class="w-3.5 h-3.5 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
      chart: '<svg class="w-3.5 h-3.5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18M7 14l4-4 3 3 5-6"/></svg>',
      users: '<svg class="w-3.5 h-3.5 shrink-0 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      sprint: '<svg class="w-3.5 h-3.5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
      shield: '<svg class="w-3.5 h-3.5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
      edit: '<svg class="w-3.5 h-3.5 shrink-0 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path stroke-linecap="round" stroke-linejoin="round" d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      copy: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
      check: '<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6 9 17l-5-5"/></svg>'
    };

    /**
     * Shows the selected model in the drawer header and the composer hint.
     */
    function updateAiHeaderBadge() {
      const badge = document.getElementById('aiHeaderModelBadge');
      if (badge) badge.textContent = AI_MODEL_SHORT_LABELS[aiModel] || aiModel;
      const hint = document.getElementById('aiComposerHint');
      if (hint) {
        hint.textContent = currentLang === 'en'
          ? 'Enter to send · Shift+Enter for new line'
          : 'Enter للإرسال · Shift+Enter لسطر جديد';
      }
    }

    /**
     * Opens the AI drawer about the whole project or one task.
     *
     * @param {string} [scope='project'] 'project' or a task ID.
     */
    function openAiChat(scope = 'project') {
      if (!activeProjectId) {
        return showToast(currentLang === 'en' ? 'Create or open a project first' : 'أنشئ أو افتح مشروعاً أولاً');
      }
      aiSelectedScope = scope || 'project';
      aiDrawerOpen = true;

      const drawer = document.getElementById('aiDrawer');
      const backdrop = document.getElementById('aiDrawerBackdrop');
      const headerBtn = document.getElementById('aiHeaderBtn');
      backdrop.classList.remove('hidden');
      drawer.classList.remove('ai-drawer-closed');
      if (headerBtn) headerBtn.setAttribute('aria-expanded', 'true');

      const modelSel = document.getElementById('aiModelSelect');
      if (modelSel) modelSel.value = aiModel;
      updateAiHeaderBadge();

      renderAiDrawerUI();
      setTimeout(() => {
        const input = document.getElementById('aiChatInput');
        if (input) input.focus();
      }, 120);
    }

    /**
     * Opens the AI drawer about the task open in the task modal.
     */
    function openAiChatForEditingTask() {
      const taskId = document.getElementById('editTaskId').value;
      closeTaskModal();
      openAiChat(taskId || 'project');
    }

    /**
     * Closes the AI drawer.
     */
    function closeAiChat() {
      aiDrawerOpen = false;
      const drawer = document.getElementById('aiDrawer');
      const backdrop = document.getElementById('aiDrawerBackdrop');
      const headerBtn = document.getElementById('aiHeaderBtn');
      if (drawer) drawer.classList.add('ai-drawer-closed');
      if (backdrop) backdrop.classList.add('hidden');
      if (headerBtn) headerBtn.setAttribute('aria-expanded', 'false');
    }

    /**
     * Saves the chosen AI model.
     *
     * @param {string} val Model ID.
     */
    function onAiModelChange(val) {
      if (!AI_ALLOWED_MODELS.includes(val)) return;
      aiModel = val;
      localStorage.setItem(AI_STORAGE_KEY_MODEL, aiModel);
      updateAiHeaderBadge();
    }

    /**
     * Switches the chat between the whole project and a single task.
     *
     * @param {string} val
     */
    function onAiScopeChange(val) {
      aiSelectedScope = val || 'project';
      renderAiDrawerUI();
    }

    /**
     * Clears the current chat history (replies still in flight are discarded).
     */
    function clearCurrentAiChat() {
      const key = getAiChatKey();
      aiChatGen[key] = (aiChatGen[key] || 0) + 1;
      aiChats[key] = [];
      saveAiChatsToStorage();
      renderAiMessages();
      showToast(t('aiChatClearedToast'));
    }

    /**
     * Renders the whole AI drawer: model, context, quick actions and messages.
     */
    function renderAiDrawerUI() {
      updateAiHeaderBadge();
      renderAiContextOptions();
      renderAiQuickActions();
      renderAiMessages();
    }

    /**
     * Quick-action prompts for the current scope (project or task) and
     * language.
     *
     * @returns {object[]}
     */
    function getAiQuickActionsList() {
      const isEn = currentLang === 'en';
      return aiSelectedScope === 'project'
        ? [
          {
            icon: AI_SVG_ICONS.split,
            label: t('aiQuickGenProjectTasks'),
            prompt: isEn
              ? 'Break down this project into clear, actionable tasks we are missing or should execute next, and include them as structured enjaz-tasks so I can add them directly to the board.'
              : 'قسّم هذا المشروع إلى مهام عملية واضحة ومرتبة نحتاج تنفيذها أو تنقصنا حالياً، وأرفقها بصيغة enjaz-tasks حتى أضيفها مباشرة للوحة.'
          },
          {
            icon: AI_SVG_ICONS.chart,
            label: t('aiQuickProjectHealth'),
            prompt: isEn
              ? 'Analyze our current project health, highlight overdue or high-priority bottlenecks, and recommend the top 3 priorities right now.'
              : 'حلّل وضع المشروع الحالي، وحدد المهام المتأخرة أو العاجلة وأهم 3 أولويات يجب التركيز عليها الآن.'
          },
          {
            icon: AI_SVG_ICONS.users,
            label: t('aiQuickBalanceTeam'),
            prompt: isEn
              ? 'Review how tasks are distributed across team members and suggest a fairer, more efficient workload balance.'
              : 'راجع توزيع المهام الحالي على أعضاء الفريق واقترح توزيعاً أفضل وأكثر توازناً.'
          },
          {
            icon: AI_SVG_ICONS.sprint,
            label: t('aiQuickNextSprint'),
            prompt: isEn
              ? 'Create a focused next-sprint action plan based on the current To Do and In Progress tasks.'
              : 'ضع خطة عمل مركزة للمرحلة (Sprint) القادمة بناءً على المهام الحالية.'
          }
        ]
        : [
          {
            icon: AI_SVG_ICONS.split,
            label: t('aiQuickDivideTask'),
            prompt: isEn
              ? 'Divide this task into 3 to 6 concrete, actionable subtasks with priorities and notes, and include them in an enjaz-tasks block so I can add them to the board in one click.'
              : 'قسّم هذه المهمة إلى 3 إلى 6 مهام فرعية عملية وواضحة مع تحديد الأولوية والملاحظات، وأرفقها داخل بلوك enjaz-tasks حتى أضيفها للوحة بضغطة واحدة.'
          },
          {
            icon: AI_SVG_ICONS.sprint,
            label: t('aiQuickStepPlan'),
            prompt: isEn
              ? 'Give me a clear step-by-step execution checklist to complete this task efficiently.'
              : 'أعطني خطة تنفيذ عملية خطوة بخطوة لإنجاز هذه المهمة بأفضل جودة وأسرع وقت.'
          },
          {
            icon: AI_SVG_ICONS.shield,
            label: t('aiQuickRisks'),
            prompt: isEn
              ? 'What are the main risks, edge cases, or blockers for this task, and how should we prevent them?'
              : 'ما هي أبرز المخاطر أو العوائق المحتملة في هذه المهمة وكيف نتجنبها؟'
          },
          {
            icon: AI_SVG_ICONS.edit,
            label: t('aiQuickImproveNotes'),
            prompt: isEn
              ? 'Rewrite and improve this task description with clear acceptance criteria and definition of done.'
              : 'أعد صياغة وتحسين وصف هذه المهمة مع معايير قبول واضحة (Acceptance Criteria).'
          }
        ];
    }

    /**
     * Renders the project/task context selector and the context summary.
     */
    function renderAiContextOptions() {
      const sel = document.getElementById('aiContextSelect');
      const summary = document.getElementById('aiContextSummary');
      if (!sel || !summary) return;

      const proj = projects.find(p => p.id === activeProjectId);
      const projTasks = tasks.filter(x => x.project_id === activeProjectId);

      // If selected task no longer exists in this project, fall back to project scope
      if (aiSelectedScope !== 'project' && !projTasks.some(x => x.id === aiSelectedScope)) {
        aiSelectedScope = 'project';
      }

      const projName = proj ? proj.name : t('workspace');
      let html = `<option value="project" class="bg-[#0E0E13]">${escapeHtml(t('aiScopeProjectPrefix'))} ${escapeHtml(projName)}</option>`;

      if (projTasks.length > 0) {
        html += `<optgroup label="${escapeHtml(t('aiScopeTaskGroup'))}" class="bg-[#0E0E13] text-zinc-400">`;
        projTasks.forEach(tk => {
          const st = getTaskStatus(tk);
          const dot = st === 'done' ? '✓' : st === 'in_progress' ? '▶' : '○';
          const shortTitle = (tk.title || '').length > 48 ? tk.title.slice(0, 48) + '…' : tk.title;
          html += `<option value="${escapeHtml(tk.id)}" class="bg-[#0E0E13] text-zinc-100">${dot} ${escapeHtml(shortTitle)}</option>`;
        });
        html += `</optgroup>`;
      }
      sel.innerHTML = html;
      sel.value = aiSelectedScope;

      if (aiSelectedScope === 'project') {
        const doneCount = projTasks.filter(x => getTaskStatus(x) === 'done').length;
        const projMembers = members.filter(m => m.project_id === activeProjectId);
        summary.innerHTML = `
          <span class="flex items-center gap-2 min-w-0">
            <span class="w-2 h-2 rounded-full bg-brand shrink-0"></span>
            <span class="truncate"><strong class="text-zinc-100">${escapeHtml(t('aiContextProjectSummary'))}:</strong> ${escapeHtml(projName)}</span>
          </span>
          <span class="font-mono tabular-nums text-[10px] px-2 py-0.5 rounded-lg bg-brand/15 text-orange-200 border border-brand/25 shrink-0 inline-flex items-center gap-1.5">
            <span>${doneCount}/${projTasks.length}</span>
            <span class="opacity-40">·</span>
            <span>${projMembers.length}</span>
          </span>
        `;
      } else {
        const tk = projTasks.find(x => x.id === aiSelectedScope);
        if (tk) {
          const st = getTaskStatus(tk);
          const stText = st === 'done' ? t('statusDone') : st === 'in_progress' ? t('statusInProgress') : t('statusTodo');
          const prText = tk.priority === 'high' ? t('prioHigh') : tk.priority === 'low' ? t('prioLow') : t('prioMed');
          summary.innerHTML = `
            <span class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span class="truncate"><strong class="text-orange-200">${escapeHtml(t('aiContextTaskSummary'))}:</strong> ${escapeHtml(tk.title)}</span>
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.06] text-zinc-200 border border-white/10 shrink-0">${escapeHtml(stText)} · ${escapeHtml(prText)}</span>
          `;
        }
      }
    }

    /**
     * Renders the quick-action chips above the composer.
     */
    function renderAiQuickActions() {
      const wrap = document.getElementById('aiQuickActions');
      if (!wrap) return;
      const actions = getAiQuickActionsList();

      wrap.innerHTML = '';
      actions.forEach(act => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-brand/15 border border-white/[0.08] hover:border-brand/40 text-[11px] font-semibold text-zinc-200 hover:text-orange-100 transition';
        btn.innerHTML = `${act.icon}<span>${escapeHtml(act.label)}</span>`;
        btn.onclick = () => sendAiMessage(act.prompt);
        wrap.appendChild(btn);
      });
    }

    /**
     * Builds the system prompt with the project's (or task's) details, members
     * and tasks, plus the format the AI must use to suggest tasks.
     *
     * @param {string} scope 'project' or a task ID.
     * @returns {string}
     */
    function buildAiSystemPrompt(scope) {
      const proj = projects.find(p => p.id === activeProjectId);
      const projTasks = tasks.filter(x => x.project_id === activeProjectId);
      const projMembers = members.filter(m => m.project_id === activeProjectId);

      const memberList = projMembers.length
        ? projMembers.map(m => `- ${m.name} (${m.role || 'Member'})`).join('\n')
        : 'No members listed yet.';

      const formatTaskLine = (tk) => {
        const st = getTaskStatus(tk);
        return `- [${st}] "${tk.title}" | priority: ${tk.priority || 'medium'} | assignee: ${tk.assignee || 'Unassigned'} | tag: ${tk.category || 'None'} | due: ${tk.due_date || 'None'}${tk.notes ? ` | notes: ${tk.notes}` : ''}`;
      };

      const tasksSummary = projTasks.length
        ? projTasks.slice(0, 60).map(formatTaskLine).join('\n')
        : 'No tasks in this project yet.';

      let focusSection = '';
      if (scope && scope !== 'project') {
        const focusedTask = projTasks.find(x => x.id === scope);
        if (focusedTask) {
          focusSection = `
=== CURRENT FOCUSED TASK ===
Title: ${focusedTask.title}
Status: ${getTaskStatus(focusedTask)}
Priority: ${focusedTask.priority || 'medium'}
Assignee: ${focusedTask.assignee || 'Unassigned'}
Category/Tag: ${focusedTask.category || 'None'}
Due Date: ${focusedTask.due_date || 'None'}
Notes: ${focusedTask.notes || 'No notes provided.'}
============================
Focus your answers primarily on helping the user complete, refine, troubleshoot, or divide THIS task while keeping the overall project context in mind.
`;
        }
      } else {
        focusSection = `
=== CURRENT FOCUS: OVERALL PROJECT ===
Help the user plan, organize, prioritize, divide work into tasks, resolve bottlenecks, and guide the team across the entire project.
`;
      }

      const defaultLangName = currentLang === 'en' ? 'English' : 'Arabic';

      return `You are Enjaz AI, an expert project management assistant and task divider built into the Enjaz team workspace app.
Respond concisely, practically, and clearly in the language the user writes in (default to ${defaultLangName} if unclear).

=== PROJECT CONTEXT ===
Project Name: ${proj ? proj.name : 'Untitled Project'}
Project Status: ${proj ? getProjectStatus(proj) : 'in_progress'}
Project Description: ${proj && proj.description ? proj.description : 'No description provided.'}
Team Members (${projMembers.length}):
${memberList}

All Project Tasks (${projTasks.length}):
${tasksSummary}
${focusSection}
=== TASK DIVIDER STRUCTURED OUTPUT RULE ===
Whenever the user asks you to divide a task into subtasks, break down work, or generate/suggest new tasks for the project, ALSO include a fenced code block tagged \`enjaz-tasks\` containing a valid JSON array of task objects so the UI can render one-click "Add to Board" cards. Example:
\`\`\`enjaz-tasks
[
  {
    "title": "Short actionable task title",
    "notes": "Brief concrete steps or acceptance criteria",
    "priority": "high",
    "category": "Frontend",
    "assignee": ""
  }
]
\`\`\`
Rules for \`enjaz-tasks\`:
- "priority" must be one of "high", "medium", or "low".
- "assignee" should be an exact team member name from the list above only if appropriate, otherwise "".
- Keep JSON strictly valid (no trailing commas, no comments).
- Only include the \`enjaz-tasks\` block when suggesting/dividing tasks.`;
    }

    /**
     * Splits an AI reply into markdown and suggested-task blocks
     * (```enjaz-tasks JSON```), validating each task.
     *
     * @param {string} rawText
     * @returns {object[]}
     */
    function parseAiMessageSegments(rawText) {
      const segments = [];
      const regex = /```enjaz-tasks\s*([\s\S]*?)```/gi;
      let lastIndex = 0;
      let match;
      let blockIdx = 0;

      while ((match = regex.exec(rawText)) !== null) {
        if (match.index > lastIndex) {
          segments.push({ type: 'markdown', content: rawText.slice(lastIndex, match.index) });
        }
        try {
          const parsed = JSON.parse(match[1].trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleanTasks = parsed
              .filter(item => item && typeof item.title === 'string' && item.title.trim())
              .map(item => ({
                title: String(item.title).trim(),
                notes: item.notes ? String(item.notes).trim() : '',
                priority: ['high', 'medium', 'low'].includes(String(item.priority || '').toLowerCase())
                  ? String(item.priority).toLowerCase()
                  : 'medium',
                category: item.category ? String(item.category).trim() : '',
                assignee: item.assignee ? String(item.assignee).trim() : ''
              }));
            if (cleanTasks.length > 0) {
              segments.push({ type: 'tasks', blockIdx: blockIdx++, tasks: cleanTasks });
            } else {
              segments.push({ type: 'markdown', content: match[0] });
            }
          } else {
            segments.push({ type: 'markdown', content: match[0] });
          }
        } catch {
          segments.push({ type: 'markdown', content: match[0] });
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < rawText.length) {
        segments.push({ type: 'markdown', content: rawText.slice(lastIndex) });
      }
      return segments;
    }

    /**
     * Renders the small, safe subset of Markdown used in AI replies (headings,
     * lists, bold, italics, code) to escaped HTML.
     *
     * @param {string} md
     * @returns {string}
     */
    function renderAiMarkdown(md) {
      if (!md || !md.trim()) return '';
      const codeBlocks = [];
      let text = md.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (_, _lang, code) => {
        const idx = codeBlocks.length;
        codeBlocks.push(`<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`);
        return `@@CODEBLOCK_${idx}@@`;
      });

      const lines = text.split('\n');
      let out = [];
      let inUl = false;
      let inOl = false;

      const closeLists = () => {
        if (inUl) { out.push('</ul>'); inUl = false; }
        if (inOl) { out.push('</ol>'); inOl = false; }
      };

      const formatInline = (str) => {
        const inlineCodes = [];
        let s = escapeHtml(str).replace(/`([^`]+)`/g, (_, code) => {
          const idx = inlineCodes.length;
          inlineCodes.push(`<code>${code}</code>`);
          return `@@INLINECODE_${idx}@@`;
        });
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        inlineCodes.forEach((codeHtml, idx) => {
          s = s.replace(`@@INLINECODE_${idx}@@`, codeHtml);
        });
        return s;
      };

      lines.forEach(rawLine => {
        const line = rawLine.trim();
        if (!line) {
          closeLists();
          return;
        }
        if (/^@@CODEBLOCK_\d+@@$/.test(line)) {
          closeLists();
          out.push(line);
          return;
        }
        const hMatch = line.match(/^#{1,4}\s+(.+)/);
        if (hMatch) {
          closeLists();
          out.push(`<h4>${formatInline(hMatch[1])}</h4>`);
          return;
        }
        const ulMatch = line.match(/^[-*•]\s+(.+)/);
        if (ulMatch) {
          if (inOl) { out.push('</ol>'); inOl = false; }
          if (!inUl) { out.push('<ul>'); inUl = true; }
          out.push(`<li>${formatInline(ulMatch[1])}</li>`);
          return;
        }
        const olMatch = line.match(/^\d+[.)]\s+(.+)/);
        if (olMatch) {
          if (inUl) { out.push('</ul>'); inUl = false; }
          if (!inOl) { out.push('<ol>'); inOl = true; }
          out.push(`<li>${formatInline(olMatch[1])}</li>`);
          return;
        }
        closeLists();
        out.push(`<p>${formatInline(line)}</p>`);
      });
      closeLists();

      let html = out.join('');
      codeBlocks.forEach((block, idx) => {
        html = html.replace(`@@CODEBLOCK_${idx}@@`, block);
      });
      return html;
    }

    /**
     * Copies an AI reply to the clipboard.
     *
     * @param {number} msgIdx
     * @param {HTMLElement} btnEl The copy button (shows a check mark).
     */
    function copyAiMessage(msgIdx, btnEl) {
      const history = getCurrentAiHistory();
      const msg = history[msgIdx];
      if (!msg || !msg.text) return;
      navigator.clipboard.writeText(msg.text).then(() => {
        if (btnEl) {
          btnEl.innerHTML = AI_SVG_ICONS.check;
          setTimeout(() => { btnEl.innerHTML = AI_SVG_ICONS.copy; }, 1400);
        }
        showToast(currentLang === 'en' ? 'Response copied' : 'تم نسخ الرد');
      }).catch(() => { });
    }

    /**
     * Renders the chat messages, including suggested-task cards with add
     * buttons.
     */
    function renderAiMessages() {
      const container = document.getElementById('aiMessages');
      if (!container) return;

      const history = getCurrentAiHistory();
      container.innerHTML = '';

      if (history.length === 0) {
        const welcomeDesc = aiSelectedScope === 'project' ? t('aiWelcomeProjectDesc') : t('aiWelcomeTaskDesc');
        const starters = getAiQuickActionsList();
        const emptyWrap = document.createElement('div');
        emptyWrap.className = 'space-y-4 animate-fade-up pt-2';
        emptyWrap.innerHTML = `
          <div class="card-surface border border-white/[0.08] rounded-2xl p-4 space-y-2.5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-brand/25 to-indigo-500/20 border border-brand/35 flex items-center justify-center text-brand shrink-0">
                ${AI_SVG_ICONS.sparkle}
              </div>
              <div class="min-w-0">
                <h3 class="font-display font-extrabold text-xs text-white">${escapeHtml(t('aiWelcomeTitle'))}</h3>
                <span class="text-[10px] font-mono text-zinc-400">${escapeHtml(AI_MODEL_SHORT_LABELS[aiModel] || aiModel)}</span>
              </div>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed">${escapeHtml(welcomeDesc)}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="aiStarterGrid"></div>
        `;
        container.appendChild(emptyWrap);

        const starterGrid = emptyWrap.querySelector('#aiStarterGrid');
        if (starterGrid) {
          starters.forEach(act => {
            const cardBtn = document.createElement('button');
            cardBtn.type = 'button';
            cardBtn.className = 'ai-starter-card rounded-2xl p-3 text-start flex flex-col gap-2';
            cardBtn.innerHTML = `
              <div class="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                ${act.icon}
              </div>
              <span class="text-xs font-bold text-zinc-100 leading-snug">${escapeHtml(act.label)}</span>
            `;
            cardBtn.onclick = () => sendAiMessage(act.prompt);
            starterGrid.appendChild(cardBtn);
          });
        }
      } else {
        history.forEach((msg, msgIdx) => {
          const isUser = msg.role === 'user';
          const wrap = document.createElement('div');
          wrap.className = `flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-up`;

          if (isUser) {
            const imgHtml = msg.image
              ? `<img src="${escapeHtml(msg.image)}" alt="Uploaded photo" class="max-h-48 w-auto rounded-xl border border-white/15 mb-2 object-cover" />`
              : '';
            wrap.innerHTML = `
              <div class="max-w-[86%] rounded-2xl rounded-ee-md bg-gradient-to-br from-brand/22 to-brand/12 border border-brand/35 px-3.5 py-2.5 text-[13px] text-zinc-100 leading-relaxed whitespace-pre-wrap break-words shadow-[0_6px_18px_-10px_rgba(252,106,13,0.45)]">${imgHtml}${escapeHtml(msg.text)}</div>
            `;
          } else {
            const segments = parseAiMessageSegments(msg.text || '');
            const row = document.createElement('div');
            row.className = 'flex items-start gap-2.5 max-w-[96%] w-full';

            const avatar = document.createElement('div');
            avatar.className = 'w-7 h-7 rounded-xl bg-gradient-to-br from-brand/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-brand shrink-0 mt-0.5';
            avatar.innerHTML = AI_SVG_ICONS.sparkle;
            row.appendChild(avatar);

            const bubble = document.createElement('div');
            bubble.className = 'min-w-0 flex-1 space-y-2.5';

            segments.forEach(seg => {
              if (seg.type === 'markdown' && seg.content.trim()) {
                const mdEl = document.createElement('div');
                mdEl.className = `ai-prose rounded-2xl rounded-es-md px-3.5 py-2.5 text-[13px] leading-relaxed break-words border ${msg.isError
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-100'
                  : 'bg-[#13131D]/95 border-white/[0.08] text-zinc-200'
                  }`;
                mdEl.innerHTML = renderAiMarkdown(seg.content);
                bubble.appendChild(mdEl);
              } else if (seg.type === 'tasks') {
                const addedMap = (msg.addedTasks && msg.addedTasks[seg.blockIdx]) || {};
                const card = document.createElement('div');
                card.className = 'rounded-2xl bg-[#11111A] border border-brand/35 overflow-hidden shadow-xl';

                const prioBadge = {
                  high: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
                  medium: 'bg-brand/15 text-orange-300 border-brand/30',
                  low: 'bg-white/[0.06] text-zinc-300 border-white/10'
                };
                const prioText = { high: t('prioHigh'), medium: t('prioMed'), low: t('prioLow') };

                const rowsHtml = seg.tasks.map((tk, tIdx) => {
                  const isAdded = Boolean(addedMap[tIdx]);
                  return `
                    <div class="p-3 flex items-start gap-2.5 border-t border-white/[0.06] hover:bg-white/[0.02] transition ${isAdded ? 'opacity-60' : ''}">
                      <input type="checkbox" data-ai-task-chk="${msgIdx}-${seg.blockIdx}" data-task-idx="${tIdx}"
                        ${isAdded ? 'disabled' : 'checked'}
                        class="mt-1 accent-[#FC6A0D] w-3.5 h-3.5 rounded cursor-pointer shrink-0" />
                      <div class="min-w-0 flex-1 space-y-1">
                        <p class="text-xs font-bold text-zinc-100 leading-snug">${escapeHtml(tk.title)}</p>
                        ${tk.notes ? `<p class="text-[11px] text-zinc-400 leading-relaxed">${escapeHtml(tk.notes)}</p>` : ''}
                        <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${prioBadge[tk.priority] || prioBadge.medium}">${escapeHtml(prioText[tk.priority] || prioText.medium)}</span>
                          ${tk.category ? `<span class="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.05] text-zinc-300 border border-white/10">${escapeHtml(tk.category)}</span>` : ''}
                          ${tk.assignee ? `<span class="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-200 border border-indigo-400/25">${escapeHtml(tk.assignee)}</span>` : ''}
                        </div>
                      </div>
                      <button type="button" ${isAdded ? 'disabled' : `onclick="addAiSuggestedTasks(${msgIdx}, ${seg.blockIdx}, ${tIdx})"`}
                        class="shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${isAdded
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-brand/15 hover:bg-brand text-brand hover:text-white border border-brand/35'
                    }">
                        ${isAdded ? escapeHtml(t('aiAddedBadge')) : `+ ${escapeHtml(t('aiAddSingleTask'))}`}
                      </button>
                    </div>
                  `;
                }).join('');

                card.innerHTML = `
                  <div class="px-3.5 py-2.5 bg-gradient-to-r from-brand/15 via-amber-500/10 to-indigo-500/10 flex items-center justify-between gap-2">
                    <span class="text-[11px] font-bold text-orange-100 flex items-center gap-1.5">
                      ${AI_SVG_ICONS.sparkle}
                      <span>${escapeHtml(t('aiSuggestedTasksTitle'))} (${seg.tasks.length})</span>
                    </span>
                    <button type="button" onclick="addAiSuggestedTasks(${msgIdx}, ${seg.blockIdx})"
                      class="btn-primary-gradient px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shrink-0">
                      + ${escapeHtml(t('aiAddSelectedTasks'))}
                    </button>
                  </div>
                  <div>${rowsHtml}</div>
                `;
                bubble.appendChild(card);
              }
            });

            const metaRow = document.createElement('div');
            metaRow.className = 'flex items-center justify-between gap-2 px-1';
            const modelLabel = msg.modelUsed ? (AI_MODEL_SHORT_LABELS[msg.modelUsed] || msg.modelUsed) : '';
            metaRow.innerHTML = `
              <span class="text-[10px] font-mono text-zinc-500">${escapeHtml(modelLabel)}</span>
              <button type="button" aria-label="Copy response" title="${currentLang === 'en' ? 'Copy' : 'نسخ'}"
                class="w-7 h-7 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-200 flex items-center justify-center transition">
                ${AI_SVG_ICONS.copy}
              </button>
            `;
            const copyBtn = metaRow.querySelector('button');
            if (copyBtn) copyBtn.onclick = () => copyAiMessage(msgIdx, copyBtn);
            bubble.appendChild(metaRow);

            row.appendChild(bubble);
            wrap.appendChild(row);
          }

          container.appendChild(wrap);
        });
      }

      if (aiSending) {
        const typing = document.createElement('div');
        typing.className = 'flex items-start gap-2.5 animate-fade-up';
        typing.setAttribute('aria-busy', 'true');
        typing.innerHTML = `
          <div class="w-7 h-7 rounded-xl bg-gradient-to-br from-brand/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-brand shrink-0">
            ${AI_SVG_ICONS.sparkle}
          </div>
          <div class="rounded-2xl rounded-es-md bg-[#13131D]/95 border border-white/[0.08] px-3.5 py-3 flex items-center gap-2.5">
            <div class="flex items-center gap-1.5">
              <span class="ai-typing-dot"></span>
              <span class="ai-typing-dot"></span>
              <span class="ai-typing-dot"></span>
            </div>
            <span class="text-[11px] font-medium text-zinc-400">${currentLang === 'en' ? 'Thinking...' : 'جاري التفكير...'}</span>
          </div>
        `;
        container.appendChild(typing);
      }

      container.scrollTop = container.scrollHeight;
    }

    /**
     * Adds AI-suggested tasks to the project: one task, or every task in the
     * block not added yet.
     *
     * @param {number} msgIdx
     * @param {number} blockIdx
     * @param {number|null} [singleTaskIdx=null]
     */
    async function addAiSuggestedTasks(msgIdx, blockIdx, singleTaskIdx = null) {
      if (!activeProjectId) return;
      const history = getCurrentAiHistory();
      const msg = history[msgIdx];
      if (!msg) return;

      const segments = parseAiMessageSegments(msg.text || '');
      const seg = segments.find(s => s.type === 'tasks' && s.blockIdx === blockIdx);
      if (!seg) return;

      let indicesToAdd = [];
      if (singleTaskIdx !== null) {
        indicesToAdd = [singleTaskIdx];
      } else {
        const checks = document.querySelectorAll(`input[data-ai-task-chk="${msgIdx}-${blockIdx}"]`);
        checks.forEach(chk => {
          if (chk.checked && !chk.disabled) {
            indicesToAdd.push(Number(chk.getAttribute('data-task-idx')));
          }
        });
      }

      if (indicesToAdd.length === 0) return;

      const user = getCurrentIdentity().name || 'عضو';
      if (!msg.addedTasks) msg.addedTasks = {};
      if (!msg.addedTasks[blockIdx]) msg.addedTasks[blockIdx] = {};

      const baseTs = Date.now();
      const pendingIndices = [];
      const batch = [];

      for (let i = 0; i < indicesToAdd.length; i++) {
        const tIdx = indicesToAdd[i];
        const tk = seg.tasks[tIdx];
        if (!tk || msg.addedTasks[blockIdx][tIdx]) continue;
        pendingIndices.push(tIdx);
        batch.push({
          id: 'TSK-' + (baseTs + i) + '-' + Math.random().toString(36).slice(2, 5),
          project_id: activeProjectId,
          title: tk.title,
          notes: tk.notes || '',
          status: 'todo',
          priority: tk.priority || 'medium',
          assignee: tk.assignee || '',
          category: tk.category || '',
          due_date: null,
          done: false,
          completed_by: '',
          completed_at: null,
          created_by: user,
          created_at: baseTs + i
        });
      }

      if (batch.length === 0) return;

      let { error: insertErr } = await db.from('tasks').insert(batch);
      if (insertErr) {
        const legacyBatch = batch.map(({ notes: _n, status: _s, due_date: _d, ...rest }) => rest);
        ({ error: insertErr } = await db.from('tasks').insert(legacyBatch));
      }

      if (insertErr) {
        showToast((currentLang === 'en' ? 'Failed to add tasks: ' : 'تعذر إضافة المهام: ') + (insertErr.message || 'Database error'));
        return;
      }

      pendingIndices.forEach((tIdx) => { msg.addedTasks[blockIdx][tIdx] = true; });
      saveAiChatsToStorage();
      renderAiMessages();
      showToast(`${t('aiTasksAddedToast')} (${batch.length})`);
      loadAllData();
    }

    /**
     * Grows the chat input with its content.
     *
     * @param {HTMLTextAreaElement} el
     */
    function autoResizeAiInput(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 112) + 'px';
    }

    /**
     * Enter sends the message; Shift+Enter adds a line.
     *
     * @param {KeyboardEvent} e
     */
    function handleAiInputKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage();
      }
    }

    /**
     * Disables the composer and shows a spinner while waiting for a reply.
     *
     * @param {boolean} sending
     */
    function setAiSendingState(sending) {
      aiSending = sending;
      const btn = document.getElementById('aiSendBtn');
      const sendIcon = document.getElementById('aiSendIcon');
      const spinIcon = document.getElementById('aiSpinnerIcon');
      if (btn) btn.disabled = sending;
      if (sendIcon) sendIcon.classList.toggle('hidden', sending);
      if (spinIcon) spinIcon.classList.toggle('hidden', !sending);
    }

    /**
     * Extracts plain text from the different response shapes Puter AI returns.
     *
     * @param {*} resp
     * @returns {string}
     */
    function extractPuterReplyText(resp) {
      if (!resp) return '';
      if (typeof resp === 'string') return resp.trim();
      const content = resp.message ? resp.message.content : (resp.content ?? resp.text ?? '');
      if (typeof content === 'string') return content.trim();
      if (Array.isArray(content)) {
        return content
          .map(part => (typeof part === 'string' ? part : (part && typeof part.text === 'string' ? part.text : '')))
          .join('')
          .trim();
      }
      return '';
    }

    /**
     * Sends a message (and optional image) to Puter AI with project context,
     * trying fallback models if the chosen one fails.
     *
     * @param {string|null} [presetText=null] Text from a quick action;
     *   otherwise the input is used.
     */
    async function sendAiMessage(presetText = null) {
      if (aiSending) return;
      const input = document.getElementById('aiChatInput');
      const attachedImage = presetText === null && aiPendingImage ? aiPendingImage.dataUrl : null;
      let userText = (presetText !== null ? presetText : (input ? input.value : '')).trim();
      if (!userText && !attachedImage) return;
      if (!userText && attachedImage) {
        userText = currentLang === 'en'
          ? 'Analyze this image and suggest any relevant tasks for the project.'
          : 'حلّل هذه الصورة واقترح أي مهام مناسبة للمشروع.';
      }

      if (input && presetText === null) {
        input.value = '';
        input.style.height = 'auto';
      }
      if (attachedImage) {
        clearAiPendingImage();
      }

      const chatKey = getAiChatKey();
      const requestGen = aiChatGen[chatKey] || 0;
      const history = getCurrentAiHistory();
      const userEntry = { role: 'user', text: userText, ts: Date.now() };
      if (attachedImage) userEntry.image = attachedImage;
      history.push(userEntry);
      saveAiChatsToStorage();

      setAiSendingState(true);
      renderAiMessages();

      try {
        if (!window.puter || !window.puter.ai || typeof window.puter.ai.chat !== 'function') {
          throw new Error(
            currentLang === 'en'
              ? 'Puter.js AI SDK failed to load. Check your internet connection and refresh.'
              : 'تعذر تحميل مكتبة Puter.js AI. تحقق من الاتصال بالإنترنت وأعد تحميل الصفحة.'
          );
        }

        const turns = history
          .filter(m => !m.isError && ((typeof m.text === 'string' && m.text.trim()) || m.image))
          .slice(-20)
          .map(m => {
            if (m.role === 'user' && m.image) {
              return {
                role: 'user',
                content: [
                  { type: 'text', text: m.text || 'Analyze this image.' },
                  { type: 'image_url', image_url: { url: m.image } }
                ]
              };
            }
            return {
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.text
            };
          });

        while (turns.length > 0 && turns[0].role !== 'user') {
          turns.shift();
        }

        const messages = [
          { role: 'system', content: buildAiSystemPrompt(aiSelectedScope) },
          ...turns
        ];

        const modelsToTry = [
          aiModel,
          ...AI_FALLBACK_CHAIN.filter(m => m !== aiModel)
        ];

        let replyText = '';
        let modelUsed = aiModel;
        let lastErr = null;

        for (const candidateModel of modelsToTry) {
          try {
            const resp = await window.puter.ai.chat(messages, { model: candidateModel, normalize: true });
            const text = extractPuterReplyText(resp);
            if (!text) {
              throw new Error(currentLang === 'en' ? 'Empty response from Puter AI.' : 'تم استلام رد فارغ من Puter AI.');
            }
            replyText = text;
            modelUsed = candidateModel;
            lastErr = null;
            break;
          } catch (attemptErr) {
            lastErr = attemptErr;
            const errMsg = (attemptErr && (attemptErr.message || attemptErr.error?.message)) || String(attemptErr);
            // Do not loop through fallback models if the user cancelled Puter sign-in
            if (/cancel|closed|denied|abort|auth/i.test(errMsg)) {
              break;
            }
          }
        }

        if (!replyText) {
          throw lastErr || new Error(currentLang === 'en' ? 'Puter AI request failed.' : 'فشل الاتصال بخدمة Puter AI.');
        }

        if ((aiChatGen[chatKey] || 0) === requestGen) {
          const targetHistory = Array.isArray(aiChats[chatKey]) ? aiChats[chatKey] : (aiChats[chatKey] = []);
          targetHistory.push({
            role: 'model',
            text: replyText,
            modelUsed,
            ts: Date.now()
          });
          saveAiChatsToStorage();
        }
      } catch (err) {
        const errPrefix = currentLang === 'en' ? 'Puter AI Error:' : 'خطأ في اتصال Puter AI:';
        const errDetail = (err && (err.message || err.error?.message)) || String(err);
        const hint = /cancel|closed|auth|sign/i.test(errDetail)
          ? (currentLang === 'en' ? 'Please allow the Puter sign-in popup to use free AI models.' : 'يرجى السماح بنافذة تسجيل الدخول في Puter لاستخدام نماذج الذكاء الاصطناعي.')
          : (currentLang === 'en' ? 'Try another model from the dropdown above or retry in a few seconds.' : 'جرّب اختيار نموذج آخر من الأعلى أو أعد المحاولة بعد ثوانٍ.');
        if ((aiChatGen[chatKey] || 0) === requestGen) {
          const targetHistory = Array.isArray(aiChats[chatKey]) ? aiChats[chatKey] : (aiChats[chatKey] = []);
          targetHistory.push({
            role: 'model',
            text: `**${errPrefix}** ${errDetail}\n\n${hint}`,
            isError: true,
            ts: Date.now()
          });
          saveAiChatsToStorage();
        }
        showToast(`${errPrefix} ${errDetail}`);
      } finally {
        setAiSendingState(false);
        renderAiMessages();
      }
    }
