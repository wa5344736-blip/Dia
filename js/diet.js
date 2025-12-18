import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD-Jd1rrLO1LC_0EoGIdrNLUCXTfqRh0uM",
    authDomain: "mr-dia.firebaseapp.com",
    projectId: "mr-dia",
    storageBucket: "mr-dia.firebasestorage.app",
    messagingSenderId: "528685312667",
    appId: "1:528685312667:web:cc5f89cf8c1f05f157743e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sound Effects Manager
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

document.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (button) {
        playSound('click');
    }
});

// Translations
const translations = {
    ar: {
        appName: "صوم الصحية",
        userData: "بياناتك الشخصية",
        dietPlan: "خطة النظام الغذائي الشخصية",
        modifyDiet: "تعديل خطة النظام الغذائي",
        modifyPlaceholder: "اكتب طلب التعديل...",
        generating: "جاري إنشاء خطة النظام الغذائي الشخصية...",
        speak: "استمع",
        pause: "إيقاف",
        downloadTXT: "تحميل كملف نصي",
        shareWhatsApp: "مشاركة",
        loadingData: "جاري تحميل بياناتك...",
        notLoggedIn: "يرجى تسجيل الدخول لعرض خطة النظام الغذائي.",
        noDataTitle: "لم يتم العثور على بيانات المستخدم",
        noDataMessage: "يرجى إكمال التقييم أولاً.",
        goHome: "الذهاب للصفحة الرئيسية",
        errorTitle: "عذراً! حدث خطأ ما",
        errorRetry: "يرجى المحاولة مرة أخرى"
    },
    en: {
        appName: "Soom Health",
        userData: "Your Personal Data",
        dietPlan: "Your Personalized Diet Plan",
        modifyDiet: "Modify Your Diet Plan",
        modifyPlaceholder: "Type your modification request...",
        generating: "Generating your personalized diet plan...",
        speak: "Listen",
        pause: "Pause",
        downloadTXT: "Download as TXT",
        shareWhatsApp: "Share",
        loadingData: "Loading your data...",
        notLoggedIn: "Please log in to view your diet plan.",
        noDataTitle: "No User Data Found",
        noDataMessage: "Please complete the assessment first.",
        goHome: "Go to Home",
        errorTitle: "Oops! Something went wrong",
        errorRetry: "Please try again"
    }
};

// Global State
let currentLang = localStorage.getItem('diet_lang') || 'ar';
let currentTheme = localStorage.getItem('diet_theme') || 'light';
let userData = null;
let currentUser = null;
let dietPlanText = '';
let isSpeaking = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    applyLanguage();
    setupEventListeners();
    showLoadingDataState();

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await loadUserDataFromFirestore(user.uid);
        } else {
            showNotLoggedInState();
        }
    });
});

function applyTheme() {
    document.body.className = `${currentTheme} ${currentLang === 'ar' ? 'rtl' : 'ltr'}`;
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.className = `${currentTheme} ${currentLang === 'ar' ? 'rtl' : 'ltr'}`;
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    const input = document.getElementById('chatInput');
    if (input) input.placeholder = translations[currentLang].modifyPlaceholder;

    // Update menu text
    const themeBtn = document.querySelector('#themeToggle span');
    const langBtn = document.querySelector('#langToggle span');
    if (themeBtn) themeBtn.textContent = currentLang === 'ar' ? 'تبديل السمة' : 'Toggle Theme';
    if (langBtn) langBtn.textContent = currentLang === 'ar' ? 'تغيير اللغة' : 'Change Language';

    const menuHeader = document.querySelector('.menu-header h2');
    if (menuHeader) menuHeader.textContent = currentLang === 'ar' ? 'القائمة' : 'Menu';

    const menuLinks = document.querySelectorAll('.menu-link span');
    if (menuLinks.length >= 3) {
        menuLinks[0].textContent = currentLang === 'ar' ? 'الصفحة الرئيسية' : 'Home';
        menuLinks[1].textContent = currentLang === 'ar' ? 'الذكاء الاصطناعي' : 'AI';
        menuLinks[2].textContent = currentLang === 'ar' ? 'رفع الملفات' : 'Upload';
    }
}

