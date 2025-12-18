// Sound Effects Manager
const sounds = {
  click: document.getElementById('clickSound'),
};

// Function to play sound
function playSound(soundName) {
  const sound = sounds[soundName];
  if (sound) {
    sound.currentTime = 0; // Reset to start
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

// --- Language Translations ---
const translations = {
  ar: {
    brand: 'تحليلي',
    menuTitle: 'القائمة',
    home: 'الرئيسية',
    aiAssistant: 'مساعد الذكاء الاصطناعي',
    newAnalysis: 'تحليل جديد',
    diet: 'النظام الغذائي',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',
    languageSwitch: 'English / العربية',
    successTitle: 'تم تحليل النتائج بنجاح',
    extractedTextTitle: 'النص المستخرج',
    show: 'عرض',
    hide: 'إخفاء',
    detailedAnalysis: 'التحليل الطبي المفصل',
    askQuestion: 'هل لديك استفسار محدد حول هذه النتائج؟ اسأل هنا ليقوم الذكاء الاصطناعي بتحديث الشرح.',
    inputPlaceholder: 'مثال: ماذا تعني نسبة السكر المرتفعة؟',
    shareWhatsapp: 'مشاركة عبر واتساب',
    downloadText: 'حفظ نصي',
    analyzeAnother: 'تحليل صورة أخرى',
    updatingAnalysis: 'جاري تحديث التحليل بناءً على سؤالك...',
    aiError: 'حدث خطأ أثناء الاتصال بالمساعد الذكي.',
    extractionError: 'فشل في استخراج البيانات.',
    noDataWarning: 'لا توجد بيانات تحليل حديثة. يرجى البدء من جديد.',
    whatsappTitle: '*نتائج التحليل الطبي*',
    analysisLabel: '*التحليل:*'
  },
  en: {
    brand: 'My Analysis',
    menuTitle: 'Menu',
    home: 'Home',
    aiAssistant: 'AI Assistant',
    newAnalysis: 'New Analysis',
    diet: 'Diet Plan',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    languageSwitch: 'العربية / English',
    successTitle: 'Results Analyzed Successfully',
    extractedTextTitle: 'Extracted Text',
    show: 'Show',
    hide: 'Hide',
    detailedAnalysis: 'Detailed Medical Analysis',
    askQuestion: 'Have a specific question about these results? Ask here and AI will update the explanation.',
    inputPlaceholder: 'Example: What does high blood sugar mean?',
    shareWhatsapp: 'Share via WhatsApp',
    downloadText: 'Save as Text',
    analyzeAnother: 'Analyze Another Image',
    updatingAnalysis: 'Updating analysis based on your question...',
    aiError: 'An error occurred while connecting to the AI assistant.',
    extractionError: 'Failed to extract data.',
    noDataWarning: 'No recent analysis data found. Please start over.',
    whatsappTitle: '*Medical Analysis Results*',
    analysisLabel: '*Analysis:*'
  }
};

// --- DOM Elements ---
const els = {
  menuToggle: document.getElementById('menuToggle'),
  closeMenu: document.getElementById('closeMenu'),
  sidebar: document.getElementById('sidebar'),
  overlay: document.getElementById('sidebarOverlay'),
  themeToggle: document.getElementById('themeToggle'),
  themeIcon: document.getElementById('themeIcon'),
  themeText: document.getElementById('themeText'),
  mainCard: document.getElementById('mainCard'),
  pageLoader: document.getElementById('pageLoader'),
  extractedText: document.getElementById('extractedText'),
  toggleExtracted: document.getElementById('toggleExtracted'),
  analysisResult: document.getElementById('analysisResult'),
  askInput: document.getElementById('askInput'),
  askBtn: document.getElementById('askBtn'),
  errorMsg: document.getElementById('errorMessage'),
  whatsappBtn: document.getElementById('whatsappBtn'),
  downloadBtn: document.getElementById('downloadBtn')
};

// --- State ---
let chatHistory = [];
let currentAnalysisMarkdown = "";
let currentLanguage = 'ar';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initTheme();
  loadAnalysisData();
  setupEventListeners();
  setupAutoResize();
});

// --- Auto-resize textarea ---
function setupAutoResize() {
  if (els.askInput) {
    els.askInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
  }
}

// --- Language Logic ---
function initLanguage() {
  currentLanguage = localStorage.getItem('language') || 'ar';
  document.documentElement.setAttribute('lang', currentLanguage);
  document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
  updateLanguageUI();
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
  localStorage.setItem('language', currentLanguage);
  document.documentElement.setAttribute('lang', currentLanguage);
  document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
  updateLanguageUI();
}

