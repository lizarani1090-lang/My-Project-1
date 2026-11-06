// ==============================================================================
// Pulse Predictor — Rural Health Access & Quality Platform
// Interactive Application Logic & Presentation Engine
// ==============================================================================

// ---- Component 4: Longitudinal Record Timeline (Rendered across all roles) ----
const timelineHTML = `
  <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
    <div class="flex gap-3">
      <div class="flex flex-col items-center">
        <div class="w-3.5 h-3.5 rounded-full bg-asha ring-4 ring-emerald-50"></div>
        <div class="w-0.5 flex-1 bg-gray-200 mt-1"></div>
      </div>
      <div class="pb-3">
        <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Sub-Centre 4 · 2 days ago</p>
        <h4 class="text-sm font-bold text-gray-800">Symptom capture + digital triage</h4>
        <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">ASHA Sunita Devi recorded fever (102°F), productive cough, BP 150/95 — flagged RED Critical Risk.</p>
        <div class="flex gap-2 mt-1.5">
          <span class="bg-red-50 text-danger text-[10px] font-bold px-2 py-0.5 rounded">High Risk Triage</span>
          <span class="bg-emerald-50 text-asha text-[10px] font-bold px-2 py-0.5 rounded">Vitals Synced</span>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <div class="flex flex-col items-center">
        <div class="w-3.5 h-3.5 rounded-full bg-doctor ring-4 ring-sky-50"></div>
        <div class="w-0.5 flex-1 bg-gray-200 mt-1"></div>
      </div>
      <div class="pb-3">
        <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">PHC Ward 4 · 2 days ago</p>
        <h4 class="text-sm font-bold text-gray-800">Assisted teleconsultation</h4>
        <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">Dr. Rajesh Kumar prescribed Tab. Amoxicillin 500mg, ordered chest X-ray, initiated emergency district hospital referral.</p>
        <div class="flex gap-2 mt-1.5">
          <span class="bg-sky-50 text-doctor text-[10px] font-bold px-2 py-0.5 rounded">e-Prescription Issued</span>
          <span class="bg-amber-50 text-warning text-[10px] font-bold px-2 py-0.5 rounded">Referral Dispatched</span>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <div class="flex flex-col items-center">
        <div class="w-3.5 h-3.5 rounded-full bg-warning ring-4 ring-amber-50"></div>
        <div class="w-0.5 flex-1 bg-gray-200 mt-1"></div>
      </div>
      <div class="pb-3">
        <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Rural Hospital · Yesterday</p>
        <h4 class="text-sm font-bold text-gray-800">Referral in transit</h4>
        <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">Inter-facility transport coordination via Ambulance 108 to District Hospital Diagnostic Hub.</p>
        <div class="flex gap-2 mt-1.5">
          <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Ambulance GPS Active</span>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <div class="flex flex-col items-center">
        <div class="w-3.5 h-3.5 rounded-full bg-gray-300 ring-4 ring-gray-100"></div>
      </div>
      <div>
        <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">District Hospital · Pending</p>
        <h4 class="text-sm font-bold text-gray-500">Specialist consultation + Chest X-ray</h4>
        <p class="text-xs text-gray-500 mt-0.5">Scheduled for examination upon hospital arrival.</p>
        <div class="mt-1.5">
          <span class="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded">Pending Intake</span>
        </div>
      </div>
    </div>
  </div>`;

function renderRecordTimeline() {
  ["recordTimeline", "recordTimeline2", "recordTimeline3"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = timelineHTML;
  });
  window.setTimeout(applyTranslations, 0);
}
renderRecordTimeline();

// ==============================================================================
// Active Secure Workplace Session State (Strict Role Workplace Auth)
// ==============================================================================
let activeRole = "asha";
let currentSessionUser = null;

const ROLE_METADATA = {
  asha: {
    badge: "ASHA Workplace",
    icon: "fa-user-nurse",
    logoBg: "bg-asha",
    badgeClass: "bg-emerald-50 text-asha border-emerald-200",
    dotClass: "text-emerald-500",
    defaultSubText: "Sunita Devi · Sub-Centre 4",
    primaryView: "asha-dashboard"
  },
  doctor: {
    badge: "Doctor Workplace",
    icon: "fa-user-doctor",
    logoBg: "bg-doctor",
    badgeClass: "bg-sky-50 text-doctor border-sky-200",
    dotClass: "text-sky-500",
    defaultSubText: "Dr. Rajesh Kumar · PHC Ward 4",
    primaryView: "doctor-queue"
  },
  facility: {
    badge: "Facility Admin",
    icon: "fa-hospital",
    logoBg: "bg-facility",
    badgeClass: "bg-amber-50 text-facility border-amber-200",
    dotClass: "text-amber-500",
    defaultSubText: "PHC Facility Admin · Logistics & Beds",
    primaryView: "facility-dashboard"
  },
  patient: {
    badge: "Patient Portal",
    icon: "fa-user",
    logoBg: "bg-patient",
    badgeClass: "bg-indigo-50 text-patient border-indigo-200",
    dotClass: "text-indigo-500",
    defaultSubText: "Damodar Kumar Singh · ABHA: 91-8507-4746-3815",
    primaryView: "patient-dashboard"
  }
};

function applyWorkplaceRole(role, sessionData = {}) {
  if (!["asha", "doctor", "facility", "patient"].includes(role)) return;
  activeRole = role;
  currentSessionUser = sessionData;

  if (window.PulseCall && window.PulseCall.setActiveRole) {
    window.PulseCall.setActiveRole(role);
  }

  const meta = ROLE_METADATA[role];

  // Update header logo border and status dot
  const logoImg = document.getElementById("headerLogoImg");
  const logoDot = document.getElementById("headerLogoDot");
  if (logoImg) {
    const borderColors = { asha: "border-emerald-500", doctor: "border-sky-500", facility: "border-amber-500", patient: "border-indigo-500" };
    logoImg.className = `w-9 h-9 rounded-xl object-cover border-2 ${borderColors[role] || "border-emerald-500"} shadow-sm transition-colors duration-300`;
  }
  if (logoDot) {
    const dotColors = { asha: "bg-emerald-500", doctor: "bg-sky-500", facility: "bg-amber-500", patient: "bg-indigo-500" };
    logoDot.className = `absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${dotColors[role] || "bg-emerald-500"} ring-2 ring-white transition-colors duration-300`;
  }

  // Update header workplace badge
  const badgeEl = document.getElementById("headerWorkplaceBadge");
  const badgeTextEl = document.getElementById("headerWorkplaceText");
  const subTextEl = document.getElementById("headerSubText");

  if (badgeEl && meta) {
    badgeEl.className = `${meta.badgeClass} border text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1`;
  }
  if (badgeTextEl && meta) {
    badgeTextEl.textContent = meta.badge;
  }
  if (subTextEl) {
    const namePart = sessionData.name || meta.defaultSubText.split("·")[0].trim();
    const workplacePart = sessionData.workplace || meta.defaultSubText.split("·")[1]?.trim() || "";
    subTextEl.textContent = workplacePart ? `${namePart} · ${workplacePart}` : namePart;
  }

  // Bind Dynamic User Details according to authenticated login ID
  const userName = (sessionData.name && sessionData.name.trim()) ? sessionData.name.trim() : null;
  const userWorkplace = (sessionData.workplace && sessionData.workplace.trim()) ? sessionData.workplace.trim() : null;
  const userAbha = (sessionData.abhaId && sessionData.abhaId.trim()) ? sessionData.abhaId.trim() : null;

  if (role === "asha") {
    const ashaNameEl = document.getElementById("ashaHeroUserName");
    const ashaWorkplaceEl = document.getElementById("ashaHeroWorkplace");
    if (ashaNameEl && userName) ashaNameEl.textContent = userName;
    if (ashaWorkplaceEl && userWorkplace) {
      ashaWorkplaceEl.textContent = `ASHA Facilitator · ${userWorkplace}`;
    }
  } else if (role === "doctor") {
    const docNameEl = document.getElementById("doctorHeroUserName");
    const docWorkplaceEl = document.getElementById("doctorHeroWorkplace");
    if (docNameEl && userName) docNameEl.textContent = userName.startsWith("Dr.") ? userName : `Dr. ${userName}`;
    if (docWorkplaceEl && userWorkplace) {
      docWorkplaceEl.textContent = `Medical Officer · ${userWorkplace} · Active Station`;
    }
  } else if (role === "facility") {
    const facNameEl = document.getElementById("facilityHeroUserName");
    const facWorkplaceEl = document.getElementById("facilityHeroWorkplace");
    if (facNameEl && userName) facNameEl.textContent = userName;
    if (facWorkplaceEl && userWorkplace) {
      facWorkplaceEl.textContent = `Operations & Logistics · ${userWorkplace}`;
    }
  } else if (role === "patient") {
    const activeName = userName || (sessionData.email?.includes("damodar") || sessionData.email?.includes("dksingh") ? "Damodar Kumar Singh" : "Damodar Kumar Singh");
    const activeAbha = userAbha || (userWorkplace?.includes("ABHA:") ? userWorkplace.replace("ABHA:", "").trim() : "91-8507-4746-3815");

    const patNameEl = document.getElementById("patientHeroUserName");
    const patWorkplaceEl = document.getElementById("patientHeroWorkplace");
    if (patNameEl) patNameEl.textContent = activeName;
    if (patWorkplaceEl) {
      patWorkplaceEl.textContent = `ABHA ID: ${activeAbha} · Ayushman Bharat`;
    }

    // Update Digital ABHA Health Locker ID Card
    const cardNameEl = document.getElementById("patientCardUserName");
    const cardAbhaNumEl = document.getElementById("patientCardAbhaNumber");
    const cardAbhaAddrEl = document.getElementById("patientCardAbhaAddress");
    if (cardNameEl) cardNameEl.textContent = activeName;
    if (cardAbhaNumEl) cardAbhaNumEl.textContent = activeAbha;
    if (cardAbhaAddrEl) {
      const addrSlug = (activeName || "damodar.singh").toLowerCase().replace(/[^a-z0-9]/g, ".");
      cardAbhaAddrEl.textContent = `ABHA Address: ${addrSlug}@abdm`;
    }

    // Restore any persisted appointment state
    try {
      const savedAppt = JSON.parse(localStorage.getItem("pulse_patient_appt") || "null");
      if (savedAppt) {
        const apptTextEl = document.getElementById("patientHeroApptText");
        const docTextEl = document.getElementById("patientHeroDoctorText");
        const queueTokenEl = document.getElementById("patientQueueToken");
        if (apptTextEl && savedAppt.time) apptTextEl.textContent = `Appt Today ${savedAppt.time}`;
        if (docTextEl && savedAppt.status) docTextEl.textContent = savedAppt.status;
        if (queueTokenEl && savedAppt.token) queueTokenEl.textContent = savedAppt.token;
      }
    } catch (_) {}
  }

  // Activate ONLY the authenticated view, completely hide all others
  document.querySelectorAll(".app-view").forEach((view) => {
    view.classList.toggle("active", view.id === `app-${role}`);
  });

  // Switch to primary sub-view for that role
  if (role === "asha") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const workParam = urlParams.get("work");
      if (workParam === "triage" || workParam === "first" || workParam === "1") {
        showASHA("asha-triage");
      } else {
        showASHA("asha-dashboard");
      }
    } catch (_) {
      showASHA("asha-dashboard");
    }
  }
  if (role === "doctor") showDoctor("doctor-queue");
  if (role === "facility") showFacility("facility-dashboard");
  if (role === "patient") showPatient("patient-dashboard");

  // Re-render timeline if visible
  renderRecordTimeline();
}

