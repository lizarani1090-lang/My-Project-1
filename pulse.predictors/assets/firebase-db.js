// ==============================================================================
// Pulse Predictor — Firebase Cloud Firestore Real-Time Database Engine
// 100% Free Spark Tier with Offline Persistence & Cross-Role Live Sync
// ==============================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  initializeFirestore,
  setLogLevel,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  getDocFromServer,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Suppress non-critical WebSocket network probe warnings
try {
  setLogLevel("error");
} catch (_) {}

const firebaseConfig = {
  projectId: "friendly-interface-pv9wh",
  appId: "1:426780996979:web:e922e5ddbbe8da69560106",
  apiKey: "AIzaSyDvMEjcFNTXK-CmhFvAllfF_CBKhcJHbnI",
  authDomain: "friendly-interface-pv9wh.firebaseapp.com",
  storageBucket: "friendly-interface-pv9wh.firebasestorage.app",
  messagingSenderId: "426780996979"
};

const DATABASE_ID = "ai-studio-codecraft-555bbde2-b2fc-4a68-b4f6-61ea4858aabd";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with long-polling and robust multi-tab local caching for iframe / offline-first environments
let db;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, DATABASE_ID);
} catch (e) {
  console.warn("Firestore offline cache initialization fallback:", e);
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true
    }, DATABASE_ID);
  } catch (e2) {
    db = initializeFirestore(app, {}, DATABASE_ID);
  }
}

// Test Connection per Firebase Skill instructions with timeout guard
async function testConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("the client is offline")), 4000)
    );
    await Promise.race([
      getDocFromServer(doc(db, "test", "connection")),
      timeoutPromise
    ]);
    console.log("Connected to Cloud Firestore database successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Pulse Predictor: Firestore client is offline, using offline cache.");
    } else {
      console.log("Pulse Predictor Firestore initialized.");
    }
  }
}
testConnection();

// Initial Seed Data for fresh database
const SEED_TRIAGE_CASES = [
  {
    patientName: "Ramesh Patil",
    abhaId: "12-3456-7890",
    symptoms: "Fever (102°F), Productive Cough, Breathlessness",
    bloodPressure: "150/95",
    pulseRate: "98 bpm",
    spo2: "94%",
    riskScore: 8,
    riskLevel: "HIGH",
    status: "pending",
    ashaName: "Sunita Devi",
    subCentre: "Sub-Centre 4",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    patientName: "Savitri Bai",
    abhaId: "44-8899-1122",
    symptoms: "High BP Spike, Headache, Vision blur",
    bloodPressure: "165/100",
    pulseRate: "88 bpm",
    spo2: "96%",
    riskScore: 7,
    riskLevel: "HIGH",
    status: "pending",
    ashaName: "Sunita Devi",
    subCentre: "Sub-Centre 4",
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  },
  {
    patientName: "Kavita Devi",
    abhaId: "90-1122-3344",
    symptoms: "Stomach Pain, Mild dehydration",
    bloodPressure: "120/80",
    pulseRate: "82 bpm",
    spo2: "98%",
    riskScore: 4,
    riskLevel: "MODERATE",
    status: "pending",
    ashaName: "Rekha Tai",
    subCentre: "Sub-Centre 2",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  }
];

const SEED_INVENTORY = [
  { id: "amoxicillin", name: "Amoxicillin 500mg", category: "medicine", quantity: 220, unit: "strips", threshold: 50, status: "available" },
  { id: "ifa", name: "Iron & Folic Acid (IFA)", category: "medicine", quantity: 18, unit: "strips", threshold: 25, status: "low_stock" },
  { id: "ors", name: "Oral Rehydration Salts (ORS)", category: "medicine", quantity: 0, unit: "packets", threshold: 40, status: "out_of_stock" },
  { id: "oxygen", name: "Oxygen Cylinders (Type D)", category: "oxygen", quantity: 8, unit: "cylinders", threshold: 5, status: "available" },
  { id: "beds_general", name: "General Wards Beds", category: "bed", quantity: 14, unit: "vacant", threshold: 4, status: "available" },
  { id: "beds_icu", name: "ICU Oxygen Beds", category: "bed", quantity: 3, unit: "vacant", threshold: 2, status: "low_stock" }
];

