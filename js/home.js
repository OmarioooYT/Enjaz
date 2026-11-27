/**
 * Enjaz — Landing page (index.html): translations, language switching, the user
 * journey walkthrough and scroll/tilt effects.
 *
 * Copyright (C) 2026 Omariooo
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This file is part of Enjaz, free software released under the GNU General
 * Public License v3.0 or later. See the LICENSE file for details.
 */

const HOME_I18N = {
  ar: {
    pageTitle: 'إنجاز Enjaz | إدارة مشاريع الفرق بالذكاء الاصطناعي — مجاني وبالعربي',
    brandName: 'إنجاز',
    brandSub: 'ملف المشروع',
    navOverview: 'نظرة عامة',
    navJourney: 'رحلة المستخدم',
    navFeatures: 'المميزات',
    navUseCases: 'لمن إنجاز؟',
    launchApp: 'افتح التطبيق',
    heroBadge: 'دراسة حالة تفاعلية · تطبيق ويب مباشر',
    heroTitleStart: 'إدارة مشاريع الفرق،',
    heroTitleAccent: 'بسرعة لحظية وذكاء اصطناعي',
    heroDesc:
      'إنجاز هو تطبيق ويب متكامل لإدارة مشاريع الفرق بتصميم داكن ثلاثي الأبعاد ودعم أصيل للعربية (RTL) والإنجليزية (LTR). يجمع بين لوحات كانبان المتزامنة لحظياً عبر Supabase، ومساعد ذكي مدمج يحوّل أهدافك إلى مهام جاهزة للتنفيذ.',
    ctaPrimary: 'ابدأ رحلتك في التطبيق',
    ctaSecondary: 'استكشف رحلة المستخدم',
    hudLiveTitle: 'مزامنة Supabase لايف',
    hudLiveSub: 'تحديث فوري لكل عضو',
    hudAiTitle: 'مساعد Puter.js الذكي',
    hudAiSub: 'تقسيم المهام بنقرة واحدة',
    stat1Val: 'لحظي',
    stat1Label: 'مزامنة فورية عبر Supabase',
    stat2Val: 'AR / EN',
    stat2Label: 'ثنائي اللغة RTL و LTR بالكامل',
    stat3Val: '+10 نماذج',
    stat3Label: 'مساعد ذكي عبر Puter.js AI',
    stat4Val: 'ثوانٍ للبدء',
    stat4Label: 'بدون إعدادات معقدة أو تحميل',
    previewTabKanban: 'لوحة كانبان',
    previewTabAi: 'المساعد الذكي',
    previewTabTeam: 'الفريق والتحليلات',
    previewUrl: 'enjaz.app / workspace / launch-v2',
    previewLive: 'متصل لايف',
    colTodo: 'قيد الانتظار',
    colProg: 'قيد التنفيذ',
    colDone: 'مكتمل',
    mockTask1Title: 'تصميم نظام التذاكر والمهام',
    mockTask1Tag: 'عالي',
    mockTask2Title: 'ربط التحديثات اللحظية Supabase',
    mockTask2Tag: 'عاجل',
    mockTask3Title: 'تفعيل مساعد تقسيم المهام الذكي',
    mockTask3Tag: 'ذكاء اصطناعي',
    mockTask4Title: 'دعم العربية والإنجليزية RTL/LTR',
    mockTask4Tag: 'منجز',
    mockAiUser: 'قسّم إطلاق النسخة الثانية إلى 3 مهام سريعة للفريق',
    mockAiReply: 'تم تحليل المشروع! إليك خطة تنفيذ مقترحة جاهزة للإضافة مباشرة إلى لوحة كانبان:',
    mockAiBtn: 'إضافة 3 مهام إلى اللوحة',
    mockTeamTitle: 'أداء الفريق وتوزيع المهام',
    mockTeamSub: 'متابعة حية لكل عضو مع فلترة فورية للمهام',
    mockProgressLabel: 'نسبة إنجاز المشروع',

    // User Journey Section
    journeyEyebrow: 'رحلة المستخدم داخل إنجاز',
    journeyTitle: 'من أول زيارة حتى تسليم المشروع في 4 محطات',
    journeyDesc: 'تصفّح كل محطة في رحلة المستخدم لترى كيف ينتقل الفريق بسلاسة من الدخول السريع إلى التخطيط بالذكاء الاصطناعي والإنجاز اللحظي.',
    j1Step: 'المحطة 01',
    j1Title: 'الدخول السريع والهوية',
    j1Short: 'ابدأ كزائر أو عبر OAuth واختر لغتك المفضلة في ثوانٍ.',
    j1StageBadge: 'الخطوة الأولى · بدون تعقيد',
    j1StageTitle: 'دخول فوري مع دعم كامل للعربية والإنجليزية',
    j1StageDesc: 'لا نماذج طويلة ولا إعدادات معقدة. يسجل المستخدم عبر حسابه أو يدخل باسمه كزائر، ويختار لغة الواجهة مع جولة تعريفية سريعة.',
    j1Pill1: 'تسجيل OAuth أو زائر',
    j1Pill2: 'تبديل فوري AR / EN',
    j1Pill3: 'جولة تعريفية تفاعلية',

    j2Step: 'المحطة 02',
    j2Title: 'إنشاء المشروع أو الانضمام بكود',
    j2Short: 'أنشئ مساحة بهوية مشروعك أو انضم لفريقك عبر كود مباشر.',
    j2StageBadge: 'الخطوة الثانية · مساحة الفريق',
    j2StageTitle: 'مساحة عمل بهوية مخصصة ومشاركة آمنة',
    j2StageDesc: 'اختر شعار مشروعك أو ارفع صورته الخاصة، ثم شارك كود المشروع أو رابط "مشروع فقط" لينضم أعضاء الفريق دون رؤية باقي مشاريعك.',
    j2Pill1: 'شعار وأيقونة مخصصة',
    j2Pill2: 'انضمام بكود فوري',
    j2Pill3: 'روابط مشاركة معزولة',

    j3Step: 'المحطة 03',
    j3Title: 'التخطيط بالذكاء الاصطناعي',
    j3Short: 'افتح المساعد الذكي (Alt+A) وقسّم الهدف إلى مهام جاهزة.',
    j3StageBadge: 'الخطوة الثالثة · Puter.js AI',
    j3StageTitle: 'حوّل الأفكار الكبيرة إلى بطاقات مهام بنقرة واحدة',
    j3StageDesc: 'يقرأ المساعد الذكي تفاصيل مشروعك الحالي، يقترح خطة تنفيذ موزعة بالأولويات، ويتيح لك إدراج جميع المهام المقترحة مباشرة في لوحة كانبان.',
    j3Pill1: '+10 نماذج ذكاء اصطناعي',
    j3Pill2: 'تبديل تلقائي عند الانقطاع',
    j3Pill3: 'استيراد المهام بنقرة واحدة',

    j4Step: 'المحطة 04',
    j4Title: 'التنفيذ اللحظي والاحتفاء بالإنجاز',
    j4Short: 'اسحب المهام وشاهد مؤشرات الإنجاز تتحدث فوراً للفريق.',
    j4StageBadge: 'الخطوة الرابعة · Supabase Realtime',
    j4StageTitle: 'تقدم حي يراه كل عضو في نفس اللحظة',
    j4StageDesc: 'مع كل بطاقة تنتقل إلى "مكتمل"، تتحدث مؤشرات الأداء وشريط التقدم لحظياً لدى الجميع مع عرض الفريق وفلترة المهام حسب كل عضو.',
    j4Pill1: 'سحب وإفلات سلس',
    j4Pill2: 'مؤشرات تقدم لحظية',
    j4Pill3: 'لوحة فريق وفلترة فورية',
    journeyNext: 'المحطة التالية',
    journeyPrev: 'المحطة السابقة',
    journeyTryNow: 'جرّب هذه الخطوة في التطبيق',

    // Bento Features
    featuresEyebrow: 'المميزات الأساسية',
    featuresTitle: 'كل ما يحتاجه الفريق لإنجاز المشاريع في مكان واحد',
    featuresDesc: 'صُمم إنجاز ليزيل التعقيد ويضع المهام، الفريق، والذكاء الاصطناعي في واجهة واحدة سريعة ومريحة للعين.',
    f1Badge: 'إدارة المهام',
    f1Title: 'لوحة كانبان وجدول وتقويم مع سحب وإفلات سلس',
    f1Desc:
      'نظّم المهام عبر حالات (قيد الانتظار، قيد التنفيذ، مكتمل) مع دعم السحب والإفلات، الأولويات، مواعيد الاستحقاق، تنبيهات التأخر، والبحث والفلترة الفورية حسب العضو.',
    f2Badge: 'Puter.js AI',
    f2Title: 'مساعد ذكي مدمج ومقسّم مهام تلقائي',
    f2Desc:
      'درج محادثة ذكي يقرأ سياق المشروع أو المهمة الحالية، يدعم أكثر من 10 نماذج مع سلسلة تبديل تلقائي عند الانقطاع، ويولّد بطاقات مهام يمكن إضافتها للوحة بنقرة واحدة.',
    f3Title: 'مزامنة لحظية ومشاركة بكود المشروع',
    f3Desc: 'أي تعديل يظهر فوراً لباقي الفريق عبر Supabase Realtime، مع إمكانية الانضمام بكود المشروع أو مشاركة رابط لمشروع محدد فقط.',
    f4Title: 'تجربة عربية أصلية (RTL) وثنائية اللغة',
    f4Desc: 'تبديل فوري بين العربية والإنجليزية مع قلب الاتجاه بالكامل وحفظ تفضيل المستخدم، وخطوط IBM Plex Sans Arabic و Cairo و Inter.',
    f5Title: 'إدارة الفريق والصلاحيات والملف الشخصي',
    f5Desc: 'تسجيل دخول عبر OAuth أو كزائر سريع، تخصيص الصورة الشخصية، متابعة مهام كل عضو، وإضافة أو إزالة أعضاء الفريق بسهولة.',
    f6Title: 'هوية مخصصة لكل مشروع وجولة تعريفية',
    f6Desc: 'اختر من أيقونات متجهة أنيقة أو ارفع شعار مشروعك الخاص، مع جولة تعريفية تفاعلية تساعد الأعضاء الجدد على البدء خلال ثوانٍ.',

    // What's New
    navNew: "الجديد",
    nwPill: "جديد",
    nwEyebrow: "آخر التحديثات",
    nwTitle: "تعاون أعمق، وتنظيم أذكى، وتجربة أسرع",
    nwDesc: "إضافات جديدة بتخلّي الفريق كله على نفس الصفحة: نقاش جوه كل مهمة، تقويم للمواعيد، سجل لكل حاجة بتحصل، وإشعارات بتوصلك في وقتها.",
    nw1Badge: "عرض جديد",
    nw1Title: "تقويم المهام",
    nw1Desc: "شوف مواعيد التسليم على تقويم شهري، واسحب أي مهمة ليوم تاني عشان تغيّر موعدها. والمهام المتأخرة بتبان بالأحمر.",
    nw2Badge: "تعاون",
    nw2Title: "تعليقات وإشارة @",
    nw2Desc: "اتناقشوا جوه المهمة نفسها بدل الشات. اكتب @ واختار اسم زميلك، وهيوصله إشعار على طول.",
    nw3Badge: "بالذكاء الاصطناعي",
    nw3Title: "خطوات المهمة",
    nw3Desc: "قسّم أي مهمة لخطوات صغيرة، أو خلّي الذكاء الاصطناعي يقسّمها لك بضغطة. ونسبة التقدم بتظهر على الكارت.",
    nw4Title: "سجل النشاط",
    nw4Desc: "كل تغيير في المشروع بيتسجل لحظة بلحظة: مين أضاف، مين نقل، ومين علّق. وقاعدة البيانات بتسجّله بنفسها، فمحدش يقدر يزوّره.",
    nw5Title: "إشعارات ذكية",
    nw5Desc: "بيوصلك تنبيه لما حد يسند لك مهمة، أو يعمل لك @، أو يعلّق على مهمتك، حتى لو التطبيق في تاب تاني.",
    nw6Title: "ملخص يومي",
    nw6Desc: "أول ما تفتح: مهام النهارده، والمتأخرة، واللي الفريق خلّصها. ومعاه ملخص مكتوب بالذكاء الاصطناعي يقولك تبدأ بإيه.",
    nw7Title: "سرعة فورية وزرار تراجع",
    nw7Desc: "أي تعديل بيظهر في لحظته من غير انتظار. ولو مسحت مهمة بالغلط، رجّعها بزرار \"تراجع\".",
    nw8Title: "تطبيق على موبايلك",
    nw8Desc: "ثبّت إنجاز كتطبيق على الموبايل أو الكمبيوتر، وتصفّح آخر بياناتك حتى من غير إنترنت.",
    nw9Title: "مشاريعك محمية",
    nw9Desc: "مفيش حد يشوف مشروعك إلا أعضاؤه. الحماية متطبّقة جوه قاعدة البيانات نفسها، وكود المشروع بقى صعب يتخمّن.",
    nwCta: "جرّب المميزات الجديدة",
    nwMockMonth: "نوفمبر",
    nwMockMention: "@عمر",
    nwMockComment1: "راجع التصميم قبل التسليم",
    nwMockComment2: "تمام، هخلّصه النهارده 👍",
    nwMockStep1: "جمع المتطلبات",
    nwMockStep2: "رسم الواجهة",
    nwMockStep3: "مراجعة مع الفريق",
    nwMockStep4: "التسليم",

    // FAQ
    faqEyebrow: "الأسئلة الشائعة",
    faqTitle: "كل ما تريد معرفته عن إنجاز",
    footerFaq: "الأسئلة الشائعة",
    footerBy: "من تطوير",
    faq1Q: "ما هو إنجاز؟",
    faq1A: "إنجاز (Enjaz) تطبيق ويب مجاني لإدارة مشاريع الفرق باللغتين العربية والإنجليزية. يجمع لوحة كانبان وجدولاً وتقويماً للمهام، وتعاوناً لحظياً بين أعضاء الفريق، ومساعد ذكاء اصطناعي يحوّل الأهداف إلى مهام جاهزة للتنفيذ.",
    faq2Q: "هل إنجاز مجاني؟",
    faq2A: "نعم. استخدام إنجاز مجاني بالكامل، وكوده مفتوح المصدر ومنشور على GitHub بترخيص GNU GPL v3.",
    faq3Q: "هل يدعم إنجاز اللغة العربية؟",
    faq3A: "نعم. إنجاز مصمم للعربية أولاً بواجهة كاملة من اليمين إلى اليسار (RTL)، ويمكن التبديل إلى الإنجليزية فوراً بضغطة واحدة.",
    faq4Q: "كيف أضيف فريقي إلى مشروع؟",
    faq4A: "لكل مشروع كود خاص (مثل PRJ-7KQ2-MX9D-4HTA) ورابط مشاركة. من يدخل بالكود أو الرابط ينضم للمشروع ويرى كل التحديثات لحظياً.",
    faq5Q: "هل أحتاج إلى إنشاء حساب؟",
    faq5A: "لا. يمكنك البدء كزائر باسمك فقط، أو تسجيل الدخول بحساب Google أو Discord أو GitHub، وتبقى مشاريعك معك عند التسجيل لاحقاً.",
    faq6Q: "كيف يعمل الذكاء الاصطناعي في إنجاز؟",
    faq6A: "يحتوي إنجاز على مساعد ذكي مدمج يعمل عبر Puter.js دون الحاجة لمفتاح API. يفهم سياق المشروع أو المهمة، ويقترح مهاماً تضيفها بضغطة، ويقسّم أي مهمة إلى خطوات، ويكتب ملخصاً يومياً لأولوياتك.",
    faq7Q: "هل بيانات مشاريعي آمنة وخاصة؟",
    faq7A: "نعم. كل مشروع محمي بقواعد أمان داخل قاعدة البيانات نفسها (Supabase Row Level Security)، فلا يراه إلا أعضاؤه، وأكواد المشاريع عشوائية ويستحيل تخمينها.",
    faq8Q: "هل يعمل إنجاز على الموبايل؟",
    faq8A: "نعم. الواجهة متجاوبة مع كل الشاشات، ويمكن تثبيت إنجاز كتطبيق (PWA) على الموبايل أو الكمبيوتر وتصفح آخر بياناتك حتى دون إنترنت.",
    faq9Q: "من طوّر إنجاز؟",
    faq9A: "طوّر إنجاز Omariooo، والكود المصدري متاح على GitHub في المستودع OmarioooYT/Enjaz.",

    // Product Use Cases & Value Comparison
    ucEyebrow: 'حالات الاستخدام · لمن إنجاز؟',
    ucTitle: 'مصمّم ليناسب طريقة عمل فريقك مهما كان حجم المشروع',
    ucDesc:
      'سواء كنت تدير فريقاً تقنياً، مشروع تخرج، أو عملاء متعددين — يمنحك إنجاز الوضوح والسرعة التي تحتاجها لإتمام العمل في وقته.',
    uc1Title: 'فرق التقنية والمنتجات',
    uc1Desc: 'إدارة السبرنتات، تحديد الأولويات العاجلة، وتقسيم المزايا الجديدة إلى مهام تنفيذية بالذكاء الاصطناعي.',
    uc2Title: 'الفرق الطلابية ومشاريع التخرج',
    uc2Desc: 'انضمام فوري للأعضاء بكود المشروع، توزيع واضح للمهام، ومتابعة حية لنسبة الإنجاز قبل موعد التسليم.',
    uc3Title: 'الوكالات وفرق التسويق',
    uc3Desc: 'شارك رابط مشروع محدد فقط مع العميل لمتابعة التقدم بشفافية تامة دون إظهار باقي مشاريعك الأخرى.',
    uc4Title: 'المستقلون والمشاريع الشخصية',
    uc4Desc: 'مساحة هادئة لتنظيم مهامك اليومية، تنبيهات فورية للمواعيد المتأخرة، ومساعد ذكي يساعدك على البدء فوراً.',
    cmpTitle: 'الفرق مع إنجاز',
    cmpBadge: 'تجربة متكاملة',
    cmpBeforeTitle: 'قبل إنجاز',
    cmpBefore1: 'مهام مبعثرة بين مجموعات الدردشة وملفات متفرقة.',
    cmpBefore2: 'واجهات معقدة لا تدعم العربية RTL بشكل مريح.',
    cmpBefore3: 'وقت طويل في تقسيم الأهداف الكبيرة يدوياً.',
    cmpAfterTitle: 'مع إنجاز',
    cmpAfter1: 'لوحة واحدة متزامنة لحظياً لكل أعضاء الفريق.',
    cmpAfter2: 'تصميم عربي وإنجليزي أصيل مع تبديل فوري.',
    cmpAfter3: 'مساعد ذكي يقسّم مشروعك إلى مهام بضغطة زر.',
    cmpCta: 'جرّب الفرق بنفسك الآن',

    // CTA & Footer
    ctaBandTitle: 'جاهز لبدء رحلتك في إنجاز؟',
    ctaBandDesc: 'افتح التطبيق المباشر الآن، جرّب لوحة كانبان والمساعد الذكي، وشاهد المشروع يعمل بكامل طاقته.',
    ctaBandBtn: 'افتح تطبيق إنجاز الآن',
    footerNote: 'إنجاز — مشروع بورتفوليو تطبيقي لإدارة مشاريع الفرق بالذكاء الاصطناعي.',
    footerLaunch: 'تشغيل التطبيق',
    footerTop: 'العودة للأعلى'
  },
  en: {
    pageTitle: 'Enjaz | Free AI-powered team project management in Arabic & English',
    brandName: 'Enjaz',
    brandSub: 'Project Portfolio',
    navOverview: 'Overview',
    navJourney: 'User Journey',
    navFeatures: 'Features',
    navUseCases: 'Use Cases',
    launchApp: 'Launch App',
    heroBadge: 'INTERACTIVE CASE STUDY · LIVE WEB APP',
    heroTitleStart: 'Team project management,',
    heroTitleAccent: 'built for real-time speed & AI',
    heroDesc:
      'Enjaz is a modern dark-mode web workspace for agile teams with native Arabic (RTL) and English (LTR) support. It combines live Supabase-synced Kanban boards, shareable project codes, and an embedded Puter.js AI assistant that turns goals into actionable tasks.',
    ctaPrimary: 'Start Your Journey',
    ctaSecondary: 'Explore User Journey',
    hudLiveTitle: 'Supabase Live Sync',
    hudLiveSub: 'Instant updates for every member',
    hudAiTitle: 'Puter.js AI Assistant',
    hudAiSub: 'One-click task breakdown',
    stat1Val: 'Real-Time',
    stat1Label: 'Live sync powered by Supabase',
    stat2Val: 'AR / EN',
    stat2Label: 'Full RTL & LTR bilingual UI',
    stat3Val: '10+ Models',
    stat3Label: 'Embedded Puter.js AI assistant',
    stat4Val: 'Instant Start',
    stat4Label: 'Zero complex setup or installs',
    previewTabKanban: 'Kanban Board',
    previewTabAi: 'AI Assistant',
    previewTabTeam: 'Team & KPIs',
    previewUrl: 'enjaz.app / workspace / launch-v2',
    previewLive: 'Live Sync',
    colTodo: 'To Do',
    colProg: 'In Progress',
    colDone: 'Done',
    mockTask1Title: 'Design task card & priority system',
    mockTask1Tag: 'High',
    mockTask2Title: 'Wire Supabase real-time channels',
    mockTask2Tag: 'Urgent',
    mockTask3Title: 'Build AI task divider & importer',
    mockTask3Tag: 'AI',
    mockTask4Title: 'Ship full AR (RTL) / EN (LTR) support',
    mockTask4Tag: 'Completed',
    mockAiUser: 'Break down the v2 launch into 3 quick actionable team tasks',
    mockAiReply: 'Project analyzed! Here is a structured sprint plan ready to import directly into your Kanban board:',
    mockAiBtn: 'Add 3 Tasks to Board',
    mockTeamTitle: 'Team Velocity & Workload',
    mockTeamSub: 'Live per-member progress with instant assignee filtering',
    mockProgressLabel: 'Overall Project Progress',

    // User Journey Section
    journeyEyebrow: 'INTERACTIVE USER JOURNEY',
    journeyTitle: 'From first visit to shipped project in 4 chapters',
    journeyDesc: 'Walk through each chapter of the Enjaz experience to see how teams move effortlessly from instant onboarding to AI planning and real-time delivery.',
    j1Step: 'Chapter 01',
    j1Title: 'Instant Entry & Identity',
    j1Short: 'Start as a guest or via OAuth and pick your language in seconds.',
    j1StageBadge: 'Step 01 · Zero Friction',
    j1StageTitle: 'Immediate access with native Arabic & English',
    j1StageDesc: 'No heavy sign-up walls. Users sign in with OAuth or enter a guest display name, switch between RTL and LTR seamlessly, and breeze through a guided walkthrough.',
    j1Pill1: 'OAuth or Guest Mode',
    j1Pill2: 'Instant AR / EN Flip',
    j1Pill3: 'Interactive Onboarding',

    j2Step: 'Chapter 02',
    j2Title: 'Create or Join by Code',
    j2Short: 'Launch a branded project or join your team with a live code.',
    j2StageBadge: 'Step 02 · Team Space',
    j2StageTitle: 'Custom project branding & scoped sharing',
    j2StageDesc: 'Pick a crisp vector icon or upload a custom logo, then invite teammates with a join code or a single-project share link that keeps your other workspaces private.',
    j2Pill1: 'Custom Logo & Icons',
    j2Pill2: 'Instant Join Code',
    j2Pill3: 'Isolated Share Links',

    j3Step: 'Chapter 03',
    j3Title: 'AI Planning & Task Division',
    j3Short: 'Open the AI drawer (Alt+A) to break milestones into tasks.',
    j3StageBadge: 'Step 03 · Puter.js AI',
    j3StageTitle: 'Turn big goals into Kanban cards in one click',
    j3StageDesc: 'The context-aware AI assistant reads your active project or task, drafts a prioritized breakdown across 10+ models with fallback, and imports cards straight to your board.',
    j3Pill1: '10+ AI Models',
    j3Pill2: 'Automatic Fallback Chain',
    j3Pill3: 'One-Click Board Import',

    j4Step: 'Chapter 04',
    j4Title: 'Live Execution & Delivery',
    j4Short: 'Drag cards across columns and watch KPIs update live.',
    j4StageBadge: 'Step 04 · Supabase Realtime',
    j4StageTitle: 'Real-time progress synced for every teammate',
    j4StageDesc: 'Every card moved to Done updates completion metrics and progress bars immediately for the entire team, with per-member filtering and live workload tracking.',
    j4Pill1: 'Smooth Drag & Drop',
    j4Pill2: 'Live KPI Progress Sweep',
    j4Pill3: 'Team View & Filters',
    journeyNext: 'Next Chapter',
    journeyPrev: 'Previous',
    journeyTryNow: 'Try This Step Live',

    // Bento Features
    featuresEyebrow: 'CORE CAPABILITIES',
    featuresTitle: 'Everything a team needs to plan and ship in one workspace',
    featuresDesc: 'Enjaz removes friction by uniting tasks, live collaboration, and context-aware AI inside a crisp, distraction-free dark interface.',
    f1Badge: 'Task Management',
    f1Title: 'Kanban, table & calendar views with smooth drag and drop',
    f1Desc:
      'Track tasks across To Do, In Progress, and Done with drag-and-drop transitions, priority badges, due-date overdue alerts, and instant search or assignee filtering.',
    f2Badge: 'Puter.js AI',
    f2Title: 'Context-Aware AI Chat & One-Click Task Divider',
    f2Desc:
      'An integrated AI drawer that understands your active project or task, supports 10+ models with automatic fallback, and generates structured task cards ready to insert into your board.',
    f3Title: 'Real-Time Sync & Shareable Project Codes',
    f3Desc: 'Every update propagates immediately across the team via Supabase Realtime, with join-by-code access and scoped single-project share links.',
    f4Title: 'Native Arabic (RTL) & English (LTR) Experience',
    f4Desc: 'Instant language switching with full layout mirroring, persisted preferences, and tailored typography pairing IBM Plex Sans Arabic, Cairo, and Inter.',
    f5Title: 'Team Directory, Auth & Custom Profiles',
    f5Desc: 'Sign in with OAuth or start immediately as a guest, customize avatars, track member task counts, and manage project members effortlessly.',
    f6Title: 'Custom Project Branding & Guided Onboarding',
    f6Desc: 'Pick from clean vector icons or upload a custom project logo, paired with an interactive walkthrough that gets new members productive in seconds.',

    // What's New
    navNew: "What's new",
    nwPill: "NEW",
    nwEyebrow: "LATEST UPDATES",
    nwTitle: "Deeper collaboration, smarter planning, faster everything",
    nwDesc: "New additions that keep the whole team on the same page: discussions inside every task, a calendar for deadlines, a log of everything that happens, and notifications right when they matter.",
    nw1Badge: "New view",
    nw1Title: "Task calendar",
    nw1Desc: "See deadlines on a monthly calendar and drag any task to another day to reschedule it. Overdue work stands out in red.",
    nw2Badge: "Collaboration",
    nw2Title: "Comments & @mentions",
    nw2Desc: "Discuss work inside the task instead of a separate chat. Type @, pick a teammate, and they get notified instantly.",
    nw3Badge: "AI-powered",
    nw3Title: "Task checklists",
    nw3Desc: "Break any task into small steps, or let AI break it down for you in one click. Progress shows right on the card.",
    nw4Title: "Activity feed",
    nw4Desc: "Every change is logged live: who added, moved, or commented on what. The database writes the log itself, so nobody can fake it.",
    nw5Title: "Smart notifications",
    nw5Desc: "Get alerted when someone assigns you a task, @mentions you, or comments on your work, even when the app is in another tab.",
    nw6Title: "Daily summary",
    nw6Desc: "The moment you open the app: today's tasks, what's overdue, and what the team finished, plus an AI-written brief on where to start.",
    nw7Title: "Instant updates & undo",
    nw7Desc: "Every change appears immediately, with no waiting. Deleted a task by mistake? Bring it back with Undo.",
    nw8Title: "Install it on your phone",
    nw8Desc: "Install Enjaz as an app on your phone or computer, and browse your latest data even without internet.",
    nw9Title: "Private by design",
    nw9Desc: "Only project members can see a project. Access rules are enforced inside the database itself, and project codes are now impossible to guess.",
    nwCta: "Try the new features",
    nwMockMonth: "November",
    nwMockMention: "@Omar",
    nwMockComment1: "please review the design before the deadline",
    nwMockComment2: "On it, finishing today 👍",
    nwMockStep1: "Gather requirements",
    nwMockStep2: "Sketch the UI",
    nwMockStep3: "Team review",
    nwMockStep4: "Ship it",

    // FAQ
    faqEyebrow: "FAQ",
    faqTitle: "Everything you want to know about Enjaz",
    footerFaq: "FAQ",
    footerBy: "Built by",
    faq1Q: "What is Enjaz?",
    faq1A: "Enjaz (إنجاز) is a free web app for team project management in Arabic and English. It combines Kanban, table and calendar views, real-time collaboration between teammates, and an AI assistant that turns goals into ready-to-do tasks.",
    faq2Q: "Is Enjaz free?",
    faq2A: "Yes. Enjaz is completely free to use, and its source code is open and published on GitHub under the GNU GPL v3 license.",
    faq3Q: "Does Enjaz support Arabic?",
    faq3A: "Yes. Enjaz is built Arabic-first with a full right-to-left (RTL) interface, and you can switch to English instantly with one click.",
    faq4Q: "How do I add my team to a project?",
    faq4A: "Every project has its own code (like PRJ-7KQ2-MX9D-4HTA) and a share link. Anyone who joins with the code or link becomes a member and sees every update live.",
    faq5Q: "Do I need to create an account?",
    faq5A: "No. You can start as a guest with just your name, or sign in with Google, Discord or GitHub, and your projects stay with you when you sign in later.",
    faq6Q: "How does the AI work in Enjaz?",
    faq6A: "Enjaz has a built-in AI assistant powered by Puter.js, with no API key needed. It understands the project or task you are viewing, suggests tasks you can add in one click, breaks any task into steps, and writes a daily summary of your priorities.",
    faq7Q: "Is my project data safe and private?",
    faq7A: "Yes. Every project is protected by security rules inside the database itself (Supabase Row Level Security), so only its members can see it, and project codes are random and impossible to guess.",
    faq8Q: "Does Enjaz work on mobile?",
    faq8A: "Yes. The interface adapts to every screen, and you can install Enjaz as an app (PWA) on your phone or computer and browse your latest data even without internet.",
    faq9Q: "Who built Enjaz?",
    faq9A: "Enjaz was built by Omariooo, and the source code is available on GitHub in the OmarioooYT/Enjaz repository.",

    // Product Use Cases & Value Comparison
    ucEyebrow: 'USE CASES · WHO IT IS FOR',
    ucTitle: 'Built for how modern teams actually ship projects',
    ucDesc:
      'Whether you run a product team, a graduation project, or client work — Enjaz gives everyone the clarity and speed to deliver on time.',
    uc1Title: 'Product & Engineering Teams',
    uc1Desc: 'Manage sprints, surface urgent priorities, and break down new features into actionable tasks with AI.',
    uc2Title: 'Student & Graduation Teams',
    uc2Desc: 'Join instantly via project code, divide responsibilities clearly, and track completion before deadlines.',
    uc3Title: 'Agencies & Marketing Teams',
    uc3Desc: 'Share a scoped single-project link with clients for full transparency while keeping other projects private.',
    uc4Title: 'Freelancers & Solo Builders',
    uc4Desc: 'A calm workspace for daily execution, overdue alerts, and an AI assistant that helps you kick off fast.',
    cmpTitle: 'The Enjaz Difference',
    cmpBadge: 'All-in-One',
    cmpBeforeTitle: 'Before Enjaz',
    cmpBefore1: 'Tasks scattered across chat groups and messy docs.',
    cmpBefore2: 'Clunky interfaces with poor Arabic RTL ergonomics.',
    cmpBefore3: 'Hours spent manually breaking down big milestones.',
    cmpAfterTitle: 'With Enjaz',
    cmpAfter1: 'One live board synced in real time for the whole team.',
    cmpAfter2: 'Native Arabic & English UI with instant switching.',
    cmpAfter3: 'Embedded AI that turns goals into tasks in one click.',
    cmpCta: 'Experience the Difference',

    // CTA & Footer
    ctaBandTitle: 'Ready to start your Enjaz journey?',
    ctaBandDesc: 'Open the live application now to test the Kanban board, real-time sync, and AI task divider firsthand.',
    ctaBandBtn: 'Open Enjaz Workspace',
    footerNote: 'Enjaz — Portfolio showcase for an AI-powered real-time team project manager.',
    footerLaunch: 'Launch App',
    footerTop: 'Back to top'
  }
};