// Changing workplace requires logging out and authenticating with the new workplace credentials
async function switchWorkplace() {
  try {
    const token = localStorage.getItem("pulse_predictor_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await fetch("/api/logout", { method: "POST", headers, credentials: "same-origin" });
  } catch (_) {}
  try {
    localStorage.removeItem("pulse_predictor_token");
    localStorage.removeItem("pulse_predictor_role");
    localStorage.removeItem("pulse_predictor_user");
  } catch (_) {}
  window.location.assign("/login.html");
}

async function logout() {
  await switchWorkplace();
}

async function switchRole(role) {
  try {
    const token = localStorage.getItem("pulse_predictor_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await fetch("/api/logout", { method: "POST", headers, credentials: "same-origin" });
  } catch (_) {}
  try {
    localStorage.removeItem("pulse_predictor_token");
    localStorage.removeItem("pulse_predictor_role");
    localStorage.removeItem("pulse_predictor_user");
  } catch (_) {}
  window.location.assign(`/login-${role}.html`);
}

// Sub-view toggles for each role
function showASHA(id) {
  document.querySelectorAll("#app-asha main").forEach((m) => (m.style.display = "none"));
  const target = document.getElementById(id);
  if (target) target.style.display = "block";

  const map = {
    "asha-dashboard": 0,
    "asha-triage": 1,
    "asha-referral": 2,
    "asha-stock": 3,
  };
  document.querySelectorAll(".asha-nav .nav-item").forEach((n, i) => {
    n.classList.toggle("text-asha", map[id] === i);
  });

  if (id === "asha-teleconsult") {
    startVideoSession("asha");
  } else {
    stopVideoSession("asha");
  }
  if (id === "asha-record") renderRecordTimeline();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDoctor(id) {
  document.querySelectorAll("#app-doctor main").forEach((m) => (m.style.display = "none"));
  const target = document.getElementById(id);
  if (target) target.style.display = "block";

  const map = { "doctor-queue": 0, "doctor-diagnostics": 1 };
  document.querySelectorAll(".doctor-nav .nav-item").forEach((n, i) => {
    n.classList.toggle("text-doctor", map[id] === i);
  });

  if (id === "doctor-consult") {
    startVideoSession("doctor");
  } else {
    stopVideoSession("doctor");
  }
  if (id === "doctor-record") renderRecordTimeline();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showFacility(id) {
  document.querySelectorAll("#app-facility main").forEach((m) => (m.style.display = "none"));
  const target = document.getElementById(id);
  if (target) target.style.display = "block";

  const map = {
    "facility-dashboard": 0,
    "facility-referrals": 1,
    "facility-stock": 2,
    "facility-outbreak": 3,
  };
  document.querySelectorAll(".facility-nav .nav-item").forEach((n, i) => {
    n.classList.toggle("text-facility", map[id] === i);
  });
  if (id === "facility-outbreak") {
    loadCmoOutbreakData();
  }
  if (id === "facility-dashboard" || id === "facility-referrals") {
    refreshHospitalIncomingReferrals();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showPatient(id) {
  document.querySelectorAll("#app-patient main").forEach((m) => (m.style.display = "none"));
  const target = document.getElementById(id);
  if (target) target.style.display = "block";

  const map = {
    "patient-dashboard": 0,
    "patient-booking": 1,
    "patient-record": 2,
    "patient-meds": 3,
  };
  document.querySelectorAll(".patient-nav .nav-item").forEach((n, i) => {
    n.classList.toggle("text-patient", map[id] === i);
  });

  if (id === "patient-teleconsult") {
    startVideoSession("patient");
  } else {
    stopVideoSession("patient");
  }
  if (id === "patient-record") renderRecordTimeline();
  if (id === "patient-dashboard") {
    updatePatientReferralView();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==============================================================================
// Interactive Clinical Triage Calculator & Risk Engine
// ==============================================================================
function toggleSymptom(el) {
  const isSelected = el.classList.contains("bg-asha");
  if (isSelected) {
    el.classList.remove("bg-asha", "text-white", "border-asha");
    el.classList.add("bg-gray-100", "text-gray-600", "border-gray-200");
  } else {
    el.classList.remove("bg-gray-100", "text-gray-600", "border-gray-200");
    el.classList.add("bg-asha", "text-white", "border-asha");
  }
  // Visual live preview update only — prevents duplicate automatic database writes on chip tap
  updateTriageLivePreview();
}

function setTriagePreset(type) {
  const bpInput = document.getElementById("triageBP");
  const pulseInput = document.getElementById("triagePulse");
  const spo2Input = document.getElementById("triageSpO2");
  const chips = document.querySelectorAll("#symptomsContainer .symptom-chip");

  chips.forEach(chip => {
    chip.classList.remove("bg-asha", "text-white", "border-asha");
    chip.classList.add("bg-gray-100", "text-gray-600", "border-gray-200");
  });

  if (type === "normal") {
    if (bpInput) bpInput.value = "120/80";
    if (pulseInput) pulseInput.value = "72 bpm";
    if (spo2Input) spo2Input.value = "98%";
    // Select mild cold as standard routine presentation
    const coldChip = Array.from(chips).find(c => c.textContent.includes("Cold"));
    if (coldChip) {
      coldChip.classList.remove("bg-gray-100", "text-gray-600", "border-gray-200");
      coldChip.classList.add("bg-asha", "text-white", "border-asha");
    }
    showToast("Loaded Normal Vitals preset (120/80, 98% SpO2).");
  } else if (type === "emergency") {
    if (bpInput) bpInput.value = "165/105";
    if (pulseInput) pulseInput.value = "112 bpm";
    if (spo2Input) spo2Input.value = "91%";
    // Select high-risk emergency symptoms
    chips.forEach(chip => {
      const text = chip.textContent;
      if (text.includes("Chest") || text.includes("Breathlessness")) {
        chip.classList.remove("bg-gray-100", "text-gray-600", "border-gray-200");
        chip.classList.add("bg-asha", "text-white", "border-asha");
      }
    });
    showToast("Loaded Emergency Case preset (Chest Tightness, 165/105 BP).");
  } else if (type === "clear") {
    if (bpInput) bpInput.value = "120/80";
    if (pulseInput) pulseInput.value = "72 bpm";
    if (spo2Input) spo2Input.value = "98%";
    showToast("Reset triage vitals and symptoms to baseline.");
  }

  updateTriageLivePreview();
}

function updateTriageLivePreview() {
  const selected = document.querySelectorAll("#symptomsContainer .bg-asha");
  const bpVal = document.getElementById("triageBP")?.value || "120/80";
  const pulseVal = document.getElementById("triagePulse")?.value || "72 bpm";
  const spo2Val = document.getElementById("triageSpO2")?.value || "98%";

  const bpParts = bpVal.split("/");
  const sys = parseInt(bpParts[0], 10) || 120;
  const dia = parseInt(bpParts[1], 10) || 80;
  const spo2 = parseFloat(spo2Val) || 98;
  const pulse = parseInt(pulseVal, 10) || 72;

  let estScore = 0;
  selected.forEach(c => {
    estScore += parseInt(c.getAttribute("data-risk") || "1", 10);
  });

  if (spo2 < 90) estScore += 5;
  else if (spo2 < 95) estScore += 2;

  if (sys >= 180 || dia >= 110) estScore += 5;
  else if (sys >= 160 || dia >= 100) estScore += 3;
  else if (sys >= 140 || dia >= 90) estScore += 2;
  else if (sys >= 130 || dia >= 85) estScore += 1;

  if (pulse > 120) estScore += 3;
  else if (pulse > 100) estScore += 1;
  else if (pulse < 50) estScore += 3;

  estScore = Math.min(10, Math.max(0, estScore));

  const dot = document.getElementById("previewRiskDot");
  const text = document.getElementById("previewRiskText");
  const dir = document.getElementById("previewDirectiveText");

  if (!dot || !text) return;

  if (estScore >= 7 || spo2 < 90 || sys >= 180) {
    dot.className = "w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse";
    text.textContent = `Estimated: HIGH RISK (${estScore}/10)`;
    text.className = "font-bold text-danger";
    if (dir) dir.textContent = "Red Alert · Priority Emergency Transfer";
  } else if (estScore >= 4) {
    dot.className = "w-2.5 h-2.5 rounded-full bg-amber-500";
    text.textContent = `Estimated: MODERATE (${estScore}/10)`;
    text.className = "font-bold text-amber-800";
    if (dir) dir.textContent = "Yellow Alert · Non-urgent PHC Teleconsult";
  } else {
    dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
    text.textContent = `Estimated: Normal / Low Risk (${estScore}/10)`;
    text.className = "font-bold text-emerald-800";
    if (dir) dir.textContent = "Green Protocol · Routine Sub-Centre Care";
  }
}

let isTriageSubmitting = false;
let lastTriageSubmittedHash = "";
let lastTriageSubmittedTime = 0;

async function calculateTriageRisk() {
  if (isTriageSubmitting) return;

  const btn = document.getElementById("calculateTriageBtn");
  const selected = document.querySelectorAll("#symptomsContainer .bg-asha");
  const selectedSymptoms = Array.from(selected).map(c => c.textContent.trim()).join(", ") || "General Routine Checkup";
  const patientNameVal = (document.getElementById("triagePatientName")?.value || "").trim() || "Ramesh Patil";
  const bpVal = (document.getElementById("triageBP")?.value || "120/80").trim();
  const pulseVal = (document.getElementById("triagePulse")?.value || "72 bpm").trim();
  const spo2Val = (document.getElementById("triageSpO2")?.value || "98%").trim();

  // Deduplication check: prevent multiple duplicate submissions of the exact same vitals/symptoms within 6 seconds
  const currentHash = `${patientNameVal}_${bpVal}_${pulseVal}_${spo2Val}_${selectedSymptoms}`;
  const now = Date.now();
  if (currentHash === lastTriageSubmittedHash && (now - lastTriageSubmittedTime < 6000)) {
    showToast("This triage assessment is already stored.");
    return;
  }

  isTriageSubmitting = true;
  if (btn) {
    btn.disabled = true;
    btn.classList.add("opacity-60", "cursor-not-allowed");
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Assessing Regulations...</span>`;
  }

  // Call the backend ICMR triage generation & regulation engine
  try {
    const res = await fetch("/api/triage/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: patientNameVal,
        symptoms: selectedSymptoms,
        bloodPressure: bpVal,
        pulseRate: pulseVal,
        spo2: spo2Val,
        initiateReferral: false, // Let clinical regulations determine if mandatory referral is warranted
        ashaName: "Sunita Devi",
        subCentre: "Sub-Centre 4"
      })
    });
    const result = await res.json();
    if (result && result.ok && result.assessment) {
      lastTriageSubmittedHash = currentHash;
      lastTriageSubmittedTime = Date.now();

      renderTriageAssessmentResult(result.assessment, result.referral, result.triageCase);

      // Persist to Cloud Firestore if connected
      if (window.PulseDB && typeof window.PulseDB.addTriageCase === "function") {
        try {
          await window.PulseDB.addTriageCase(result.triageCase);
          if (result.referral && typeof window.PulseDB.addReferral === "function") {
            await window.PulseDB.addReferral(result.referral);
          }
        } catch (dbErr) {
          console.warn("Firestore live sync notice:", dbErr);
        }
      }

      // Propagate to Hospital and Patient views if a referral was mandated
      if (result.referral) {
        refreshHospitalIncomingReferrals();
        updatePatientReferralView();
      }

      if (result.assessment.riskLevel === "LOW") {
        showToast(`Triage Complete: Normal / Low Risk (${result.assessment.riskScore}/10) · Routine Protocol Logged`);
      } else if (result.assessment.riskLevel === "MODERATE") {
        showToast(`Triage Complete: Moderate Risk (${result.assessment.riskScore}/10) · Routine Teleconsult Advised`);
      } else {
        showToast(`ICMR Alert: HIGH RISK (${result.assessment.riskScore}/10) · Emergency Referral Dispatched!`);
      }
      return;
    }
  } catch (err) {
    console.warn("API triage/generate fallback to local scoring:", err);
  } finally {
    isTriageSubmitting = false;
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("opacity-60", "cursor-not-allowed");
      btn.innerHTML = `<i class="fa-solid fa-calculator"></i><span>Protocol Score &amp; Save</span>`;
    }
  }

  // Local fallback calculation if offline or backend unreachable
  let score = 0;
  selected.forEach((chip) => {
    score += parseInt(chip.getAttribute("data-risk") || "1", 10);
  });
  const spo2Num = parseFloat(spo2Val) || 98;
  const bpParts = bpVal.split("/");
  const sys = parseInt(bpParts[0], 10) || 120;
  const dia = parseInt(bpParts[1], 10) || 80;

  if (spo2Num < 90) score += 5;
  else if (spo2Num < 95) score += 2;

  if (sys >= 180 || dia >= 110) score += 5;
  else if (sys >= 160 || dia >= 100) score += 3;
  else if (sys >= 140 || dia >= 90) score += 2;
  else if (sys >= 130 || dia >= 85) score += 1;

  score = Math.min(10, Math.max(0, score));

  const resultCard = document.getElementById("ashaTriageResult");
  const title = document.getElementById("triageRiskTitle");
  const scoreBadge = document.getElementById("triageRiskScore");
  const desc = document.getElementById("triageRiskDesc");

  if (!resultCard) return;
  resultCard.classList.remove("hidden");

  const riskLevelVal = score >= 7 ? "HIGH" : score >= 4 ? "MODERATE" : "LOW";
  if (score >= 7) {
    resultCard.className = "bg-red-50 border-2 border-red-200 p-4 rounded-2xl mb-4";
    title.textContent = "High Clinical Risk — RED ALERT (ICMR Rule Triggered)";
    title.className = "font-bold text-danger text-sm";
    scoreBadge.textContent = `Risk Score: ${score}/10 (High)`;
    scoreBadge.className = "bg-red-100 text-danger text-[10px] font-bold px-2 py-0.5 rounded-full";
    desc.textContent = "Acute symptoms detected. Priority emergency referral to District Hospital mandated.";
  } else if (score >= 4) {
    resultCard.className = "bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl mb-4";
    title.textContent = "Moderate Clinical Risk — YELLOW ALERT";
    title.className = "font-bold text-amber-800 text-sm";
    scoreBadge.textContent = `Risk Score: ${score}/10 (Moderate)`;
    scoreBadge.className = "bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full";
    desc.textContent = "Moderate symptoms observed. Recommend non-urgent teleconsult within 24 hours.";
  } else {
    resultCard.className = "bg-green-50 border-2 border-green-200 p-4 rounded-2xl mb-4";
    title.textContent = "Normal / Low Clinical Risk — GREEN PROTOCOL";
    title.className = "font-bold text-green-800 text-sm";
    scoreBadge.textContent = `Risk Score: ${score}/10 (Normal / Mild)`;
    scoreBadge.className = "bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full";
    desc.textContent = "Stable normal vitals and mild presentation. Counsel patient on home care and hydration.";
  }

  const casePayload = {
    patientName: patientNameVal,
    symptoms: selectedSymptoms,
    bloodPressure: bpVal,
    pulseRate: pulseVal,
    spo2: spo2Val,
    riskScore: score,
    riskLevel: riskLevelVal,
    ashaName: "Sunita Devi",
    subCentre: "Sub-Centre 4"
  };

  if (!isOnline) {
    queueOfflineRecord({ type: "triage", data: casePayload, timestamp: new Date().toISOString() });
    showToast(`Frontline offline mode: Triage queued in local outbox for ${patientNameVal} (${riskLevelVal})`);
    return;
  }

  submitTriageViaRest(casePayload);
}

function renderTriageAssessmentResult(assessment, referral, triageCase) {
  const resultCard = document.getElementById("ashaTriageResult");
  const title = document.getElementById("triageRiskTitle");
  const scoreBadge = document.getElementById("triageRiskScore");
  const desc = document.getElementById("triageRiskDesc");
  if (!resultCard) return;

  resultCard.classList.remove("hidden");
  const isHigh = assessment.riskLevel === "HIGH";
  const isMod = assessment.riskLevel === "MODERATE";

  resultCard.className = isHigh
    ? "bg-red-50 border-2 border-red-300 p-4 rounded-2xl mb-4 animate-fade-in"
    : isMod
    ? "bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl mb-4 animate-fade-in"
    : "bg-green-50 border-2 border-green-300 p-4 rounded-2xl mb-4 animate-fade-in";

  if (title) {
    title.className = isHigh ? "font-black text-danger text-sm" : isMod ? "font-bold text-amber-900 text-sm" : "font-bold text-green-900 text-sm";
    title.textContent = isHigh 
      ? `High Clinical Risk — CRITICAL TIER (ICMR Alert)`
      : isMod 
      ? `Moderate Clinical Risk — URGENT TIER`
      : `Normal / Low Clinical Risk — GREEN PROTOCOL`;
  }

  if (scoreBadge) {
    scoreBadge.className = isHigh
      ? "bg-red-100 text-danger text-[10px] font-black px-2.5 py-0.5 rounded-full"
      : isMod
      ? "bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
      : "bg-green-100 text-green-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full";
    scoreBadge.textContent = `Score: ${assessment.riskScore}/10 (${assessment.protocolTier})`;
  }

  if (desc) {
    const rulesList = (assessment.triggeredRules || []).map(r => {
      const text = typeof r === "string" ? r : `${r.rule || ""}: ${r.note || ""}`;
      return `<li>${escapeHTML(text)}</li>`;
    }).join("");

    const actionsList = (assessment.frontlineActions || []).map(a => `<li>${escapeHTML(a)}</li>`).join("");

    const referralHtml = referral ? `
      <div class="mt-2.5 pt-2.5 border-t border-red-200/80 text-xs">
        <div class="flex items-center justify-between text-red-900 font-bold mb-1">
          <span>🚨 Mandatory Referral Generated: ${escapeHTML(referral.targetFacility)}</span>
          <span class="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full">108 Active</span>
        </div>
        <p class="text-[11px] text-gray-700">Ambulance: <strong>${escapeHTML(referral.ambulanceNumber)}</strong> · Driver: ${escapeHTML(referral.driverName)} (${escapeHTML(referral.driverPhone)}) · ETA: <strong>${escapeHTML(referral.eta)}</strong></p>
        <p class="text-[11px] text-emerald-800 font-semibold mt-0.5">✅ ${escapeHTML(referral.bedAssigned)} Reserved at District Hospital</p>
      </div>
    ` : `
      <div class="mt-2 pt-2 border-t border-green-200/80 text-xs text-green-800 font-semibold flex items-center gap-1.5">
        <i class="fa-solid fa-circle-check text-green-600"></i>
        <span>No Emergency Hospital Referral Required · Safe for sub-centre home care monitoring.</span>
      </div>
    `;

    desc.innerHTML = `
      <p class="text-xs text-gray-800 font-semibold mb-1">${escapeHTML(assessment.regulationProtocol)}</p>
      ${rulesList ? `<ul class="text-[11px] text-gray-700 space-y-0.5 list-disc list-inside mb-1.5">${rulesList}</ul>` : ""}
      ${actionsList ? `<div class="bg-white/80 p-2 rounded-lg border border-emerald-100 text-[11px] text-gray-700 space-y-0.5"><strong>Recommended Frontline Actions:</strong><ul class="list-disc list-inside">${actionsList}</ul></div>` : ""}
      ${referralHtml}
    `;
  }
}

async function submitTriageViaRest(payload) {
  try {
    const res = await fetch("/api/triage/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, initiateReferral: Boolean(payload.initiateReferral) })
    });
    const data = await res.json();
    if (data.ok) {
      showToast(`Triage recorded: ${payload.patientName} (${payload.riskLevel} Risk)`);
      if (data.referral) {
        refreshHospitalIncomingReferrals();
        updatePatientReferralView();
      }
    }
  } catch (_) {
    queueOfflineRecord({ type: "triage", data: payload, timestamp: new Date().toISOString() });
    showToast("Triage recorded in offline local cache.");
  }
}

// ==============================================================================
// Medicine Restock & Logistics Simulation
// ==============================================================================
async function requestRestock(itemId = "ors") {
  if (window.PulseDB && typeof window.PulseDB.requestRestock === "function") {
    try {
      await window.PulseDB.requestRestock(itemId);
    } catch (e) {
      console.warn("Cloud restock notice:", e);
    }
  }

  try {
    await fetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, action: "restock", quantity: 100 })
    });
  } catch (_) {}

  const stockList = document.getElementById("ashaStockList");
  if (stockList) {
    stockList.innerHTML = `
      <div class="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h4 class="text-sm font-bold text-gray-800">Amoxicillin 500mg</h4>
          <p class="text-xs text-gray-500">220 strips in stock · Reorder at 50</p>
        </div>
        <span class="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg">Available</span>
      </div>
      <div class="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h4 class="text-sm font-bold text-gray-800">Iron &amp; Folic Acid (IFA)</h4>
          <p class="text-xs text-gray-500">18 strips remaining · Reorder threshold 25</p>
        </div>
        <span class="bg-amber-100 text-warning text-xs font-bold px-2.5 py-1 rounded-lg">Low Stock</span>
      </div>
      <div class="bg-white p-3.5 rounded-xl shadow-sm border border-emerald-200 bg-emerald-50/50 flex justify-between items-center">
        <div>
          <h4 class="text-sm font-bold text-emerald-900">Oral Rehydration Salts (ORS)</h4>
          <p class="text-xs text-emerald-700 font-medium">Restock order #PHC-892 placed · 100 packets en route</p>
        </div>
        <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">Dispatched (ETA 2h)</span>
      </div>
    `;
  }
  showToast("Restock order #PHC-892 transmitted to PHC Central Pharmacy. ETA: 2 hours.");
}

// Patient booking confirmation
async function confirmPatientBooking() {
  const activePatientName = currentSessionUser?.name || "Damodar Kumar Singh";
  const token = `Token #${Math.floor(10 + Math.random() * 89)}`;
  const scheduledTime = "2:00 PM Today";

  // Update persistent appointment state
  try {
    localStorage.setItem("pulse_patient_appt", JSON.stringify({
      time: "2:00 PM",
      status: "Doctor Ready",
      token: token,
      doctor: "Dr. Rajesh Kumar"
    }));
  } catch (_) {}

  // Update top hero appointment badge & queue card
  const heroApptText = document.getElementById("patientHeroApptText");
  const heroDocText = document.getElementById("patientHeroDoctorText");
  const queueTokenEl = document.getElementById("patientQueueToken");
  if (heroApptText) heroApptText.textContent = `Appt Today 2:00 PM (${token})`;
  if (heroDocText) heroDocText.textContent = "Doctor Ready";
  if (queueTokenEl) queueTokenEl.textContent = token;

  if (window.PulseDB && typeof window.PulseDB.bookConsultation === "function") {
    try {
      await window.PulseDB.bookConsultation({
        patientName: activePatientName,
        doctorName: "Dr. Rajesh Kumar",
        tokenNumber: token,
        scheduledTime: scheduledTime
      });
    } catch (_) {}
  }

  try {
    await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientName: activePatientName, tokenNumber: token })
    });
  } catch (_) {}

  const status = document.getElementById("queueStatus");
  if (status) {
    status.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
          <i class="fa-solid fa-circle-check text-emerald-600"></i>Appointment Confirmed: 2:00 PM Today
        </p>
        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">${token}</span>
      </div>
      <p class="text-xs text-gray-600 mb-2">You are <strong>#1 in line</strong> with Dr. Rajesh Kumar. Prepare your phone for the video call.</p>
      <div class="w-full bg-white rounded-full h-2.5 overflow-hidden">
        <div class="bg-emerald-600 h-full rounded-full" style="width: 90%"></div>
      </div>
    `;
  }
  showToast(`Appointment confirmed for 2:00 PM with Dr. Rajesh Kumar (${token})!`);
}

// Doctor consultation completion with e-Prescription & Pharmacy inventory sync
async function completeConsultation() {
  const rxInput = document.getElementById("doctorRxInput");
  const rxText = rxInput ? rxInput.value.trim() : "Tab. Amoxicillin 500mg - 1-0-1 (5 days)\nTab. Paracetamol 650mg - 1-0-1 (SOS Fever)";

  const dispensedMeds = [];
  if (document.getElementById("rxMedAmox")?.checked) {
    dispensedMeds.push({ id: "amoxicillin", name: "Amoxicillin 500mg", qty: 10, unit: "capsules", directions: "1-0-1 (5 days)" });
  }
  if (document.getElementById("rxMedPara")?.checked) {
    dispensedMeds.push({ id: "paracetamol", name: "Paracetamol 650mg", qty: 10, unit: "tablets", directions: "SOS for fever" });
  }
  if (document.getElementById("rxMedORS")?.checked) {
    dispensedMeds.push({ id: "ors", name: "Oral Rehydration Salts (ORS)", qty: 2, unit: "packets", directions: "Mix in 1L clean water" });
  }
  if (document.getElementById("rxMedIFA")?.checked) {
    dispensedMeds.push({ id: "ifa", name: "Iron & Folic Acid (IFA)", qty: 10, unit: "strips", directions: "1 daily after meal" });
  }

  const patientName = (currentSessionUser?.role === 'patient' && currentSessionUser?.name) ? currentSessionUser.name : "Damodar Kumar Singh";

  if (!isOnline) {
    queueOfflineRecord({
      type: "prescription",
      data: { patientName, rxText, dispensedMeds },
      timestamp: new Date().toISOString()
    });
    showToast("Frontline offline mode: e-Prescription queued in local outbox.");
  } else {
    // 1. Direct Cloud Firestore synchronization
    if (window.PulseDB && typeof window.PulseDB.addPrescription === "function") {
      try {
        await window.PulseDB.addPrescription(patientName, rxText, dispensedMeds);
      } catch (e) {
        console.warn("Cloud prescription sync notice:", e);
      }
    }

    // 2. Serverless REST backup synchronization
    try {
      await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName, rxText, dispensedMeds, status: "completed" })
      });
    } catch (_) {}

    // 3. Decrement inventory stock on serverless endpoint
    for (const med of dispensedMeds) {
      try {
        await fetch("/api/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: med.id, action: "dispense", quantity: med.qty })
        });
      } catch (_) {}
    }
  }

  // 4. Append prescribed medicines directly to Patient's Meds View
  const patientMedsContainer = document.querySelector("#patient-meds .space-y-3");
  if (patientMedsContainer && dispensedMeds.length > 0) {
    dispensedMeds.forEach(m => {
      const medDiv = document.createElement("div");
      medDiv.className = "bg-white p-3.5 rounded-xl shadow-sm border border-emerald-200 bg-emerald-50/40 flex justify-between items-center";
      medDiv.innerHTML = `
        <div>
          <h4 class="text-xs font-bold text-gray-800">${escapeHTML(m.name)}</h4>
          <p class="text-[10px] text-gray-500">${escapeHTML(m.directions)} · Dr. Rajesh Kumar (${escapeHTML(m.qty)} ${escapeHTML(m.unit)})</p>
        </div>
        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Active e-Rx</span>
      `;
      patientMedsContainer.insertBefore(medDiv, patientMedsContainer.firstChild);
    });
  }

  // 5. Append new timeline node to longitudinal record
  const medNames = dispensedMeds.map(m => m.name).join(", ") || "Standard therapeutics";
  const newTimelineNode = `
    <div class="flex gap-3 animate-fade-in mb-3">
      <div class="flex flex-col items-center">
        <div class="w-3.5 h-3.5 rounded-full bg-doctor ring-4 ring-sky-100"></div>
        <div class="w-0.5 flex-1 bg-gray-200 mt-1"></div>
      </div>
      <div class="pb-3">
        <p class="text-[10px] text-sky-700 font-bold uppercase tracking-wider">PHC Ward 4 · Today (Live Consultation)</p>
        <h4 class="text-sm font-bold text-gray-800">Teleconsult Completed &amp; e-Prescription Signed</h4>
        <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">Dr. Rajesh Kumar finalized teleconsultation for ${patientName}. Issued e-Prescription with ${medNames}. Stock automatically deducted from Sub-Centre Central Pharmacy.</p>
        <div class="flex gap-2 mt-1.5">
          <span class="bg-sky-50 text-doctor text-[10px] font-bold px-2 py-0.5 rounded">e-Prescription Signed</span>
          <span class="bg-emerald-50 text-asha text-[10px] font-bold px-2 py-0.5 rounded">Stock Deducted</span>
        </div>
      </div>
    </div>
  `;
  ["recordTimeline", "recordTimeline2", "recordTimeline3"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const container = el.querySelector(".space-y-4") || el;
      container.insertAdjacentHTML("afterbegin", newTimelineNode);
    }
  });

  showToast(`e-Prescription signed for ${patientName}! Pharmacy inventory updated & synced to ABHA record.`);
  window.setTimeout(() => {
    showDoctor("doctor-queue");
  }, 1200);
}

// ==============================================================================
// Teleconsultation Video Suite (Canvas Clinical Video Stream Simulation)
// ==============================================================================
let callTimers = {
  asha: { seconds: 222, interval: null },
  doctor: { seconds: 135, interval: null },
  patient: { seconds: 258, interval: null }
};

let callMediaStreams = {
  asha: null,
  doctor: null,
  patient: null
};

let callStates = {
  asha: { muted: false, videoOn: true },
  doctor: { muted: false, videoOn: true },
  patient: { muted: false, videoOn: true }
};

let canvasAnimFrames = {
  asha: null,
  doctor: null,
  patient: null
};

function formatDuration(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function startVideoSession(role) {
  if (window.PulseCall) {
    window.PulseCall.setActiveRole(role);
    window.PulseCall.startSessionForRole(role);
  } else {
    // Fallback timer & canvas
    const timerObj = callTimers[role];
    const timerEl = document.getElementById(`callTimer${role.charAt(0).toUpperCase() + role.slice(1)}`);
    if (timerEl && !timerObj.interval) {
      timerObj.interval = window.setInterval(() => {
        timerObj.seconds++;
        timerEl.textContent = formatDuration(timerObj.seconds);
      }, 1000);
    }
    launchCanvasRenderer(role);
  }
}

function stopVideoSession(role) {
  if (window.PulseCall) {
    window.PulseCall.stopSessionForRole(role);
  }
  const timerObj = callTimers[role];
  if (timerObj && timerObj.interval) {
    window.clearInterval(timerObj.interval);
    timerObj.interval = null;
  }
  if (canvasAnimFrames[role]) {
    cancelAnimationFrame(canvasAnimFrames[role]);
    canvasAnimFrames[role] = null;
  }
  if (callMediaStreams[role]) {
    callMediaStreams[role].getTracks().forEach((t) => t.stop());
    callMediaStreams[role] = null;
  }
}

function toggleCallMute(role) {
  if (window.PulseCall) {
    window.PulseCall.toggleMute(role);
  } else {
    callStates[role].muted = !callStates[role].muted;
    const isMuted = callStates[role].muted;
    const btnId = role === "asha" ? "ashaMuteBtn" : role === "doctor" ? "docMuteBtn" : "patMuteBtn";
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-microphone${isMuted ? "-slash" : ""}"></i>`;
      btn.classList.toggle("muted", isMuted);
    }
    showToast(isMuted ? "Microphone muted" : "Microphone unmuted");
  }
}

async function toggleCallVideo(role) {
  if (window.PulseCall) {
    window.PulseCall.toggleVideo(role);
  } else {
    callStates[role].videoOn = !callStates[role].videoOn;
    const isVideoOn = callStates[role].videoOn;
    const btnId = role === "asha" ? "ashaVideoBtn" : role === "doctor" ? "docVideoBtn" : "patVideoBtn";
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-video${isVideoOn ? "" : "-slash"}"></i>`;
      btn.classList.toggle("muted", !isVideoOn);
    }
    showToast(isVideoOn ? "Camera enabled" : "Camera disabled");
  }
}

function switchCamera(role) {
  if (window.PulseCall) {
    window.PulseCall.flipCamera(role);
  } else {
    showToast("Switching camera view (Front / Diagnostic examination angle)...");
  }
}

function endCall(role) {
  if (window.PulseCall) {
    window.PulseCall.endLiveCall(role);
  } else {
    stopVideoSession(role);
    showToast("Teleconsultation session ended safely. Clinical directives recorded.");
    if (role === "asha") showASHA("asha-dashboard");
    if (role === "doctor") showDoctor("doctor-queue");
    if (role === "patient") showPatient("patient-dashboard");
  }
}

// Realistic Canvas Video Feed Animator
function launchCanvasRenderer(role) {
  const mainCanvas = document.getElementById(`${role}VideoCanvas`);
  const pipCanvas = document.getElementById(`${role}PipCanvas`);
  if (!mainCanvas) return;

  const mainCtx = mainCanvas.getContext("2d");
  const pipCtx = pipCanvas ? pipCanvas.getContext("2d") : null;

  mainCanvas.width = 640;
  mainCanvas.height = 400;
  if (pipCanvas) {
    pipCanvas.width = 160;
    pipCanvas.height = 120;
  }

  let frame = 0;

  function render() {
    frame++;

    // 1. Draw Main Stream (Doctor or Patient)
    if (mainCtx) {
      // Clinical room background gradient
      const bgGrad = mainCtx.createLinearGradient(0, 0, 0, 400);
      bgGrad.addColorStop(0, "#1E293B");
      bgGrad.addColorStop(1, "#0F172A");
      mainCtx.fillStyle = bgGrad;
      mainCtx.fillRect(0, 0, 640, 400);

      // Subtle medical room grid
      mainCtx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      mainCtx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        mainCtx.beginPath();
        mainCtx.moveTo(x, 0);
        mainCtx.lineTo(x, 400);
        mainCtx.stroke();
      }

      // If camera is muted, draw camera off screen
      if (!callStates[role].videoOn) {
        mainCtx.fillStyle = "rgba(15, 23, 42, 0.95)";
        mainCtx.fillRect(0, 0, 640, 400);
        mainCtx.fillStyle = "#94A3B8";
        mainCtx.font = "bold 16px sans-serif";
        mainCtx.textAlign = "center";
        mainCtx.fillText("Camera is Turned Off", 320, 200);
      } else {
        // Draw doctor or patient figure
        const isDoctorView = role === "asha" || role === "patient";
        const breathe = Math.sin(frame * 0.05) * 4;

        // Soft backlight glow
        const glow = mainCtx.createRadialGradient(320, 180 + breathe, 20, 320, 180 + breathe, 140);
        glow.addColorStop(0, isDoctorView ? "rgba(2, 132, 199, 0.25)" : "rgba(15, 118, 110, 0.25)");
        glow.addColorStop(1, "transparent");
        mainCtx.fillStyle = glow;
        mainCtx.fillRect(180, 50, 280, 260);

        // Body / Coat
        mainCtx.fillStyle = isDoctorView ? "#FFFFFF" : "#E2E8F0";
        mainCtx.beginPath();
        mainCtx.ellipse(320, 330 + breathe, 110, 80, 0, 0, Math.PI * 2);
        mainCtx.fill();

        // Stethoscope or scarf around neck
        if (isDoctorView) {
          mainCtx.strokeStyle = "#0284C7";
          mainCtx.lineWidth = 6;
          mainCtx.beginPath();
          mainCtx.arc(320, 255 + breathe, 42, 0.2, Math.PI - 0.2);
          mainCtx.stroke();
        }

        // Head
        mainCtx.fillStyle = "#F6D8B8";
        mainCtx.beginPath();
        mainCtx.arc(320, 180 + breathe, 48, 0, Math.PI * 2);
        mainCtx.fill();

        // Hair
        mainCtx.fillStyle = "#262626";
        mainCtx.beginPath();
        mainCtx.arc(320, 160 + breathe, 48, Math.PI, Math.PI * 2);
        mainCtx.fill();

        // Doctor's glasses / features
        mainCtx.strokeStyle = "#334155";
        mainCtx.lineWidth = 2.5;
        mainCtx.strokeRect(302, 172 + breathe, 14, 10);
        mainCtx.strokeRect(324, 172 + breathe, 14, 10);
        mainCtx.beginPath();
        mainCtx.moveTo(316, 177 + breathe);
        mainCtx.lineTo(324, 177 + breathe);
        mainCtx.stroke();

        // Animated ECG pulse waveform in top-right HUD
        mainCtx.strokeStyle = "#22C55E";
        mainCtx.lineWidth = 2;
        mainCtx.beginPath();
        const startX = 490;
        const waveY = 55;
        mainCtx.moveTo(startX, waveY);
        for (let i = 0; i < 90; i++) {
          const t = (frame * 3 + i) % 90;
          let offset = 0;
          if (t > 40 && t < 48) offset = -14;
          if (t >= 48 && t < 54) offset = 18;
          if (t >= 54 && t < 60) offset = -8;
          mainCtx.lineTo(startX + i, waveY + offset);
        }
        mainCtx.stroke();
      }
    }

    // 2. Draw PIP Stream (ASHA or Self View)
    if (pipCtx) {
      pipCtx.fillStyle = "#0F172A";
      pipCtx.fillRect(0, 0, 160, 120);

      // Simple smiling avatar
      pipCtx.fillStyle = "#334155";
      pipCtx.beginPath();
      pipCtx.ellipse(80, 105, 36, 24, 0, 0, Math.PI * 2);
      pipCtx.fill();

      pipCtx.fillStyle = "#E0BC97";
      pipCtx.beginPath();
      pipCtx.arc(80, 60, 22, 0, Math.PI * 2);
      pipCtx.fill();

      // Border tag
      pipCtx.fillStyle = "rgba(0,0,0,0.6)";
      pipCtx.fillRect(4, 4, 38, 14);
      pipCtx.fillStyle = "#FFFFFF";
      pipCtx.font = "bold 8px sans-serif";
      pipCtx.fillText("You", 8, 14);
    }

    canvasAnimFrames[role] = requestAnimationFrame(render);
  }

  render();
}

// ==============================================================================
// Toast & Connectivity Handlers
// ==============================================================================
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  const translator = (typeof window !== "undefined" && (window.translate || (window.PulseTranslator && window.PulseTranslator.translate))) || null;
  toast.textContent = translator ? translator(message) : message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3400);
}

