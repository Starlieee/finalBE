/* ════════════════════════════════════
    MOVIE BILLBOARD DATA
════════════════════════════════════ */
const movies = [
  {
    title: "ECLIPSE OF DARK",
    genre: "SCI-FI · ACTION",
    rating: "⭐ 9.1",
    cta: "Beli Tiket",
    render: () => `
      <rect width="200" height="300" fill="url(#g1)"/>
      <defs>
        <radialGradient id="g1" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#1a2a6c"/>
          <stop offset="60%" stop-color="#0d0d1f"/>
          <stop offset="100%" stop-color="#000"/>
        </radialGradient>
      </defs>
      ${Array.from({length:30}, (_,i) => `<circle cx="${(i*37+13)%200}" cy="${(i*53+7)%160}" r="${i%3==0?1.2:.6}" fill="white" opacity="${.3+.5*(i%3)/3}"/>`).join('')}
      <circle cx="100" cy="110" r="55" fill="url(#pg)"/>
      <defs>
        <radialGradient id="pg" cx="35%" cy="35%">
          <stop offset="0%" stop-color="#4a6fa5"/>
          <stop offset="100%" stop-color="#0d1b3e"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="110" rx="65" ry="18" fill="none" stroke="#fdbb2d" stroke-width="3" opacity=".7"/>
      <rect x="0" y="220" width="200" height="80" fill="url(#tb1)"/>
      <defs><linearGradient id="tb1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#000"/></linearGradient></defs>
    `
  },
  {
    title: "SCARLET STORM",
    genre: "THRILLER · DRAMA",
    rating: "⭐ 8.7",
    cta: "Beli Tiket",
    render: () => `
      <defs>
        <radialGradient id="g2" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stop-color="#8b0000"/>
          <stop offset="100%" stop-color="#0d0000"/>
        </radialGradient>
      </defs>
      <rect width="200" height="300" fill="url(#g2)"/>
      <rect x="0" y="170" width="200" height="130" fill="#0d0000"/>
      <polygon points="105,45 95,80 108,80 98,115" fill="#ff6b35" opacity=".9"/>
      <rect x="0" y="220" width="200" height="80" fill="url(#tb2)"/>
      <defs><linearGradient id="tb2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#0d0000"/></linearGradient></defs>
    `
  },
  {
    title: "NEON DYNASTY",
    genre: "ACTION · CYBERPUNK",
    rating: "⭐ 9.4",
    cta: "Beli Tiket",
    render: () => `
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000d1a"/>
          <stop offset="100%" stop-color="#001428"/>
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#g3)"/>
      <circle cx="100" cy="80" r="20" fill="#001428" stroke="#00d2ff" stroke-width="1.5"/>
      <rect x="0" y="220" width="200" height="80" fill="url(#tb3)"/>
      <defs><linearGradient id="tb3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#000d1a"/></linearGradient></defs>
    `
  },
  {
    title: "THE LAST FOREST",
    genre: "ADVENTURE · DRAMA",
    rating: "⭐ 8.9",
    cta: "Beli Tiket",
    render: () => `
      <defs>
        <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1a0a"/>
          <stop offset="100%" stop-color="#0a1f0a"/>
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#g4)"/>
      <circle cx="155" cy="45" r="22" fill="#e8f0d8" opacity=".9"/>
      <rect x="0" y="220" width="200" height="80" fill="url(#tb4)"/>
      <defs><linearGradient id="tb4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#0a1a0a"/></linearGradient></defs>
    `
  },
  {
    title: "FROZEN HORIZON",
    genre: "MYSTERY · THRILLER",
    rating: "⭐ 8.5",
    cta: "Beli Tiket",
    render: () => `
      <defs>
        <linearGradient id="g5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a0f1a"/>
          <stop offset="100%" stop-color="#0f1e30"/>
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#g5)"/>
      <polygon points="0,300 0,200 50,140 80,170 100,120 130,165 160,130 200,175 200,300" fill="#0d1e35"/>
      <rect x="0" y="220" width="200" height="80" fill="url(#tb5)"/>
      <defs><linearGradient id="tb5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#0a0f1a"/></linearGradient></defs>
    `
  }
];

/* ════════════════════════════════════
    BILLBOARD INIT
════════════════════════════════════ */
let currentSlide = 0;
let billboardTimer = null;

