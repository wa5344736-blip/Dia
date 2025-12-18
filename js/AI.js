// Claude Chat Application - Firebase Integrated with Groq AI
// Import Firebase functions
import { auth, db, listenToAuth, getUserProfile, getUserSessions } from './firestore.js';

// ============================================
// SOUND EFFECTS MANAGER
// ============================================
const sounds = {
  click: document.getElementById('clickSound'),
};

function playSound(soundName) {
  const sound = sounds[soundName];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(err => console.log('Sound play failed:', err));
  }
}

// Add click sound to ALL buttons
document.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (button) {
    playSound('click');
  }
});

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  en: {
    newChat: 'New chat',
    home: 'Home',
    diet: 'Diet',
    upload: 'Upload',
    recent: 'Recent',
    freePlan: 'Free plan',
    messagePlaceholder: 'Message Beaty...',
    replyPlaceholder: 'Reply to Beaty...',
    suggest1: 'I feel so tired',
    suggest2: 'Can I fast today?',
    settingsHeader: 'Settings',
    languageLabel: 'اللغة العربية (Arabic)',
    themeLabel: 'Dark mode',
    cancel: 'Cancel',
    save: 'Save',
    you: 'You',
    claude: 'Beaty-AI',
    heroText: 'How can I help you today?',
    topPlanText: 'Made by Wagdy'
  },
  ar: {
    newChat: 'محادثة جديدة',
    home: 'الرئيسية',
    diet: 'نظام غذائي',
    upload: 'التحليل',
    recent: 'الأخيرة',
    freePlan: 'خطة مجانية',
    messagePlaceholder: 'اكتب رسالة إلى بيتي...',
    replyPlaceholder: 'الرد على بيتي...',
    suggest1: 'اشعر بالتعب الشديد',
    suggest2: 'هل يمكنني الصيام اليوم؟',
    settingsHeader: 'الإعدادات',
    languageLabel: 'اللغة الإنجليزية (English)',
    themeLabel: 'الوضع الداكن',
    cancel: 'إلغاء',
    save: 'حفظ',
    you: 'أنت',
    claude: 'بيتي',
    heroText: 'كيف يمكنني مساعدتك اليوم؟',
    topPlanText: 'صنع بواسطة وجدي'
  }
};

// ============================================
// API CONFIGURATION - GROQ مشفر
// ============================================
const GROQ_API_KEY = CONFIG.getApiKey();
const GROQ_API_URL = CONFIG.getApiUrl();
const GROQ_MODEL = CONFIG.getModel();

// التحقق من وجود API Key
if (!GROQ_API_KEY) {
  console.error('❌ Failed to load API configuration');
}

// ============================================
// APPLICATION STATE
// ============================================
let userName = '';
let userFirstName = '';
let readableAnswers = []; 
let currentUserId = null;
let currentLang = 'ar';
let currentTheme = 'light';
let conversations = [];
let currentConversationId = null;
let sidebarOpen = true;
let userScrolled = true;

// ============================================
// CHAT HISTORY MEMORY (In-Memory Storage)
// ============================================
let currentChatHistory = []; // Stores all messages in current conversation for context

// ============================================
// MARKDOWN CONFIGURATION
// ============================================
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  });
}