function updateLanguageUI() {
  const t = translations[currentLanguage];
  
  // Update all text elements
  const brandSpan = document.querySelector('.navbar .brand span');
  if (brandSpan) brandSpan.textContent = t.brand;
  
  const sidebarBrand = document.querySelector('.sidebar-header .brand');
  if (sidebarBrand) sidebarBrand.textContent = t.menuTitle;
  
  // Menu items
  const menuLinks = document.querySelectorAll('.menu-link');
  if (menuLinks[0]) menuLinks[0].innerHTML = `<i class="fas fa-home"></i> ${t.home}`;
  if (menuLinks[1]) menuLinks[1].innerHTML = `<i class="fas fa-robot"></i> ${t.aiAssistant}`;
  if (menuLinks[2]) menuLinks[2].innerHTML = `<i class="fas fa-upload"></i> ${t.newAnalysis}`;
  if (menuLinks[3]) menuLinks[3].innerHTML = `<i class="fas fa-apple-alt"></i> ${t.diet}`;
  
  // Theme toggle text
  const currentTheme = document.documentElement.getAttribute('data-theme');
  els.themeText.textContent = currentTheme === 'dark' ? t.lightMode : t.darkMode;
  
  // Language toggle button
  const langToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  if (langToggleBtns[1]) {
    langToggleBtns[1].innerHTML = `<i class="fas fa-globe"></i><span>${t.languageSwitch}</span>`;
  }
  
  // Main content
  const statusText = document.querySelector('.status-text');
  if (statusText) statusText.textContent = t.successTitle;
  
  const extractedHeader = document.querySelector('.extracted-header span');
  if (extractedHeader) extractedHeader.innerHTML = `<i class="fas fa-file-alt"></i> ${t.extractedTextTitle}`;
  
  if (els.toggleExtracted) {
    els.toggleExtracted.textContent = els.extractedText.classList.contains('expanded') ? t.hide : t.show;
  }
  
  const sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) sectionTitle.innerHTML = `<i class="fas fa-stethoscope"></i> ${t.detailedAnalysis}`;
  
  // Interaction area
  const interactionP = document.querySelector('.interaction-area p');
  if (interactionP) {
    interactionP.innerHTML = `
      <i class="fas fa-sparkles" style="color: var(--secondary);"></i> 
      ${t.askQuestion}
    `;
  }
  
  if (els.askInput) els.askInput.placeholder = t.inputPlaceholder;
  
  // Buttons
  if (els.whatsappBtn) els.whatsappBtn.innerHTML = `<i class="fab fa-whatsapp"></i> ${t.shareWhatsapp}`;
  if (els.downloadBtn) els.downloadBtn.innerHTML = `<i class="fas fa-file-download"></i> ${t.downloadText}`;
  
  const analyzeAnotherBtn = document.querySelector('.btn-secondary');
  if (analyzeAnotherBtn) {
    analyzeAnotherBtn.innerHTML = `<i class="fas fa-redo"></i> ${t.analyzeAnother}`;
  }
}

// --- Theme Logic ---
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeUI(newTheme);
}

function updateThemeUI(theme) {
  const t = translations[currentLanguage];
  if (theme === 'dark') {
    els.themeIcon.className = 'fas fa-sun';
    els.themeIcon.style.color = '#F59E0B';
    els.themeText.textContent = t.lightMode;
  } else {
    els.themeIcon.className = 'fas fa-moon';
    els.themeIcon.style.color = '';
    els.themeText.textContent = t.darkMode;
  }
}

// --- Sidebar Logic ---
function toggleSidebar(show) {
  if (show) {
    els.sidebar.classList.add('active');
    els.overlay.classList.add('active');
  } else {
    els.sidebar.classList.remove('active');
    els.overlay.classList.remove('active');
  }
}

