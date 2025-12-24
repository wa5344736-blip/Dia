// Media Data
const imagesData = [
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478209/diabetes-glucose-monitoring_oajsz0.jpg',
        title: 'مراقبة الجلوكوز',
        description: 'أنظمة مراقبة الجلوكوز في الوقت الفعلي وطرق التتبع'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478247/diabetes-complications_upiwuq.png',
        title: 'مضاعفات السكري',
        description: 'المضاعفات الشائعة لمرض السكري واستراتيجيات الوقاية'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478255/diabetes-symptoms_rdztgq.png',
        title: 'أعراض السكري',
        description: 'الأعراض الرئيسية والعلامات التحذيرية لمرض السكري'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478273/diabetes-comparing-types_nagjcr.png',
        title: 'مقارنة الأنواع',
        description: 'مقارنة مرئية بين خصائص السكري من النوع 1 والنوع 2'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478274/diabetes-medictions_exxtom.png',
        title: 'أدوية السكري',
        description: 'الأدوية الشائعة وأنواع الأنسولين لإدارة مرض السكري'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478273/diabetes-health-food_qjxrso.jpg',
        title: 'الغذاء الصحي',
        description: 'الخيارات الغذائية المغذية الموصى بها لخطط النظام الغذائي لمرضى السكري'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478298/diabetes-blood-test_osleh4.png',
        title: 'فحص الدم',
        description: 'الفحوصات المختبرية الأساسية لتشخيص ومراقبة مرض السكري'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478296/diabetes-foot-care_ormjue.png',
        title: 'العناية بالقدمين',
        description: 'تقنيات العناية المناسبة بالقدمين للوقاية من مضاعفات السكري'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478298/diabetes-blood-test_osleh4.png',
        title: 'حقن الأنسولين',
        description: 'تقنيات حقن الأنسولين وأفضل الممارسات'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/image/upload/w_800,q_auto,f_auto/v1766478343/diabetes-exercises_yueswl.jpg',
        title: 'التمارين الرياضية',
        description: 'الأنشطة البدنية الموصى بها لإدارة مرض السكري'
    }
];

const audioData = [
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/video/upload/v1766477749/Diabetes_description_ahqdic.wav',
        title: 'وصف مرض السكري',
        description: 'نظرة شاملة على أنواع مرض السكري وأسبابه واستراتيجيات الإدارة'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/video/upload/v1766477657/APP_description_s2seth.wav',
        title: 'وصف التطبيق',
        description: 'شرح تفصيلي لمميزات تطبيق إدارة مرض السكري الخاص بنا'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/video/upload/v1766477695/Problem_we_solve_cqlwuf.wav',
        title: 'المشكلة التي نحلها',
        description: 'التحديات الأساسية في رعاية مرضى السكري التي يعالجها حلنا'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/video/upload/v1766477724/Security_problems_ondvoj.wav',
        title: 'مشاكل الأمان',
        description: 'تحديات أمان بيانات الرعاية الصحية والتدابير الوقائية لدينا'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/video/upload/v1766477825/Firebase_problems_ncnz2t.wav',
        title: 'مشاكل Firebase',
        description: 'القيود التقنية لـ Firebase وحلول التحسين الخاصة بنا'
    },
    {
        url: 'https://res.cloudinary.com/dvvuh8qbz/video/upload/v1766477843/Used_technologies_srm3w7.wav',
        title: 'التقنيات المستخدمة',
        description: 'تفصيل كامل لحزمة التكنولوجيا وقرارات البنية'
    }
];