// ============================================
// FIREBASE INITIALIZATION
// ============================================
async function initializeUserData() {
  try {
    await new Promise((resolve) => {
      listenToAuth((user) => {
        if (user) {
          currentUserId = user.uid;
          console.log('✅ User authenticated:', currentUserId);
          resolve();
        } else {
          console.log('❌ No user logged in, redirecting...');
          window.location.href = 'login.html';
        }
      });
    });

    if (!currentUserId) return;

    const userProfile = await getUserProfile(currentUserId);
    if (userProfile && userProfile.name) {
      userName = userProfile.name;
      userFirstName = userName.split(' ')[0];
      updateUserName(userName);
      updateHeroText();
      console.log('✅ User name loaded:', userName);
    }

    const sessions = await getUserSessions(currentUserId, 1);
    if (sessions && sessions.length > 0) {
      const latestSession = sessions[0];
      console.log('📦 Latest session data found');
      
      const rawData = latestSession.readableAnswers || latestSession.answers || {};

      if (Array.isArray(rawData)) {
        readableAnswers = rawData;
      } else if (typeof rawData === 'object' && rawData !== null) {
        readableAnswers = Object.entries(rawData).map(([key, value]) => ({
          question: key,
          answer: value
        }));
      } else {
        readableAnswers = [];
      }
      
      console.log('✅ User assessment data loaded:', readableAnswers.length, 'items');
    } else {
      console.log('ℹ️ No sessions found, using empty assessment data');
      readableAnswers = [];
    }
  } catch (error) {
    console.error('❌ Error initializing user data:', error);
    readableAnswers = [];
  }
}

// ============================================
// LOCALSTORAGE FUNCTIONS (Settings Only)
// ============================================
function loadSettings() {
  try {
    const savedSettings = localStorage.getItem('claude_settings');
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      currentLang = settings.language || 'ar';
      currentTheme = settings.theme || 'light';
      sidebarOpen = settings.sidebarOpen !== undefined ? settings.sidebarOpen : true;
      
      applyLanguage(currentLang);
      applyTheme(currentTheme);
      setSidebarState(sidebarOpen);
      console.log('✅ Settings loaded from localStorage');
    } else {
      applyLanguage('ar');
      applyTheme('light');
      console.log('ℹ️ No saved settings, using defaults');
    }
  } catch (error) {
    console.error('❌ Error loading settings:', error);
    applyLanguage('ar');
    applyTheme('light');
  }
}

function saveSettings() {
  try {
    const settings = {
      language: currentLang,
      theme: currentTheme,
      sidebarOpen: sidebarOpen,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('claude_settings', JSON.stringify(settings));
    console.log('✅ Settings saved');
  } catch (error) {
    console.error('❌ Failed to save settings:', error);
  }
}

// ============================================
// LANGUAGE & THEME
// ============================================
function applyLanguage(lang) {
  currentLang = lang;
  document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  
  const t = translations[lang];
  
  const updateElement = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  updateElement('newChatText', t.newChat);
  updateElement('homeText', t.home);
  updateElement('dietText', t.diet);
  updateElement('uploadText', t.upload);
  updateElement('recentHeader', t.recent);
  updateElement('planText', t.freePlan);
  updateElement('topPlanText', t.topPlanText);
  updateElement('settingsHeader', t.settingsHeader);
  updateElement('languageLabel', t.languageLabel);
  updateElement('themeLabel', t.themeLabel);
  updateElement('cancelBtn', t.cancel);
  updateElement('saveBtn', t.save);
  updateElement('suggest1', t.suggest1);
  updateElement('suggest2', t.suggest2);
  
  const mainInput = document.getElementById('mainInput');
  const bottomTextarea = document.getElementById('bottomTextarea');
  if (mainInput) mainInput.placeholder = t.messagePlaceholder;
  if (bottomTextarea) bottomTextarea.placeholder = t.replyPlaceholder;
  
  updateHeroText();
  
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    if (lang === 'en') {
      languageToggle.classList.add('active');
      languageToggle.setAttribute('aria-checked', 'true');
    } else {
      languageToggle.classList.remove('active');
      languageToggle.setAttribute('aria-checked', 'false');
    }
  }
  
  const chips = document.querySelectorAll('.suggestion-chip');
  const suggestions = [t.suggest1, t.suggest2];
  
  chips.forEach((chip, index) => {
    if (suggestions[index]) {
      chip.setAttribute('data-suggestion', suggestions[index]);
    }
  });
}

