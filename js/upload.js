// State
    let currentImage = null;
    let currentTheme = 'light';
    let currentLang = 'ar';
    let isProcessing = false;
    let cameraStream = null;

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
    // Translations
    const translations = {
      ar: {
        placeholderText: 'ارفق صورة / صوّر الآن',
        uploadBtnText: 'ارفاق صورة / تصوير',
        uploadFileText: 'رفع من الجهاز',
        takePhotoText: 'تصوير مباشر',
        analyzeBtnText: 'تحليل النتيجة',
        changeBtnText: 'تغيير الصورة',
        errorSize: 'حجم الصورة كبير جداً!',
        errorType: 'نوع الملف غير مدعوم! استخدم PNG أو JPG فقط',
        errorGeneral: 'حدث خطأ أثناء رفع الصورة',
        errorOCR: 'فشل استخراج النص من الصورة. حاول مرة أخرى',
        errorGemini: 'فشل التواصل مع خدمة التحليل. تحقق من الاتصال',
        themeLight: 'الوضع الفاتح',
        themeDark: 'الوضع الداكن',
        langToggle: 'English',
        statusPreparing: 'جاري التحضير...',
        statusLoadingOCR: 'تحميل محرك القراءة...',
        statusExtracting: 'استخراج النص من الصورة...',
        statusPrepData: 'تحضير البيانات...',
        statusSendingGemini: 'إرسال إلى الذكاء الاصطناعي...',
        statusProcessing: 'معالجة النتائج...',
        statusComplete: 'اكتمل التحليل بنجاح!',
        statusRedirecting: 'جاري الانتقال...',
        loadingImage: 'جاري معالجة الصورة...',
        imageReady: 'الصورة جاهزة للتحليل'
      },
      en: {
        placeholderText: 'Upload Image / Take Photo',
        uploadBtnText: 'Upload Image / Take Photo',
        uploadFileText: 'Upload from Device',
        takePhotoText: 'Take Photo',
        analyzeBtnText: 'Analyze Results',
        changeBtnText: 'Change Image',
        errorSize: 'Image size too large!',
        errorType: 'File type not supported! Use PNG or JPG only',
        errorGeneral: 'Error uploading image',
        errorOCR: 'Failed to extract text from image. Try again',
        errorGemini: 'Failed to connect to analysis service. Check connection',
        themeLight: 'Light Mode',
        themeDark: 'Dark Mode',
        langToggle: 'العربية',
        statusPreparing: 'Preparing...',
        statusLoadingOCR: 'Loading OCR engine...',
        statusExtracting: 'Extracting text from image...',
        statusPrepData: 'Preparing data...',
        statusSendingGemini: 'Sending to AI...',
        statusProcessing: 'Processing results...',
        statusComplete: 'Analysis completed successfully!',
        statusRedirecting: 'Redirecting...',
        loadingImage: 'Processing image...',
        imageReady: 'Image ready for analysis'
      }
    };

    // DOM Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadMenu = document.getElementById('uploadMenu');
    const uploadFile = document.getElementById('uploadFile');
    const openCamera = document.getElementById('openCamera');
    const fileInput = document.getElementById('fileInput');
    const placeholder = document.getElementById('placeholder');
    const previewImage = document.getElementById('previewImage');
    const deleteOverlay = document.getElementById('deleteOverlay');
    const changeBtn = document.getElementById('changeBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const errorMessage = document.getElementById('errorMessage');
    const statusMessage = document.getElementById('statusMessage');
    const progressModal = document.getElementById('progressModal');
    const progressCircleFill = document.getElementById('progressCircleFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressStage = document.getElementById('progressStage');
    const progressDetails = document.getElementById('progressDetails');
    const dropZone = document.getElementById('dropZone');

    // Camera Elements
    const cameraModal = document.getElementById('cameraModal');
    const cameraVideo = document.getElementById('cameraVideo');
    const closeCameraBtn = document.getElementById('closeCamera');
    const takePictureBtn = document.getElementById('takePicture');
    const switchCameraBtn = document.getElementById('switchCamera');
    const cameraCanvas = document.getElementById('cameraCanvas');

    // Event Listeners - Settings
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsMenu.classList.toggle('active');
      uploadMenu.classList.remove('active');
    });

    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.classList.toggle('dark-theme', currentTheme === 'dark');
      updateTexts();
    });

    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'ar' ? 'en' : 'ar';
      document.documentElement.lang = currentLang;
      document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      updateTexts();
    });

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    // Event Listeners - Upload
    uploadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadMenu.classList.toggle('active');
      settingsMenu.classList.remove('active');
    });

    uploadFile.addEventListener('click', () => {
      fileInput.click();
      uploadMenu.classList.remove('active');
    });

    openCamera.addEventListener('click', () => {
      startCamera();
      uploadMenu.classList.remove('active');
    });

    fileInput.addEventListener('change', (e) => handleFileSelect(e.target.files[0]));

    changeBtn.addEventListener('click', () => {
      uploadBtn.click();
    });

    deleteOverlay.addEventListener('click', () => {
      resetImageState();
    });

    document.addEventListener('click', () => {
      settingsMenu.classList.remove('active');
      uploadMenu.classList.remove('active');
    });

    settingsMenu.addEventListener('click', (e) => e.stopPropagation());
    uploadMenu.addEventListener('click', (e) => e.stopPropagation());

    // Camera Logic
    let usingFrontCamera = false;

    async function startCamera() {
      try {
        const constraints = {
          video: {
            facingMode: usingFrontCamera ? 'user' : 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraVideo.srcObject = cameraStream;
        cameraModal.classList.add('active');
      } catch (err) {
        console.error("Camera error:", err);
        showError("لا يمكن الوصول للكاميرا");
      }
    }

    function stopCamera() {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
      }
      cameraModal.classList.remove('active');
    }

    closeCameraBtn.addEventListener('click', stopCamera);

    switchCameraBtn.addEventListener('click', () => {
      usingFrontCamera = !usingFrontCamera;
      stopCamera();
      startCamera();
    });

    takePictureBtn.addEventListener('click', () => {
      const context = cameraCanvas.getContext('2d');
      cameraCanvas.width = cameraVideo.videoWidth;
      cameraCanvas.height = cameraVideo.videoHeight;
      context.drawImage(cameraVideo, 0, 0);
      
      const imageData = cameraCanvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      
      // Process the captured image
      processImageString(imageData);
    });

    // Analyze Button
    analyzeBtn.addEventListener('click', async () => {
      if (!currentImage || isProcessing) return;
      await startAnalysisFlow();
    });

    // File Handling
    function handleFileSelect(file) {
      if (!file) return;

      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showError(translations[currentLang].errorType);
        return;
      }

      setStatus(translations[currentLang].loadingImage, 'active');
      hideError();

      const reader = new FileReader();
      reader.onload = (e) => {
        processImageString(e.target.result);
      };
      
      reader.onerror = () => {
        showError(translations[currentLang].errorGeneral);
        setStatus('', '');
      };
      
      reader.readAsDataURL(file);
    }

    // Process and Compress Image
    function processImageString(base64String) {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if larger than 2000px
        const maxDim = 2000;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG 0.7
        const compressedData = canvas.toDataURL('image/jpeg', 0.7);
        
        // Save state
        currentImage = compressedData;
        try {
          localStorage.setItem('uploadedImage', currentImage);
          
          previewImage.src = currentImage;
          previewImage.classList.add('active');
          placeholder.style.display = 'none';
          deleteOverlay.classList.add('active');
          
          analyzeBtn.classList.add('active');
          analyzeBtn.disabled = false;
          changeBtn.classList.add('active');
          
          setStatus(translations[currentLang].imageReady, 'success');
          setTimeout(() => {
            statusMessage.classList.remove('active', 'success');
          }, 3000);
          
        } catch (e) {
          showError("الصورة كبيرة جداً للتخزين، حاول تصغيرها");
          console.error(e);
        }
      };
    }

    function resetImageState() {
      currentImage = null;
      previewImage.src = '';
      previewImage.classList.remove('active');
      deleteOverlay.classList.remove('active');
      placeholder.style.display = 'flex';
      analyzeBtn.classList.remove('active');
      analyzeBtn.disabled = true;
      changeBtn.classList.remove('active');
      hideError();
      setStatus('', '');
      fileInput.value = '';
      localStorage.removeItem('uploadedImage');
    }

    // Analysis Flow
   async function startAnalysisFlow() {
      isProcessing = true;
      analyzeBtn.disabled = true;
      showProgress();
      
      try {
        updateProgress(5, translations[currentLang].statusPreparing, '');
        await sleep(300);
        
        updateProgress(10, translations[currentLang].statusLoadingOCR, '');
        await sleep(500);
        
        updateProgress(20, translations[currentLang].statusExtracting, '');
        const extractedText = await performOCR(currentImage);
        
        if (!extractedText || extractedText.trim().length < 10) {
          throw new Error('OCR_EMPTY');
        }
        
        localStorage.setItem('extractedText', extractedText);
        localStorage.setItem('ocrStatus', 'success');
        
        updateProgress(60, translations[currentLang].statusExtracting, 
          currentLang === 'ar' ? 'تم استخراج النص بنجاح' : 'Text extracted successfully');
        await sleep(500);
        
        updateProgress(70, translations[currentLang].statusPrepData, '');
        const prompt = buildPrompt(extractedText);
        await sleep(300);
        
        updateProgress(75, translations[currentLang].statusSendingGemini, '');
        const groqResponse = await sendToGroq(prompt);
        
        if (!groqResponse) {
          throw new Error('GROQ_ERROR');
        }
        
        localStorage.setItem('geminiResponse', groqResponse);
        
        updateProgress(90, translations[currentLang].statusProcessing, '');
        await sleep(500);
        
        updateProgress(100, translations[currentLang].statusComplete, '');
        localStorage.setItem('analysisTimestamp', Date.now().toString());
        
        await sleep(800);
        
        updateProgress(100, translations[currentLang].statusRedirecting, '');
        await sleep(300);
        
        window.location.href = '../pages/result.html';
        
      } catch (error) {
        console.error('Analysis error:', error);
        hideProgress();
        
        if (error.message === 'OCR_EMPTY') {
          showError(translations[currentLang].errorOCR);
        } else if (error.message === 'GROQ_ERROR') {
          showError(translations[currentLang].errorGemini);
        } else {
          showError(translations[currentLang].errorGeneral);
        }
        
        localStorage.setItem('ocrStatus', 'error');
        isProcessing = false;
        analyzeBtn.disabled = false;
      }
    }

    // OCR Processing
    async function performOCR(imageData) {
      try {
        updateProgress(25, translations[currentLang].statusExtracting, 
          currentLang === 'ar' ? 'تهيئة المحرك...' : 'Initializing engine...');
        
        const worker = await Tesseract.createWorker({
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const ocrProgress = Math.floor(m.progress * 35);
              updateProgress(25 + ocrProgress, translations[currentLang].statusExtracting,
                `${Math.floor(m.progress * 100)}%`);
            }
          }
        });
        
        updateProgress(30, translations[currentLang].statusExtracting, 
          currentLang === 'ar' ? 'تحميل اللغة...' : 'Loading language...');
        
        await worker.loadLanguage('eng+ara');
        await worker.initialize('eng+ara');
        
        updateProgress(35, translations[currentLang].statusExtracting, 
          currentLang === 'ar' ? 'قراءة الصورة...' : 'Reading image...');
        
        const { data: { text } } = await worker.recognize(imageData);
        await worker.terminate();
        
        return text;
      } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('OCR_EMPTY');
      }
    }

    // Build Prompt for Groq
    function buildPrompt(extractedText) {
      return `أنت طبيب متخصص في تحليل النتائج الطبية والمختبرية. قم بتحليل النتائج التالية بشكل مفصل ومهني:

النص المستخرج من التحليل:
${extractedText}

المطلوب:
1. تحديد نوع التحليل الطبي
2. شرح كل قيمة في النتائج ومقارنتها بالمعدل الطبيعي
3. تحديد أي قيم غير طبيعية وتوضيح مدلولاتها الطبية
4. تقديم التوصيات الطبية المناسبة
5. الإشارة إلى أي فحوصات إضافية قد تكون مطلوبة
6. تقديم نصائح للمريض بناءً على النتائج
يرجى تقديم التحليل بلغة عربية واضحة ومفهومة للمريض العادي، مع الحفاظ على الدقة العلمية.`;
    }

    // Send to Groq API
    async function sendToGroq(prompt, retryCount = 0) {
      // Verify CONFIG is available
      if (typeof CONFIG === 'undefined' || !CONFIG.isValid()) {
        console.error('❌ CONFIG not loaded or invalid');
        throw new Error('GROQ_ERROR');
      }

      const apiKey = CONFIG.getApiKey();
      const apiUrl = CONFIG.getApiUrl();
      const model = CONFIG.getModel();

      if (!apiKey) {
        console.error('❌ Failed to get API key');
        throw new Error('GROQ_ERROR');
      }

      const requestBody = {
        model: model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.8
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API request failed:', response.status, errorText);
          throw new Error('API request failed');
        }

        const data = await response.json();
        const groqResponse = data.choices?.[0]?.message?.content || '';

        if (!groqResponse) {
          throw new Error('Empty response');
        }

        return groqResponse;
        
      } catch (error) {
        console.error('Groq API error:', error);
        
        if (retryCount < 2) {
          await sleep(2000);
          return sendToGroq(prompt, retryCount + 1);
        }
        
        throw new Error('GROQ_ERROR');
      }
    }

    // Progress Modal Controls
    function showProgress() {
      progressModal.classList.add('active');
      updateProgress(0, translations[currentLang].statusPreparing, '');
    }

    function hideProgress() {
      progressModal.classList.remove('active');
      updateProgress(0, '', '');
    }

    function updateProgress(percentage, stage, details) {
      progressPercentage.textContent = `${percentage}%`;
      
      const circumference = 339.292;
      const offset = circumference - (percentage / 100) * circumference;
      progressCircleFill.style.strokeDashoffset = offset;
      
      progressStage.textContent = stage;
      progressDetails.textContent = details;
    }

    // Status Message Controls
    function setStatus(message, type) {
      statusMessage.textContent = message;
      statusMessage.className = 'status-message';
      if (type) {
        statusMessage.classList.add(type);
      }
    }

    // Error Message Controls
    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.add('active');
      setTimeout(() => {
        hideError();
      }, 5000);
    }

    function hideError() {
      errorMessage.classList.remove('active');
    }

    // Utility Functions
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function updateTexts() {
      const t = translations[currentLang];

      document.getElementById('placeholderText').textContent = t.placeholderText;
      document.getElementById('uploadBtnText').textContent = t.uploadBtnText;
      document.getElementById('uploadFileText').textContent = t.uploadFileText;
      document.getElementById('takePhotoText').textContent = t.takePhotoText;
      document.getElementById('analyzeBtnText').textContent = t.analyzeBtnText;
      document.getElementById('changeBtnText').textContent = t.changeBtnText;
      document.getElementById('langText').textContent = t.langToggle;
      document.getElementById('themeText').textContent = currentTheme === 'light' ? t.themeDark : t.themeLight;
    }

    // Initialization
    updateTexts();
    localStorage.removeItem('extractedText');
    localStorage.removeItem('ocrStatus');
    localStorage.removeItem('geminiResponse');
    
// Hamburger Menu Logic
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sideMenu = document.getElementById('sideMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
  sideMenu.classList.add('active');
  hamburgerBtn.classList.add('active');
  menuOverlay.classList.add('active');
}

function closeMenu() {
  sideMenu.classList.remove('active');
  hamburgerBtn.classList.remove('active');
  menuOverlay.classList.remove('active');
}

hamburgerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (sideMenu.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
});

closeMenuBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// Close menu when clicking outside on desktop
document.addEventListener('click', (e) => {
  if (window.innerWidth >= 768) {
    if (!sideMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      closeMenu();
    }
  }
});

// Prevent menu clicks from closing it
sideMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});
    console.log('Main page initialized successfully');