let currentLang = localStorage.getItem('enjaz_lang') === 'en' ? 'en' : 'ar';
let activeJourneyStep = 1;

const prefersReducedMotion = () =>
  Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/**
 * Switches the landing page language and direction and re-translates every
 * [data-i18n] element.
 *
 * @param {'ar'|'en'} lang
 */
function applyHomeLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'ar';
  localStorage.setItem('enjaz_lang', currentLang);

  const html = document.documentElement;
  html.lang = currentLang;
  html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  const dict = HOME_I18N[currentLang];
  document.title = dict.pageTitle;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  const langBtnLabel = document.getElementById('langToggleLabel');
  if (langBtnLabel) {
    langBtnLabel.textContent = currentLang === 'ar' ? 'EN' : 'AR';
  }
}

/**
 * Toggles the landing page between Arabic and English.
 */
function toggleHomeLanguage() {
  applyHomeLanguage(currentLang === 'ar' ? 'en' : 'ar');
}

/**
 * Switches the tabs of the app preview in the hero section.
 *
 * @param {string} tabName
 */
function switchPreviewTab(tabName) {
  document.querySelectorAll('[data-preview-tab]').forEach((btn) => {
    btn.setAttribute('aria-selected', btn.getAttribute('data-preview-tab') === tabName ? 'true' : 'false');
  });

  document.querySelectorAll('[data-preview-panel]').forEach((panel) => {
    panel.classList.toggle('hidden', panel.getAttribute('data-preview-panel') !== tabName);
  });
}

