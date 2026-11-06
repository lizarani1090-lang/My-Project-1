(() => {
  // Purge any stale client-side caches immediately so new markup displays
  try {
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          if (name !== 'pulse-predictor-v7') {
            caches.delete(name);
          }
        }
      });
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          reg.update();
        }
      });
    }
  } catch (_) {}

  // PWA Install handlers
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.handlePWAInstall = function() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isStandalone) {
      alert('Pulse Predictor is already installed on this device.');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    } else {
      const modal = document.getElementById('pwaInstallModal');
      if (modal) {
        modal.classList.remove('hidden');
        const iosSteps = document.getElementById('iosInstallSteps');
        const genericSteps = document.getElementById('genericInstallSteps');
        if (iosSteps && genericSteps) {
          if (isIOS) {
            iosSteps.classList.remove('hidden');
            genericSteps.classList.add('hidden');
          } else {
            iosSteps.classList.add('hidden');
            genericSteps.classList.remove('hidden');
          }
        }
      }
    }
  };

  window.closeInstallModal = function() {
    const modal = document.getElementById('pwaInstallModal');
    if (modal) modal.classList.add('hidden');
  };

  // Registration and Login Tabs Switcher
  window.switchAuthTab = function(mode) {
    const loginForm = document.getElementById('loginForm') || document.querySelector('[data-login-form]');
    const registerForm = document.getElementById('registerForm') || document.querySelector('[data-register-form]');
    const tabLogin = document.getElementById('tabLoginBtn');
    const tabRegister = document.getElementById('tabRegisterBtn');

    if (mode === 'register') {
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = 'block';
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabRegister) tabRegister.classList.add('active');
    } else {
      if (loginForm) loginForm.style.display = 'block';
      if (registerForm) registerForm.style.display = 'none';
      if (tabLogin) tabLogin.classList.add('active');
      if (tabRegister) tabRegister.classList.remove('active');
    }
  };

  // Login Form Submission
  const loginForm = document.querySelector('[data-login-form]');
  if (loginForm) {
    const errorMessage = loginForm.querySelector('[data-login-error]') || document.querySelector('[data-login-error]');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const role = loginForm.dataset.role;

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (errorMessage) errorMessage.textContent = '';

      if (window.location.protocol === 'file:') {
        if (errorMessage) errorMessage.textContent = 'Open this page from http://localhost:3000 after starting node server.js.';
        return;
      }

      submitButton.disabled = true;
      const origText = submitButton.textContent;
      submitButton.textContent = 'Signing in...';

      const formData = new FormData(loginForm);
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
            role: role || formData.get('role'),
          }),
        });
        const responseText = await response.text();
        let result = {};
        try {
          result = responseText ? JSON.parse(responseText) : {};
        } catch (_) {
          throw new Error(`The server returned an invalid response (${response.status}). Please restart node server.js.`);
        }
        if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
        if (result.token) {
          try {
            localStorage.setItem('pulse_predictor_token', result.token);
            localStorage.setItem('pulse_predictor_role', result.role || role || 'asha');
            localStorage.setItem('pulse_predictor_user', JSON.stringify({
              name: result.name || '',
              workplace: result.workplace || '',
              email: result.email || '',
              role: result.role || role || 'asha',
              phone: result.phone || '',
              abhaId: result.abhaId || ''
            }));
          } catch (_) {}
        }
        const targetUrl = result.token ? `/index.html?token=${encodeURIComponent(result.token)}` : '/index.html';
        window.location.assign(targetUrl);
      } catch (error) {
        if (errorMessage) {
          errorMessage.textContent = error.message.includes('Failed to fetch')
            ? 'Start the local server with “node server.js” before signing in.'
            : error.message;
        }
        submitButton.disabled = false;
        submitButton.textContent = origText;
      }
    });
  }

  // Universal Registration Form Submission
  const registerForm = document.querySelector('[data-register-form]');
  if (registerForm) {
    const regErrorMessage = registerForm.querySelector('[data-register-error]');
    const regSuccessMessage = registerForm.querySelector('[data-register-success]');
    const regSubmitButton = registerForm.querySelector('button[type="submit"]');

    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (regErrorMessage) regErrorMessage.textContent = '';
      if (regSuccessMessage) {
        regSuccessMessage.textContent = '';
        regSuccessMessage.style.display = 'none';
      }

      regSubmitButton.disabled = true;
      const origText = regSubmitButton.textContent;
      regSubmitButton.textContent = 'Creating account...';

      const formData = new FormData(registerForm);
      const chosenRole = formData.get('role') || registerForm.dataset.role || 'asha';

      const registrationPayload = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: chosenRole,
        workplace: formData.get('workplace') || '',
        phone: formData.get('phone') || '',
        abhaId: formData.get('abhaId') || '',
        licenseNumber: formData.get('licenseNumber') || '',
        isGoogleVerified: Boolean(typeof pendingGoogleUser !== 'undefined' && pendingGoogleUser),
        googleUid: (typeof pendingGoogleUser !== 'undefined' && pendingGoogleUser) ? pendingGoogleUser.uid : '',
        photoURL: (typeof pendingGoogleUser !== 'undefined' && pendingGoogleUser) ? (pendingGoogleUser.photoURL || '') : ''
      };

      try {
        const endpoint = (typeof pendingGoogleUser !== 'undefined' && pendingGoogleUser) ? '/api/auth/google' : '/api/register';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(registrationPayload)
        });

        const responseText = await response.text();
        let result = {};
        try {
          result = responseText ? JSON.parse(responseText) : {};
        } catch (_) {
          throw new Error(`Server returned invalid response (${response.status}).`);
        }

        if (!response.ok) throw new Error(result.error || 'Registration failed.');

        // Backup user to Firestore if available
        if (window.PulseDB && typeof window.PulseDB.registerUserAccount === 'function') {
          try {
            await window.PulseDB.registerUserAccount(registrationPayload);
          } catch (fireErr) {
            console.warn('Firestore backup registration notice:', fireErr);
          }
        }

        if (result.token) {
          try {
            localStorage.setItem('pulse_predictor_token', result.token);
            localStorage.setItem('pulse_predictor_role', result.role || chosenRole);
            localStorage.setItem('pulse_predictor_user', JSON.stringify({
              name: result.name || registrationPayload.name || '',
              workplace: result.workplace || registrationPayload.workplace || '',
              email: result.email || registrationPayload.email || '',
              role: result.role || chosenRole,
              phone: registrationPayload.phone || '',
              abhaId: registrationPayload.abhaId || ''
            }));
          } catch (_) {}
        }

        if (regSuccessMessage) {
          regSuccessMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> Registration successful! Opening workspace...';
          regSuccessMessage.style.display = 'flex';
        }

        setTimeout(() => {
          const targetUrl = result.token ? `/index.html?token=${encodeURIComponent(result.token)}` : '/index.html';
          window.location.assign(targetUrl);
        }, 1000);

      } catch (error) {
        if (regErrorMessage) {
          regErrorMessage.textContent = error.message.includes('Failed to fetch')
            ? 'Start the local server with “node server.js” before registering.'
            : error.message;
        }
        regSubmitButton.disabled = false;
        regSubmitButton.textContent = origText;
      }
    });
  }
})();