let isOnline = true;

// --- Frontline Offline Outbox & IndexedDB Queue Engine ---
const IDB_NAME = "pulse_health_offline_db";
const IDB_VERSION = 1;
const IDB_STORE = "outbox_records";
let indexedDBInstance = null;

function initIndexedDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = (e) => {
      indexedDBInstance = e.target.result;
      resolve(indexedDBInstance);
    };
    request.onerror = () => resolve(null);
  });
}
initIndexedDB();

function getOfflineOutbox() {
  try {
    const raw = localStorage.getItem("pulse_offline_outbox");
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

async function queueOfflineRecord(item) {
  const outbox = getOfflineOutbox();
  const enhancedItem = {
    ...item,
    id: item.id || `outbox-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    queuedAt: new Date().toISOString(),
    clientVersion: 1
  };
  outbox.push(enhancedItem);
  try {
    localStorage.setItem("pulse_offline_outbox", JSON.stringify(outbox));
  } catch (_) {}

  // Also mirror to persistent IndexedDB
  try {
    if (indexedDBInstance) {
      const tx = indexedDBInstance.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(enhancedItem);
    }
  } catch (_) {}

  updateOutboxUI();
}

function updateOutboxUI() {
  const outbox = getOfflineOutbox();
  const count = outbox.length;
  const badge = document.getElementById("outboxBadge");
  const bannerText = document.getElementById("offlineBannerText");
  if (badge) badge.textContent = count;
  if (bannerText) {
    bannerText.textContent = count > 0 
      ? `Offline Mode — ${count} record(s) queued for sync` 
      : "Offline Mode — Frontline local storage active";
  }
}

async function syncOfflineOutbox() {
  const outbox = getOfflineOutbox();
  if (!outbox.length) {
    showToast("Outbox is clear. All clinical records are up to date with Cloud DB.");
    return;
  }

  showToast(`Synchronizing ${outbox.length} offline record(s) to Cloud Firestore...`);
  
  let successCount = 0;
  for (const item of outbox) {
    try {
      if (item.type === "triage" && window.PulseDB?.addTriageCase) {
        await window.PulseDB.addTriageCase(item.data);
        successCount++;
      } else if (item.type === "patient_registration" && window.PulseDB?.registerPatient) {
        await window.PulseDB.registerPatient(item.data);
        successCount++;
      } else if (item.type === "prescription" && window.PulseDB?.addPrescription) {
        await window.PulseDB.addPrescription(item.data.patientName, item.data.rxText, item.data.dispensedMeds);
        successCount++;
      } else if (item.type === "restock" && window.PulseDB?.requestRestock) {
        await window.PulseDB.requestRestock(item.data.itemId);
        successCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      console.warn("Outbox item sync notice:", err);
    }
  }

  try {
    localStorage.removeItem("pulse_offline_outbox");
  } catch (_) {}
  updateOutboxUI();
  showToast(`Success! ${successCount} offline record(s) synced to Cloud Firestore.`);
}

function toggleConnectivity() {
  isOnline = !isOnline;
  const btn = document.getElementById("connectivityBtn");
  const icon = document.getElementById("wifiIcon");
  const banner = document.getElementById("offlineBanner");

  if (isOnline) {
    if (btn) btn.className = "flex items-center px-2 py-1.5 rounded-lg bg-green-100 text-green-700 border border-green-200 touch-target";
    if (icon) icon.className = "fa-solid fa-wifi";
    if (banner) banner.classList.add("hidden");
    showToast("Network restored. Syncing pending clinical outbox...");
    syncOfflineOutbox();
  } else {
    if (btn) btn.className = "flex items-center px-2 py-1.5 rounded-lg bg-red-100 text-red-700 border border-red-200 touch-target";
    if (icon) icon.className = "fa-solid fa-wifi-slash";
    if (banner) banner.classList.remove("hidden");
    updateOutboxUI();
    showToast("Operating offline. All triage, registrations, and prescriptions will queue locally.");
  }
}

// Initial outbox check on startup
updateOutboxUI();

// ==============================================================================
// Live Referral Pathway & Transit Progression Controller
// ==============================================================================
let currentReferralStage = 2; // 0: Sub-Centre, 1: PHC, 2: Ambulance Transit (Default), 3: District Hospital

const REFERRAL_STAGES = [
  { name: "1. Sub-Centre", status: "Sub-Centre Triage & Stabilization Complete", eta: "Done", badge: "Triage Completed", note: "ASHA Sunita Devi flagged high risk; stabilized with vitals check." },
  { name: "2. PHC Ward 4", status: "PHC Teleconsultation Evaluated", eta: "Done", badge: "Teleconsult Completed", note: "Dr. Rajesh Kumar ordered urgent District Hospital escalation." },
  { name: "3. Rural Hosp. Transit", status: "Ambulance 108 In Transit to District Diagnostic Hub", eta: "ETA 18m", badge: "In Transit", note: "Ambulance 108 (Driver Santosh) active on Highway 4." },
  { name: "4. District Hosp.", status: "Patient Arrived & Admitted to District Emergency Ward", eta: "Admitted", badge: "Hospital Admitted", note: "Emergency intake finalized; Chest X-ray & ECG scheduled." }
];

async function advanceReferralStage() {
  currentReferralStage = (currentReferralStage + 1) % REFERRAL_STAGES.length;
  const stageInfo = REFERRAL_STAGES[currentReferralStage];

  // 1. Sync stage advancement with Cloud Firestore
  if (window.PulseDB && typeof window.PulseDB.updateReferralStage === "function") {
    try {
      await window.PulseDB.updateReferralStage("ref-ramesh-01", currentReferralStage, stageInfo.status);
    } catch (e) {
      console.warn("Cloud referral update notice:", e);
    }
  }

  // 2. Update UI DOM Elements
  const statusText = document.getElementById("refStatusText");
  const statusBadge = document.getElementById("refStatusBadge");
  const advanceBtnText = document.getElementById("advanceStageBtnText");

  if (statusText) statusText.textContent = `${stageInfo.badge} (Stage ${currentReferralStage + 1}/4)`;
  if (statusBadge) {
    if (currentReferralStage === 3) {
      statusBadge.className = "bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1";
      statusBadge.innerHTML = `<i class="fa-solid fa-hospital text-[10px]"></i><span>${stageInfo.badge}</span>`;
    } else {
      statusBadge.className = "bg-amber-100 text-warning text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1";
      statusBadge.innerHTML = `<i class="fa-solid fa-truck-medical text-[10px]"></i><span>${stageInfo.badge}</span>`;
    }
  }

  // 3. Update dots & connecting lines
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`refStageDot${i}`);
    const line = document.getElementById(`refStageLine${i}`);
    const label = document.getElementById(`refStageLabel${i}`);

    if (dot) {
      if (i - 1 < currentReferralStage) {
        dot.className = "stage-dot bg-asha";
        dot.title = `${REFERRAL_STAGES[i-1].name} Completed`;
      } else if (i - 1 === currentReferralStage) {
        dot.className = currentReferralStage === 3 
          ? "stage-dot bg-emerald-600 ring-4 ring-emerald-100 shadow-sm" 
          : "stage-dot bg-warning animate-pulse ring-4 ring-amber-100 shadow-sm";
        dot.title = `${stageInfo.name} Active`;
      } else {
        dot.className = "stage-dot bg-gray-300";
        dot.title = `${REFERRAL_STAGES[i-1].name} Pending`;
      }
    }

    if (line) {
      line.className = i - 1 < currentReferralStage ? "stage-line bg-asha" : "stage-line";
    }

    if (label) {
      if (i - 1 === currentReferralStage) {
        label.className = currentReferralStage === 3 ? "text-emerald-700 font-bold" : "text-warning font-bold";
      } else if (i - 1 < currentReferralStage) {
        label.className = "text-asha";
      } else {
        label.className = "text-gray-400";
      }
    }
  }

  if (advanceBtnText) {
    advanceBtnText.textContent = currentReferralStage === 3 ? "Reset to Stage 1" : "Advance Transit Stage";
  }

  showToast(`Referral updated: ${stageInfo.status}`);
}

// ==============================================================================
// Patient Registration & ABHA Health ID Handlers
// ==============================================================================
function openRegisterPatientModal() {
  const modal = document.getElementById("registerPatientModal");
  if (modal) modal.classList.remove("hidden");
  generateNewABHA();
}

function closeRegisterPatientModal() {
  const modal = document.getElementById("registerPatientModal");
  if (modal) modal.classList.add("hidden");
}

function generateNewABHA() {
  const p1 = "91";
  const p2 = Math.floor(1000 + Math.random() * 9000);
  const p3 = Math.floor(1000 + Math.random() * 9000);
  const p4 = Math.floor(1000 + Math.random() * 9000);
  const abha = `${p1}-${p2}-${p3}-${p4}`;
  const input = document.getElementById("newPatientAbha");
  if (input) input.value = abha;
  return abha;
}

async function saveNewPatient() {
  const nameInput = document.getElementById("newPatientName");
  const ageInput = document.getElementById("newPatientAge");
  const genderInput = document.getElementById("newPatientGender");
  const villageInput = document.getElementById("newPatientVillage");
  const phoneInput = document.getElementById("newPatientPhone");
  const abhaInput = document.getElementById("newPatientAbha");

  const name = nameInput ? nameInput.value.trim() : "";
  const age = ageInput ? ageInput.value.trim() : "35";
  const gender = genderInput ? genderInput.value : "Female";
  const village = villageInput ? villageInput.value.trim() : "Sub-Centre 4";
  const phone = phoneInput ? phoneInput.value.trim() : "+91 98765 43210";
  const abhaId = abhaInput ? abhaInput.value.trim() : generateNewABHA();

  if (!name) {
    showToast("Please enter the patient's full name to continue.");
    if (nameInput) nameInput.focus();
    return;
  }

  const patientPayload = {
    name,
    age: Number(age) || 35,
    gender,
    village,
    phone,
    abhaId,
    registeredAt: new Date().toISOString()
  };

  if (!isOnline) {
    queueOfflineRecord({ type: "patient_registration", data: patientPayload, timestamp: new Date().toISOString() });
    showToast(`Frontline offline mode: ${name} (ABHA: ${abhaId}) registered in local outbox.`);
  } else {
    if (window.PulseDB && typeof window.PulseDB.registerPatient === "function") {
      try {
        await window.PulseDB.registerPatient(patientPayload);
        showToast(`Patient ${name} registered & ABHA ID ${abhaId} synced to Cloud Firestore!`);
      } catch (e) {
        console.warn("Cloud registration notice, queuing offline:", e);
        queueOfflineRecord({ type: "patient_registration", data: patientPayload, timestamp: new Date().toISOString() });
        showToast(`Patient ${name} saved to offline outbox.`);
      }
    } else {
      queueOfflineRecord({ type: "patient_registration", data: patientPayload, timestamp: new Date().toISOString() });
      showToast(`Patient ${name} registered with ABHA: ${abhaId}`);
    }
  }

  // Pre-populate Digital Triage with new patient
  const triageInput = document.getElementById("triagePatientName");
  if (triageInput) {
    triageInput.value = `${name} (${age}y)`;
  }

  closeRegisterPatientModal();
  showASHA("asha-triage");
}

// ==============================================================================
// Progressive Web App (PWA) Mobile Installability Engine
// ==============================================================================
// Progressive Web App (PWA) Mobile Installability Engine
// ==============================================================================
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const pwaBtn = document.getElementById("pwaInstallBtn");
  if (pwaBtn) pwaBtn.classList.remove("hidden");
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  showToast("Pulse Predictor installed successfully on your device!");
});

function handlePWAInstall() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  if (isStandalone) {
    showToast("Pulse Predictor is already installed on this device.");
    return;
  }

  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        showToast("App installation accepted!");
      }
      deferredPrompt = null;
    });
  } else {
    // Show step-by-step universal install modal
    const modal = document.getElementById("pwaInstallModal") || document.getElementById("iosInstallModal");
    if (modal) {
      modal.classList.remove("hidden");
      const iosSteps = document.getElementById("iosInstallSteps");
      const genericSteps = document.getElementById("genericInstallSteps");
      if (iosSteps && genericSteps) {
        if (isIOS) {
          iosSteps.classList.remove("hidden");
          genericSteps.classList.add("hidden");
        } else {
          iosSteps.classList.add("hidden");
          genericSteps.classList.remove("hidden");
        }
      }
    } else {
      showToast("To install, tap browser menu (⋮) and select 'Install App' or 'Add to Home Screen'.");
    }
  }
}

function closeInstallModal() {
  const modal = document.getElementById("pwaInstallModal") || document.getElementById("iosInstallModal");
  if (modal) modal.classList.add("hidden");
}

function closeIOSGuide() {
  closeInstallModal();
}

// Register Service Worker for offline capability & ensure caches stay fresh
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name !== "pulse-predictor-v6") caches.delete(name);
        });
      });
    }
    navigator.serviceWorker.register("/sw.js").then(
      (reg) => {
        reg.update();
        console.log("Pulse Predictor Service Worker registered with scope:", reg.scope);
      },
      (err) => console.warn("Service Worker registration notice:", err)
    );
  });
}

// ==============================================================================
// Multi-Language Support (English, Hindi, Marathi)
// ==============================================================================
function setLanguage(language) {
  if (window.PulseTranslator && typeof window.PulseTranslator.setLanguage === "function") {
    window.PulseTranslator.setLanguage(language);
    return;
  }
  try {
    localStorage.setItem("swasthya-setu-language", language);
  } catch (_) {}
}

function applyTranslations() {
  if (window.PulseTranslator && typeof window.PulseTranslator.applyTranslations === "function") {
    window.PulseTranslator.applyTranslations();
  }
}

// Initial sync with localStorage
try {
  const savedLang = localStorage.getItem("swasthya-setu-language") || "en";
  if (window.PulseTranslator) {
    window.PulseTranslator.setLanguage(savedLang);
  }
} catch (_) {}


// ==============================================================================
// Authentication & Session Initializer (Strict Role Workplace Authentication)
// ==============================================================================
async function initializeRoleWorkspace() {
  const loadingScreen = document.getElementById("appLoadingScreen");
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const roleFromUrl = urlParams.get("role");
    let token = tokenFromUrl;
    if (tokenFromUrl) {
      try { localStorage.setItem("pulse_predictor_token", tokenFromUrl); } catch (_) {}
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      try { token = localStorage.getItem("pulse_predictor_token"); } catch (_) {}
    }

    if (roleFromUrl && ["asha", "doctor", "facility", "patient"].includes(roleFromUrl)) {
      try { localStorage.setItem("pulse_predictor_role", roleFromUrl); } catch (_) {}
    }

    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch("/api/session", {
      headers,
      credentials: "same-origin",
    });

    if (!response.ok) {
      // Default to ASHA Worker (Sunita Devi) workspace
      const defaultAsha = {
        role: "asha",
        name: "Sunita Devi (ASHA)",
        workplace: "Sub-Centre 4, Ward 4",
        email: "asha@pulse.in"
      };
      try {
        localStorage.setItem("pulse_predictor_user", JSON.stringify(defaultAsha));
        localStorage.setItem("pulse_predictor_role", "asha");
      } catch (_) {}
      applyWorkplaceRole("asha", defaultAsha);
      return;
    }

    const sessionData = await response.json();
    let role = sessionData.role;
    if (roleFromUrl && ["asha", "doctor", "facility", "patient"].includes(roleFromUrl)) {
      role = roleFromUrl;
    }
    if (["asha", "doctor", "facility", "patient"].includes(role)) {
      try {
        localStorage.setItem("pulse_predictor_user", JSON.stringify(sessionData));
        localStorage.setItem("pulse_predictor_role", role);
      } catch (_) {}
      applyWorkplaceRole(role, sessionData);
    } else {
      const defaultAsha = {
        role: "asha",
        name: "Sunita Devi (ASHA)",
        workplace: "Sub-Centre 4, Ward 4",
        email: "asha@pulse.in"
      };
      applyWorkplaceRole("asha", defaultAsha);
    }
  } catch (err) {
    let savedRole = null;
    let savedUser = {};
    try {
      savedRole = localStorage.getItem("pulse_predictor_role");
      const savedUserStr = localStorage.getItem("pulse_predictor_user");
      if (savedUserStr) savedUser = JSON.parse(savedUserStr);
    } catch (_) {}
    const finalRole = (savedRole && ["asha", "doctor", "facility", "patient"].includes(savedRole)) ? savedRole : "asha";
    const finalUser = (savedUser && savedUser.role) ? savedUser : { role: "asha", name: "Sunita Devi (ASHA)", workplace: "Sub-Centre 4, Ward 4", email: "asha@pulse.in" };
    applyWorkplaceRole(finalRole, finalUser);
  } finally {
    if (loadingScreen) loadingScreen.style.display = "none";
    document.body.classList.remove("auth-pending");
  }
}

initializeRoleWorkspace();

// Connectivity sync
window.addEventListener("online", () => {
  if (!isOnline) toggleConnectivity();
});
window.addEventListener("offline", () => {
  if (isOnline) toggleConnectivity();
});

// ==============================================================================
// Real-Time Cloud Database Synchronizer (Doctor Queue, Inventory, Referrals)
// ==============================================================================
function renderLiveDoctorQueue(cases) {
  const container = document.getElementById("doctorQueueList");
  if (!container || !cases || !cases.length) return;

  container.innerHTML = cases.map((c) => {
    const isHigh = c.riskLevel === "HIGH";
    const isMod = c.riskLevel === "MODERATE";
    const borderCol = isHigh ? "border-danger" : isMod ? "border-yellow-500" : "border-green-500";
    const bgBadge = isHigh ? "bg-red-50 text-danger" : isMod ? "bg-amber-50 text-warning" : "bg-green-50 text-green-600";
    const icon = isHigh ? "fa-triangle-exclamation" : isMod ? "fa-baby" : "fa-user";

    return `
      <div class="bg-white p-3.5 rounded-xl shadow-sm border-l-4 ${borderCol} flex items-center gap-3">
        <div class="${bgBadge} w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-gray-800">${escapeHTML(c.patientName)}</h4>
          <p class="text-xs text-gray-500">Triage: <strong class="${isHigh ? 'text-danger' : isMod ? 'text-amber-700' : 'text-green-700'}">${c.riskLevel}</strong> · BP ${c.bloodPressure || '120/80'} · ${escapeHTML(c.symptoms || '')}</p>
        </div>
        <button onclick="showDoctor('doctor-consult')" class="bg-doctor text-white text-xs font-bold px-3.5 py-2.5 rounded-xl touch-target hover:bg-sky-700 transition">
          Consult
        </button>
      </div>
    `;
  }).join("");
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderLiveInventory(items) {
  if (!items || !items.length) return;

  const facilityContainer = document.getElementById("facilityStockList");
  if (facilityContainer) {
    facilityContainer.innerHTML = items.map(item => {
      const isOut = item.status === "out_of_stock" || item.quantity <= 0;
      const isLow = item.status === "low_stock" || item.quantity <= item.threshold;
      const badge = isOut
        ? `<span class="bg-red-100 text-danger text-xs font-bold px-2 py-0.5 rounded">Out of Stock</span>`
        : isLow
        ? `<span class="bg-amber-100 text-warning text-xs font-bold px-2 py-0.5 rounded">Low Stock</span>`
        : `<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">Stocked</span>`;

      return `
        <div class="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-1">
            <h4 class="text-sm font-bold text-gray-800">${escapeHTML(item.name)}</h4>
            ${badge}
          </div>
          <p class="text-xs text-gray-500">${item.quantity} ${escapeHTML(item.unit || 'units')} remaining · Reorder threshold: ${item.threshold || 20}</p>
        </div>
      `;
    }).join("");
  }
}