/**
 * Shows one step (1-4) of the user-journey walkthrough.
 *
 * @param {number} stepNum
 */
function selectJourneyStep(stepNum) {
  const clamped = Math.max(1, Math.min(4, Number(stepNum) || 1));
  activeJourneyStep = clamped;

  document.querySelectorAll('[data-journey-btn]').forEach((btn) => {
    const isSelected = Number(btn.getAttribute('data-journey-btn')) === clamped;
    btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  });

  document.querySelectorAll('[data-journey-panel]').forEach((panel) => {
    const isMatch = Number(panel.getAttribute('data-journey-panel')) === clamped;
    panel.classList.toggle('hidden', !isMatch);
    if (isMatch && !prefersReducedMotion()) {
      panel.classList.remove('journey-panel-animate');
      void panel.offsetWidth;
      panel.classList.add('journey-panel-animate');
    }
  });

  const bar = document.getElementById('journeyProgressFill');
  if (bar) {
    bar.style.width = `${(clamped / 4) * 100}%`;
  }

  const counter = document.getElementById('journeyStepCounter');
  if (counter) {
    counter.textContent = `0${clamped} / 04`;
  }

  const prevBtn = document.getElementById('journeyPrevBtn');
  const nextBtn = document.getElementById('journeyNextBtn');
  if (prevBtn) prevBtn.disabled = clamped === 1;
  if (nextBtn) nextBtn.disabled = clamped === 4;
}