const techData = {
    frontend: [
        {
            icon: 'fab fa-html5',
            name: 'HTML5',
            version: 'Latest',
            description: 'بنية دلالية حديثة لصفحات الويب',
            proficiency: 95,
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
        },
        {
            icon: 'fab fa-css3-alt',
            name: 'CSS3',
            version: 'Latest',
            description: 'تصميم متقدم مع Flexbox و Grid',
            proficiency: 95,
            link: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
        },
        {
            icon: 'fab fa-js',
            name: 'JavaScript',
            version: 'ES6+',
            description: 'برمجة حديثة وتفاعلية',
            proficiency: 90,
            link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
        },
        {
            icon: 'fab fa-font-awesome',
            name: 'FontAwesome',
            version: '6.4.0',
            description: 'أيقونات احترافية ومتنوعة',
            proficiency: 85,
            link: 'https://fontawesome.com/'
        }
    ],
    backend: [
        {
            icon: 'fas fa-fire',
            name: 'Firebase',
            version: '10.x',
            description: 'قاعدة بيانات فورية ومصادقة آمنة',
            proficiency: 90,
            link: 'https://firebase.google.com/'
        },
        {
            icon: 'fas fa-database',
            name: 'Firestore',
            version: 'Latest',
            description: 'قاعدة بيانات NoSQL مرنة وقابلة للتطوير',
            proficiency: 85,
            link: 'https://firebase.google.com/docs/firestore'
        },
        {
            icon: 'fas fa-shield-alt',
            name: 'Authentication',
            version: 'Firebase Auth',
            description: 'نظام مصادقة متعدد الطرق آمن',
            proficiency: 90,
            link: 'https://firebase.google.com/docs/auth'
        },
        {
            icon: 'fas fa-cloud',
            name: 'Cloudinary',
            version: 'Latest',
            description: 'إدارة وتحسين الوسائط السحابية',
            proficiency: 80,
            link: 'https://cloudinary.com/'
        }
    ],
    ai: [
        {
            icon: 'fas fa-robot',
            name: 'Groq API',
            version: 'Latest',
            description: 'ذكاء اصطناعي سريع للاستجابات الفورية',
            proficiency: 85,
            link: 'https://groq.com/'
        },
        {
            icon: 'fas fa-file-alt',
            name: 'Tesseract.js',
            version: '4.x',
            description: 'استخراج النص من الصور بدقة عالية',
            proficiency: 80,
            link: 'https://tesseract.projectnaptha.com/'
        },
        {
            icon: 'fab fa-markdown',
            name: 'Marked.js',
            version: '9.x',
            description: 'تحويل Markdown إلى HTML',
            proficiency: 75,
            link: 'https://marked.js.org/'
        }
    ],
    tools: [
        {
            icon: 'fab fa-google',
            name: 'Google Fonts',
            version: 'API',
            description: 'خطوط ويب عالية الجودة',
            proficiency: 90,
            link: 'https://fonts.google.com/'
        },
        {
            icon: 'fas fa-download',
            name: 'jsPDF',
            version: '2.x',
            description: 'إنشاء ملفات PDF من JavaScript',
            proficiency: 75,
            link: 'https://github.com/parallax/jsPDF'
        },
        {
            icon: 'fab fa-github',
            name: 'Git',
            version: 'Latest',
            description: 'نظام التحكم في الإصدارات',
            proficiency: 85,
            link: 'https://git-scm.com/'
        },
        {
            icon: 'fas fa-code-branch',
            name: 'VS Code',
            version: 'Latest',
            description: 'بيئة التطوير المتكاملة',
            proficiency: 95,
            link: 'https://code.visualstudio.com/'
        }
    ]
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHeroParticles();
    initHeroCounters();
    initMediaGallery();
    initTechnologySection();
    initScrollAnimations();
    initFAB();
    initLightbox();
    initMobileMenu();
});

// Navbar
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update scroll progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.querySelector('i').classList.remove('fa-times');
            toggle.querySelector('i').classList.add('fa-bars');
        });
    });
}

// Hero Particles
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `linear-gradient(135deg, rgba(102, 126, 234, ${Math.random() * 0.5}), rgba(118, 75, 162, ${Math.random() * 0.5}))`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