function applyTheme(theme) {
  currentTheme = theme;
  const themeToggle = document.getElementById('themeToggle');
  
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    if (themeToggle) {
      themeToggle.classList.add('active');
      themeToggle.setAttribute('aria-checked', 'true');
    }
  } else {
    document.body.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.classList.remove('active');
      themeToggle.setAttribute('aria-checked', 'false');
    }
  }
}

function updateUserName(name) {
  userName = name;
  userFirstName = name.split(' ')[0];
  
  const userNameEl = document.getElementById('userName');
  const userAvatarEl = document.getElementById('userAvatar');
  
  if (userNameEl) userNameEl.textContent = name;
  if (userAvatarEl) userAvatarEl.textContent = userFirstName.charAt(0).toUpperCase();
}

function updateHeroText() {
  const heroElement = document.getElementById('heroText');
  if (!heroElement) return;
  
  if (currentLang === 'ar') {
    heroElement.textContent = userFirstName 
      ? `كيف يمكنني مساعدتك اليوم يا ${userFirstName}؟` 
      : 'كيف يمكنني مساعدتك اليوم؟';
  } else {
    heroElement.textContent = userFirstName 
      ? `How can I help you today, ${userFirstName}?` 
      : 'How can I help you today?';
  }
}

// ============================================
// SIDEBAR TOGGLE WITH OVERLAY
// ============================================
function setSidebarState(isOpen) {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const menuBtn = document.getElementById('menuBtn');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  if (!sidebar || !mainContent || !menuBtn || !sidebarOverlay) return;
  
  sidebarOpen = isOpen;
  
  if (isOpen) {
    sidebar.classList.add('open');
    sidebar.classList.remove('closed');
    mainContent.classList.remove('expanded');
    menuBtn.classList.remove('visible');
    
    if (window.innerWidth <= 768) {
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  } else {
    sidebar.classList.remove('open');
    sidebar.classList.add('closed');
    mainContent.classList.add('expanded');
    menuBtn.classList.add('visible');
    
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  saveSettings();
}

function toggleSidebar() {
  setSidebarState(!sidebarOpen);
}

function closeSidebar() {
  setSidebarState(false);
}

// ============================================
// AUTO-RESIZE TEXTAREA
// ============================================
function autoResize(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

// ============================================
// CONVERSATION MANAGEMENT (In-Memory)
// ============================================
function createNewChat() {
  const newId = Date.now().toString();
  const newConv = {
    id: newId,
    title: currentLang === 'ar' ? 'محادثة جديدة' : 'New conversation',
    messages: [],
    timestamp: new Date().toISOString()
  };
  conversations.unshift(newConv);
  currentConversationId = newId;
  currentChatHistory = []; // Reset chat history for new conversation
  renderRecentsList();
  showWelcomeScreen();
  
  const mainInput = document.getElementById('mainInput');
  const bottomTextarea = document.getElementById('bottomTextarea');
  if (mainInput) mainInput.value = '';
  if (bottomTextarea) bottomTextarea.value = '';
  
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
}

function renderRecentsList() {
  const list = document.getElementById('recentsList');
  if (!list) return;
  
  list.innerHTML = '';
  conversations.forEach(conv => {
    const btn = document.createElement('button');
    btn.className = 'recent-item';
    if (conv.id === currentConversationId) {
      btn.classList.add('active');
    }
    
    // Create text span
    const textSpan = document.createElement('span');
    textSpan.className = 'recent-item-text';
    textSpan.textContent = conv.title;
    
    // Create actions container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'recent-item-actions';
    
    // Rename button
    const renameBtn = document.createElement('button');
    renameBtn.className = 'recent-action-btn rename';
    renameBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    renameBtn.setAttribute('aria-label', 'Rename chat');
    renameBtn.onclick = (e) => {
      e.stopPropagation();
      startRenaming(conv.id, btn, textSpan);
    };
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'recent-action-btn delete';
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.setAttribute('aria-label', 'Delete chat');
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      confirmDeleteChat(conv.id);
    };
    
    actionsDiv.appendChild(renameBtn);
    actionsDiv.appendChild(deleteBtn);
    
    btn.appendChild(textSpan);
    btn.appendChild(actionsDiv);
    
    btn.onclick = () => {
      if (!btn.classList.contains('editing')) {
        loadConversation(conv.id);
        if (window.innerWidth <= 768) {
          closeSidebar();
        }
      }
    };
    
    list.appendChild(btn);
  });
}
// ============================================
// CHAT RENAME FUNCTIONALITY
// ============================================
function startRenaming(convId, btnElement, textSpan) {
  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;
  
  btnElement.classList.add('editing');
  
  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'recent-item-input';
  input.value = conv.title;
  
  // Replace text with input
  textSpan.replaceWith(input);
  input.focus();
  input.select();
  
  // Save on Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finishRenaming(convId, input.value.trim(), btnElement);
    } else if (e.key === 'Escape') {
      renderRecentsList();
    }
  });
  
  // Save on blur
  input.addEventListener('blur', () => {
    setTimeout(() => {
      finishRenaming(convId, input.value.trim(), btnElement);
    }, 100);
  });
  
  // Prevent click propagation
  input.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