function showLoadingDataState() {
    const panel = document.getElementById('dietPanel');
    const userPanel = document.getElementById('userDataContent');
    
    const loadingHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p class="loading-text">${translations[currentLang].loadingData}</p>
        </div>
    `;
    
    panel.innerHTML = loadingHTML;
    userPanel.innerHTML = loadingHTML;
}

function showNotLoggedInState() {
    const panel = document.getElementById('dietPanel');
    const userPanel = document.getElementById('userDataContent');
    
    const notLoggedHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-user-lock"></i>
            </div>
            <h2>${translations[currentLang].notLoggedIn}</h2>
            <button class="action-btn" onclick="window.location.href='../index.html'">
                <i class="fas fa-home"></i>
                <span>${translations[currentLang].goHome}</span>
            </button>
        </div>
    `;
    
    panel.innerHTML = notLoggedHTML;
    userPanel.innerHTML = notLoggedHTML;
}

async function loadUserDataFromFirestore(userId) {
    try {
        console.log('Loading data for user:', userId);
        
        const sessionsRef = collection(db, "users", userId, "sessions");
        const q = query(sessionsRef, orderBy("timestamp", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const latestSession = querySnapshot.docs[0].data();
            console.log('Latest session:', latestSession);
            
            userData = latestSession.readableAnswers || latestSession.answers || {};
            console.log('User data:', userData);
            
            displayUserData(userData);
            generateDietPlan();
        } else {
            console.log('No sessions found');
            showNoDataState();
        }
    } catch (error) {
        console.error('Firestore error:', error);
        showErrorState('Failed to load your data: ' + error.message);
    }
}

function displayUserData(data) {
    const userPanel = document.getElementById('userDataContent');
    
    // Convert user data to markdown format
    let markdownContent = `## ${translations[currentLang === 'ar' ? 'ar' : 'en'].userData}\n\n`;
    
    for (const [key, value] of Object.entries(data)) {
        if (value) {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            markdownContent += `**${formattedKey}:** ${value}\n\n`;
        }
    }
    
    const formattedHTML = marked.parse(markdownContent);
    userPanel.innerHTML = `<div class="user-data-formatted">${formattedHTML}</div>`;
}

function showNoDataState() {
    const panel = document.getElementById('dietPanel');
    const userPanel = document.getElementById('userDataContent');
    
    const noDataHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-clipboard-list"></i>
            </div>
            <h2>${translations[currentLang].noDataTitle}</h2>
            <p>${translations[currentLang].noDataMessage}</p>
            <button class="action-btn" onclick="window.location.href='../index.html'">
                <i class="fas fa-home"></i>
                <span>${translations[currentLang].goHome}</span>
            </button>
        </div>
    `;
    
    panel.innerHTML = noDataHTML;
    userPanel.innerHTML = noDataHTML;
}

function showLoadingState() {
    const panel = document.getElementById('dietPanel');
    panel.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p class="loading-text">${translations[currentLang].generating}</p>
        </div>
    `;
}

function showErrorState(message) {
    const panel = document.getElementById('dietPanel');
    panel.innerHTML = `
        <div class="error-state">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>${translations[currentLang].errorTitle}</h2>
            <p>${message}</p>
            <button class="action-btn" onclick="window.location.reload()">
                <i class="fas fa-redo"></i>
                <span>${translations[currentLang].errorRetry}</span>
            </button>
        </div>
    `;
}

async function generateDietPlan(modification = null) {
    showLoadingState();

    const promptText = modification 
        ? `You are a professional dietitian. Based on this patient data: ${JSON.stringify(userData)}. Create a diet plan in ${currentLang === 'ar' ? 'Arabic' : 'English'} using Markdown with ## headers for sections (Breakfast, Lunch, Dinner, Snacks). User modification: ${modification}`
        : `You are a professional dietitian. Based on this patient data: ${JSON.stringify(userData)}. Create a comprehensive diet plan in ${currentLang === 'ar' ? 'Arabic' : 'English'} using Markdown formatting with ## headers for sections: Breakfast, Lunch, Dinner, Snacks, Alternatives, and Notes/Warnings. Use bullet points for items.`;

    try {
        // Verify CONFIG is loaded
        if (!CONFIG || !CONFIG.isValid()) {
            throw new Error('Configuration not loaded properly');
        }

        const apiKey = CONFIG.getApiKey();
        const apiUrl = CONFIG.getApiUrl();
        const model = CONFIG.getModel();

        if (!apiKey) {
            throw new Error('API key not available');
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: promptText
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        // Extract text from Groq API response format
        if (data.choices && data.choices[0] && data.choices[0].message) {
            dietPlanText = data.choices[0].message.content;
            displayDietPlan(dietPlanText);
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('Groq API error:', error);
        showErrorState(error.message);
    }
}

function displayDietPlan(text) {
    const panel = document.getElementById('dietPanel');
    const formattedText = marked.parse(text);
    
    panel.innerHTML = `
        <div class="diet-header">
            <h1 class="diet-title">
                <i class="fas fa-utensils"></i>
                <span>${translations[currentLang].dietPlan}</span>
            </h1>
            <div class="diet-actions">
                <button class="action-btn secondary" onclick="window.downloadTXT()">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  <path d="M5 20h14v-2H5v2zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1z"/>
</svg>
                    <span>${translations[currentLang].downloadTXT}</span>
                </button>
                <button class="action-btn secondary" onclick="window.shareWhatsApp()">
<svg viewBox="0 0 24 24" width="24" height="24" fill="currentcolor">
  <path d="M16.6 14.2c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1-.2.2-.7.7-.8.9-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6.1-.1.2-.3.3-.4.1-.1.2-.3.3-.5.1-.2 0-.3 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.4 2 11.9c0 1.9.5 3.7 1.5 5.2L2 22l5-1.3c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.4 10-9.9C22 6.4 17.5 2 12 2z"/>
</svg>
                   <span>${translations[currentLang].shareWhatsApp}</span>
                </button>
            </div>
        </div>
        <div class="diet-content">
            ${formattedText}
        </div>
    `;
}

function setupEventListeners() {
    // Hamburger menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    hamburgerBtn.addEventListener('click', () => {
        sidebarMenu.classList.add('active');
        menuOverlay.classList.add('active');
    });

    const closeMenu = () => {
        sidebarMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    };

    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('diet_theme', currentTheme);
        applyTheme();
    });

    // Language toggle
    document.getElementById('langToggle').addEventListener('click', () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('diet_lang', currentLang);
        applyLanguage();
        
        // Regenerate diet plan in new language
        if (userData) {
            generateDietPlan();
        }
    });

    // Send button
    document.getElementById('sendBtn').addEventListener('click', () => {
        const input = document.getElementById('chatInput');
        const mod = input.value.trim();
        if (mod) {
            input.value = '';
            input.style.height = 'auto';
            generateDietPlan(mod);
        }
    });

    // Chat input auto-resize
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('sendBtn').click();
        }
    });
}

// Global functions

window.downloadTXT = function() {
    const clean = dietPlanText.replace(/[*#]/g, '');
    const content = `Soom Health - Diet Plan\n` +
        `Patient: ${currentUser?.email || 'N/A'}\n` +
        `Date: ${new Date().toLocaleDateString()}\n\n` +
        `${clean}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Diet_Plan_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

window.shareWhatsApp = function() {
    const summary = `*Soom Health - Diet Plan*\n\n` +
        `👤 ${currentUser?.email || 'Patient'}\n` +
        `📅 ${new Date().toLocaleDateString()}\n\n` +
        `${dietPlanText.substring(0, 500)}...\n\n` +
        `_Generated by Diabeaty AI_`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank');
};