// Hero Counters
function initHeroCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateCounters = () => {
        if (animated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        animated = true;
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.hero-stats').forEach(el => observer.observe(el));
}

// Media Gallery
function initMediaGallery() {
    loadImages();
    loadAudioPlayers();
    initMediaToggle();
}

function initMediaToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const mediaContents = document.querySelectorAll('.media-content');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mediaType = btn.getAttribute('data-media');
            
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            mediaContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${mediaType}Content`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function loadImages() {
    const grid = document.getElementById('imagesGrid');
    
    imagesData.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.setAttribute('data-index', index);
        
        const skeleton = document.createElement('div');
        skeleton.className = 'image-skeleton';
        card.appendChild(skeleton);
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.loading = 'lazy';
        
        img.onload = () => {
            skeleton.remove();
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.innerHTML = `
            <h4>${image.title}</h4>
            <p>${image.description}</p>
        `;
        
        card.appendChild(img);
        card.appendChild(overlay);
        
        card.addEventListener('click', () => {
            openLightbox(index);
        });
        
        grid.appendChild(card);
    });
}

function loadAudioPlayers() {
    const list = document.getElementById('audioList');
    
    audioData.forEach((audio, index) => {
        const card = document.createElement('div');
        card.className = 'audio-card';
        
        card.innerHTML = `
            <div class="audio-header">
                <div class="audio-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="audio-info">
                    <h4>${audio.title}</h4>
                    <p>${audio.description}</p>
                </div>
            </div>
            <div class="audio-player">
                <audio src="${audio.url}" preload="metadata"></audio>
                <div class="audio-controls">
                    <button class="play-btn">
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="time-display">
                            <span class="current-time">0:00</span>
                            <span class="total-time">0:00</span>
                        </div>
                    </div>
                </div>
                <div class="audio-controls">
                    <div class="volume-control">
                        <button class="volume-btn">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <div class="volume-slider">
                            <div class="volume-fill"></div>
                        </div>
                    </div>
                    <button class="download-btn">
                        <i class="fas fa-download"></i> تحميل
                    </button>
                </div>
            </div>
        `;
        
        list.appendChild(card);
        initAudioPlayer(card);
    });
}

function initAudioPlayer(card) {
    const audio = card.querySelector('audio');
    const playBtn = card.querySelector('.play-btn');
    const progressBar = card.querySelector('.progress-bar');
    const progressFill = card.querySelector('.progress-fill');
    const currentTime = card.querySelector('.current-time');
    const totalTime = card.querySelector('.total-time');
    const volumeBtn = card.querySelector('.volume-btn');
    const volumeSlider = card.querySelector('.volume-slider');
    const volumeFill = card.querySelector('.volume-fill');
    const downloadBtn = card.querySelector('.download-btn');
    
    // Load metadata
    audio.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audio.duration);
    });
    
    // Play/Pause
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            // Pause all other audio
            document.querySelectorAll('audio').forEach(a => {
                if (a !== audio) a.pause();
            });
            document.querySelectorAll('.play-btn i').forEach(i => {
                i.classList.remove('fa-pause');
                i.classList.add('fa-play');
            });
            
            audio.play();
            playBtn.querySelector('i').classList.remove('fa-play');
            playBtn.querySelector('i').classList.add('fa-pause');
        } else {
            audio.pause();
            playBtn.querySelector('i').classList.remove('fa-pause');
            playBtn.querySelector('i').classList.add('fa-play');
        }
    });
    
    // Update progress
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = progress + '%';
        currentTime.textContent = formatTime(audio.currentTime);
    });
    
    // Seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // Volume control
    volumeBtn.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false;
            volumeBtn.querySelector('i').classList.remove('fa-volume-mute');
            volumeBtn.querySelector('i').classList.add('fa-volume-up');
            volumeFill.style.width = (audio.volume * 100) + '%';
        } else {
            audio.muted = true;
            volumeBtn.querySelector('i').classList.remove('fa-volume-up');
            volumeBtn.querySelector('i').classList.add('fa-volume-mute');
            volumeFill.style.width = '0%';
        }
    });
    
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.volume = percent;
        volumeFill.style.width = (percent * 100) + '%';
        audio.muted = false;
        volumeBtn.querySelector('i').classList.remove('fa-volume-mute');
        volumeBtn.querySelector('i').classList.add('fa-volume-up');
    });
    
    // Download
    downloadBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = audio.src;
        a.download = audio.src.split('/').pop();
        a.click();
        showToast('جاري التحميل...');
    });
    
    // Reset on end
    audio.addEventListener('ended', () => {
        playBtn.querySelector('i').classList.remove('fa-pause');
        playBtn.querySelector('i').classList.add('fa-play');
        progressFill.style.width = '0%';
        audio.currentTime = 0;
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Technology Section
function initTechnologySection() {
    loadTechCards('frontend');
    
    const tabs = document.querySelectorAll('.tech-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            loadTechCards(category);
        });
    });
}

function loadTechCards(category) {
    const container = document.getElementById('techContent');
    container.innerHTML = '';
    
    const cards = techData[category];
    
    cards.forEach((tech, index) => {
        const card = document.createElement('div');
        card.className = 'tech-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        card.innerHTML = `
            <div class="tech-logo">
                <i class="${tech.icon}"></i>
            </div>
            <h4>${tech.name}</h4>
            <p class="tech-version">${tech.version}</p>
            <p class="tech-description">${tech.description}</p>
            <div class="proficiency-bar">
                <div class="proficiency-fill" style="width: 0%;" data-width="${tech.proficiency}%"></div>
            </div>
            <a href="${tech.link}" target="_blank" class="learn-more">
                تعلم المزيد <i class="fas fa-arrow-left"></i>
            </a>
        `;
        
        container.appendChild(card);
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                const fill = card.querySelector('.proficiency-fill');
                fill.style.width = fill.getAttribute('data-width');
            }, 300);
        }, index * 100);
    });
}

// Lightbox
let currentImageIndex = 0;

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const close = document.getElementById('lightboxClose');
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    
    close.addEventListener('click', closeLightbox);
    prev.addEventListener('click', () => navigateLightbox(-1));
    next.addEventListener('click', () => navigateLightbox(1));
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(1);
        if (e.key === 'ArrowRight') navigateLightbox(-1);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = imagesData.length - 1;
    if (currentImageIndex >= imagesData.length) currentImageIndex = 0;
    updateLightbox();
}

function updateLightbox() {
    const image = imagesData[currentImageIndex];
    document.getElementById('lightboxImage').src = image.url;
    document.getElementById('lightboxCaption').innerHTML = `
        <h4>${image.title}</h4>
        <p>${image.description}</p>
    `;
}

// FAB
function initFAB() {
    const fab = document.getElementById('fab');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            fab.classList.add('visible');
        } else {
            fab.classList.remove('visible');
        }
    });
    
    fab.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.feature-card, .tech-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});