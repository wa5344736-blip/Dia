// --- Import Firebase core and modules ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Your Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyD-Jd1rrLO1LC_0EoGIdrNLUCXTfqRh0uM",
  authDomain: "mr-dia.firebaseapp.com",
  projectId: "mr-dia",
  storageBucket: "mr-dia.appspot.com",
  messagingSenderId: "528685312667",
  appId: "1:528685312667:web:cc5f89cf8c1f05f157743e",
  measurementId: "G-5DMP99EVN6"
};

// --- Initialize app, auth, and database ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('✅ Firebase initialized successfully');

// ════════════════════════════════════════════════════════════════
// 🔐 AUTHENTICATION FUNCTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Register new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<string>} User ID
 */
export async function registerUser(name, email, password) {
  try {
    console.log('📄 Starting registration for:', email);
    
    // Create authentication account
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCred.user.uid;
    
    console.log('✅ Auth account created:', userId);

    // Create user document (NO password stored in Firestore - security best practice)
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      name: name,
      email: email,
      createdAt: serverTimestamp()
    });

    console.log('✅ Firestore user document created for:', userId);
    return userId;
    
  } catch (error) {
    console.error('❌ Registration error:', error.code, error.message);
    throw error;
  }
}

/**
 * Login existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<string>} User ID
 */
export async function loginUser(email, password) {
  try {
    console.log('📄 Attempting login for:', email);
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User logged in:', userCred.user.uid);
    return userCred.user.uid;
  } catch (error) {
    console.error('❌ Login error:', error.code, error.message);
    throw error;
  }
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function receiving user object
 */
export function listenToAuth(callback) {
  onAuthStateChanged(auth, user => {
    if (user) {
      console.log('✅ Auth state: User logged in -', user.uid);
    } else {
      console.log('ℹ️ Auth state: No user logged in');
    }
    callback(user); // null if signed out
  });
}

/**
 * Logout current user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log('✅ User logged out successfully');
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw error;
  }
}

// ════════════════════════════════════════════════════════════════
// 📊 SESSION FUNCTIONS (OLD - Kept for compatibility)
// ════════════════════════════════════════════════════════════════

/**
 * Save a new assessment session
 * @param {string} userId - User ID
 * @param {Array} answers - Array of answers
 * @param {Array} readableAnswers - Array of readable answers
 * @param {number} score - Assessment score
 * @param {string} riskLevel - Risk level
 * @returns {Promise<string>} Session document ID
 */
export async function saveSession(userId, answers, readableAnswers, score, riskLevel) {
  try {
    console.log('📄 Saving session for user:', userId);
    
    const sessionRef = collection(db, "users", userId, "sessions");
    const docRef = await addDoc(sessionRef, {
      answers: answers,
      readableAnswers: readableAnswers,
      score: score,
      riskLevel: riskLevel,
      timestamp: serverTimestamp()
    });
    
    console.log('✅ Session saved with ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Session save error:', error);
    throw error;
  }
}

/**
 * Get user sessions (latest first)
 * @param {string} userId - User ID
 * @param {number} limitCount - Maximum number of sessions to retrieve
 * @returns {Promise<Array>} Array of session objects
 */
export async function getUserSessions(userId, limitCount = 10) {
  try {
    console.log('📄 Fetching sessions for user:', userId);
    
    const sessionsRef = collection(db, "users", userId, "sessions");
    const q = query(sessionsRef, orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Found ${sessions.length} sessions`);
    return sessions;
    
  } catch (error) {
    console.error('❌ Get sessions error:', error);
    throw error;
  }
}

// ════════════════════════════════════════════════════════════════
// 🔬 ANALYZE FUNCTIONS (NEW - Medical Analysis)
// ════════════════════════════════════════════════════════════════

/**
 * Save a new medical analysis
 * @param {string} userId - User ID
 * @param {string} extractedText - OCR extracted text from image
 * @param {string} geminiResponse - AI analysis result
 * @returns {Promise<string>} Analysis document ID
 */
export async function saveAnalysis(userId, extractedText, geminiResponse) {
  try {
    console.log('📄 Saving analysis for user:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!extractedText || !geminiResponse) {
      throw new Error('Both extractedText and geminiResponse are required');
    }
    
    const analyzeRef = collection(db, "users", userId, "analyze");
    const docRef = await addDoc(analyzeRef, {
      extractedText: extractedText,
      geminiResponse: geminiResponse,
      timestamp: serverTimestamp()
    });
    
    console.log('✅ Analysis saved with ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Analysis save error:', error);
    throw error;
  }
}

/**
 * Get a specific analysis by ID
 * @param {string} userId - User ID
 * @param {string} analyzeId - Analysis document ID
 * @returns {Promise<Object|null>} Analysis object or null if not found
 */
export async function getAnalysis(userId, analyzeId) {
  try {
    console.log('📄 Fetching analysis:', analyzeId, 'for user:', userId);
    
    const analyzeDoc = await getDoc(doc(db, "users", userId, "analyze", analyzeId));
    
    if (analyzeDoc.exists()) {
      console.log('✅ Analysis found');
      return {
        id: analyzeDoc.id,
        ...analyzeDoc.data()
      };
    }
    
    console.log('⚠️ Analysis not found');
    return null;
    
  } catch (error) {
    console.error('❌ Get analysis error:', error);
    throw error;
  }
}

/**
 * Get user analyses (latest first)
 * @param {string} userId - User ID
 * @param {number} limitCount - Maximum number of analyses to retrieve
 * @returns {Promise<Array>} Array of analysis objects
 */
export async function getUserAnalyses(userId, limitCount = 10) {
  try {
    console.log('📄 Fetching analyses for user:', userId);
    
    const analyzeRef = collection(db, "users", userId, "analyze");
    const q = query(analyzeRef, orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const analyses = [];
    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Found ${analyses.length} analyses`);
    return analyses;
    
  } catch (error) {
    console.error('❌ Get analyses error:', error);
    throw error;
  }
}

// ════════════════════════════════════════════════════════════════
// 👤 USER PROFILE FUNCTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile object or null
 */
export async function getUserProfile(userId) {
  try {
    console.log('📄 Fetching user profile:', userId);
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      console.log('✅ User profile found');
      return userDoc.data();
    }
    
    console.log('⚠️ User profile not found');
    return null;
    
  } catch (error) {
    console.error('❌ Get user profile error:', error);
    throw error;
  }
}

// ════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ════════════════════════════════════════════════════════════════
export { auth, db }