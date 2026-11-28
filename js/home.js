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
    brandSub: "إدارة مشاريع الفرق",
    navOverview: "نظرة عامة",
    navJourney: "كيف يعمل",
    navFeatures: "المميزات",
    navUseCases: "لمن إنجاز؟",
    launchApp: "افتح التطبيق",
    heroBadge: "مجاني · عربي وإنجليزي · يعمل من المتصفح",
    heroTitleStart: "نظّم مشاريع فريقك،",
    heroTitleAccent: "بمساعدة الذكاء الاصطناعي",
    heroDesc: "لوحة مهام يرى فيها كل أعضاء الفريق التحديثات في نفس اللحظة. أضف المهام، ووزّعها على الفريق، وتابع ما أُنجز وما تأخر. والمساعد الذكي يحوّل أي هدف كبير إلى خطوات صغيرة واضحة.",
    ctaPrimary: "ابدأ مجاناً",
    ctaSecondary: "شاهد كيف يعمل",
    hudLiveTitle: "تحديث فوري",
    hudLiveSub: "يظهر التعديل عند الفريق كله",
    hudAiTitle: "مساعد ذكي",
    hudAiSub: "يقسّم المهمة بضغطة",
    stat1Val: "مجاني",
    stat1Label: "بلا اشتراك ولا بطاقة ائتمان",
    stat2Val: "عربي وإنجليزي",
    stat2Label: "بدّل اللغة بضغطة واحدة",
    stat3Val: "فوري",
    stat3Label: "الفريق يرى كل تعديل في لحظته",
    stat4Val: "بلا تثبيت",
    stat4Label: "يعمل من المتصفح على أي جهاز",
    previewTabKanban: "لوحة المهام",
    previewTabAi: "المساعد الذكي",
    previewTabTeam: "الفريق",
    previewUrl: "enjaz-os.vercel.app",
    previewLive: "متصل",
    colTodo: "قيد الانتظار",
    colProg: "جاري العمل",
    colDone: "مكتمل",
    mockTask1Title: "تصميم صفحة الدفع",
    mockTask1Tag: "أولوية عالية",
    mockTask2Title: "ربط بوابة الدفع",
    mockTask2Tag: "عاجل",
    mockTask3Title: "كتابة وصف المنتجات",
    mockTask3Tag: "اقترحها المساعد",
    mockTask4Title: "اختيار ألوان المتجر",
    mockTask4Tag: "مكتمل",
    mockAiUser: "قسّم إطلاق المتجر إلى مهام لهذا الأسبوع",
    mockAiReply: "هذه 3 مهام مرتبة حسب الأولوية، ويمكنك إضافتها إلى اللوحة مباشرة:",
    mockAiBtn: "أضف المهام الثلاث",
    mockTeamTitle: "مهام كل عضو",
    mockTeamSub: "كم مهمة عند كل شخص، وكم أنجز منها",
    mockProgressLabel: "نسبة إنجاز المشروع",

    // User Journey Section
    journeyEyebrow: "كيف يعمل",
    journeyTitle: "4 خطوات من التسجيل إلى التسليم",
    journeyDesc: "هكذا يستخدم الفريق إنجاز من أول يوم. اختر خطوة لترى تفاصيلها.",
    j1Step: "الخطوة 1",
    j1Title: "ادخل في ثوانٍ",
    j1Short: "باسمك فقط، أو بحساب Google أو Discord أو GitHub.",
    j1StageBadge: "الخطوة 1 · الدخول",
    j1StageTitle: "بحساب أو بدونه، كما تفضّل",
    j1StageDesc: "اكتب اسمك وابدأ فوراً كزائر، أو سجّل الدخول بحساب Google أو Discord أو GitHub. وإن بدأت كزائر ثم سجّلت لاحقاً، تبقى مشاريعك معك. ويمكنك اختيار لغة الواجهة: العربية أو الإنجليزية.",
    j1Pill1: "دخول كزائر",
    j1Pill2: "Google · Discord · GitHub",
    j1Pill3: "عربي أو إنجليزي",

    j2Step: "الخطوة 2",
    j2Title: "أنشئ مشروعاً وادعُ فريقك",
    j2Short: "لكل مشروع كود، أرسله لزملائك لينضموا.",
    j2StageBadge: "الخطوة 2 · المشروع والفريق",
    j2StageTitle: "مشروع لا يراه إلا فريقك",
    j2StageDesc: "أنشئ مشروعاً وضع له اسماً وشعاراً، ثم أرسل كوده أو رابطه لأعضاء الفريق. لا يرى المشروع إلا من انضم إليه، ولا يرى أحد مشاريعك الأخرى.",
    j2Pill1: "اسم وشعار للمشروع",
    j2Pill2: "انضمام بالكود أو الرابط",
    j2Pill3: "خاص بالأعضاء فقط",

    j3Step: "الخطوة 3",
    j3Title: "خطّط مع المساعد الذكي",
    j3Short: "اكتب هدفك، واحصل على قائمة مهام جاهزة.",
    j3StageBadge: "الخطوة 3 · التخطيط",
    j3StageTitle: "من هدف كبير إلى مهام صغيرة واضحة",
    j3StageDesc: "اكتب مثلاً «جهّز إطلاق المتجر»، فيقترح المساعد مهاماً مرتبة حسب الأولوية، وتضيفها إلى اللوحة بضغطة واحدة. ويمكنك أن ترفق ملف PDF أو Word أو Excel ليستخرج منه المهام.",
    j3Pill1: "مهام مرتبة بالأولوية",
    j3Pill2: "يقرأ ملفاتك وصورك",
    j3Pill3: "إضافة بضغطة واحدة",

    j4Step: "الخطوة 4",
    j4Title: "نفّذ وتابع التقدم",
    j4Short: "انقل المهام بين الأعمدة، والكل يرى التحديث فوراً.",
    j4StageBadge: "الخطوة 4 · التنفيذ",
    j4StageTitle: "الكل يرى التقدم في نفس اللحظة",
    j4StageDesc: "اسحب المهمة من «قيد الانتظار» إلى «جاري العمل» ثم «مكتمل». تتحدّث نسبة الإنجاز عند كل أعضاء الفريق فوراً، وترى المهام المتأخرة ومهام كل شخص.",
    j4Pill1: "سحب وإفلات",
    j4Pill2: "نسبة إنجاز محدّثة",
    j4Pill3: "مهام كل عضو",
    journeyNext: "الخطوة التالية",
    journeyPrev: "الخطوة السابقة",
    journeyTryNow: "جرّبها في التطبيق",

    // Bento Features
    featuresEyebrow: "المميزات",
    featuresTitle: "كل ما يحتاجه فريقك في مكان واحد",
    featuresDesc: "بدل التنقل بين مجموعات الدردشة والجداول والملفات: المهام والفريق والنقاش في صفحة واحدة.",
    f1Badge: "إدارة المهام",
    f1Title: "لوحة مهام وجدول وتقويم",
    f1Desc: "رتّب المهام في ثلاثة أعمدة: قيد الانتظار، وجاري العمل، ومكتمل. حدّد لكل مهمة أولوية وموعداً ومسؤولاً، وابحث وفلتر حسب الشخص. والمهام المتأخرة تظهر باللون الأحمر.",
    f2Badge: "ذكاء اصطناعي",
    f2Title: "مساعد يقسّم العمل عنك",
    f2Desc: "يعرف تفاصيل مشروعك ومهامه، فيقترح مهاماً جديدة ويقسّم المهام الكبيرة إلى خطوات، ويقرأ الصور وملفات PDF وWord وExcel. مجاني ولا يحتاج إلى أي إعداد.",
    f3Title: "تحديث فوري للفريق كله",
    f3Desc: "أي تعديل يظهر عند باقي الفريق فوراً دون تحديث الصفحة. ادعُ الأعضاء بكود المشروع، أو شارك رابطاً يفتح مشروعاً واحداً فقط.",
    f4Title: "عربي من الأساس، وإنجليزي أيضاً",
    f4Desc: "الواجهة مصممة للعربية من اليمين إلى اليسار، ويمكنك التبديل إلى الإنجليزية بضغطة، ويتذكر التطبيق اختيارك.",
    f5Title: "الفريق والملف الشخصي",
    f5Desc: "ادخل بحسابك أو كزائر، وضع صورتك ومسمّاك الوظيفي، وشاهد مهام كل عضو وما أنجزه. ويمكنك إضافة أعضاء ليس لديهم حساب لتسند إليهم المهام.",
    f6Title: "شكل خاص لكل مشروع، ودليل للبداية",
    f6Desc: "اختر أيقونة لمشروعك أو ارفع شعاره، ودليل قصير يشرح للأعضاء الجدد كيف يبدؤون.",

    // What's New
    navNew: "الجديد",
    nwPill: "جديد",
    nwEyebrow: "آخر الإضافات",
    nwTitle: "إضافات جديدة تجعل العمل الجماعي أسهل",
    nwDesc: "نقاش داخل كل مهمة، وتقويم للمواعيد، وسجل لكل ما يحدث في المشروع، وإشعارات تصلك في وقتها.",
    nw1Badge: "عرض جديد",
    nw1Title: "تقويم المهام",
    nw1Desc: "شاهد مواعيد التسليم على تقويم شهري، واسحب أي مهمة إلى يوم آخر لتغيير موعدها. والمهام المتأخرة تظهر باللون الأحمر.",
    nw2Badge: "تعاون",
    nw2Title: "تعليقات وإشارة @",
    nw2Desc: "تناقشوا داخل المهمة نفسها بدل الدردشة. اكتب @ واختر اسم زميلك، فيصله إشعار فوراً.",
    nw3Badge: "بالذكاء الاصطناعي",
    nw3Title: "خطوات المهمة",
    nw3Desc: "قسّم أي مهمة إلى خطوات صغيرة، أو دع الذكاء الاصطناعي يقسّمها لك بضغطة. ونسبة التقدم تظهر على بطاقة المهمة.",
    nw4Title: "سجل النشاط",
    nw4Desc: "كل تغيير في المشروع يُسجَّل لحظة بلحظة: من أضاف مهمة، ومن نقلها، ومن علّق عليها.",
    nw5Title: "إشعارات",
    nw5Desc: "يصلك تنبيه عندما يسند لك أحد مهمة، أو يذكرك بـ @، أو يعلّق على مهمتك، حتى لو كان التطبيق في تبويب آخر.",
    nw6Title: "ملخص يومي",
    nw6Desc: "عند فتح التطبيق ترى مهام اليوم، والمهام المتأخرة، وما أنجزه الفريق، مع ملخص قصير يقترح عليك بماذا تبدأ.",
    nw7Title: "تحديث فوري وزر تراجع",
    nw7Desc: "أي تعديل يظهر في لحظته دون انتظار. وإن حذفت مهمة بالخطأ، أعدها بزر «تراجع».",
    nw8Title: "تطبيق على جوالك",
    nw8Desc: "ثبّت إنجاز كتطبيق على الجوال أو الكمبيوتر، وتصفّح آخر بياناتك حتى بدون إنترنت.",
    nw9Title: "مشاريعك خاصة",
    nw9Desc: "لا يرى مشروعك إلا أعضاؤه، وكود المشروع عشوائي فلا يمكن تخمينه.",
    nwCta: "جرّب المميزات الجديدة",
    nwMockMonth: "نوفمبر",
    nwMockMention: "@عمر",
    nwMockComment1: "راجع التصميم قبل التسليم",
    nwMockComment2: "حسناً، سأنهيه اليوم 👍",
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
    faq1A: "إنجاز تطبيق ويب مجاني لإدارة مشاريع الفرق باللغتين العربية والإنجليزية. تضيف فيه المهام وتوزّعها على الفريق، ويرى الجميع التحديثات في نفس اللحظة، ومعه مساعد ذكي يحوّل الأهداف الكبيرة إلى مهام صغيرة.",
    faq2Q: "هل إنجاز مجاني؟",
    faq2A: "نعم. استخدام إنجاز مجاني بالكامل، بلا اشتراك ولا بطاقة ائتمان، وكوده مفتوح المصدر ومنشور على GitHub.",
    faq3Q: "هل يدعم إنجاز اللغة العربية؟",
    faq3A: "نعم. إنجاز مصمم للعربية أولاً، والواجهة كلها من اليمين إلى اليسار، ويمكنك التبديل إلى الإنجليزية بضغطة واحدة.",
    faq4Q: "كيف أضيف فريقي إلى مشروع؟",
    faq4A: "لكل مشروع كود خاص (مثل PRJ-7KQ2-MX9D-4HTA) ورابط مشاركة. أرسل أيّاً منهما لزملائك، ومن ينضم يرى المشروع وكل تحديثاته فوراً.",
    faq5Q: "هل أحتاج إلى إنشاء حساب؟",
    faq5A: "لا. يمكنك البدء كزائر باسمك فقط، أو تسجيل الدخول بحساب Google أو Discord أو GitHub. وإن سجّلت لاحقاً تبقى مشاريعك معك.",
    faq6Q: "كيف يعمل الذكاء الاصطناعي في إنجاز؟",
    faq6A: "في التطبيق مساعد ذكي يعرف تفاصيل مشروعك. اكتب له هدفك فيقترح مهاماً مرتبة حسب الأولوية تضيفها بضغطة، ويقسّم أي مهمة إلى خطوات، ويقرأ الصور وملفات PDF وWord وExcel. وهو مجاني ولا يحتاج إلى أي إعداد.",
    faq7Q: "هل بيانات مشاريعي آمنة وخاصة؟",
    faq7A: "نعم. لا يرى المشروع إلا أعضاؤه، والحماية مطبّقة على الخادم نفسه وليس في المتصفح فقط. وأكواد المشاريع عشوائية فلا يمكن تخمينها.",
    faq8Q: "هل يعمل إنجاز على الجوال؟",
    faq8A: "نعم. الصفحة تعمل على أي جوال، ويمكنك تثبيت إنجاز كتطبيق على الجوال أو الكمبيوتر، وتصفّح آخر بياناتك حتى بدون إنترنت.",
    faq9Q: "من طوّر إنجاز؟",
    faq9A: "طوّره Omariooo، والكود متاح للجميع على GitHub.",

    // Mockup labels
    mockInitOmar: "ع",
    mockInit1: "م",
    mockName1: "محمود",
    mockInit2: "س",
    mockName2: "سارة",
    mockInit3: "أ",
    mockName3: "أحمد",
    mockAiLabel: "المساعد الذكي",
    mockAiT1: "1. تجهيز صور المنتجات",
    mockAiT2: "2. تحديد أسعار الشحن",
    mockAiT3: "3. تجربة طلب كامل",
    mockTasksUnit: "مهام",
    j1MockTitle: "تسجيل الدخول",
    j1MockSub: "زائر · Google · Discord · GitHub",
    j1MockBadge: "ع / EN",
    j2MockLabel: "كود المشروع",
    j3MockLabel: "المساعد الذكي · Alt + A",
    j3MockBadge: "مجاني",
    j4MockLabel: "نسبة إنجاز المشروع",
    j4MockValue: "100% مكتمل",

    // Product Use Cases & Value Comparison
    ucEyebrow: "لمن إنجاز؟",
    ucTitle: "يناسب أي فريق، صغيراً كان أو كبيراً",
    ucDesc: "أمثلة على من يستخدم إنجاز وكيف يفيدهم:",
    uc1Title: "فرق البرمجة والمنتجات",
    uc1Desc: "خطّطوا للأسابيع القادمة، ورتّبوا الأولويات، وقسّموا كل ميزة جديدة إلى مهام بمساعدة المساعد الذكي.",
    uc2Title: "مشاريع التخرج والفرق الطلابية",
    uc2Desc: "ينضم الزملاء بالكود، ويعرف كل واحد مهامه، وترون نسبة الإنجاز قبل موعد التسليم.",
    uc3Title: "الوكالات وفرق التسويق",
    uc3Desc: "أرسل للعميل رابطاً يفتح مشروعه فقط، ليتابع التقدم بنفسه دون أن يرى مشاريعك الأخرى.",
    uc4Title: "المستقلون والمهام الشخصية",
    uc4Desc: "رتّب مهامك اليومية، وتابع مواعيدك، ودع المساعد يساعدك حين لا تعرف من أين تبدأ.",
    cmpTitle: "قبل إنجاز وبعده",
    cmpBadge: "مقارنة سريعة",
    cmpBeforeTitle: "قبل إنجاز",
    cmpBefore1: "المهام ضائعة بين رسائل الدردشة والملفات.",
    cmpBefore2: "برامج معقدة لا تدعم العربية جيداً.",
    cmpBefore3: "وقت طويل في تقسيم المشروع إلى مهام.",
    cmpAfterTitle: "مع إنجاز",
    cmpAfter1: "لوحة واحدة يراها الفريق كله، ومحدّثة دائماً.",
    cmpAfter2: "واجهة عربية واضحة، وإنجليزية عند الحاجة.",
    cmpAfter3: "المساعد يقسّم المشروع إلى مهام في ثوانٍ.",
    cmpCta: "جرّبه مجاناً",

    // CTA & Footer
    ctaBandTitle: "جاهز لتجربته؟",
    ctaBandDesc: "أنشئ أول مشروع في أقل من دقيقة. مجاني، ولا يحتاج إلى تثبيت أو بطاقة ائتمان.",
    ctaBandBtn: "ابدأ مجاناً",
    footerNote: "إنجاز — تطبيق مجاني ومفتوح المصدر لإدارة مشاريع الفرق.",
    footerLaunch: "افتح التطبيق",
    footerTop: "العودة للأعلى"
  },
  en: {
    pageTitle: 'Enjaz | Free AI-powered team project management in Arabic & English',
    brandName: 'Enjaz',
    brandSub: "Team project management",
    navOverview: "Overview",
    navJourney: "How it works",
    navFeatures: "Features",
    navUseCases: "Who it’s for",
    launchApp: "Open the app",
    heroBadge: "Free · Arabic & English · Runs in your browser",
    heroTitleStart: "Organize your team’s projects,",
    heroTitleAccent: "with help from AI",
    heroDesc: "A task board where everyone on the team sees updates the moment they happen. Add tasks, assign them, and see what’s done and what’s late. The AI assistant turns any big goal into small, clear steps.",
    ctaPrimary: "Start for free",
    ctaSecondary: "See how it works",
    hudLiveTitle: "Live updates",
    hudLiveSub: "Changes appear for the whole team",
    hudAiTitle: "AI assistant",
    hudAiSub: "Breaks a task down in one click",
    stat1Val: "Free",
    stat1Label: "No subscription, no credit card",
    stat2Val: "Arabic & English",
    stat2Label: "Switch language in one click",
    stat3Val: "Live",
    stat3Label: "Your team sees every change instantly",
    stat4Val: "No install",
    stat4Label: "Works in the browser on any device",
    previewTabKanban: "Task board",
    previewTabAi: "AI assistant",
    previewTabTeam: "Team",
    previewUrl: "enjaz-os.vercel.app",
    previewLive: "Live",
    colTodo: "To do",
    colProg: "In progress",
    colDone: "Done",
    mockTask1Title: "Design the checkout page",
    mockTask1Tag: "High priority",
    mockTask2Title: "Connect the payment gateway",
    mockTask2Tag: "Urgent",
    mockTask3Title: "Write product descriptions",
    mockTask3Tag: "Suggested by AI",
    mockTask4Title: "Pick the store’s colors",
    mockTask4Tag: "Done",
    mockAiUser: "Break the store launch into tasks for this week",
    mockAiReply: "Here are 3 tasks ordered by priority. You can add them to the board right away:",
    mockAiBtn: "Add all 3 tasks",
    mockTeamTitle: "Each member’s tasks",
    mockTeamSub: "How many tasks each person has, and how many are done",
    mockProgressLabel: "Project progress",

    // User Journey Section
    journeyEyebrow: "How it works",
    journeyTitle: "4 steps from sign-up to delivery",
    journeyDesc: "This is how a team uses Enjaz from day one. Pick a step to see the details.",
    j1Step: "Step 1",
    j1Title: "Get in within seconds",
    j1Short: "With just your name, or with Google, Discord or GitHub.",
    j1StageBadge: "Step 1 · Sign in",
    j1StageTitle: "With an account or without, your choice",
    j1StageDesc: "Type your name and start right away as a guest, or sign in with Google, Discord or GitHub. If you start as a guest and sign in later, your projects stay with you. Choose Arabic or English for the interface.",
    j1Pill1: "Guest access",
    j1Pill2: "Google · Discord · GitHub",
    j1Pill3: "Arabic or English",

    j2Step: "Step 2",
    j2Title: "Create a project, invite your team",
    j2Short: "Each project has a code. Send it to your teammates to join.",
    j2StageBadge: "Step 2 · Project & team",
    j2StageTitle: "A project only your team can see",
    j2StageDesc: "Create a project with a name and a logo, then send its code or link to your teammates. Only people who join can see it, and nobody sees your other projects.",
    j2Pill1: "Project name & logo",
    j2Pill2: "Join by code or link",
    j2Pill3: "Members only",

    j3Step: "Step 3",
    j3Title: "Plan with the AI assistant",
    j3Short: "Describe your goal and get a ready task list.",
    j3StageBadge: "Step 3 · Planning",
    j3StageTitle: "From one big goal to small, clear tasks",
    j3StageDesc: "Type something like “prepare the store launch” and the assistant suggests tasks ordered by priority, which you add to the board in one click. You can also attach a PDF, Word or Excel file for it to pull tasks from.",
    j3Pill1: "Tasks ordered by priority",
    j3Pill2: "Reads your files and images",
    j3Pill3: "Add in one click",

    j4Step: "Step 4",
    j4Title: "Get it done, track progress",
    j4Short: "Move tasks between columns; everyone sees it instantly.",
    j4StageBadge: "Step 4 · Execution",
    j4StageTitle: "Everyone sees progress at the same moment",
    j4StageDesc: "Drag a task from “To do” to “In progress”, then to “Done”. Progress updates for every teammate instantly, and you can see late tasks and what each person is working on.",
    j4Pill1: "Drag and drop",
    j4Pill2: "Live progress",
    j4Pill3: "Tasks per member",
    journeyNext: "Next step",
    journeyPrev: "Previous step",
    journeyTryNow: "Try it in the app",

    // Bento Features
    featuresEyebrow: "Features",
    featuresTitle: "Everything your team needs, in one place",
    featuresDesc: "Instead of jumping between chat groups, spreadsheets and files: tasks, team and discussion on one page.",
    f1Badge: "Tasks",
    f1Title: "Board, table and calendar views",
    f1Desc: "Arrange tasks in three columns: To do, In progress and Done. Give each task a priority, a due date and an owner, then search and filter by person. Late tasks show up in red.",
    f2Badge: "AI",
    f2Title: "An assistant that breaks down the work",
    f2Desc: "It knows your project and its tasks, so it suggests new tasks, splits big ones into steps, and reads images and PDF, Word and Excel files. Free, with nothing to set up.",
    f3Title: "Instant updates for the whole team",
    f3Desc: "Every change shows up for your teammates immediately, without refreshing. Invite people with the project code, or share a link that opens just one project.",
    f4Title: "Built for Arabic, works in English too",
    f4Desc: "The interface is designed for right-to-left Arabic. Switch to English in one click, and the app remembers your choice.",
    f5Title: "Team and profiles",
    f5Desc: "Sign in or join as a guest, add your photo and role, and see each member’s tasks and what they finished. You can also add people without an account so you can assign them tasks.",
    f6Title: "A look for each project, and a quick guide",
    f6Desc: "Pick an icon for your project or upload its logo. A short guide shows new members how to get started.",

    // What's New
    navNew: "What’s new",
    nwPill: "NEW",
    nwEyebrow: "Latest additions",
    nwTitle: "New additions that make teamwork easier",
    nwDesc: "Discussion inside every task, a calendar for deadlines, a log of everything that happens, and notifications at the right moment.",
    nw1Badge: "New view",
    nw1Title: "Task calendar",
    nw1Desc: "See deadlines on a monthly calendar and drag any task to another day to change its date. Late tasks show up in red.",
    nw2Badge: "Collaboration",
    nw2Title: "Comments & @mentions",
    nw2Desc: "Discuss work inside the task instead of a chat app. Type @, pick a teammate, and they get notified right away.",
    nw3Badge: "AI-powered",
    nw3Title: "Task checklists",
    nw3Desc: "Split any task into small steps, or let AI do it in one click. Progress shows right on the task card.",
    nw4Title: "Activity feed",
    nw4Desc: "Every change is logged as it happens: who added a task, who moved it, and who commented.",
    nw5Title: "Notifications",
    nw5Desc: "Get notified when someone assigns you a task, @mentions you, or comments on your task, even when the app is in another tab.",
    nw6Title: "Daily summary",
    nw6Desc: "When you open the app you see today’s tasks, late tasks and what the team finished, plus a short summary suggesting where to start.",
    nw7Title: "Instant updates & undo",
    nw7Desc: "Every change appears immediately. Deleted a task by mistake? Bring it back with Undo.",
    nw8Title: "Install it on your phone",
    nw8Desc: "Install Enjaz as an app on your phone or computer, and browse your latest data even without internet.",
    nw9Title: "Your projects stay private",
    nw9Desc: "Only members can see a project, and project codes are random, so they can’t be guessed.",
    nwCta: "Try the new features",
    nwMockMonth: "November",
    nwMockMention: "@Omar",
    nwMockComment1: "please review the design before the deadline",
    nwMockComment2: "On it, I’ll finish it today 👍",
    nwMockStep1: "Gather requirements",
    nwMockStep2: "Sketch the UI",
    nwMockStep3: "Team review",
    nwMockStep4: "Hand it in",

    // FAQ
    faqEyebrow: "FAQ",
    faqTitle: "Everything you want to know about Enjaz",
    footerFaq: "FAQ",
    footerBy: "Built by",
    faq1Q: "What is Enjaz?",
    faq1A: "Enjaz is a free web app for managing team projects in Arabic and English. You add tasks and assign them to your team, everyone sees updates the moment they happen, and an AI assistant turns big goals into small tasks.",
    faq2Q: "Is Enjaz free?",
    faq2A: "Yes. Enjaz is completely free, with no subscription and no credit card, and its source code is open and published on GitHub.",
    faq3Q: "Does Enjaz support Arabic?",
    faq3A: "Yes. Enjaz is built Arabic-first with a fully right-to-left interface, and you can switch to English in one click.",
    faq4Q: "How do I add my team to a project?",
    faq4A: "Every project has its own code (like PRJ-7KQ2-MX9D-4HTA) and a share link. Send either one to your teammates; anyone who joins sees the project and every update right away.",
    faq5Q: "Do I need to create an account?",
    faq5A: "No. You can start as a guest with just your name, or sign in with Google, Discord or GitHub. If you sign in later, your projects stay with you.",
    faq6Q: "How does the AI work in Enjaz?",
    faq6A: "The app has an AI assistant that knows your project. Describe your goal and it suggests tasks ordered by priority that you add in one click; it also splits any task into steps and reads images and PDF, Word and Excel files. It’s free and needs no setup.",
    faq7Q: "Is my project data safe and private?",
    faq7A: "Yes. Only members can see a project, and that rule is enforced on the server, not just in the browser. Project codes are random, so they can’t be guessed.",
    faq8Q: "Does Enjaz work on mobile?",
    faq8A: "Yes. It works on any phone, and you can install Enjaz as an app on your phone or computer and browse your latest data even without internet.",
    faq9Q: "Who built Enjaz?",
    faq9A: "Enjaz was built by Omariooo, and its code is open to everyone on GitHub.",

    // Mockup labels
    mockInitOmar: "O",
    mockInit1: "M",
    mockName1: "Mahmoud",
    mockInit2: "S",
    mockName2: "Sara",
    mockInit3: "A",
    mockName3: "Ahmed",
    mockAiLabel: "AI assistant",
    mockAiT1: "1. Prepare product photos",
    mockAiT2: "2. Set shipping prices",
    mockAiT3: "3. Test a full order",
    mockTasksUnit: "tasks",
    j1MockTitle: "Sign in",
    j1MockSub: "Guest · Google · Discord · GitHub",
    j1MockBadge: "AR / EN",
    j2MockLabel: "Project code",
    j3MockLabel: "AI assistant · Alt + A",
    j3MockBadge: "Free",
    j4MockLabel: "Project progress",
    j4MockValue: "100% done",

    // Product Use Cases & Value Comparison
    ucEyebrow: "Who it’s for",
    ucTitle: "Fits any team, big or small",
    ucDesc: "A few examples of who uses Enjaz and how it helps:",
    uc1Title: "Software and product teams",
    uc1Desc: "Plan the coming weeks, set priorities, and split each new feature into tasks with the AI assistant.",
    uc2Title: "Graduation projects and student teams",
    uc2Desc: "Classmates join with the code, everyone knows their tasks, and you can all see progress before the deadline.",
    uc3Title: "Agencies and marketing teams",
    uc3Desc: "Send a client a link that opens only their project, so they can follow progress without seeing your other work.",
    uc4Title: "Freelancers and personal tasks",
    uc4Desc: "Organize your daily tasks, keep track of deadlines, and let the assistant help when you don’t know where to start.",
    cmpTitle: "Before and after Enjaz",
    cmpBadge: "Quick comparison",
    cmpBeforeTitle: "Before Enjaz",
    cmpBefore1: "Tasks lost between chat messages and files.",
    cmpBefore2: "Complicated tools with poor Arabic support.",
    cmpBefore3: "Hours spent splitting a project into tasks.",
    cmpAfterTitle: "With Enjaz",
    cmpAfter1: "One board the whole team sees, always up to date.",
    cmpAfter2: "A clear Arabic interface, with English when you need it.",
    cmpAfter3: "The assistant splits a project into tasks in seconds.",
    cmpCta: "Try it for free",

    // CTA & Footer
    ctaBandTitle: "Ready to try it?",
    ctaBandDesc: "Create your first project in under a minute. Free, with no install and no credit card.",
    ctaBandBtn: "Start for free",
    footerNote: "Enjaz — a free, open-source team project manager.",
    footerLaunch: "Open the app",
    footerTop: "Back to top"
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