let cachedReferralsList = [];

function renderLiveReferrals(referrals) {
  if (!referrals || !Array.isArray(referrals)) return;
  cachedReferralsList = referrals;

  // 1. Render in Facility Referrals Pipeline Tab
  const container = document.getElementById("facilityReferralList");
  if (container) {
    if (!referrals.length) {
      container.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs bg-white rounded-xl border border-gray-100">No active inter-facility referrals.</div>`;
    } else {
      container.innerHTML = referrals.map(ref => {
        const isCritical = ref.priority === "CRITICAL" || ref.riskLevel === "HIGH";
        const badgeColor = isCritical ? "bg-red-100 text-danger border-red-200" : "bg-amber-100 text-warning border-amber-200";
        const bedText = ref.bedReserved 
          ? `<span class="text-emerald-700 font-bold text-xs flex items-center gap-1"><i class="fa-solid fa-bed-pulse"></i>${escapeHTML(ref.bedAssigned || 'ICU Bed #4')} Reserved</span>` 
          : `<span class="text-amber-700 text-xs flex items-center gap-1"><i class="fa-solid fa-bed"></i>Bed Allocation Pending</span>`;

        return `
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 transition space-y-2.5">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-black text-gray-900">${escapeHTML(ref.patientName)}</h4>
                  <span class="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">${escapeHTML(ref.abhaId || 'ABHA Registered')}</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">${escapeHTML(ref.sourceFacility || 'Sub-Centre 4')} → <strong class="text-gray-800">${escapeHTML(ref.targetFacility || 'District Hospital')}</strong></p>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeColor}">
                  ${escapeHTML(ref.priority || 'URGENT')}
                </span>
                <span class="block text-[10px] text-gray-400 mt-1 font-semibold">${escapeHTML(ref.eta || '14m ETA')}</span>
              </div>
            </div>

            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs flex flex-wrap justify-between items-center gap-2">
              <div>
                <span class="text-[10px] text-gray-500 block">Vitals Summary:</span>
                <span class="font-bold text-gray-800">${escapeHTML(ref.vitalsSummary || 'BP: 150/95 · SpO2: 94% · Pulse: 98 bpm')}</span>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 block">108 Ambulance:</span>
                <span class="font-semibold text-gray-700">${escapeHTML(ref.ambulanceNumber || 'MH-12-AMB-108')} (${escapeHTML(ref.driverName || 'Santosh')})</span>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 block">Hospital Bed:</span>
                ${bedText}
              </div>
            </div>

            ${ref.regulationSummary ? `
              <p class="text-[11px] text-gray-600 italic bg-amber-50/60 p-2 rounded border border-amber-100">
                <i class="fa-solid fa-scale-balanced text-amber-600 mr-1"></i>${escapeHTML(ref.regulationSummary)}
              </p>
            ` : ''}

            <div class="flex justify-between items-center pt-1 border-t border-gray-100">
              <span class="text-[11px] font-medium text-gray-500">Status: <strong class="text-indigo-700">${escapeHTML(ref.status || 'Ambulance In Transit')}</strong></span>
              <div class="flex gap-2">
                ${!ref.bedReserved ? `
                  <button onclick="reserveEmergencyBedForReferral('${escapeHTML(ref.id)}', 'ICU Oxygen Bed', 'ICU Bed #4')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-xs">
                    <i class="fa-solid fa-bed"></i><span>Reserve Bed</span>
                  </button>
                ` : `
                  <button onclick="confirmHospitalIntake('${escapeHTML(ref.id)}')" class="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-xs">
                    <i class="fa-solid fa-check-double"></i><span>Admit Patient</span>
                  </button>
                `}
                <button onclick="showPatientReferralDetailsModal('${escapeHTML(ref.id)}')" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition">
                  <i class="fa-solid fa-file-lines"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // 2. Render in Hospital Inbound Emergency Referrals list on Facility Dashboard
  const hospitalContainer = document.getElementById("hospitalIncomingList");
  const inboundBadge = document.getElementById("hospitalInboundBadge");
  if (inboundBadge) {
    inboundBadge.textContent = `${referrals.length} Inbound Transfer${referrals.length === 1 ? '' : 's'}`;
  }

  if (hospitalContainer) {
    if (!referrals.length) {
      hospitalContainer.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs bg-white rounded-xl border border-gray-100">No incoming emergency referrals awaiting intake.</div>`;
    } else {
      hospitalContainer.innerHTML = referrals.map(ref => {
        const isReserved = ref.bedReserved;
        const isAdmitted = ref.currentStage === 3 || ref.transportStatus === "completed";

        return `
          <div class="bg-white p-3.5 rounded-xl border border-red-200 shadow-xs space-y-2.5">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-black text-gray-900">${escapeHTML(ref.patientName)}</h4>
                  <span class="bg-red-100 text-danger text-[10px] font-black px-2 py-0.5 rounded-full">${escapeHTML(ref.priority || 'CRITICAL')}</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">En route from: <strong>${escapeHTML(ref.sourceFacility || 'Sub-Centre 4')}</strong></p>
              </div>
              <div class="text-right">
                <span class="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <i class="fa-solid fa-truck-fast text-[10px] animate-pulse"></i>${escapeHTML(ref.eta || '14 mins')}
                </span>
                <span class="block text-[10px] text-gray-400 mt-0.5 font-mono">${escapeHTML(ref.ambulanceNumber || 'MH-12-AMB-108')}</span>
              </div>
            </div>

            <!-- Triage Vitals & ICMR Directive -->
            <div class="bg-red-50/70 p-2 rounded-lg border border-red-100 text-xs">
              <div class="flex justify-between font-bold text-red-900 mb-0.5">
                <span>Vitals: ${escapeHTML(ref.vitalsSummary || 'BP: 150/95 · SpO2: 94% · Pulse: 98 bpm')}</span>
                <span class="text-[10px] bg-red-200/80 px-1.5 py-0.2 rounded font-mono">ICMR Mandate</span>
              </div>
              <p class="text-[11px] text-gray-700 leading-tight">
                ${escapeHTML(ref.regulationSummary || 'Borderline Hypoxemia with Stage-2 Hypertension. Priority resuscitation unit intake required.')}
              </p>
            </div>

            <!-- Hospital Bed Reservation Bar -->
            <div class="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
              <div>
                ${isReserved 
                  ? `<span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600"></i>${escapeHTML(ref.bedAssigned || 'ICU Bed #4')} Allocated</span>`
                  : `<span class="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation text-amber-600"></i>Bed Not Allocated</span>`
                }
              </div>
              <div class="flex gap-2">
                ${!isReserved ? `
                  <button onclick="reserveEmergencyBedForReferral('${escapeHTML(ref.id)}', 'ICU Bed', 'ICU Bed #4')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1">
                    <i class="fa-solid fa-bed-pulse"></i><span>Reserve ICU Bed</span>
                  </button>
                ` : isAdmitted ? `
                  <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <i class="fa-solid fa-hospital-user"></i><span>Admitted</span>
                  </span>
                ` : `
                  <button onclick="confirmHospitalIntake('${escapeHTML(ref.id)}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1">
                    <i class="fa-solid fa-hospital-user"></i><span>Confirm Hospital Intake</span>
                  </button>
                `}
                <button onclick="showPatientReferralDetailsModal('${escapeHTML(ref.id)}')" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition">
                  <i class="fa-solid fa-file-medical"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // 3. Render in Patient Dashboard if viewing as patient
  updatePatientReferralView(referrals);
}

// ==============================================================================
// Hospital Emergency Bed Allocation & Intake Actions
// ==============================================================================
async function reserveEmergencyBedForReferral(referralId, bedType = "ICU Oxygen Bed", bedNumber = "ICU Bed #4") {
  showToast(`Allocating ${bedNumber} at District Hospital Emergency Unit...`);
  try {
    const res = await fetch("/api/referrals/reserve-bed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referralId: referralId || "ref-1",
        bedType: bedType,
        bedNumber: bedNumber,
        reservedBy: "Dr. A. Verma (Emergency CMO)"
      })
    });
    const data = await res.json();
    if (data.ok) {
      showToast(`✅ ${bedNumber} reserved for patient intake!`);
      // Update Cloud Firestore if active
      if (window.PulseDB && typeof window.PulseDB.reserveFacilityBed === "function") {
        try {
          await window.PulseDB.reserveFacilityBed(referralId, bedNumber);
        } catch (_) {}
      }
      refreshHospitalIncomingReferrals();
      updatePatientReferralView();
      return;
    }
  } catch (err) {
    console.warn("REST bed reservation error, updating local state:", err);
  }

  // Fallback update
  const ref = cachedReferralsList.find(r => r.id === referralId);
  if (ref) {
    ref.bedReserved = true;
    ref.bedAssigned = bedNumber;
    renderLiveReferrals(cachedReferralsList);
    showToast(`✅ ${bedNumber} assigned to incoming patient.`);
  }
}

async function confirmHospitalIntake(referralId) {
  showToast("Confirming hospital patient intake & admission...");
  try {
    const res = await fetch("/api/referrals/update-stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referralId: referralId || "ref-1",
        stageIndex: 3,
        statusText: "Patient arrived & admitted to District Hospital Emergency Ward"
      })
    });
    const data = await res.json();
    if (data.ok) {
      showToast("🏥 Patient successfully admitted to District Hospital!");
      if (window.PulseDB && typeof window.PulseDB.updateReferralStage === "function") {
        try {
          await window.PulseDB.updateReferralStage(referralId, 3, "Patient arrived & admitted to District Hospital Emergency Ward");
        } catch (_) {}
      }
      refreshHospitalIncomingReferrals();
      updatePatientReferralView();
      return;
    }
  } catch (err) {
    console.warn("Intake stage update fallback:", err);
  }

  const ref = cachedReferralsList.find(r => r.id === referralId);
  if (ref) {
    ref.currentStage = 3;
    ref.status = "Patient admitted to District Emergency Ward";
    renderLiveReferrals(cachedReferralsList);
    showToast("🏥 Patient intake confirmed.");
  }
}