/**
 * Moves the user-journey walkthrough forward or back.
 *
 * @param {number} delta
 */
function stepJourney(delta) {
  selectJourneyStep(activeJourneyStep + delta);
}

/**
 * Opens or closes the mobile navigation menu.
 *
 * @param {boolean} [forceState]
 */
function toggleMobileNav(forceState) {
  const menu = document.getElementById('mobileNavMenu');
  const btn = document.getElementById('mobileNavBtn');
  if (!menu || !btn) return;
  const shouldOpen = typeof forceState === 'boolean' ? forceState : menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !shouldOpen);
  btn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
}

/**
 * Fades sections in as they scroll into view (skipped when reduced motion is
 * preferred).
 */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

/**
 * Drives the reading-progress bar at the top of the page.
 */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    bar.style.transform = `scaleX(${pct})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/**
 * Adds the 3D tilt effect to [data-tilt] cards on devices with a mouse.
 */
function init3DTilt() {
  if (prefersReducedMotion()) return;
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    const maxDeg = Number(card.getAttribute('data-tilt-max')) || 8;

    card.addEventListener('pointerenter', () => {
      card.classList.add('is-tilting');
    });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      const rotY = px * maxDeg * 2;
      const rotX = -py * maxDeg * 2;

      card.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
      card.style.setProperty('--gx', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${((y / rect.height) * 100).toFixed(1)}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyHomeLanguage(currentLang);
  selectJourneyStep(1);
  initScrollReveal();
  initScrollProgress();
  init3DTilt();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMobileNav(false);
    }
  });
});
