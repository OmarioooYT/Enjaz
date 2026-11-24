const SUPABASE_URL = 'https://ptyahjbxuztnatjbgzoo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GcfG0NF3sVVWewXxBJpcNw_YWmg9IGd';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const initialParams = new URLSearchParams(window.location.search);
const urlProjectParam = initialParams.get('project');
let isSharedMode = Boolean(urlProjectParam && initialParams.get('shared') === '1');
let sharedOnlyProjectId = isSharedMode ? urlProjectParam : null;

let projects = [];
let tasks = [];
let members = [];
let activeProjectId = urlProjectParam || null;
let viewMode = 'board';
let selectedAssignee = 'all';
let searchQuery = '';
let draggedTaskId = null;
let currentUser = null;
let tutorialStep = 0;
let currentLang = localStorage.getItem('enjaz_lang') === 'en' ? 'en' : 'ar';