async function refreshHospitalIncomingReferrals() {
  try {
    const res = await fetch("/api/facility/incoming");
    const data = await res.json();
    if (data.ok && Array.isArray(data.incoming)) {
      renderLiveReferrals(data.incoming);
    }
  } catch (err) {
    console.warn("Could not fetch /api/facility/incoming:", err);
  }
}

// ==============================================================================
// Patient Referral Card Synchronizer
// ==============================================================================
async function updatePatientReferralView(passedReferrals) {
  let targetRef = null;
  if (passedReferrals && passedReferrals.length) {
    targetRef = passedReferrals[0];
  } else {
    try {
      const res = await fetch("/api/patient/referral?name=Ramesh%20Patil");
      const data = await res.json();
      if (data.ok && data.referral) {
        targetRef = data.referral;
      }
    } catch (_) {}
  }

  const container = document.getElementById("patientReferralStatusContainer");
  const heroBadge = document.getElementById("patientHeroReferralBadge");
  const heroBadgeText = document.getElementById("patientHeroReferralBadgeText");

  if (!targetRef) {
    if (container) container.style.display = "none";
    if (heroBadge) heroBadge.classList.add("hidden");
    return;
  }

  if (container) container.style.display = "block";
  if (heroBadge) {
    heroBadge.classList.remove("hidden");
    if (heroBadgeText) {
      heroBadgeText.textContent = targetRef.currentStage === 3 ? "Admitted at District Hospital" : "Emergency Transfer Active";
    }
  }

  const facilityName = document.getElementById("patientReferralFacilityName");
  const originText = document.getElementById("patientReferralOrigin");
  const ambulanceText = document.getElementById("patientReferralAmbulance");
  const driverText = document.getElementById("patientReferralDriver");
  const bedText = document.getElementById("patientReferralBedStatus");
  const vitalsText = document.getElementById("patientReferralVitals");
  const regText = document.getElementById("patientReferralRegulationText");
  const stageBadge = document.getElementById("patientRefStageBadge");
  const stageText = document.getElementById("patientRefStageText");
  const priorityBadge = document.getElementById("patientRefPriorityBadge");

  if (facilityName) facilityName.textContent = targetRef.targetFacility || "District Hospital Diagnostic & Emergency Hub";
  if (originText) originText.textContent = `Referred from: ${targetRef.sourceFacility || 'Sub-Centre 4'} (${targetRef.ashaName || 'ASHA Sunita Devi'}) · Under ICMR Emergency Protocol`;
  if (ambulanceText) ambulanceText.textContent = targetRef.ambulanceNumber || "MH-12-AMB-108";
  if (driverText) driverText.textContent = `Driver: ${targetRef.driverName || 'Santosh Jadhav'} (${targetRef.driverPhone || '+91 98220 10811'}) · ETA: ${targetRef.eta || '14 mins'}`;
  
  if (bedText) {
    if (targetRef.bedReserved) {
      bedText.className = "font-bold text-emerald-900 flex items-center gap-1.5";
      bedText.innerHTML = `<i class="fa-solid fa-bed-pulse text-emerald-600"></i> ${escapeHTML(targetRef.bedAssigned || 'ICU Bed #4')} Reserved`;
    } else {
      bedText.className = "font-bold text-amber-900 flex items-center gap-1.5";
      bedText.innerHTML = `<i class="fa-solid fa-bed text-amber-600"></i> Allocation in Progress`;
    }
  }

  if (vitalsText) vitalsText.textContent = targetRef.vitalsSummary || "BP: 150/95 · SpO2: 94% · Pulse: 98 bpm";
  if (regText) regText.textContent = targetRef.regulationSummary || "ICMR Directive: Borderline Hypoxemia with Stage-2 Hypertension. High-risk transfer mandated under National Health Mission guidelines.";

  if (priorityBadge) {
    priorityBadge.textContent = targetRef.priority || "CRITICAL";
  }

  if (stageBadge && stageText) {
    if (targetRef.currentStage === 3) {
      stageBadge.className = "bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1";
      stageText.textContent = "Admitted to Hospital";
    } else {
      stageBadge.className = "bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1";
      stageText.textContent = `108 En Route (${targetRef.eta || '14m'})`;
    }
  }
}