function initBillboard() {
  const slidesEl = document.getElementById('billboard-slides');
  const dotsEl   = document.getElementById('billboard-dots');

  movies.forEach((m, i) => {
    const slide = document.createElement('div');
    slide.className = 'billboard-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML = `
      <svg class="slide-poster-svg" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
        ${m.render()}
      </svg>
      <div class="slide-overlay"></div>
      <div class="billboard-info">
        <div class="billboard-genre">${m.genre}</div>
        <div class="billboard-title">${m.title}</div>
        <div class="billboard-cta">${m.cta}</div>
      </div>
    `;
    slidesEl.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'bdot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsEl.appendChild(dot);
  });

  document.getElementById('billboard-rating').textContent = movies[0].rating;
  billboardTimer = setInterval(nextSlide, 3500);
}

function goToSlide(idx) {
  const slides = document.querySelectorAll('.billboard-slide');
  const dots   = document.querySelectorAll('.bdot');
  const shine  = document.getElementById('billboard-shine');
  const rating = document.getElementById('billboard-rating');

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = idx;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  rating.textContent = movies[currentSlide].rating;

  shine.classList.remove('sweep');
  void shine.offsetWidth; // reflow
  shine.classList.add('sweep');

  clearInterval(billboardTimer);
  billboardTimer = setInterval(nextSlide, 3500);
}

function nextSlide() {
  goToSlide((currentSlide + 1) % movies.length);
}

initBillboard();

/* ════════════════════════════════════
    FORM LOGIC
════════════════════════════════════ */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.form-view').forEach(v => v.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('view-' + tab).classList.add('active');
  const titleEl = document.getElementById('form-title');
  const subEl   = document.getElementById('form-subtitle');
  if (tab === 'login') {
    titleEl.textContent = 'SELAMAT DATANG';
    subEl.textContent   = 'Masuk untuk melanjutkan ke platform.';
  } else {
    titleEl.textContent = 'BUAT AKUN';
    subEl.textContent   = 'Daftar gratis dan mulai berburu tiket.';
  }
  clearErrors();
}

function togglePw(id, btn) {
  const inp = document.getElementById(id);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

function setError(fieldId, msg) {
  const f = document.getElementById(fieldId);
  f.classList.add('has-error');
  if (msg) f.querySelector('.field-error').textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.field').forEach(f => f.classList.remove('has-error'));
}

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, 3500);
}

function setLoading(btnId, on) {
  document.getElementById(btnId).classList.toggle('loading', on);
}

async function apiCall(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function handleLogin() {
  clearErrors();
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-pw').value;
  let valid = true;
  if (!isEmail(email)) { setError('f-email-login'); valid = false; }
  if (!pw)              { setError('f-pw-login');    valid = false; }
  if (!valid) return;
  setLoading('btn-login', true);
  try {
    const { ok, data } = await apiCall('/api/auth/login', { email, password: pw });
    if (ok) {
      showToast('✅ Login berhasil! Mengalihkan...', 'success');
      setTimeout(() => { window.location.href = '/home.html'; }, 1200);
    } else {
      showToast('❌ ' + (data.message || 'Email atau password salah.'), 'error');
    }
  } catch (err) {
    showToast('⚠️ Tidak dapat terhubung ke server.', 'error');
  } finally {
    setLoading('btn-login', false);
  }
}

async function handleRegister() {
  clearErrors();
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pw    = document.getElementById('reg-pw').value;
  const pw2   = document.getElementById('reg-pw2').value;
  let valid = true;
  if (name.length < 3)  { setError('f-name');       valid = false; }
  if (!isEmail(email))  { setError('f-email-reg');   valid = false; }
  if (pw.length < 8)    { setError('f-pw-reg');      valid = false; }
  if (pw !== pw2)       { setError('f-pw-confirm', 'Password tidak cocok.'); valid = false; }
  if (!valid) return;
  setLoading('btn-register', true);
  try {
    const { ok, data } = await apiCall('/api/auth/register', { name, email, password: pw });
    if (ok) {
      showToast('🎉 Akun berhasil dibuat! Silakan login.', 'success');
      setTimeout(() => switchTab('login'), 1500);
    } else {
      showToast('❌ ' + (data.message || 'Registrasi gagal.'), 'error');
    }
  } catch (err) {
    showToast('⚠️ Tidak dapat terhubung ke server.', 'error');
  } finally {
    setLoading('btn-register', false);
  }
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const loginActive = document.getElementById('view-login').classList.contains('active');
  if (loginActive) handleLogin(); else handleRegister();
});