const SEED_REFERRALS = [
  {
    patientName: "Ramesh Patil",
    abhaId: "12-3456-7890",
    sourceFacility: "Sub-Centre 4",
    targetFacility: "District Hospital Diagnostic Hub",
    priority: "CRITICAL",
    transportStatus: "in_transit",
    currentStage: 2,
    stageName: "Ambulance 108 In Transit",
    ambulanceNumber: "MH-12-AMB-108",
    driverName: "Santosh Jadhav",
    driverPhone: "+91 98220 10811",
    eta: "14 mins",
    bedReserved: true,
    bedAssigned: "ICU Bed #4",
    bedType: "ICU Oxygen Bed",
    vitalsSummary: "BP: 150/95 · SpO2: 94% · Pulse: 98 bpm",
    regulationSummary: "HIGH Risk (8/10) · ICMR Rule 1.2 & 2.2 Triggered",
    notes: "Acute respiratory distress & Stage-2 hypertension. Priority emergency transfer mandated.",
    statusNote: "Ambulance 108 active on Highway 4 with emergency oxygen support.",
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString()
  }
];

// Seed initial documents if not present
async function seedInitialDataIfEmpty() {
  try {
    const triageSnap = await getDocs(collection(db, "triage_cases"));
    if (triageSnap.empty) {
      console.log("Seeding initial Firestore triage cases...");
      for (const item of SEED_TRIAGE_CASES) {
        await addDoc(collection(db, "triage_cases"), item);
      }
    }

    const invSnap = await getDocs(collection(db, "inventory"));
    if (invSnap.empty) {
      console.log("Seeding initial Firestore inventory...");
      for (const item of SEED_INVENTORY) {
        await setDoc(doc(db, "inventory", item.id), item);
      }
    }

    const refSnap = await getDocs(collection(db, "referrals"));
    if (refSnap.empty) {
      console.log("Seeding initial Firestore referrals...");
      for (const item of SEED_REFERRALS) {
        await addDoc(collection(db, "referrals"), item);
      }
    }
  } catch (err) {
    console.warn("Firestore seed notice (may already exist or offline):", err);
  }
}

// Auto seed on boot
seedInitialDataIfEmpty();