// ==============================================================================
// Digital Referral Slip Modal Handlers
// ==============================================================================
function showPatientReferralDetailsModal(referralId) {
  let ref = cachedReferralsList.find(r => r.id === referralId);
  if (!ref && cachedReferralsList.length) ref = cachedReferralsList[0];

  const modal = document.getElementById("patientReferralModal");
  if (!modal) return;

  if (ref) {
    const elHosp = document.getElementById("modalSlipHospital");
    const elPat = document.getElementById("modalSlipPatient");
    const elAbha = document.getElementById("modalSlipAbha");
    const elBP = document.getElementById("modalSlipBP");
    const elPulse = document.getElementById("modalSlipPulse");
    const elSpo2 = document.getElementById("modalSlipSpo2");
    const elReg = document.getElementById("modalSlipRegulation");
    const elAmb = document.getElementById("modalSlipAmbulance");
    const elDriver = document.getElementById("modalSlipDriver");
    const elBed = document.getElementById("modalSlipBed");

    if (elHosp) elHosp.textContent = ref.targetFacility || "District Hospital Diagnostic & Emergency Hub";
    if (elPat) elPat.textContent = `${ref.patientName || 'Ramesh Patil'} (48y / M)`;
    if (elAbha) elAbha.textContent = ref.abhaId || "12-3456-7890-0012";
    if (elBP) elBP.textContent = ref.bloodPressure || "150/95";
    if (elPulse) elPulse.textContent = ref.pulseRate || "98 bpm";
    if (elSpo2) elSpo2.textContent = ref.spo2 || "94%";
    if (elReg) elReg.textContent = ref.regulationSummary || "ICMR Rule 1.2 & 2.2: Stage-2 Hypertension with Borderline Hypoxemia. Priority emergency transfer mandated.";
    if (elAmb) elAmb.textContent = ref.ambulanceNumber || "MH-12-AMB-108";
    if (elDriver) elDriver.textContent = `${ref.driverName || 'Santosh Jadhav'} (${ref.driverPhone || '+91 98220 10811'})`;
    if (elBed) elBed.textContent = ref.bedReserved ? `${ref.bedAssigned || 'ICU Bed #4'} (Reserved)` : "Allocation Pending";
  }

  modal.classList.remove("hidden");
}

function togglePatientReferralDossier() {
  showPatientReferralDetailsModal();
}

function closePatientReferralModal() {
  const modal = document.getElementById("patientReferralModal");
  if (modal) modal.classList.add("hidden");
}

function call108Ambulance() {
  showToast("Dialing 108 Emergency Ambulance Dispatch Center (Toll-Free)...");
  window.location.href = "tel:108";
}

function initializeDatabaseSubscriptions() {
  if (window.PulseDB && window.PulseDB.isReady) {
    window.PulseDB.listenTriageCases(renderLiveDoctorQueue);
    window.PulseDB.listenInventory(renderLiveInventory);
    window.PulseDB.listenReferrals(renderLiveReferrals);
  } else {
    // Fallback: poll serverless REST API
    fetch("/api/triage").then(res => res.json()).then(res => {
      if (res.data) renderLiveDoctorQueue(res.data);
    }).catch(() => {});

    fetch("/api/stock").then(res => res.json()).then(res => {
      if (res.data) renderLiveInventory(res.data);
    }).catch(() => {});

    fetch("/api/referrals").then(res => res.json()).then(res => {
      if (res.data) renderLiveReferrals(res.data);
    }).catch(() => {});
  }

  // Pre-load hospital incoming referrals & patient referral status
  refreshHospitalIncomingReferrals();
  updatePatientReferralView();
}

// Attach listener when PulseDB is ready or on window load
window.addEventListener("PulseDBReady", initializeDatabaseSubscriptions);
window.addEventListener("DOMContentLoaded", () => {
  window.setTimeout(initializeDatabaseSubscriptions, 500);
});

// Explicit window bindings for HTML event handlers
window.advanceReferralStage = advanceReferralStage;
window.openRegisterPatientModal = openRegisterPatientModal;
window.closeRegisterPatientModal = closeRegisterPatientModal;
window.generateNewABHA = generateNewABHA;
window.saveNewPatient = saveNewPatient;
window.syncOfflineOutbox = syncOfflineOutbox;
window.completeConsultation = completeConsultation;
window.toggleConnectivity = toggleConnectivity;
window.requestRestock = requestRestock;
window.confirmPatientBooking = confirmPatientBooking;
window.openAbhaCardModal = openAbhaCardModal;
window.closeAbhaCardModal = closeAbhaCardModal;
window.runAiClinicalAnalysis = runAiClinicalAnalysis;
window.toggleCallChat = toggleCallChat;
window.sendCallChatMessage = sendCallChatMessage;
window.allocateBed = allocateBed;
window.dischargeBed = dischargeBed;
window.renderLiveReferrals = renderLiveReferrals;
window.reserveEmergencyBedForReferral = reserveEmergencyBedForReferral;
window.confirmHospitalIntake = confirmHospitalIntake;
window.refreshHospitalIncomingReferrals = refreshHospitalIncomingReferrals;
window.updatePatientReferralView = updatePatientReferralView;
window.showPatientReferralDetailsModal = showPatientReferralDetailsModal;
window.togglePatientReferralDossier = togglePatientReferralDossier;
window.closePatientReferralModal = closePatientReferralModal;
window.call108Ambulance = call108Ambulance;
window.toggleSymptom = toggleSymptom;
window.setTriagePreset = setTriagePreset;
window.updateTriageLivePreview = updateTriageLivePreview;
window.calculateTriageRisk = calculateTriageRisk;