function finishRenaming(convId, newTitle, btnElement) {
  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;
  
  if (newTitle && newTitle !== conv.title) {
    conv.title = newTitle;
    console.log(`✅ Chat renamed to: ${newTitle}`);
  }
  
  renderRecentsList();
}

// ============================================
// CHAT DELETE FUNCTIONALITY
// ============================================
function confirmDeleteChat(convId) {
  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;
  
  // Create confirm overlay
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay active';
  overlay.innerHTML = `
    <div class="confirm-dialog">
      <h3 class="confirm-header">${currentLang === 'ar' ? 'حذف المحادثة' : 'Delete Chat'}</h3>
      <p class="confirm-message">
        ${currentLang === 'ar' 
          ? `هل أنت متأكد من حذف "${conv.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
          : `Are you sure you want to delete "${conv.title}"? This action cannot be undone.`
        }
      </p>
      <div class="confirm-actions">
        <button class="confirm-btn cancel" id="confirmCancel">
          ${currentLang === 'ar' ? 'إلغاء' : 'Cancel'}
        </button>
        <button class="confirm-btn delete" id="confirmDelete">
          ${currentLang === 'ar' ? 'حذف' : 'Delete'}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Cancel button
  const cancelBtn = overlay.querySelector('#confirmCancel');
  cancelBtn.addEventListener('click', () => {
    overlay.remove();
  });
  
  // Delete button
  const deleteBtn = overlay.querySelector('#confirmDelete');
  deleteBtn.addEventListener('click', () => {
    deleteChat(convId);
    overlay.remove();
  });
  
  // Click outside to cancel
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

function deleteChat(convId) {
  const index = conversations.findIndex(c => c.id === convId);
  if (index === -1) return;
  
  const deletedConv = conversations[index];
  conversations.splice(index, 1);
  
  console.log(`🗑️ Chat deleted: ${deletedConv.title}`);
  
  // If deleted chat was current, switch to another or show welcome
  if (currentConversationId === convId) {
    if (conversations.length > 0) {
      loadConversation(conversations[0].id);
    } else {
      currentConversationId = null;
      currentChatHistory = [];
      showWelcomeScreen();
    }
  }
  
  renderRecentsList();
}

function loadConversation(id) {
  currentConversationId = id;
  const conv = conversations.find(c => c.id === id);
  if (conv && conv.messages.length > 0) {
    currentChatHistory = [...conv.messages]; // Load conversation into memory
    showMessages();
    renderMessages(conv.messages);
  } else {
    currentChatHistory = [];
    showWelcomeScreen();
  }
  renderRecentsList();
}

function showWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcomeScreen');
  const messagesArea = document.getElementById('messagesArea');
  const bottomInput = document.getElementById('bottomInput');
  
  if (welcomeScreen) welcomeScreen.style.display = 'flex';
  if (messagesArea) messagesArea.style.display = 'none';
  if (bottomInput) bottomInput.style.display = 'none';
}