// PulseDB Global Public Interface
window.PulseDB = {
  db,
  isReady: true,

  // --- Triage Cases ---
  async addTriageCase(data) {
    const payload = {
      patientName: data.patientName || "Patient",
      abhaId: data.abhaId || "ABHA-PENDING",
      symptoms: data.symptoms || "General Malaise",
      bloodPressure: data.bloodPressure || "120/80",
      pulseRate: data.pulseRate || "78 bpm",
      spo2: data.spo2 || "98%",
      temperature: data.temperature || "98.6°F",
      riskScore: Number(data.riskScore || 5),
      riskLevel: data.riskLevel || "MODERATE",
      protocolTier: data.protocolTier || "YELLOW_URGENT",
      priority: data.priority || "URGENT",
      mandatoryReferral: Boolean(data.mandatoryReferral),
      regulationProtocol: data.regulationProtocol || "ICMR-NHM Frontline Emergency Standard 2026",
      triggeredRules: data.triggeredRules || [],
      emergencyFlags: data.emergencyFlags || [],
      frontlineActions: data.frontlineActions || [],
      referralDirective: data.referralDirective || "",
      targetFacility: data.targetFacility || "District Hospital Diagnostic Hub",
      referralId: data.referralId || "",
      status: data.status || "pending",
      ashaName: data.ashaName || "Sunita Devi",
      subCentre: data.subCentre || "Sub-Centre 4",
      createdAt: data.createdAt || new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "triage_cases"), payload);
    return { id: docRef.id, ...payload };
  },

  listenTriageCases(onUpdate, onError) {
    const q = query(collection(db, "triage_cases"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const cases = [];
        snapshot.forEach((docSnap) => {
          cases.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(cases);
      },
      (error) => {
        console.warn("Triage cases listener warning:", error);
        if (onError) onError(error);
      }
    );
  },

  async updateTriageCase(id, updates) {
    const docRef = doc(db, "triage_cases", id);
    await updateDoc(docRef, updates);
  },

  // --- Inventory & Restock ---
  async updateInventoryItem(itemId, updates) {
    const docRef = doc(db, "inventory", itemId);
    await updateDoc(docRef, updates);
  },

  listenInventory(onUpdate) {
    return onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      onUpdate(items);
    });
  },

  async requestRestock(itemId, orderDetails) {
    const docRef = doc(db, "inventory", itemId);
    await updateDoc(docRef, {
      status: "restocking",
      restockOrder: orderDetails || {
        orderId: `PHC-${Math.floor(100 + Math.random() * 900)}`,
        quantity: 100,
        requestedAt: new Date().toISOString(),
        eta: "2 hours"
      }
    });
  },

  // --- Referrals ---
  async addReferral(data) {
    const payload = {
      triageId: data.triageId || "",
      patientName: data.patientName || "Ramesh Patil",
      abhaId: data.abhaId || "12-3456-7890",
      sourceFacility: data.sourceFacility || "Sub-Centre 4",
      targetFacility: data.targetFacility || "District Hospital Diagnostic Hub",
      priority: data.priority || "URGENT",
      transportStatus: data.transportStatus || "in_transit",
      currentStage: Number(data.currentStage ?? 2),
      stageName: data.stageName || "Ambulance 108 In Transit",
      ambulanceNumber: data.ambulanceNumber || "MH-12-AMB-108",
      driverName: data.driverName || "Santosh Jadhav",
      driverPhone: data.driverPhone || "+91 98220 10811",
      eta: data.eta || "14 mins",
      bedReserved: Boolean(data.bedReserved),
      bedAssigned: data.bedAssigned || "",
      bedType: data.bedType || "General Ward Bed",
      vitalsSummary: data.vitalsSummary || "",
      regulationSummary: data.regulationSummary || "",
      notes: data.notes || "Priority clinical escalation under ICMR regulation",
      statusNote: data.statusNote || "Ambulance 108 active on Highway 4",
      createdAt: data.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "referrals"), payload);
    return { id: docRef.id, ...payload };
  },

  listenReferrals(onUpdate, onError) {
    return onSnapshot(collection(db, "referrals"), (snapshot) => {
      const referrals = [];
      snapshot.forEach((docSnap) => {
        referrals.push({ id: docSnap.id, ...docSnap.data() });
      });
      onUpdate(referrals);
    }, (err) => {
      console.warn("Referrals snapshot notice:", err);
      if (onError) onError(err);
    });
  },

  async reserveFacilityBed(referralId, bedType, bedNumber, hospitalNotes) {
    const docRef = doc(db, "referrals", referralId);
    const updates = {
      bedReserved: true,
      bedType: bedType || "ICU Oxygen Bed",
      bedAssigned: bedNumber || "ICU Bed #4",
      statusNote: hospitalNotes || `Reserved ${bedNumber || "ICU Bed #4"} at District Hospital Emergency Intake`,
      lastUpdated: new Date().toISOString()
    };
    await updateDoc(docRef, updates);
    return updates;
  },

  // --- Referral Stage Progression ---
  async updateReferralStage(referralId, stageIndex, statusText) {
    const stageNames = ["Sub-Centre Triage", "PHC Teleconsult", "Ambulance 108 In Transit", "District Hospital Intake"];
    const docRef = doc(db, "referrals", referralId);
    await updateDoc(docRef, {
      currentStage: stageIndex,
      stageName: stageNames[stageIndex] || "In Transit",
      transportStatus: stageIndex >= 3 ? "arrived" : "in_transit",
      lastUpdated: new Date().toISOString(),
      statusNote: statusText || (stageIndex >= 3 ? "Patient admitted to District Emergency Ward" : "Ambulance en route")
    });
  },

  // --- Patient Registration ---
  async registerPatient(data) {
    const payload = {
      name: data.name,
      age: Number(data.age) || 30,
      gender: data.gender || "Female",
      village: data.village || "Ward 4",
      abhaId: data.abhaId || `ABHA-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: data.phone || "9876543210",
      registeredAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "patients"), payload);
    return { id: docRef.id, ...payload };
  },

  listenPatients(onUpdate) {
    return onSnapshot(collection(db, "patients"), (snapshot) => {
      const patients = [];
      snapshot.forEach((docSnap) => {
        patients.push({ id: docSnap.id, ...docSnap.data() });
      });
      onUpdate(patients);
    });
  },

  // --- Registered Workspace Users & Self-Registration Cloud Sync ---
  async registerUserAccount(data) {
    const payload = {
      name: data.name,
      email: (data.email || "").trim().toLowerCase(),
      role: data.role,
      workplace: data.workplace || "Rural Health Network",
      phone: data.phone || "",
      abhaId: data.abhaId || "",
      licenseNumber: data.licenseNumber || "",
      isGoogleVerified: Boolean(data.isGoogleVerified),
      googleUid: data.googleUid || "",
      photoURL: data.photoURL || "",
      authProvider: data.authProvider || (data.isGoogleVerified ? "google" : "credentials"),
      createdAt: new Date().toISOString()
    };
    const targetId = data.googleUid || data.id || payload.email.replace(/[^a-z0-9]/gi, "_");
    const docRef = doc(db, "users", targetId);
    await setDoc(docRef, payload, { merge: true });
    return { id: targetId, ...payload };
  },

  async findUserByEmail(email) {
    try {
      const normEmail = (email || "").trim().toLowerCase();
      if (!normEmail) return null;
      const q = query(collection(db, "users"), where("email", "==", normEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (e) {
      console.warn("Firestore findUserByEmail notice:", e);
      return null;
    }
  },

  async getUserAccounts() {
    try {
      const snap = await getDocs(collection(db, "users"));
      const users = [];
      snap.forEach(d => users.push({ id: d.id, ...d.data() }));
      return users;
    } catch (e) {
      console.warn("Firestore getUserAccounts notice:", e);
      return [];
    }
  },

  // Live WebRTC Video Call Signaling & Session Methods
  async setCallSession(callId, data) {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      await setDoc(doc(db, "video_calls", callId), {
        ...cleanData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore setCallSession notice:", e);
    }
  },

  async updateCallSession(callId, data) {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      await updateDoc(doc(db, "video_calls", callId), {
        ...cleanData,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Firestore updateCallSession notice:", e);
    }
  },

  async clearCallSession(callId) {
    try {
      await deleteDoc(doc(db, "video_calls", callId));
    } catch (e) {
      console.warn("Firestore clearCallSession notice:", e);
    }
  },

  listenCallSession(callId, callback) {
    try {
      return onSnapshot(doc(db, "video_calls", callId), (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data());
        } else {
          callback(null);
        }
      }, (err) => {
        console.warn("listenCallSession error:", err);
      });
    } catch (e) {
      console.warn("listenCallSession setup error:", e);
      return () => {};
    }
  },

  async sendCallSignal(callId, signalData) {
    try {
      const cleanSignal = JSON.parse(JSON.stringify(signalData));
      await addDoc(collection(db, "video_calls", callId, "signals"), {
        ...cleanSignal,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Firestore sendCallSignal notice:", e);
    }
  },

  listenCallSignals(callId, callback) {
    try {
      const q = query(collection(db, "video_calls", callId, "signals"), orderBy("createdAt", "asc"));
      return onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            callback({ id: change.doc.id, ...change.doc.data() });
          }
        });
      }, (err) => {
        console.warn("listenCallSignals error:", err);
      });
    } catch (e) {
      console.warn("listenCallSignals setup error:", e);
      return () => {};
    }
  }
};

// Dispatch readiness event
window.dispatchEvent(new CustomEvent("PulseDBReady", { detail: window.PulseDB }));