// --- Data Loading & Analysis ---
function loadAnalysisData() {
  const t = translations[currentLanguage];
  const ocrStatus = localStorage.getItem('ocrStatus');
  const extractedText = localStorage.getItem('extractedText');
  const groqResponse = localStorage.getItem('geminiResponse'); // Keep the key name for backward compatibility
  const error = localStorage.getItem('analysisError');

  els.pageLoader.style.display = 'none';

  if (ocrStatus === 'fail' || error) {
    showError(error || t.extractionError);
    return;
  }

  if (ocrStatus === 'success' && extractedText && groqResponse) {
    // Show Content
    els.mainCard.style.display = 'block';
    
    // Populate Extracted Text
    els.extractedText.textContent = extractedText;
    
    // Render Markdown
    currentAnalysisMarkdown = groqResponse;
    els.analysisResult.innerHTML = marked.parse(groqResponse);

    // Initialize History for AI context
    const systemPrompt = currentLanguage === 'ar' 
      ? `هذا هو النص المستخرج من التحليل الطبي:\n${extractedText}\n\nقم بتحليل هذه النتائج.`
      : `This is the extracted text from the medical analysis:\n${extractedText}\n\nAnalyze these results.`;
    
    chatHistory = [
      {
        role: 'user',
        content: systemPrompt
      },
      {
        role: 'assistant',
        content: groqResponse
      }
    ];
  } else {
    // No data found
    els.mainCard.style.display = 'none';
    const warningMsg = document.getElementById('warningMessage');
    if (warningMsg) {
      warningMsg.style.display = 'block';
      warningMsg.textContent = t.noDataWarning;
    }
  }
}

// --- AI Interaction Logic ---
async function handleAskAI() {
  const t = translations[currentLanguage];
  const query = els.askInput.value.trim();
  if (!query) return;

  // Validate CONFIG
  if (!CONFIG || !CONFIG.isValid()) {
    console.error('❌ CONFIG is not valid');
    els.analysisResult.innerHTML = `<div class="alert alert-error">${t.aiError}</div>` + marked.parse(currentAnalysisMarkdown);
    return;
  }

  // Disable UI
  els.askInput.disabled = true;
  els.askBtn.disabled = true;
  
  // Show loading inside analysis box
  els.analysisResult.innerHTML = `
    <div class="loader">
      <div class="spinner"></div>
      <p style="margin-${currentLanguage === 'ar' ? 'right' : 'left'}: 15px; color: var(--secondary);">${t.updatingAnalysis}</p>
    </div>
  `;

  try {
    // Add user query to history
    chatHistory.push({
      role: 'user',
      content: query
    });

    // Call Groq API
    const response = await fetch(CONFIG.getApiUrl(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.getApiKey()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.getModel(),
        messages: chatHistory
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const newText = data.choices[0].message.content;
      
      // Update History
      chatHistory.push({
        role: 'assistant',
        content: newText
      });

      // Update UI with new Markdown
      currentAnalysisMarkdown = newText;
      els.analysisResult.innerHTML = marked.parse(newText);
      
      // Clear input
      els.askInput.value = '';
    } else {
      throw new Error('No response content');
    }

  } catch (err) {
    console.error('❌ Groq API Error:', err);
    els.analysisResult.innerHTML = `<div class="alert alert-error">${t.aiError}</div>` + marked.parse(currentAnalysisMarkdown);
  } finally {
    els.askInput.disabled = false;
    els.askBtn.disabled = false;
    els.askInput.focus();
  }
}

// --- Event Listeners ---
function setupEventListeners() {
  // Menu
  els.menuToggle.addEventListener('click', () => toggleSidebar(true));
  els.closeMenu.addEventListener('click', () => toggleSidebar(false));
  els.overlay.addEventListener('click', () => toggleSidebar(false));
  
  // Theme
  els.themeToggle.addEventListener('click', toggleTheme);

  // Language Toggle
  const langToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  langToggleBtns[1].addEventListener('click', toggleLanguage);

  // Text Toggle
  els.toggleExtracted.addEventListener('click', () => {
    const t = translations[currentLanguage];
    els.extractedText.classList.toggle('expanded');
    els.toggleExtracted.textContent = els.extractedText.classList.contains('expanded') ? t.hide : t.show;
  });

  // AI Input
  els.askBtn.addEventListener('click', handleAskAI);
  els.askInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAskAI();
  });

  // WhatsApp Share
  els.whatsappBtn.addEventListener('click', () => {
    const t = translations[currentLanguage];
    const text = `${t.whatsappTitle}\n\n${els.extractedText.textContent.substring(0, 100)}...\n\n${t.analysisLabel}\n${currentAnalysisMarkdown}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  // Download
  els.downloadBtn.addEventListener('click', () => {
    const content = els.extractedText.textContent + "\n\n----------------\n\n" + currentAnalysisMarkdown;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Medical_Analysis_Result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

function showError(msg) {
  els.errorMsg.style.display = 'block';
  els.errorMsg.textContent = msg;
  els.mainCard.style.display = 'none';
}