function showMessages() {
  const welcomeScreen = document.getElementById('welcomeScreen');
  const messagesArea = document.getElementById('messagesArea');
  const bottomInput = document.getElementById('bottomInput');
  
  if (welcomeScreen) welcomeScreen.style.display = 'none';
  if (messagesArea) messagesArea.style.display = 'block';
  if (bottomInput) bottomInput.style.display = 'block';
}

// ============================================
// MESSAGE RENDERING WITH MARKDOWN
// ============================================
function renderMessages(messages) {
  const area = document.getElementById('messagesArea');
  if (!area) return;
  
  area.innerHTML = '';
  
  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + msg.role;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar ' + msg.role;
    avatar.textContent = msg.role === 'user' ? userFirstName.charAt(0).toUpperCase() : 'B';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = msg.role === 'user' ? translations[currentLang].you : translations[currentLang].claude;
    
    const text = document.createElement('div');
    text.className = 'message-text';
    
    if (msg.role === 'assistant' && typeof marked !== 'undefined') {
      try {
        text.innerHTML = marked.parse(msg.content);
      } catch (error) {
        console.error('Markdown parsing error:', error);
        text.textContent = msg.content;
      }
    } else {
      text.textContent = msg.content;
    }
    
    content.appendChild(label);
    content.appendChild(text);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);
    area.appendChild(msgDiv);
  });
  
  scrollToBottom(area, true);
}

function addTypingIndicator() {
  const area = document.getElementById('messagesArea');
  if (!area) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message assistant';
  msgDiv.id = 'typingIndicator';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar assistant';
  avatar.textContent = 'B';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  
  const label = document.createElement('div');
  label.className = 'message-label';
  label.textContent = translations[currentLang].claude;
  
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  
  content.appendChild(label);
  content.appendChild(typing);
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(content);
  area.appendChild(msgDiv);
  
  scrollToBottom(area, true);
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.remove();
  }
}

// ============================================
// AUTO-SCROLL FUNCTIONALITY
// ============================================
function scrollToBottom(element, smooth = true) {
  if (!element || userScrolled) return;
  
  if (smooth) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth'
    });
  } else {
    element.scrollTop = element.scrollHeight;
  }
}

function setupScrollTracking() {
  const area = document.getElementById('messagesArea');
  if (!area) return;
  
  let scrollTimeout;
  
  area.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    const isNearBottom = area.scrollHeight - area.scrollTop - area.clientHeight < 100;
    
    if (!isNearBottom) {
      userScrolled = true;
    } else {
      userScrolled = false;
    }
    
    scrollTimeout = setTimeout(() => {
      if (isNearBottom) {
        userScrolled = false;
      }
    }, 2000);
  });
}

