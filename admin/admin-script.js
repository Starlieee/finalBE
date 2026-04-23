/* DATA AWAL */
let events = [
  { id:1, name:'Neon Dynasty Tour', artist:'DJ Nexus', date:'2025-08-15', venue:'Jakarta Arena', cap:600, sold:521, price:350000, status:'active' },
  { id:2, name:'Scarlet Storm Fest', artist:'Red Wolves', date:'2025-09-02', venue:'Bandung Sport', cap:400, sold:400, price:200000, status:'sold' },
  { id:3, name:'Frozen Horizon', artist:'Arctic Pulse', date:'2025-10-10', venue:'Surabaya Conv.', cap:800, sold:230, price:450000, status:'soon' },
  { id:4, name:'Eclipse of Dark', artist:'Void Syndicate', date:'2025-07-20', venue:'GBK Jakarta', cap:5000, sold:3780, price:750000, status:'active' },
];

const orders = [
  { id:'TW-00421', buyer:'Andi Saputra', event:'Neon Dynasty Tour', seat:'B-07', total:350000, method:'VA BCA', status:'success', time:'5 mnt lalu' },
  { id:'TW-00420', buyer:'Siti Rahayu', event:'Scarlet Storm Fest', seat:'A-12', total:200000, method:'GoPay', status:'success', time:'12 mnt lalu' },
];

const activity = [
  { color:'#4dffb8', text:'Tiket <em>Neon Dynasty</em> B-07 terjual ke Andi S.', time:'5 mnt' },
  { color:'#f0c040', text:'User mengunci kursi <em>C-09</em> Frozen Horizon', time:'8 mnt' },
];

const ROWS = ['A','B','C','D','E','F','G','H'];
const COLS = 12;

let editingId = null;
let deletingId = null;
let seatStates = [];

/* NAVIGASI */
function navigate(viewId, el) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-'+viewId).classList.add('active');
  if (el) el.classList.add('active');

  const titles = {
    dashboard:'DASHBOARD <span>ADMIN</span>',
    events:'KELOLA <span>EVENT</span>',
    seats:'STATUS <span>KURSI</span>',
    orders:'DAFTAR <span>PESANAN</span>',
    reports:'LAPORAN <span>PENJUALAN</span>',
    settings:'PENGATURAN <span>SISTEM</span>'
  };
  document.getElementById('topbar-title').innerHTML = titles[viewId];
  
  if (viewId === 'events') renderEvents();
  if (viewId === 'seats') renderSeatMap();
  if (viewId === 'orders') renderOrders();
  if (viewId === 'reports') renderReports();
}

/* RENDER FUNGSI */
function renderEvents() {
  const tbody = document.getElementById('event-tbody');
  tbody.innerHTML = events.map(e => `
    <tr>
      <td><div class="event-name">${e.name}</div><div class="event-artist">${e.artist}</div></td>
      <td>${e.date}</td>
      <td>${e.venue}</td>
      <td>${e.cap}</td>
      <td>${e.sold}/${e.cap}</td>
      <td>Rp ${e.price.toLocaleString()}</td>
      <td><span class="badge ${e.status === 'active' ? 'badge-active' : 'badge-sold'}">${e.status}</span></td>
      <td>
        <button class="btn-icon" onclick="openEditModal(${e.id})">✏️</button>
        <button class="btn-icon danger" onclick="askDelete(${e.id}, '${e.name}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function renderOrders() {
  const tbody = document.getElementById('order-tbody');
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.buyer}</td>
      <td>${o.event}</td>
      <td>${o.seat}</td>
      <td>Rp ${o.total.toLocaleString()}</td>
      <td>${o.method}</td>
      <td>${o.status}</td>
      <td>${o.time}</td>
    </tr>
  `).join('');
}

/* MODAL LOGIC */
function openModal() {
  editingId = null;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function saveEvent() {
  const name = document.getElementById('m-name').value;
  if(!name) return showToast('Nama wajib diisi', 'error');
  
  showToast('✅ Berhasil disimpan', 'success');
  closeModal();
}

/* SEAT MAP LOGIC */
function renderSeatMap() {
  const grid = document.getElementById('seat-grid');
  grid.innerHTML = '';
  ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'seat-row';
    for(let i=1; i<=COLS; i++) {
      const btn = document.createElement('button');
      btn.className = 'seat available';
      rowEl.appendChild(btn);
    }
    grid.appendChild(rowEl);
  });
}

/* TOAST */
function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show ' + type;
  setTimeout(() => t.className = '', 3000);
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  document.getElementById('topbar-date').textContent = now.toLocaleDateString('id-ID');
  
  // Render Dashboard
  const feed = document.getElementById('activity-feed');
  if(feed) {
    feed.innerHTML = activity.map(a => `
      <div class="activity-item">
        <div class="activity-dot" style="background:${a.color}"></div>
        <div class="activity-text">${a.text}</div>
        <span class="activity-time">${a.time}</span>
      </div>
    `).join('');
  }
});