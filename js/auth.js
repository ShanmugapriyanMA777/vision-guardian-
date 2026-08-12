// VisionAssist Guardian Portal - Authentication Module

document.addEventListener('DOMContentLoaded', () => {
  initAuthUI();
  checkAuthSession();
});

function initAuthUI() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const logoutBtn = document.getElementById('logout-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const authMsg = document.getElementById('auth-message');

      if (authMsg) authMsg.textContent = 'Logging in...';

      if (isDemoMode()) {
        localStorage.setItem('vg_guardian_user', JSON.stringify({ name: 'Dr. Sarah Connor', email }));
        window.location.href = 'dashboard.html';
        return;
      }

      const client = getSupabase();
      if (!client) return;

      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        if (authMsg) authMsg.textContent = `Error: ${error.message}`;
      } else {
        localStorage.setItem('vg_guardian_user', JSON.stringify({ name: data.user.email.split('@')[0], email: data.user.email }));
        window.location.href = 'dashboard.html';
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const authMsg = document.getElementById('auth-message');

      if (authMsg) authMsg.textContent = 'Registering guardian account...';

      if (isDemoMode()) {
        localStorage.setItem('vg_guardian_user', JSON.stringify({ name, email }));
        window.location.href = 'dashboard.html';
        return;
      }

      const client = getSupabase();
      if (!client) return;

      const { data, error } = await client.auth.signUp({ email, password, options: { data: { name } } });
      if (error) {
        if (authMsg) authMsg.textContent = `Registration error: ${error.message}`;
      } else {
        if (authMsg) authMsg.textContent = 'Account created successfully! Redirecting...';
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const client = getSupabase();
      if (client && !isDemoMode()) {
        await client.auth.signOut();
      }
      localStorage.removeItem('vg_guardian_user');
      window.location.href = 'login.html';
    });
  }
}

function checkAuthSession() {
  const currentPage = window.location.pathname.split('/').pop();
  const publicPages = ['index.html', 'login.html', ''];
  const user = localStorage.getItem('vg_guardian_user');

  if (!publicPages.includes(currentPage) && !user && !isDemoMode()) {
    window.location.href = 'login.html';
  }

  // Update guardian name in header if logged in
  if (user) {
    const guardianObj = JSON.parse(user);
    const nameEl = document.getElementById('guardian-name-display');
    if (nameEl) nameEl.textContent = guardianObj.name || 'Guardian';
  }
}