// ============================================
// PROMPT BUILDER WITH USER CONTEXT & MEMORY
// ============================================
function buildPromptWithContext(userMessage) {
  let assessmentDataVariable = "";

  if (readableAnswers && readableAnswers.length > 0) {
    assessmentDataVariable = readableAnswers.map((item, index) => {
      const q = item.question || item.q || item.text || `Attribute ${index + 1}`;
      const a = item.answer || item.ans || item.value || JSON.stringify(item);
      return `- ${q}: ${a}`;
    }).join("\n");
  } else {
    assessmentDataVariable = "No assessment data available.";
  }

  // Build chat history context
  let chatHistoryContext = "";
  if (currentChatHistory.length > 0) {
    chatHistoryContext = "\n\n=== CHAT HISTORY (for context) ===\n";
    currentChatHistory.forEach(msg => {
      const role = msg.role === 'user' ? 'المستخدم/User' : 'بيتي/Beaty';
      chatHistoryContext += `${role}: ${msg.content}\n`;
    });
    chatHistoryContext += "==========================================\n";
  }

  const fixedTemplate = `=== PATIENT HEALTH ASSESSMENT DATA ===
${assessmentDataVariable}
==========================================
${chatHistoryContext}

INSTRUCTIONS: أنت مساعد صحي ذكي اسمه (Beaty AI). استخدم بيانات تقييم المريض أعلاه لتقديم نصائح دقيقة وطبية وشخصية بناءً على حالته الصحية وعوامل الخطر الخاصة به. 

MEMORY RULES:
- استخدم سجل المحادثة أعلاه كذاكرة قصيرة المدى
- تذكر الحقائق التي ذكرها المستخدم صراحة (الاسم، الحالة، التفضيلات)
- إذا سأل المستخدم عن معلومة ذكرها سابقاً، استخدم الذاكرة للإجابة
- Use the chat history above as short-term memory
- Remember facts explicitly stated by the user (name, condition, preferences)
- If the user asks about information mentioned earlier, use memory to answer

IMPORTANT LANGUAGE RULES:
- إذا كانت رسالة المستخدم باللغة العربية → جاوب بالعربية فقط
- If the user's message is in English → Answer in English only
- احترم اللغة المستخدمة في السؤال ولا تخلط بينهما

USER MESSAGE:
${userMessage}`;

  console.log('🔍 Prompt generated with context and memory');
  return fixedTemplate;
}

// ============================================
// GROQ API INTEGRATION WITH MEMORY
// ============================================
async function getGroqResponse(userMessage) {
  try {
    const messages = [
      {
        role: 'system',
        content: 'أنت مساعد صحي ذكي ومحترف اسمك Beaty AI. تجيب بدقة ووضوح. تجيب بالعربية للأسئلة العربية وبالإنجليزية للأسئلة الإنجليزية. تركز على الصحة والتغذية والعادات الصحية. لديك ذاكرة قصيرة المدى تعتمد على سجل المحادثة الحالي - تذكر ما يخبرك به المستخدم واستخدمه في إجاباتك.'
      }
    ];
    
    // Add entire chat history for context
    currentChatHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });
    
    // Add current message with full context
    const enhancedMessage = buildPromptWithContext(userMessage);
    messages.push({
      role: 'user',
      content: enhancedMessage
    });

    console.log('🚀 Calling Groq API with memory context...');
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      
      // Handle rate limit
      if (response.status === 429) {
        return currentLang === 'ar' 
          ? 'عذراً، تم تجاوز الحد المسموح للطلبات. يرجى الانتظار دقيقة واحدة ثم المحاولة مرة أخرى.'
          : 'Sorry, rate limit exceeded. Please wait a minute and try again.';
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Groq Response received');
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    throw new Error('Invalid response format from Groq');
    
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return currentLang === 'ar' 
      ? 'عذراً، حدث خطأ في الاتصال بالخدمة. يرجى التحقق من مفتاح API والمحاولة مرة أخرى.'
      : 'Sorry, there was an error connecting to the service. Please check your API key and try again.';
  }
}

async function sendMessage(input) {
  if (!input) return;
  
  const message = input.value.trim();
  if (!message) return;

  if (!currentConversationId) {
    createNewChat();
  }

  const conv = conversations.find(c => c.id === currentConversationId);
  if (!conv) return;
  
  const userMsg = {
    id: Date.now().toString(),
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  };

  conv.messages.push(userMsg);
  currentChatHistory.push(userMsg); // Add to memory
  
  if (conv.messages.length === 1) {
    conv.title = message.slice(0, 50);
    renderRecentsList();
  }

  input.value = '';
  autoResize(input);
  
  showMessages();
  renderMessages(conv.messages);
  addTypingIndicator();
  userScrolled = false;
  
  const aiResponse = await getGroqResponse(message);
  
  removeTypingIndicator();
  
  const aiMsg = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date().toISOString()
  };

  conv.messages.push(aiMsg);
  currentChatHistory.push(aiMsg); // Add to memory
  renderMessages(conv.messages);
}

