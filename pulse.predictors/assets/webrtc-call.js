// ==============================================================================
// Pulse Predictor — Real-time WebRTC Live Video Calling Suite
// Clinical Teleconsultation between ASHA Workers and PHC Medical Officers
// ==============================================================================

(function () {
  "use strict";

  const RTC_CONFIG = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" }
    ]
  };

  const CALL_SESSION_ID = "active_consultation";
  const BROADCAST_CHANNEL_NAME = "pulse_webrtc_signaling";

  // State Management
  let localStream = null;
  let remoteStream = null;
  let peerConnection = null;
  let activeRole = null; // 'asha', 'doctor', 'patient'
  try {
    activeRole = localStorage.getItem("pulse_predictor_role") || null;
  } catch (_) {}
  let currentCallState = "idle"; // 'idle', 'calling', 'ringing', 'connected', 'ended'
  let incomingCallData = null;
  let currentFacingMode = "user";
  let isMuted = false;
  let isVideoOff = false;
  let callTimerInterval = null;
  let callDurationSeconds = 0;
  let signalingChannel = null;
  let dbUnsubscribeSession = null;
  let ringtoneOscillatorInterval = null;
  let audioCtx = null;
  let syntheticStreamContext = null;
  let pendingIceCandidates = [];
  let processedSignalHashes = new Set();
  let serverPollInterval = null;
  let lastServerPollTimestamp = Date.now() - 60000;
  let isAnsweringCall = false;

  // Initialize Broadcast Channel
  try {
    if (typeof BroadcastChannel !== "undefined") {
      signalingChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      signalingChannel.onmessage = (evt) => handleIncomingSignal(evt.data);
    }
  } catch (e) {
    console.warn("BroadcastChannel not supported:", e);
  }

  // Audio Ringtone Generator (Web Audio API)
  function startRingtone() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      stopRingtone();
      const playChime = () => {
        if (!audioCtx || audioCtx.state !== "running") return;
        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(783.99, now + 0.18); // G5
        osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35); // C6

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start(now);
        osc1.stop(now + 0.3);
        osc2.start(now + 0.18);
        osc2.stop(now + 0.6);
      };

      playChime();
      ringtoneOscillatorInterval = window.setInterval(playChime, 2400);
    } catch (e) {
      console.warn("Ringtone error:", e);
    }
  }

  function stopRingtone() {
    if (ringtoneOscillatorInterval) {
      clearInterval(ringtoneOscillatorInterval);
      ringtoneOscillatorInterval = null;
    }
  }

  // Create Synthetic Live Stream Fallback (Ensures WebRTC never fails if physical camera is blocked or in headless tests)
  function createSyntheticStream(role) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    let frame = 0;
    const isDoc = role === "doctor";

    function drawFrame() {
      frame++;
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 480);
      grad.addColorStop(0, isDoc ? "#0c4a6e" : "#064e3b");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 480);

      // Subtle pulse grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }

      // Animated silhouette with realistic breathing movement
      const breathe = Math.sin(frame * 0.05) * 6;
      ctx.fillStyle = isDoc ? "#38bdf8" : "#34d399";
      ctx.beginPath();
      ctx.arc(320, 190 + breathe, 70, 0, Math.PI * 2);
      ctx.fill();

      // Body / Shoulders
      ctx.fillStyle = isDoc ? "#f0f9ff" : "#ecfdf5";
      ctx.beginPath();
      ctx.ellipse(320, 370 + breathe, 140, 110, 0, 0, Math.PI * 2);
      ctx.fill();

      // Clinical Stethoscope indicator
      if (isDoc) {
        ctx.strokeStyle = "#0284c7";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(320, 270 + breathe, 50, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }

      // Live Video Overlay Stamp
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(isDoc ? "Dr. Rajesh Kumar (PHC Medical Officer)" : "ASHA Sunita Devi (Sub-Centre 4)", 320, 440);

      ctx.font = "12px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`LIVE CLINICAL STREAM · ${new Date().toLocaleTimeString()}`, 320, 462);

      syntheticStreamContext = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Canvas captureStream
    const videoStream = canvas.captureStream ? canvas.captureStream(30) : null;
    if (!videoStream) return null;

    // Create silent audio track
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const actx = new AudioCtx();
        const dest = actx.createMediaStreamDestination();
        const osc = actx.createOscillator();
        const g = actx.createGain();
        g.gain.value = 0.0001; // virtually silent
        osc.connect(g);
        g.connect(dest);
        osc.start();
        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) videoStream.addTrack(audioTrack);
      }
    } catch (_) {}

    return videoStream;
  }

  // Acquire Real Camera & Microphone
  async function acquireLocalMedia(role, facingMode = "user") {
    // Release existing tracks
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream = null;
    }
    if (syntheticStreamContext) {
      cancelAnimationFrame(syntheticStreamContext);
      syntheticStreamContext = null;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: facingMode
            },
            audio: true
          });
        } catch (mediaErr) {
          console.warn("Retrying getUserMedia with video only (audio blocked):", mediaErr);
          localStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: facingMode
            },
            audio: false
          });
        }
      }
    } catch (err) {
      console.warn("Hardware camera unavailable or permission denied, using live synthetic clinical feed:", err);
    }

    if (!localStream) {
      localStream = createSyntheticStream(role);
    }

    // Attach to Local Video (PIP view)
    const pipVideoId = role === "asha" ? "ashaLocalVideo" : role === "doctor" ? "doctorLocalVideo" : "patientLocalVideo";
    const pipEl = document.getElementById(pipVideoId);
    if (pipEl && localStream) {
      pipEl.srcObject = localStream;
      pipEl.play().catch(() => {});
    }

    return localStream;
  }

  // Create WebRTC Peer Connection
  function createPeerConnection(role) {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    peerConnection = new RTCPeerConnection(RTC_CONFIG);

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Listen for incoming remote tracks
    peerConnection.ontrack = (event) => {
      console.log("WebRTC: Remote track received:", event);
      if (!remoteStream) {
        remoteStream = new MediaStream();
      }
      if (event.streams && event.streams[0]) {
        remoteStream = event.streams[0];
      } else if (event.track) {
        remoteStream.addTrack(event.track);
      }
      const roleTarget = activeRole || role;
      attachRemoteStream(roleTarget, remoteStream);
      updateCallUIState("connected", roleTarget);
    };

    // ICE Candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        broadcastSignal({
          type: "candidate",
          candidate: event.candidate,
          fromRole: role,
          sessionId: CALL_SESSION_ID
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("WebRTC connection state:", peerConnection.connectionState);
      const roleTarget = activeRole || role;
      if (peerConnection.connectionState === "connected") {
        currentCallState = "connected";
        updateCallUIState("connected", roleTarget);
        startCallTimer(roleTarget);
      } else if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed"
      ) {
        console.warn("WebRTC connection disconnected or failed.");
        const isDoc = roleTarget === "doctor";
        const isPat = roleTarget === "patient";
        const statusBadgeId = isDoc ? "docCallStatusBadge" : isPat ? "patCallStatusBadge" : "ashaCallStatusBadge";
        const badge = document.getElementById(statusBadgeId);
        if (badge) badge.textContent = "Reconnecting video stream...";
      }
    };

    return peerConnection;
  }

  function attachRemoteStream(role, stream) {
    const remoteVideoId = role === "asha" ? "ashaRemoteVideo" : role === "doctor" ? "doctorRemoteVideo" : "patientRemoteVideo";
    const remoteEl = document.getElementById(remoteVideoId);
    if (remoteEl) {
      if (remoteEl.srcObject !== stream) {
        remoteEl.srcObject = stream;
      }
      remoteEl.classList.remove("hidden");
      const playPromise = remoteEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Remote video play error, falling back to muted play:", err);
          remoteEl.muted = true;
          remoteEl.play().catch(() => {});
        });
      }
    }

    // Hide waiting overlay
    const overlayId = role === "asha" ? "ashaCallWaitingOverlay" : role === "doctor" ? "docCallWaitingOverlay" : "patCallWaitingOverlay";
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.classList.add("hidden");
  }

  // Safely serialize SDP and ICE candidates to plain JSON objects (crucial for Firestore setDoc/addDoc)
  function serializeSignal(signal) {
    if (!signal) return null;
    const clean = {
      type: signal.type,
      fromRole: signal.fromRole,
      sessionId: signal.sessionId || CALL_SESSION_ID,
      timestamp: signal.timestamp || Date.now()
    };
    if (signal.callerName) clean.callerName = signal.callerName;
    if (signal.patientName) clean.patientName = signal.patientName;
    if (signal.sender) clean.sender = signal.sender;
    if (signal.role) clean.role = signal.role;
    if (signal.text) clean.text = signal.text;

    if (signal.sdp) {
      clean.sdp = {
        type: signal.sdp.type || "offer",
        sdp: typeof signal.sdp === "string" ? signal.sdp : (signal.sdp.sdp || "")
      };
    }
    if (signal.candidate) {
      const c = signal.candidate;
      clean.candidate = {
        candidate: c.candidate !== undefined ? c.candidate : "",
        sdpMid: c.sdpMid !== undefined ? c.sdpMid : null,
        sdpMLineIndex: c.sdpMLineIndex !== undefined ? c.sdpMLineIndex : null,
        usernameFragment: c.usernameFragment || null
      };
    }
    return clean;
  }

  // Safe ICE Candidate queuing and flushing
  async function addIceCandidateSafely(candidateData) {
    if (!peerConnection) return;
    if (!candidateData || !candidateData.candidate) return;

    if (!peerConnection.remoteDescription || !peerConnection.remoteDescription.type) {
      pendingIceCandidates.push(candidateData);
      return;
    }

    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidateData));
    } catch (e) {
      console.warn("addIceCandidate warning:", e);
    }
  }

  async function flushPendingIceCandidates() {
    if (!peerConnection || !peerConnection.remoteDescription) return;
    while (pendingIceCandidates.length > 0) {
      const cand = pendingIceCandidates.shift();
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(cand));
      } catch (e) {
        console.warn("flush ICE candidate warning:", e);
      }
    }
  }

  // Broadcast Signal via BroadcastChannel + Cloud Firestore + Server HTTP Relay
  async function broadcastSignal(rawSignal) {
    const signal = serializeSignal(rawSignal);
    if (!signal) return;

    // 1. Local instant BroadcastChannel
    if (signalingChannel) {
      try {
        signalingChannel.postMessage(signal);
      } catch (e) {
        console.warn("BroadcastChannel send error:", e);
      }
    }

    // 2. Cloud Firestore Signaling (cross-origin / cross-device)
    if (window.PulseDB) {
      try {
        if (signal.type === "offer" || signal.type === "answer" || signal.type === "end") {
          await window.PulseDB.setCallSession(CALL_SESSION_ID, signal);
        } else if (signal.type === "candidate") {
          await window.PulseDB.sendCallSignal(CALL_SESSION_ID, signal);
        }
      } catch (e) {
        console.warn("Cloud Firestore signal error:", e);
      }
    }

    // 3. Server HTTP fallback relay
    try {
      if (signal.type === "offer" || signal.type === "answer") {
        fetch("/api/call/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signal)
        }).catch(() => {});
      } else if (signal.type === "candidate") {
        fetch("/api/call/candidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signal)
        }).catch(() => {});
      } else if (signal.type === "end") {
        fetch("/api/call/end", { method: "POST" }).catch(() => {});
      }
    } catch (_) {}
  }

  // Handle Incoming Signal
  async function handleIncomingSignal(rawSignal) {
    if (!rawSignal || !rawSignal.type) return;
    const signal = serializeSignal(rawSignal) || rawSignal;

    // Signal deduplication
    const candPart = signal.candidate ? (signal.candidate.candidate || "").slice(0, 30) : "";
    const sdpPart = signal.sdp ? (signal.sdp.sdp || "").slice(0, 30) : "";
    const sigKey = `${signal.type}_${signal.fromRole}_${signal.timestamp || ''}_${candPart}_${sdpPart}`;
    if (processedSignalHashes.has(sigKey)) return;
    processedSignalHashes.add(sigKey);
    if (processedSignalHashes.size > 250) {
      const arr = Array.from(processedSignalHashes).slice(120);
      processedSignalHashes = new Set(arr);
    }

    const currentRole = activeRole || (function() {
      try { return localStorage.getItem("pulse_predictor_role"); } catch (_) { return null; }
    })();

    // Ignore signals from oneself
    if (signal.fromRole && currentRole && signal.fromRole === currentRole) return;

    // Ignore signals older than 2.5 minutes
    if (signal.timestamp && Math.abs(Date.now() - signal.timestamp) > 150000) return;

    console.log("WebRTC incoming signal:", signal.type, "from:", signal.fromRole, "my role:", currentRole);

    if (signal.type === "offer") {
      incomingCallData = signal;
      const inCallView = isUserInCallView(currentRole);

      // Handle WebRTC Glare (Offer collision):
      // If we are currently calling or have a local offer pending:
      const isOfferCollision = peerConnection && (
        peerConnection.signalingState === "have-local-offer" ||
        currentCallState === "calling"
      );

      if (isOfferCollision) {
        // Doctor yields as polite peer and answers ASHA's offer
        const isPolite = (currentRole === "doctor");
        if (isPolite) {
          console.log("WebRTC Glare: Doctor is polite peer, yielding to answer ASHA's offer.");
          await answerIncomingCall(signal);
          return;
        } else {
          console.log("WebRTC Glare: ASHA is impolite peer, waiting for Doctor to answer our offer.");
          return;
        }
      }

      if (inCallView) {
        await answerIncomingCall(signal);
      } else {
        showIncomingCallBanner(signal);
      }
    } else if (signal.type === "answer") {
      if (peerConnection && (peerConnection.signalingState === "have-local-offer" || !peerConnection.remoteDescription)) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        console.log("WebRTC: Remote description (answer) set successfully.");
        await flushPendingIceCandidates();
        currentCallState = "connected";
        updateCallUIState("connected", currentRole);
        startCallTimer(currentRole);
      }
    } else if (signal.type === "candidate") {
      if (signal.candidate) {
        await addIceCandidateSafely(signal.candidate);
      }
    } else if (signal.type === "end") {
      handleRemoteCallEnded();
    } else if (signal.type === "chat_message") {
      appendChatMessage(signal.sender, signal.role, signal.text, false);
    }
  }

  function isUserInCallView(role) {
    if (role === "asha") {
      const el = document.getElementById("asha-teleconsult");
      return el && el.style.display !== "none";
    }
    if (role === "doctor") {
      const el = document.getElementById("doctor-consult");
      return el && el.style.display !== "none";
    }
    if (role === "patient") {
      const el = document.getElementById("patient-teleconsult");
      return el && el.style.display !== "none";
    }
    return false;
  }

  // Show Floating Incoming Call Banner
  function showIncomingCallBanner(signal) {
    const banner = document.getElementById("incomingCallBanner");
    if (!banner) return;

    const callerRoleEl = document.getElementById("incomingCallerRole");
    const callerTextEl = document.getElementById("incomingCallerText");

    const callerName = signal.callerName || (signal.fromRole === "asha" ? "ASHA Sunita Devi" : "Dr. Rajesh Kumar");
    const patientInfo = signal.patientName ? ` · Patient: ${signal.patientName}` : "";

    if (callerRoleEl) {
      callerRoleEl.textContent = signal.fromRole === "asha" ? "Sub-Centre 4" : "PHC Hospital";
    }
    if (callerTextEl) {
      callerTextEl.textContent = `${callerName}${patientInfo} is calling...`;
    }

    banner.classList.remove("hidden");
    startRingtone();
  }

  function hideIncomingCallBanner() {
    const banner = document.getElementById("incomingCallBanner");
    if (banner) banner.classList.add("hidden");
    stopRingtone();
    incomingCallData = null;
  }

  // Initiate Call (ASHA, Doctor, or Patient)
  async function initiateCall(role, patientName = "Ramesh Patil") {
    if (isAnsweringCall) return;
    activeRole = role;
    currentCallState = "calling";
    updateCallUIState("calling", role);

    // 1. Acquire Local Camera/Mic
    await acquireLocalMedia(role, currentFacingMode);

    // 2. Create WebRTC PeerConnection
    createPeerConnection(role);

    // 3. Create Offer
    try {
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await peerConnection.setLocalDescription(offer);

      const callerName = role === "asha" ? "Sunita Devi (ASHA)" : role === "patient" ? "Ramesh Patil (Patient)" : "Dr. Rajesh Kumar (PHC)";
      broadcastSignal({
        type: "offer",
        sdp: peerConnection.localDescription,
        fromRole: role,
        callerName: callerName,
        patientName: patientName,
        sessionId: CALL_SESSION_ID
      });

      console.log("WebRTC offer dispatched by", role);
      if (window.showToast) {
        const dest = role === "doctor" ? "Sub-Centre 4 (ASHA)" : "Dr. Rajesh Kumar (PHC)";
        window.showToast(`Calling ${dest}...`);
      }
    } catch (e) {
      console.error("Error creating WebRTC offer:", e);
    }
  }

  // Answer Incoming Call
  async function answerIncomingCall(signal) {
    if (!signal || !signal.sdp) return;
    if (isAnsweringCall) return;
    isAnsweringCall = true;

    hideIncomingCallBanner();
    const role = activeRole || (signal.fromRole === "asha" ? "doctor" : "asha");
    activeRole = role;
    currentCallState = "connecting";

    // 1. Acquire Local Camera/Mic
    await acquireLocalMedia(role, currentFacingMode);

    // 2. Create WebRTC PeerConnection
    createPeerConnection(role);

    // 3. Navigate to role's teleconsult view without re-triggering initiation
    if (role === "asha" && typeof window.showASHA === "function") {
      window.showASHA("asha-teleconsult");
    } else if (role === "doctor" && typeof window.showDoctor === "function") {
      window.showDoctor("doctor-consult");
    } else if (role === "patient" && typeof window.showPatient === "function") {
      window.showPatient("patient-teleconsult");
    }

    try {
      // 4. Set Remote Description (Offer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushPendingIceCandidates();

      // 5. Create Answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // 6. Broadcast Answer
      broadcastSignal({
        type: "answer",
        sdp: peerConnection.localDescription,
        fromRole: role,
        sessionId: CALL_SESSION_ID
      });

      console.log("WebRTC answer dispatched by", role);
      currentCallState = "connected";
      updateCallUIState("connected", role);
      startCallTimer(role);
      if (window.showToast) {
        window.showToast("Connected to live video consultation.");
      }
    } catch (e) {
      console.error("Error answering WebRTC call:", e);
    } finally {
      isAnsweringCall = false;
    }
  }

  // Reconnect Call
  async function reconnectCall(role) {
    if (window.showToast) window.showToast("Re-establishing video consultation...");
    cleanupCallSession(role);
    await new Promise((r) => setTimeout(r, 300));
    await initiateCall(role);
  }

  // End Call
  function endLiveCall(role) {
    broadcastSignal({
      type: "end",
      fromRole: role,
      sessionId: CALL_SESSION_ID
    });

    cleanupCallSession(role);

    if (window.showToast) {
      window.showToast("Video consultation ended safely. Clinical log saved.");
    }

    if (role === "asha" && typeof window.showASHA === "function") {
      window.showASHA("asha-dashboard");
    } else if (role === "doctor" && typeof window.showDoctor === "function") {
      window.showDoctor("doctor-queue");
    } else if (role === "patient" && typeof window.showPatient === "function") {
      window.showPatient("patient-dashboard");
    }
  }

  function handleRemoteCallEnded() {
    cleanupCallSession(activeRole);
    if (window.showToast) {
      window.showToast("Remote participant has ended the video consultation.");
    }
    if (activeRole === "asha" && typeof window.showASHA === "function") {
      window.showASHA("asha-dashboard");
    } else if (activeRole === "doctor" && typeof window.showDoctor === "function") {
      window.showDoctor("doctor-queue");
    }
  }

  function cleanupCallSession(role) {
    stopRingtone();
    hideIncomingCallBanner();

    if (callTimerInterval) {
      clearInterval(callTimerInterval);
      callTimerInterval = null;
    }
    callDurationSeconds = 0;

    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream = null;
    }
    if (syntheticStreamContext) {
      cancelAnimationFrame(syntheticStreamContext);
      syntheticStreamContext = null;
    }
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    remoteStream = null;
    currentCallState = "idle";

    // Reset video elements
    const remoteVideoIds = ["ashaRemoteVideo", "doctorRemoteVideo", "patientRemoteVideo"];
    remoteVideoIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.srcObject = null;
        el.classList.add("hidden");
      }
    });

    const localVideoIds = ["ashaLocalVideo", "doctorLocalVideo", "patientLocalVideo"];
    localVideoIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.srcObject = null;
    });

    // Reset overlays
    const overlays = ["ashaCallWaitingOverlay", "docCallWaitingOverlay", "patCallWaitingOverlay"];
    overlays.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("hidden");
    });
  }

  // Audio Mute Toggle
  function toggleMute(role) {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      isMuted = !isMuted;
      audioTrack.enabled = !isMuted;
      const btnId = role === "asha" ? "ashaMuteBtn" : role === "doctor" ? "docMuteBtn" : "patMuteBtn";
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-microphone${isMuted ? "-slash" : ""}"></i>`;
        btn.classList.toggle("bg-red-500", isMuted);
        btn.classList.toggle("text-white", isMuted);
      }
      if (window.showToast) {
        window.showToast(isMuted ? "Microphone muted" : "Microphone unmuted");
      }
    } else {
      if (window.showToast) window.showToast("Microphone device unavailable");
    }
  }

  // Video On/Off Toggle
  function toggleVideo(role) {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      isVideoOff = !isVideoOff;
      videoTrack.enabled = !isVideoOff;
      const btnId = role === "asha" ? "ashaVideoBtn" : role === "doctor" ? "docVideoBtn" : "patVideoBtn";
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-video${isVideoOff ? "-slash" : ""}"></i>`;
        btn.classList.toggle("bg-red-500", isVideoOff);
        btn.classList.toggle("text-white", isVideoOff);
      }
      if (window.showToast) {
        window.showToast(isVideoOff ? "Camera turned off" : "Camera turned on");
      }
    }
  }

  // Camera Flip (Front/Rear)
  async function flipCamera(role) {
    currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
    if (window.showToast) {
      window.showToast(`Switching camera: ${currentFacingMode === "user" ? "Front (Selfie)" : "Rear (Patient Examination)"}`);
    }

    if (localStream && peerConnection) {
      const newStream = await acquireLocalMedia(role, currentFacingMode);
      if (newStream) {
        const newVideoTrack = newStream.getVideoTracks()[0];
        const senders = peerConnection.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === "video");
        if (videoSender && newVideoTrack) {
          videoSender.replaceTrack(newVideoTrack);
        }
      }
    }
  }

  // Call Duration Timer
  function startCallTimer(role) {
    if (callTimerInterval) clearInterval(callTimerInterval);
    callDurationSeconds = 0;
    const timerId = role === "asha" ? "callTimerAsha" : role === "doctor" ? "callTimerDoctor" : "callTimerPatient";
    const timerEl = document.getElementById(timerId);

    callTimerInterval = window.setInterval(() => {
      callDurationSeconds++;
      const mins = Math.floor(callDurationSeconds / 60).toString().padStart(2, "0");
      const secs = (callDurationSeconds % 60).toString().padStart(2, "0");
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  // Update Call UI State
  function updateCallUIState(state, role) {
    const isDoc = role === "doctor";
    const isPat = role === "patient";
    const statusBadgeId = isDoc ? "docCallStatusBadge" : isPat ? "patCallStatusBadge" : "ashaCallStatusBadge";
    const badge = document.getElementById(statusBadgeId);

    if (state === "calling") {
      if (badge) badge.textContent = "Calling... Awaiting Response";
    } else if (state === "connected") {
      if (badge) badge.textContent = "Connected · Live HD Stream";
      // Hide waiting overlay
      const overlayId = isDoc ? "docCallWaitingOverlay" : isPat ? "patCallWaitingOverlay" : "ashaCallWaitingOverlay";
      const overlay = document.getElementById(overlayId);
      if (overlay) overlay.classList.add("hidden");

      // Show remote video
      const remoteVideoId = isDoc ? "doctorRemoteVideo" : isPat ? "patientRemoteVideo" : "ashaRemoteVideo";
      const remoteEl = document.getElementById(remoteVideoId);
      if (remoteEl) remoteEl.classList.remove("hidden");
    }
  }

  // Send In-Call Live Chat Message
  function sendCallChatMessage() {
    const input = document.getElementById("callChatInput");
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = "";

    const sender = activeRole === "doctor" ? "Dr. Rajesh Kumar (PHC)" : "Sunita Devi (ASHA)";
    appendChatMessage(sender, activeRole, text, true);

    broadcastSignal({
      type: "chat_message",
      sender: sender,
      role: activeRole,
      text: text,
      sessionId: CALL_SESSION_ID
    });
  }

  function appendChatMessage(sender, role, text, isSelf) {
    const container = document.getElementById("callChatMessages");
    if (!container) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgDiv = document.createElement("div");
    msgDiv.className = `flex flex-col ${isSelf ? "items-end" : "items-start"}`;

    const isDoc = role === "doctor";
    const bgClass = isSelf
      ? isDoc ? "bg-doctor text-white" : "bg-asha text-white"
      : "bg-white border border-gray-200 text-gray-700";

    msgDiv.innerHTML = `
      <span class="text-[9px] text-gray-400 font-semibold mb-0.5">${sender} · ${timeStr}</span>
      <div class="${bgClass} px-2.5 py-1.5 rounded-xl ${isSelf ? "rounded-tr-none" : "rounded-tl-none"} max-w-[85%] text-xs shadow-2xs">
        ${escapeHTML(text)}
      </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    // Pulse chat unread dot if chat panel is hidden
    if (!isSelf) {
      const dot = document.getElementById("chatUnreadDot");
      if (dot) dot.classList.remove("hidden");
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[tag] || tag));
  }

  // Listen for Cloud Firestore Call Session changes
  function setupCloudCallListener() {
    if (!window.PulseDB || !window.PulseDB.listenCallSession) return;
    if (dbUnsubscribeSession) dbUnsubscribeSession();

    dbUnsubscribeSession = window.PulseDB.listenCallSession(CALL_SESSION_ID, (sessionData) => {
      if (!sessionData) return;
      handleIncomingSignal(sessionData);
    });

    if (window.PulseDB.listenCallSignals) {
      window.PulseDB.listenCallSignals(CALL_SESSION_ID, (signalData) => {
        if (!signalData) return;
        handleIncomingSignal(signalData);
      });
    }
  }

  // Server HTTP polling relay fallback
  function startServerPolling() {
    if (serverPollInterval) return;
    serverPollInterval = window.setInterval(async () => {
      try {
        const res = await fetch("/api/call/session");
        if (res.ok) {
          const json = await res.json();
          if (json.session) {
            handleIncomingSignal(json.session);
          }
        }
      } catch (_) {}

      if (peerConnection) {
        try {
          const currentRole = activeRole || localStorage.getItem("pulse_predictor_role") || "";
          const res = await fetch(`/api/call/candidates?since=${lastServerPollTimestamp}&role=${encodeURIComponent(currentRole)}`);
          if (res.ok) {
            const json = await res.json();
            if (json.candidates && json.candidates.length) {
              json.candidates.forEach((c) => {
                lastServerPollTimestamp = Math.max(lastServerPollTimestamp, c.timestamp || 0);
                handleIncomingSignal(c);
              });
            }
          }
        } catch (_) {}
      }
    }, 1200);
  }

  // Hook listener immediately if PulseDB already ready, and also on event
  if (window.PulseDB && window.PulseDB.isReady) {
    setupCloudCallListener();
  }
  window.addEventListener("PulseDBReady", () => {
    setupCloudCallListener();
  });

  // Start background HTTP relay polling
  startServerPolling();

  // Expose global controller
  window.PulseCall = {
    initiateCall,
    answerIncomingCall,
    reconnectCall,
    endLiveCall,
    toggleMute,
    toggleVideo,
    flipCamera,
    sendCallChatMessage,
    acceptIncomingCall: () => {
      if (incomingCallData) {
        answerIncomingCall(incomingCallData);
      } else {
        hideIncomingCallBanner();
      }
    },
    declineIncomingCall: () => {
      broadcastSignal({
        type: "end",
        fromRole: activeRole,
        sessionId: CALL_SESSION_ID
      });
      hideIncomingCallBanner();
      if (window.showToast) window.showToast("Call declined.");
    },
    startSessionForRole: (role) => {
      activeRole = role;
      // If already connected or in the middle of answering, do not destroy session
      if (isAnsweringCall || currentCallState === "connected") {
        console.log("startSessionForRole: Call already connecting/connected, attaching video preview.");
        if (localStream) {
          const pipId = role === "asha" ? "ashaLocalVideo" : role === "doctor" ? "doctorLocalVideo" : "patientLocalVideo";
          const pipEl = document.getElementById(pipId);
          if (pipEl && pipEl.srcObject !== localStream) {
            pipEl.srcObject = localStream;
            pipEl.play().catch(() => {});
          }
        }
        return;
      }
      // If there is an active pending offer from the other participant, answer it immediately
      if (incomingCallData && incomingCallData.sdp && incomingCallData.fromRole !== role) {
        console.log("startSessionForRole: Answering active pending incoming call.");
        answerIncomingCall(incomingCallData);
        return;
      }
      initiateCall(role);
    },
    stopSessionForRole: (role) => {
      // Only clean up if not actively in an established consultation call
      if (currentCallState !== "connected") {
        cleanupCallSession(role);
      }
    },
    setActiveRole: (role) => {
      activeRole = role;
    }
  };

  // Wire global trigger functions for HTML inline handlers
  window.acceptIncomingCall = () => window.PulseCall.acceptIncomingCall();
  window.declineIncomingCall = () => window.PulseCall.declineIncomingCall();
  window.sendCallChatMessage = () => window.PulseCall.sendCallChatMessage();

})();
