// js/config.js - ملف حماية API Key (المُصحّح)
const CONFIG = (function() {
  // الـ API Key مشفر ومقسّم لأجزاء (Base64)
  const parts = [
  "Z3NrX254T01t",
  "UDVNOFBjZ29U",
  "MWJJbThTV0dk",
  "eWIzRll4RGFL",
  "MHo2Vkpja3N2",
  "Tnp0eDBYRDQx",
  "Nnc="
  ];
  
  return {
    // فك تشفير API Key
    getApiKey: function() {
      try {
        const encoded = parts.join('');
        const decoded = atob(encoded);
        console.log('🔓 API Key loaded:', decoded.substring(0, 10) + '...');
        return decoded;
      } catch (e) {
        console.error('❌ خطأ في فك تشفير API Key:', e);
        return null;
      }
    },
    
    // رابط Groq API
    getApiUrl: function() {
      return 'https://api.groq.com/openai/v1/chat/completions';
    },
    
    // اسم الموديل
    getModel: function() {
      return 'meta-llama/llama-4-maverick-17b-128e-instruct';
    },
    
    // التحقق من صحة الإعدادات
    isValid: function() {
      const key = this.getApiKey();
      return key && key.startsWith('gsk_');
    }
  };
})();

// منع التعديل على الـ Object
Object.freeze(CONFIG);

// رسالة تأكيد في Console
if (CONFIG.isValid()) {
  console.log('✅ CONFIG loaded successfully');
} else {
  console.error('❌ CONFIG failed to load');
}