// ============================================
// HAMBURGER MENU & OVERLAY FUNCTIONALITY
// ============================================
function setupHamburgerMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      setSidebarState(true);
    });
  }
  
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => {
      closeSidebar();
    });
  }
  
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      closeSidebar();
    });
  }
  
  const navItems = document.querySelectorAll('.sidebar .nav-item');
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
}

// ============================================
// KEYBOARD SHORTCUTS & LISTENERS
// ============================================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === 'س')) {
      e.preventDefault();
      toggleSidebar();
    }
  });
}

function setupEventListeners() {
  const mainInput = document.getElementById('mainInput');
  const sendBtn = document.getElementById('sendBtn');
  
  if (mainInput && sendBtn) {
    mainInput.addEventListener('input', function(e) {
      autoResize(e.target);
      sendBtn.disabled = !e.target.value.trim();
    });

    mainInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(this);
      }
    });

    sendBtn.addEventListener('click', function() {
      sendMessage(mainInput);
    });
  }

  const bottomTextarea = document.getElementById('bottomTextarea');
  const bottomSendBtn = document.getElementById('bottomSendBtn');
  
  if (bottomTextarea && bottomSendBtn) {
    bottomTextarea.addEventListener('input', function(e) {
      autoResize(e.target);
      bottomSendBtn.disabled = !e.target.value.trim();
    });

    bottomTextarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(this);
      }
    });

    bottomSendBtn.addEventListener('click', function() {
      sendMessage(bottomTextarea);
    });
  }

  const newChatBtn = document.getElementById('newChatBtn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', createNewChat);
  }

  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      const suggestion = this.getAttribute('data-suggestion');
      if (mainInput && sendBtn) {
        mainInput.value = suggestion;
        sendBtn.disabled = false;
        autoResize(mainInput);
        mainInput.focus();
      }
    });
  });

  const settingsBtn = document.getElementById('settingsBtn');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const cancelBtn = document.getElementById('cancelBtn');
  const saveBtn = document.getElementById('saveBtn');
if (settingsBtn && settingsOverlay) {
settingsBtn.addEventListener('click', function() {
settingsOverlay.classList.add('active');
});
}
if (cancelBtn && settingsOverlay) {
cancelBtn.addEventListener('click', function() {
settingsOverlay.classList.remove('active');
});
}
if (settingsOverlay) {
settingsOverlay.addEventListener('click', function(e) {
if (e.target === this) {
this.classList.remove('active');
}
});
}
if (saveBtn && settingsOverlay) {
saveBtn.addEventListener('click', function() {
saveSettings();
settingsOverlay.classList.remove('active');
});
}
const languageToggle = document.getElementById('languageToggle');
if (languageToggle) {
languageToggle.addEventListener('click', function() {
const newLang = currentLang === 'en' ? 'ar' : 'en';
applyLanguage(newLang);
saveSettings();
});
}
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
themeToggle.addEventListener('click', function() {
const newTheme = currentTheme === 'light' ? 'dark' : 'light';
applyTheme(newTheme);
saveSettings();
});
}
window.addEventListener('resize', function() {
if (window.innerWidth > 768) {
const sidebarOverlay = document.getElementById('sidebarOverlay');
if (sidebarOverlay) {
sidebarOverlay.classList.remove('active');
}
document.body.style.overflow = '';
const menuBtn = document.getElementById('menuBtn');
if (!sidebarOpen && menuBtn) {
menuBtn.classList.add('visible');
}
}
});
}
// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
console.log('🚀 Initializing Beaty AI Chat with Groq + Memory...');
loadSettings();
await initializeUserData();
setupScrollTracking();
setupKeyboardShortcuts();
setupHamburgerMenu();
setupEventListeners();
const menuBtn = document.getElementById('menuBtn');
if (!sidebarOpen && menuBtn) {
menuBtn.classList.add('visible');
}
console.log('✅ Initialization complete - Ready to chat with memory!');
});