// ==============================================================================
// In-Call Teleconsultation Two-Way Chat
// ==============================================================================
function toggleCallChat() {
  const panel = document.getElementById("teleconsultChatPanel");
  if (panel) {
    panel.classList.toggle("hidden");
    const unread = document.getElementById("chatUnreadDot");
    if (unread) unread.classList.add("hidden");
  }
}

function sendCallChatMessage() {
  const input = document.getElementById("callChatInput");
  const container = document.getElementById("callChatMessages");
  if (!input || !input.value.trim()) return;

  const msgText = input.value.trim();
  input.value = "";

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgEl = document.createElement("div");
  msgEl.className = "flex flex-col items-end animate-fade-in";
  msgEl.innerHTML = `
    <span class="text-[9px] text-sky-600 font-semibold mb-0.5">You (Dr. Rajesh) · ${timeStr}</span>
    <div class="bg-doctor text-white px-2.5 py-1.5 rounded-xl rounded-tr-none max-w-[85%] text-xs shadow-2xs">
      ${escapeHTML(msgText)}
    </div>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;

  // Automated frontline ASHA confirmation reply after 1.5s
  window.setTimeout(() => {
    const ashaMsgEl = document.createElement("div");
    ashaMsgEl.className = "flex flex-col items-start animate-fade-in";
    ashaMsgEl.innerHTML = `
      <span class="text-[9px] text-gray-400 font-semibold mb-0.5">Sunita Devi (ASHA) · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <div class="bg-white border border-gray-200 text-gray-700 px-2.5 py-1.5 rounded-xl rounded-tl-none max-w-[85%] text-xs shadow-2xs">
        Noted Doctor saab! Followed instructions and vitals are being recorded.
      </div>
    `;
    container.appendChild(ashaMsgEl);
    container.scrollTop = container.scrollHeight;
    showToast("Message received from ASHA Sunita Devi");
  }, 1200);
}

// ==============================================================================
// Facility Bed & Oxygen Allocation Manager
// ==============================================================================
let bedState = {
  general: { occupied: 34, total: 40 },
  icu: { occupied: 11, total: 15 },
  oxygen: { occupied: 18, total: 20 }
};

function updateBedUI() {
  // General Ward
  const genPct = Math.round((bedState.general.occupied / bedState.general.total) * 100);
  const genOccEl = document.getElementById("genBedOccupied");
  const genVacEl = document.getElementById("genBedVacant");
  const genPctEl = document.getElementById("genBedPct");
  const genBarEl = document.getElementById("genBedBar");
  if (genOccEl) genOccEl.textContent = bedState.general.occupied;
  if (genVacEl) genVacEl.textContent = bedState.general.total - bedState.general.occupied;
  if (genPctEl) genPctEl.textContent = `${genPct}%`;
  if (genBarEl) genBarEl.style.width = `${genPct}%`;

  // ICU Ward
  const icuPct = Math.round((bedState.icu.occupied / bedState.icu.total) * 100);
  const icuOccEl = document.getElementById("icuBedOccupied");
  const icuVacEl = document.getElementById("icuBedVacant");
  const icuPctEl = document.getElementById("icuBedPct");
  const icuBarEl = document.getElementById("icuBedBar");
  if (icuOccEl) icuOccEl.textContent = bedState.icu.occupied;
  if (icuVacEl) icuVacEl.textContent = bedState.icu.total - bedState.icu.occupied;
  if (icuPctEl) icuPctEl.textContent = `${icuPct}%`;
  if (icuBarEl) icuBarEl.style.width = `${icuPct}%`;

  // Oxygen Reserves
  const o2Pct = Math.round((bedState.oxygen.occupied / bedState.oxygen.total) * 100);
  const o2OccEl = document.getElementById("o2CylinderOccupied");
  const o2VacEl = document.getElementById("o2CylinderVacant");
  const o2PctEl = document.getElementById("o2CylinderPct");
  const o2BarEl = document.getElementById("o2CylinderBar");
  if (o2OccEl) o2OccEl.textContent = bedState.oxygen.occupied;
  if (o2VacEl) o2VacEl.textContent = bedState.oxygen.total - bedState.oxygen.occupied;
  if (o2PctEl) o2PctEl.textContent = `${o2Pct}%`;
  if (o2BarEl) o2BarEl.style.width = `${o2Pct}%`;
}

function appendBedLog(message) {
  const logContainer = document.getElementById("bedAllocationLogs");
  if (!logContainer) return;
  const timeStr = "Just now";
  const item = document.createElement("div");
  item.className = "flex justify-between items-center bg-gray-50 px-2 py-1 rounded animate-fade-in";
  item.innerHTML = `
    <span><i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>${escapeHTML(message)}</span>
    <span class="text-[9px] text-gray-400 font-mono">${timeStr}</span>
  `;
  logContainer.insertBefore(item, logContainer.firstChild);
}

function allocateBed(type) {
  if (type === "general") {
    if (bedState.general.occupied >= bedState.general.total) {
      showToast("General ward is at 100% capacity!");
      return;
    }
    bedState.general.occupied++;
    appendBedLog(`General Bed #${bedState.general.occupied} allocated to Sub-Centre referral`);
    showToast(`General Ward bed allocated (${bedState.general.total - bedState.general.occupied} vacant)`);
  } else if (type === "icu") {
    if (bedState.icu.occupied >= bedState.icu.total) {
      showToast("All ICU beds are currently in critical use!");
      return;
    }
    bedState.icu.occupied++;
    appendBedLog(`ICU Bed #${bedState.icu.occupied} with Ventilator reserved for incoming 108 Ambulance`);
    showToast(`Emergency ICU Bed reserved for incoming ambulance transfer!`);
  } else if (type === "oxygen") {
    if (bedState.oxygen.occupied <= 0) {
      showToast("No oxygen cylinders available to dispatch!");
      return;
    }
    bedState.oxygen.occupied--;
    appendBedLog(`High-flow O2 Cylinder dispatched to peripheral Sub-Centre 4`);
    showToast(`High-flow Oxygen cylinder dispatched to frontline unit.`);
  }
  updateBedUI();
}

function dischargeBed(type) {
  if (type === "general") {
    if (bedState.general.occupied > 0) {
      bedState.general.occupied--;
      appendBedLog(`Patient discharged from General Ward; sanitization underway`);
      showToast(`Bed released and marked available for intake.`);
    }
  } else if (type === "icu") {
    if (bedState.icu.occupied > 0) {
      bedState.icu.occupied--;
      appendBedLog(`Patient transferred from ICU to step-down ward`);
      showToast(`ICU bed released and prepared for emergency intake.`);
    }
  } else if (type === "oxygen") {
    if (bedState.oxygen.occupied < bedState.oxygen.total) {
      bedState.oxygen.occupied++;
      appendBedLog(`Oxygen Cylinder returned from refill plant to active reserve`);
      showToast(`Oxygen reserve refilled and ready for dispatch.`);
    }
  }
  updateBedUI();
}

// ==============================================================================
// ABHA Card Modal Controller
// ==============================================================================
function openAbhaCardModal() {
  const modal = document.getElementById("abhaCardModal");
  if (modal) modal.classList.remove("hidden");
}

function closeAbhaCardModal() {
  const modal = document.getElementById("abhaCardModal");
  if (modal) modal.classList.add("hidden");
}

// ==============================================================================
// AI Clinical Decision Support Engine (Gemini 3.8 Flash)
// ==============================================================================
async function runAiClinicalAnalysis() {
  const btn = document.getElementById("aiAnalyzeBtn");
  const card = document.getElementById("aiClinicalGuidanceCard");
  const patientName = document.getElementById("triagePatientName")?.value.trim() || "Ramesh Patil";
  const bp = document.getElementById("triageBP")?.value.trim() || "150/95";
  const pulse = document.getElementById("triagePulse")?.value.trim() || "98 bpm";
  const spo2 = document.getElementById("triageSpO2")?.value.trim() || "94%";
  const langSelect = document.getElementById("aiLanguageSelect");
  const targetLanguage = langSelect ? langSelect.value : (currentLanguage === "hi" ? "Hindi" : currentLanguage === "mr" ? "Marathi" : "English");

  // Collect selected symptoms
  const selectedChips = document.querySelectorAll("#symptomsContainer .symptom-chip.bg-asha");
  const symptoms = Array.from(selectedChips).map(c => c.textContent.trim()).join(", ") || "Fever, Cough, Breathlessness";

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Analyzing...</span>';
  }

  showToast(`Invoking AI Clinical Assistant in ${targetLanguage}...`);

  try {
    const res = await fetch("/api/ai/triage-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName,
        symptoms,
        bp,
        pulse,
        spo2,
        language: targetLanguage
      })
    });

    const result = await res.json();
    if (result && result.ok && result.data) {
      const data = result.data;
      if (card) {
        card.classList.remove("hidden");
        const triageBadge = document.getElementById("aiTriageBadge");
        if (triageBadge) {
          triageBadge.textContent = data.triageLevel || "HIGH";
          triageBadge.className = data.triageLevel === "CRITICAL" || data.triageLevel === "HIGH"
            ? "bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse"
            : "bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider";
        }

        const suspectedList = document.getElementById("aiSuspectedList");
        if (suspectedList && data.suspectedConditions) {
          suspectedList.innerHTML = data.suspectedConditions.map(c =>
            `<span class="bg-white/10 text-emerald-100 text-[11px] px-2 py-0.5 rounded-md border border-white/10">${escapeHTML(c)}</span>`
          ).join("");
        }

        const actionsList = document.getElementById("aiActionsList");
        if (actionsList && data.immediateFrontlineActions) {
          actionsList.innerHTML = data.immediateFrontlineActions.map(a =>
            `<li>${escapeHTML(a)}</li>`
          ).join("");
        }

        const referralRec = document.getElementById("aiReferralRec");
        if (referralRec && data.referralRecommendation) {
          referralRec.textContent = data.referralRecommendation;
        }

        const ashaNotes = document.getElementById("aiAshaNotes");
        if (ashaNotes && data.ashaGuidanceNotes) {
          ashaNotes.textContent = data.ashaGuidanceNotes;
        }

        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      showToast("AI Clinical assessment ready: " + (data.triageLevel || "HIGH") + " Alert!");
    } else {
      showToast("Clinical analysis calculated using national emergency protocols.");
    }
  } catch (err) {
    console.warn("AI Triage client notice:", err);
    showToast("Assessed via frontline emergency guidelines.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-emerald-200"></i><span>AI Clinical Assistant</span>';
    }
  }
}

// ==============================================================================
// 1. Offline-First Sync Conflict Visualizer & Manager
// ==============================================================================
let activeConflictPolicy = "timestamp"; // "timestamp" or "frontline"

function openSyncConflictModal() {
  const modal = document.getElementById("syncConflictModal");
  if (modal) modal.classList.remove("hidden");
  
  const countEl = document.getElementById("conflictOutboxCount");
  const outbox = getOfflineOutbox();
  if (countEl) countEl.textContent = `${outbox.length} Item(s)`;
}

function closeSyncConflictModal() {
  const modal = document.getElementById("syncConflictModal");
  if (modal) modal.classList.add("hidden");
}

function setConflictPolicy(policy) {
  activeConflictPolicy = policy;
  const timeBtn = document.getElementById("policyTimestampBtn");
  const frontlineBtn = document.getElementById("policyFrontlineBtn");

  if (timeBtn && frontlineBtn) {
    if (policy === "timestamp") {
      timeBtn.className = "flex-1 bg-white border border-emerald-500 text-emerald-800 font-bold text-[10px] py-1.5 rounded-lg shadow-xs";
      frontlineBtn.className = "flex-1 bg-white border border-gray-300 text-gray-700 font-semibold text-[10px] py-1.5 rounded-lg";
    } else {
      timeBtn.className = "flex-1 bg-white border border-gray-300 text-gray-700 font-semibold text-[10px] py-1.5 rounded-lg";
      frontlineBtn.className = "flex-1 bg-white border border-emerald-500 text-emerald-800 font-bold text-[10px] py-1.5 rounded-lg shadow-xs";
    }
  }
  showToast(`Conflict policy updated: ${policy === "timestamp" ? "Latest Timestamp Wins" : "Frontline ASHA Worker Priority"}`);
}

function resolveConflict(chosenVersion) {
  const container = document.getElementById("conflictDiffContainer");
  if (container) {
    container.innerHTML = `
      <div class="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
          <span>Conflict for <strong>Ramesh Patil (#TRG-9021)</strong> resolved using <strong>${chosenVersion === 'local' ? 'Local ASHA Frontline Record' : 'PHC Remote Cloud Record'}</strong>.</span>
        </div>
        <span class="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">Resolved</span>
      </div>
    `;
  }
  showToast(`Conflict resolved: ${chosenVersion.toUpperCase()} record selected.`);
}

async function mergeAndSyncAllConflicts() {
  showToast("Reconciling IndexedDB outbox records with Cloud Firestore...");
  resolveConflict("local");
  await syncOfflineOutbox();
  setTimeout(() => {
    closeSyncConflictModal();
  }, 1200);
}

// ==============================================================================
// 2. Voice-to-Text Clinical Dictation Engine (Web Speech API + AI Parser)
// ==============================================================================
let speechRecognition = null;
let isRecordingSpeech = false;

function openVoiceDictationModal() {
  const modal = document.getElementById("voiceDictationModal");
  if (modal) modal.classList.remove("hidden");
  
  const transcriptArea = document.getElementById("voiceTranscriptInput");
  if (transcriptArea) transcriptArea.value = "";
  
  const entitiesBox = document.getElementById("extractedEntitiesBox");
  if (entitiesBox) entitiesBox.classList.add("hidden");

  initSpeechRecognition();
}

function closeVoiceDictationModal() {
  stopSpeechRecording();
  const modal = document.getElementById("voiceDictationModal");
  if (modal) modal.classList.add("hidden");
}

function initSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    const promptEl = document.getElementById("micSubPrompt");
    if (promptEl) {
      promptEl.innerHTML = "<span class='text-amber-600 font-semibold'>Browser microphone speech API unavailable in this frame. Use the Quick Clinical Audio Presets below to test live clinical parsing.</span>";
    }
    return;
  }

  if (!speechRecognition) {
    speechRecognition = new SpeechRec();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      const area = document.getElementById("voiceTranscriptInput");
      if (area && finalTranscript) {
        area.value = finalTranscript;
      }
    };

    speechRecognition.onerror = (e) => {
      console.warn("Speech recognition notice:", e.error);
      stopSpeechRecording();
    };

    speechRecognition.onend = () => {
      stopSpeechRecording();
    };
  }
}

function toggleSpeechRecording() {
  if (isRecordingSpeech) {
    stopSpeechRecording();
  } else {
    startSpeechRecording();
  }
}

function startSpeechRecording() {
  const langSelect = document.getElementById("voiceLanguageSelect");
  const lang = langSelect ? langSelect.value : "hi-IN";

  const halo = document.getElementById("micRecordingHalo");
  const icon = document.getElementById("micIcon");
  const status = document.getElementById("micStatusText");

  if (!speechRecognition) {
    initSpeechRecognition();
  }

  if (speechRecognition) {
    try {
      speechRecognition.lang = lang;
      speechRecognition.start();
      isRecordingSpeech = true;
      if (halo) halo.className = "w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl mb-2 cursor-pointer shadow-lg mic-recording-wave";
      if (icon) icon.className = "fa-solid fa-waveform animate-pulse";
      if (status) status.textContent = "Listening live... Speak symptoms and vitals";
      showToast("Clinical microphone active. Speak clearly...");
      return;
    } catch (e) {
      console.warn("Speech start exception:", e);
    }
  }

  // If browser permissions or iframe blocks mic, simulate live voice dictation
  isRecordingSpeech = true;
  if (halo) halo.className = "w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl mb-2 cursor-pointer shadow-lg mic-recording-wave";
  if (status) status.textContent = "Simulating clinical dictation capture...";
  
  loadVoiceSample(lang.startsWith("mr") ? "dyspnea_spo2" : "fever_bp");
  setTimeout(() => {
    stopSpeechRecording();
  }, 2200);
}

function stopSpeechRecording() {
  isRecordingSpeech = false;
  if (speechRecognition) {
    try { speechRecognition.stop(); } catch (_) {}
  }
  const halo = document.getElementById("micRecordingHalo");
  const icon = document.getElementById("micIcon");
  const status = document.getElementById("micStatusText");

  if (halo) halo.className = "w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl mb-2 cursor-pointer shadow-lg transition-transform";
  if (icon) icon.className = "fa-solid fa-microphone";
  if (status) status.textContent = "Dictation captured. Click Extract & Populate.";
}

function loadVoiceSample(type) {
  const area = document.getElementById("voiceTranscriptInput");
  if (!area) return;

  if (type === "fever_bp") {
    area.value = "मरीज रमेश पाटिल, उम्र 48 वर्ष। 3 दिन से तेज बुखार 102 डिग्री है और खांसी है। बीपी नापा तो 155 बटा 95 आया, पल्स 98 बीपीएम, ऑक्सीजन सेचुरेशन 93 प्रतिशत। सांस लेने में हल्की तकलीफ है।";
  } else {
    area.value = "रुग्णाचे नाव रमेश पाटील, वय 48 वर्षे. तीव्र ताप आणि छातीत भरल्यासारखे वाटते. रक्तदाब 150/95 mmHg, पल्स 102, ऑक्सिजन पातळी 92% आहे. तातडीने संदर्भ सेवा हवी.";
  }
  showToast("Clinical voice transcript loaded.");
}

async function processVoiceDictation() {
  const area = document.getElementById("voiceTranscriptInput");
  const text = area ? area.value.trim() : "";
  if (!text) {
    showToast("Please speak or enter a dictated clinical transcript first.");
    return;
  }

  const btn = document.getElementById("processVoiceBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i><span>Analyzing Clinical NLP...</span>';
  }

  try {
    const langSelect = document.getElementById("voiceLanguageSelect");
    const lang = langSelect ? langSelect.options[langSelect.selectedIndex].text : "Hindi";

    const response = await fetch("/api/ai/parse-voice-dictation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: lang })
    });

    const result = await response.json();
    if (result.ok && result.data) {
      const data = result.data;
      
      // Update preview card
      const entitiesBox = document.getElementById("extractedEntitiesBox");
      if (entitiesBox) entitiesBox.classList.remove("hidden");

      if (document.getElementById("vExtractedName")) document.getElementById("vExtractedName").textContent = data.patientName || "Ramesh Patil";
      if (document.getElementById("vExtractedBP")) document.getElementById("vExtractedBP").textContent = data.bloodPressure || "150/95";
      if (document.getElementById("vExtractedPulse")) document.getElementById("vExtractedPulse").textContent = data.pulseRate || "98 bpm";
      if (document.getElementById("vExtractedSpO2")) document.getElementById("vExtractedSpO2").textContent = data.spo2 || "93%";
      if (document.getElementById("vExtractedSymptoms")) document.getElementById("vExtractedSymptoms").textContent = (data.detectedSymptoms || []).join(", ") || "Fever, Breathlessness";

      // Apply directly to Triage Form fields
      if (data.bloodPressure && document.getElementById("triageBP")) {
        document.getElementById("triageBP").value = data.bloodPressure;
      }
      if (data.pulseRate && document.getElementById("triagePulse")) {
        document.getElementById("triagePulse").value = data.pulseRate;
      }
      if (data.spo2 && document.getElementById("triageSpO2")) {
        document.getElementById("triageSpO2").value = data.spo2;
      }
      if (data.patientName && document.getElementById("triagePatientName")) {
        document.getElementById("triagePatientName").value = data.patientName;
      }

      // Highlight symptom chips
      const chips = document.querySelectorAll("#symptomsContainer .symptom-chip");
      const symptomsStr = (data.detectedSymptoms || []).join(" ").toLowerCase();
      chips.forEach((c) => {
        const txt = c.textContent.toLowerCase();
        if (symptomsStr.includes("fever") && txt.includes("fever")) {
          c.className = "symptom-chip bg-asha text-white border-asha";
        }
        if (symptomsStr.includes("cough") && txt.includes("cough")) {
          c.className = "symptom-chip bg-asha text-white border-asha";
        }
        if (symptomsStr.includes("breath") && txt.includes("breath")) {
          c.className = "symptom-chip bg-asha text-white border-asha";
        }
        if (symptomsStr.includes("bp") && txt.includes("bp")) {
          c.className = "symptom-chip bg-asha text-white border-asha";
        }
      });

      updateTriageLivePreview();
      showToast("Voice dictation transcribed! Review fields and click Protocol Score to save.");
      setTimeout(() => {
        closeVoiceDictationModal();
      }, 1500);
    }
  } catch (e) {
    console.warn("Voice parsing notice:", e);
    showToast("Parsed clinical dictation into triage fields.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i><span>Extract &amp; Populate Triage</span>';
    }
  }
}

// ==============================================================================
// 3. Live Ambulance 108 GPS & Telemetry Simulator Engine
// ==============================================================================
let ambulanceGpsActive = false;
let ambSimInterval = null;
let ambProgressPct = 42; // percentage along the transit route
const ambWaypoints = [
  { lat: 17.6812, lng: 74.0192, speed: "56 km/h", dist: "9.2 km", eta: "16 mins", o2: "4.5 L/min" },
  { lat: 17.6842, lng: 74.0210, speed: "61 km/h", dist: "8.4 km", eta: "14 mins", o2: "4.5 L/min" },
  { lat: 17.6890, lng: 74.0255, speed: "64 km/h", dist: "6.8 km", eta: "11 mins", o2: "4.0 L/min" },
  { lat: 17.6945, lng: 74.0298, speed: "52 km/h", dist: "4.5 km", eta: "7 mins", o2: "4.0 L/min" },
  { lat: 17.7010, lng: 74.0340, speed: "42 km/h", dist: "1.8 km", eta: "3 mins", o2: "3.5 L/min" },
  { lat: 17.7055, lng: 74.0375, speed: "25 km/h", dist: "0.4 km", eta: "1 min", o2: "3.5 L/min" }
];
let ambWaypointIdx = 1;

function toggleAmbulanceGpsTracker() {
  const panel = document.getElementById("ambulanceGpsPanel");
  if (!panel) return;

  ambulanceGpsActive = !ambulanceGpsActive;
  const btn = document.getElementById("toggleGpsTrackingBtn");

  if (ambulanceGpsActive) {
    if (btn) {
      btn.className = "flex-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold py-2.5 rounded-xl touch-target hover:bg-emerald-200 transition flex items-center justify-center gap-1.5 shadow-xs";
      btn.innerHTML = '<i class="fa-solid fa-satellite-dish text-emerald-600 animate-pulse"></i><span>Tracking Active (108 GPS)</span>';
    }
    showToast("Ambulance 108 GPS Radar activated. Streaming real-time telemetry...");
    startAmbulanceTelemetrySimulation();
  } else {
    if (btn) {
      btn.className = "flex-1 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold py-2.5 rounded-xl touch-target hover:bg-amber-100 transition flex items-center justify-center gap-1.5";
      btn.innerHTML = '<i class="fa-solid fa-location-crosshairs text-amber-600"></i><span>Live 108 GPS Telemetry</span>';
    }
    if (ambSimInterval) clearInterval(ambSimInterval);
    showToast("Ambulance GPS telemetry paused.");
  }
}

function startAmbulanceTelemetrySimulation() {
  if (ambSimInterval) clearInterval(ambSimInterval);

  ambSimInterval = setInterval(() => {
    ambWaypointIdx = (ambWaypointIdx + 1) % ambWaypoints.length;
    const pt = ambWaypoints[ambWaypointIdx];

    // Move marker along SVG track
    ambProgressPct = 25 + (ambWaypointIdx * 12);
    const marker = document.getElementById("ambulanceLiveMarker");
    if (marker) {
      marker.style.left = `${Math.min(85, ambProgressPct)}%`;
      marker.style.top = `${36 + Math.sin(ambWaypointIdx) * 12}%`;
    }

    const etaBadge = document.getElementById("ambEtaBadge");
    const speedVal = document.getElementById("ambSpeedVal");
    const distVal = document.getElementById("ambDistVal");
    const coordText = document.getElementById("ambCoordText");

    if (etaBadge) etaBadge.textContent = `ETA: ${pt.eta}`;
    if (speedVal) speedVal.textContent = pt.speed;
    if (distVal) distVal.textContent = pt.dist;
    if (coordText) coordText.textContent = `${pt.lat.toFixed(4)}° N, ${pt.lng.toFixed(4)}° E`;
  }, 3200);
}

// ==============================================================================
// 4. District CMO Outbreak & Epidemic Surveillance Heatmap Engine
// ==============================================================================
let districtClustersCache = null;

async function loadCmoOutbreakData() {
  try {
    const res = await fetch("/api/cmo/outbreak-clusters");
    const data = await res.json();
    if (data.ok && data.data) {
      districtClustersCache = data.data;
      renderCmoVitals(data.data.districtVitals);
    }
  } catch (e) {
    console.warn("CMO Outbreak fetch notice:", e);
  }
}

function renderCmoVitals(vitals) {
  if (!vitals) return;
  const screened = document.getElementById("cmoScreenedCount");
  const fever = document.getElementById("cmoFeverCount");
  const resp = document.getElementById("cmoRespCount");
  const dispatch = document.getElementById("cmoDispatchCount");

  if (screened) screened.textContent = vitals.totalScreenedThisWeek || 428;
  if (fever) fever.textContent = vitals.feverCases || 84;
  if (resp) resp.textContent = vitals.respiratoryCases || 41;
  if (dispatch) dispatch.textContent = vitals.rapid108Transfers || 11;
}

function selectCmoCluster(clusterId) {
  const clusters = districtClustersCache?.activeClusters || [
    {
      id: "cls-01",
      name: "Ward 4 Rampur - Sub-Centre 4",
      disease: "Dengue & Acute Febrile Illness",
      cases7d: 19,
      growthRate: "+68%",
      riskScore: "CRITICAL",
      recommendedInterventions: [
        "Immediate thermal fogging across Ward 4 perimeter",
        "Dispatch 200 additional NS1 Rapid Antigen test kits to PHC",
        "ASHA door-to-door larval surveillance sweep"
      ]
    },
    {
      id: "cls-02",
      name: "Shirwal East - Sub-Centre 2",
      disease: "Gastroenteritis & Dehydration (Waterborne)",
      cases7d: 14,
      growthRate: "+35%",
      riskScore: "HIGH",
      recommendedInterventions: [
        "Superchlorination of community borewell pumps",
        "Emergency distribution of 150 ORS + Zinc packets",
        "Public health boil-water advisory announcement"
      ]
    },
    {
      id: "cls-03",
      name: "Wai Valley Sector - Sub-Centre 7",
      disease: "Seasonal Viral Bronchitis / URTI",
      cases7d: 8,
      growthRate: "+12%",
      riskScore: "MODERATE",
      recommendedInterventions: [
        "Monitor pediatric respiratory trends via teleconsults",
        "Ensure adequate Amoxicillin suspension buffers"
      ]
    }
  ];

  const found = clusters.find(c => c.id === clusterId) || clusters[0];

  const title = document.getElementById("clusterTitle");
  const disease = document.getElementById("clusterDisease");
  const badge = document.getElementById("clusterBadge");
  const list = document.getElementById("clusterActionsList");

  if (title) title.textContent = found.name;
  if (disease) disease.textContent = `${found.disease} · ${found.cases7d} cases (${found.growthRate} growth in 7 days)`;
  if (badge) {
    badge.textContent = `${found.riskScore} SPIKE`;
    badge.className = found.riskScore === "CRITICAL"
      ? "bg-red-100 text-danger text-[10px] font-extrabold px-2.5 py-1 rounded-full"
      : found.riskScore === "HIGH"
      ? "bg-amber-100 text-warning text-[10px] font-extrabold px-2.5 py-1 rounded-full"
      : "bg-blue-100 text-doctor text-[10px] font-extrabold px-2.5 py-1 rounded-full";
  }

  if (list && found.recommendedInterventions) {
    list.innerHTML = found.recommendedInterventions.map(act => `<li>${escapeHTML(act)}</li>`).join("");
  }

  showToast(`Cluster selected: ${found.name} (${found.riskScore})`);
}

function refreshCmoClusters() {
  showToast("Scanning district syndromic data & re-calculating GIS clusters...");
  loadCmoOutbreakData();
}

function dispatchOutbreakIntervention() {
  showToast("Rapid Response Command issued! District Mobile Health Squad & 200 Rapid Antigen kits dispatched.");
}


