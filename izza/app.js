/* app.js - Single Page Application logic for NutriTrack MBG */

// --- STATE MANAGEMENT (With LocalStorage Persistence) ---
const STORAGE_KEYS = {
  SPPG: 'nutritrack_sppg_locations_v3',
  LAPORAN: 'nutritrack_laporan_docs_v3',
  DATASETS: 'nutritrack_datasets_queue_v3'
};

// Default datasets
const defaultSppgLocations = [
  { id: 1, name: 'SPPG Bandung Pusat', province: 'Jawa Barat', maxCapacity: 5000, activePortions: 4850, chefCount: 12, status: 'Aktif' },
  { id: 2, name: 'SPPG Surabaya 1', province: 'Jawa Timur', maxCapacity: 7500, activePortions: 7200, chefCount: 18, status: 'Aktif' },
  { id: 3, name: 'SPPG Makassar Selatan', province: 'Sulawesi Selatan', maxCapacity: 3000, activePortions: 0, chefCount: 5, status: 'Persiapan' },
  { id: 4, name: 'SPPG Medan Kota', province: 'Sumatera Utara', maxCapacity: 6000, activePortions: 5900, chefCount: 15, status: 'Aktif' },
  { id: 5, name: 'SPPG Denpasar', province: 'Bali', maxCapacity: 4000, activePortions: 3800, chefCount: 10, status: 'Aktif' },
  { id: 6, name: 'SPPG Pontianak', province: 'Kalimantan Barat', maxCapacity: 3500, activePortions: 0, chefCount: 0, status: 'Pembangunan' }
];

const defaultReports = [
  { id: 1, title: 'Laporan Gizi Nasional Bulan Mei 2026', category: 'Bulanan', date: '31 Mei 2026', size: '2.4 MB' },
  { id: 2, title: 'Evaluasi Vendor Bahan Pokok - Q1 2026', category: 'Evaluasi', date: '15 Apr 2026', size: '1.8 MB' },
  { id: 3, title: 'Distribusi Porsi MBG Jawa Barat', category: 'Wilayah', date: '10 Apr 2026', size: '3.1 MB' },
  { id: 4, title: 'Laporan Realisasi Anggaran Maret 2026', category: 'Keuangan', date: '05 Apr 2026', size: '1.2 MB' },
  { id: 5, title: 'Status Pemenuhan Standar Kalori Q1', category: 'Gizi', date: '02 Apr 2026', size: '4.5 MB' }
];

const defaultDatasets = [
  { id: 1, name: 'Dataset_Makanan_Jat', type: 'Makanan', sender: 'Budi (Relawan)', date: '07 Mei 2026', status: 'Valid' },
  { id: 2, name: 'Data_SPPG_Jatim_Fin', type: 'Lokasi SPPG', sender: 'Dinas Jatim', date: '06 Mei 2026', status: 'Menunggu' },
  { id: 3, name: 'https://docs.google.cc', type: 'Standar Gizi', sender: 'Tim Gizi Pusat', date: '05 Mei 2026', status: 'Perlu Perbaikan' },
  { id: 4, name: 'Harga_Pangan_Nasior', type: 'Data Pangan', sender: 'Sistem BPS', date: '04 Mei 2026', status: 'Valid' }
];

const eduModules = [
  {
    id: 1,
    type: 'Artikel',
    category: 'Gizi',
    tag: 'PANDUAN GIZI',
    title: 'Standar Porsi Makanan Anak Sekolah (SD)',
    desc: 'Memahami porsi yang tepat untuk karbohidrat, protein, dan serat pada anak sesuai kelompok umur sekolah dasar.',
    image: 'assets/sd_portions.png'
  },
  {
    id: 2,
    type: 'Video',
    category: 'Operasional',
    tag: 'OPERASIONAL',
    title: 'SOP Manajemen Dapur Massal SPPG',
    desc: 'Video instruksional cara menjaga kebersihan, sanitasi, dan alur kerja yang higienis di dapur skala besar.',
    image: 'assets/mass_kitchen.png',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 3,
    type: 'Artikel',
    category: 'Gizi',
    tag: 'PANDUAN GIZI',
    title: 'Mengenal Piramida Gizi Seimbang MBG',
    desc: 'Implementasi Pedoman Gizi Seimbang yang diterapkan secara nasional untuk program Makan Bergizi Gratis.',
    image: 'assets/nutrition_pyramid.png'
  },
  {
    id: 4,
    type: 'Artikel',
    category: 'Keamanan',
    tag: 'KEAMANAN PANGAN',
    title: 'SOP Sanitasi dan Higiene Dapur SPPG',
    desc: 'Pedoman lengkap sterilisasi peralatan dapur, kebersihan koki, dan penanganan higienis bahan makanan basah.',
    image: 'assets/food_safety.png'
  }
];

// Helper to get from localstorage or use default
function getStoredData(key, fallback) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

// State
let sppgLocations = getStoredData(STORAGE_KEYS.SPPG, defaultSppgLocations);
let reports = getStoredData(STORAGE_KEYS.LAPORAN, defaultReports);
let datasets = getStoredData(STORAGE_KEYS.DATASETS, defaultDatasets);

// Current selected tab category in Edukasi
let activeEduCategory = 'Semua';

// --- ROUTING SHELL CONTROLLER ---
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initToast();
  
  // Render default page content
  renderSppgGrid();
  renderLaporanTable();
  renderEdukasiGrid();
  renderPusatDataTable();
  updateStatsCounters();

  // Setup modal handlers
  initSppgModal();
  initUploadModal();
  initPreviewModal();
});

// Routing implementation
function initRouter() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.view-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      
      // Update Navbar layout
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Update active view panel
      panels.forEach(panel => {
        panel.style.display = 'none';
      });

      const targetPanel = document.getElementById(`view-${targetTab}`);
      if (targetPanel) {
        targetPanel.style.display = 'block';
        
        // Trigger specific view refresh or setups if needed
        if (targetTab === 'lokasi') renderSppgGrid();
        if (targetTab === 'laporan') renderLaporanTable();
        if (targetTab === 'edukasi') renderEdukasiGrid();
        if (targetTab === 'pusatdata') renderPusatDataTable();
      }
    });
  });
}

// --- STATS COUNT UPDATERS ---
function updateStatsCounters() {
  // Lokasi SPPG Stats — angka fixed sesuai desain (1,248 / 1,092 / 3.5 Juta)
  // 6 kartu yang tampil adalah sampel representatif; total sistem jauh lebih besar
  const BASE_TOTAL_SPPG = 1248;
  const BASE_AKTIF_SPPG = 1092;

  // Delta dari SPPG baru yang ditambahkan user (di luar 6 default)
  const extraSppg  = Math.max(0, sppgLocations.length - 6);
  const extraAktif = Math.max(0, sppgLocations.filter(loc => loc.status === 'Aktif').length - 4);

  document.getElementById('stat-total-sppg').innerText  = (BASE_TOTAL_SPPG + extraSppg).toLocaleString();
  document.getElementById('stat-aktif-sppg').innerText  = (BASE_AKTIF_SPPG + extraAktif).toLocaleString();
  document.getElementById('stat-kapasitas-sppg').innerText = '3.5 Juta';

  // Pusat Data Stats — angka fixed sesuai desain (128/12/94/18/4) sebagai nilai sistem
  // Antrean tabel hanya menampilkan entri visible, sisanya adalah data sistem background
  const BASE_TOTAL = 128;
  const BASE_MENUNGGU = 12;
  const BASE_VALID = 94;
  const BASE_PERBAIKAN = 18;
  const BASE_DITOLAK = 4;

  // Hitung delta dari entri baru yang ditambahkan user (di luar 4 default)
  const extraDatasets = Math.max(0, datasets.length - 4);
  const extraValid = Math.max(0, datasets.filter(d => d.status === 'Valid').length - 2);
  const extraMenunggu = Math.max(0, datasets.filter(d => d.status === 'Menunggu').length - 1);

  document.getElementById('pd-stat-total').innerText = (BASE_TOTAL + extraDatasets).toLocaleString();
  document.getElementById('pd-stat-menunggu').innerText = (BASE_MENUNGGU + extraMenunggu).toLocaleString();
  document.getElementById('pd-stat-valid').innerText = (BASE_VALID + extraValid).toLocaleString();
  document.getElementById('pd-stat-perbaikan').innerText = BASE_PERBAIKAN;
  document.getElementById('pd-stat-ditolak').innerText = BASE_DITOLAK;
}


// --- TOAST NOTIFICATIONS ---
let toastContainer;
function initToast() {
  toastContainer = document.getElementById('toast-container');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderLeftColor = '#c5221f';
    toast.style.backgroundColor = '#1e293b';
  }
  
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after 3.5 seconds
  setTimeout(() => {
    toast.style.animation = 'toast-in 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// --- LOKASI SPPG MODULE ---
const sppgGrid = document.getElementById('sppg-grid-container');
const sppgSearch = document.getElementById('search-sppg');

sppgSearch.addEventListener('input', () => {
  renderSppgGrid(sppgSearch.value);
});

// Setup dynamic inline filter toggle for SPPG
const filterSppgBtn = document.getElementById('btn-filter-sppg');
let currentSppgFilter = 'Semua';
filterSppgBtn.addEventListener('click', () => {
  const filters = ['Semua', 'Aktif', 'Persiapan', 'Pembangunan'];
  const currentIndex = filters.indexOf(currentSppgFilter);
  currentSppgFilter = filters[(currentIndex + 1) % filters.length];
  
  filterSppgBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
    Status: ${currentSppgFilter}
  `;
  renderSppgGrid(sppgSearch.value);
  showToast(`Menampilkan SPPG dengan status: ${currentSppgFilter}`);
});

function renderSppgGrid(searchQuery = '') {
  sppgGrid.innerHTML = '';
  
  const query = searchQuery.toLowerCase().trim();
  
  const filtered = sppgLocations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(query) || loc.province.toLowerCase().includes(query);
    const matchesStatus = currentSppgFilter === 'Semua' || loc.status === currentSppgFilter;
    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    sppgGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        Tidak menemukan lokasi SPPG yang cocok.
      </div>
    `;
    return;
  }

  filtered.forEach(loc => {
    let badgeClass = 'badge-active';
    if (loc.status === 'Persiapan') badgeClass = 'badge-prep';
    if (loc.status === 'Pembangunan') badgeClass = 'badge-build';

    const card = document.createElement('div');
    card.className = 'sp-card';
    card.innerHTML = `
      <div class="sp-card-header">
        <div class="sp-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/></svg>
        </div>
        <span class="badge ${badgeClass}">${loc.status}</span>
      </div>
      
      <div class="sp-title-area">
        <h3 class="sp-name">${loc.name}</h3>
        <div class="sp-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${loc.province}
        </div>
      </div>
      
      <div class="sp-details-list">
        <div class="sp-detail-row">
          <span class="sp-detail-label">Kapasitas Maksimal</span>
          <span class="sp-detail-val">${loc.maxCapacity.toLocaleString()} Porsi</span>
        </div>
        <div class="sp-detail-row">
          <span class="sp-detail-label">Porsi Aktif</span>
          <span class="sp-detail-val">${loc.activePortions.toLocaleString()} Porsi</span>
        </div>
        <div class="sp-detail-row">
          <span class="sp-detail-label">Tenaga Koki</span>
          <span class="sp-detail-val">${loc.chefCount.toLocaleString()} Orang</span>
        </div>
      </div>
    `;
    sppgGrid.appendChild(card);
  });
}

function initSppgModal() {
  const modal = document.getElementById('modal-tambah-sppg');
  const btnTambah = document.getElementById('btn-tambah-lokasi');
  const btnClose = document.getElementById('close-modal-sppg');
  const btnCancel = document.getElementById('cancel-modal-sppg');
  const form = document.getElementById('form-sppg');

  const openModal = () => modal.classList.add('open');
  const closeModal = () => {
    modal.classList.remove('open');
    form.reset();
  };

  btnTambah.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newLoc = {
      id: Date.now(),
      name: document.getElementById('input-sppg-nama').value,
      province: document.getElementById('input-sppg-provinsi').value,
      maxCapacity: parseInt(document.getElementById('input-sppg-kapasitas').value) || 0,
      activePortions: parseInt(document.getElementById('input-sppg-aktif').value) || 0,
      chefCount: parseInt(document.getElementById('input-sppg-koki').value) || 0,
      status: document.getElementById('input-sppg-status').value
    };

    sppgLocations.unshift(newLoc);
    localStorage.setItem(STORAGE_KEYS.SPPG, JSON.stringify(sppgLocations));
    
    renderSppgGrid();
    updateStatsCounters();
    closeModal();
    showToast(`Lokasi SPPG "${newLoc.name}" berhasil ditambahkan!`);
  });
}


// --- PUSAT LAPORAN MODULE ---
const laporanTableBody = document.getElementById('laporan-table-body');

// Setup Filter Cycle for Laporan Categories
const filterLaporanBtn = document.getElementById('btn-filter-laporan');
let currentLaporanCategory = 'Semua';
filterLaporanBtn.addEventListener('click', () => {
  const categories = ['Semua', 'Bulanan', 'Evaluasi', 'Wilayah', 'Keuangan', 'Gizi'];
  const currentIndex = categories.indexOf(currentLaporanCategory);
  currentLaporanCategory = categories[(currentIndex + 1) % categories.length];

  filterLaporanBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
    Kategori: ${currentLaporanCategory}
  `;
  renderLaporanTable();
  showToast(`Menampilkan kategori laporan: ${currentLaporanCategory}`);
});

// Period Filter Mock Action
const periodLaporanBtn = document.getElementById('btn-periode-laporan');
periodLaporanBtn.addEventListener('click', () => {
  showToast("Filter periode aktif: 3 bulan terakhir");
});

function renderLaporanTable() {
  laporanTableBody.innerHTML = '';
  
  const filtered = reports.filter(rep => {
    return currentLaporanCategory === 'Semua' || rep.category === currentLaporanCategory;
  });

  if (filtered.length === 0) {
    laporanTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px;">
          Tidak ada laporan di kategori ini.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(rep => {
    const badgeClass = `badge-${rep.category.toLowerCase()}`;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="doc-title-cell">
          <div class="doc-icon-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          ${rep.title}
        </div>
      </td>
      <td><span class="badge ${badgeClass}">${rep.category}</span></td>
      <td>${rep.date}</td>
      <td>${rep.size}</td>
      <td>
        <div class="table-actions">
          <button class="action-icon-btn view-btn" data-id="${rep.id}" title="Pratinjau Laporan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="action-icon-btn download-btn" data-title="${rep.title}" title="Unduh PDF">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </div>
      </td>
    `;
    
    // Bind action listeners
    row.querySelector('.view-btn').addEventListener('click', () => {
      openReportPreview(rep);
    });

    row.querySelector('.download-btn').addEventListener('click', () => {
      downloadFile(rep.title);
    });

    laporanTableBody.appendChild(row);
  });
}

function openReportPreview(report) {
  // Simply alert/show modal representation for report content
  const previewModal = document.getElementById('modal-preview-dataset');
  const title = document.getElementById('preview-dataset-title');
  const sender = document.getElementById('preview-dataset-sender');
  const date = document.getElementById('preview-dataset-date');
  const status = document.getElementById('preview-dataset-status');
  const headersRow = document.getElementById('preview-dataset-headers');
  const rowsBody = document.getElementById('preview-dataset-rows');
  const importBtn = document.getElementById('btn-import-from-preview');

  title.innerText = `Pratinjau: ${report.title}`;
  sender.innerText = 'Sistem NutriTrack';
  date.innerText = report.date;
  status.innerHTML = `<span class="badge badge-active">Publik</span>`;
  importBtn.style.display = 'none'; // hide import action since this is a public report

  // Mock report table metrics
  headersRow.innerHTML = `
    <th>Metrik Program</th>
    <th>Nilai Realisasi</th>
    <th>Target Kementerian</th>
    <th>Status Capaian</th>
  `;

  rowsBody.innerHTML = `
    <tr>
      <td>Kepatuhan Menu Standar</td>
      <td>97.8%</td>
      <td>95.0%</td>
      <td><span class="badge badge-active">Tercapai</span></td>
    </tr>
    <tr>
      <td>Ketepatan Distribusi Jam Makan</td>
      <td>94.2%</td>
      <td>90.0%</td>
      <td><span class="badge badge-active">Tercapai</span></td>
    </tr>
    <tr>
      <td>Kebersihan Sampel Dapur</td>
      <td>100% (A)</td>
      <td>100%</td>
      <td><span class="badge badge-active">Tercapai</span></td>
    </tr>
    <tr>
      <td>Total Penerima Manfaat Gizi</td>
      <td>3.58 Juta Siswa</td>
      <td>3.50 Juta Siswa</td>
      <td><span class="badge badge-active">Tercapai</span></td>
    </tr>
  `;

  previewModal.classList.add('open');
}

function downloadFile(filename) {
  showToast(`Mempersiapkan dokumen: ${filename}...`);
  setTimeout(() => {
    // Generate text representation file download
    const element = document.createElement('a');
    const file = new Blob([`NutriTrack Laporan MBG\n\nJudul: ${filename}\nStatus: Dokumen Validasi Final Kemenkes\nTanggal Rilis: 2026\n\nLaporan ini disimulasikan dan diunduh dari aplikasi visualisasi NutriTrack.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${filename.replace(/\s+/g, '_')}_Final.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast("Dokumen berhasil diunduh!", "success");
  }, 1000);
}


// --- MODUL EDUKASI & SOP MODULE ---
const eduGrid = document.getElementById('edukasi-grid-container');
const eduTabs = document.querySelectorAll('.edu-tab');

eduTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    eduTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeEduCategory = tab.getAttribute('data-category');
    renderEdukasiGrid();
  });
});

function renderEdukasiGrid() {
  eduGrid.innerHTML = '';
  
  const filtered = eduModules.filter(mod => {
    if (activeEduCategory === 'Semua') return true;
    if (activeEduCategory === 'Video') return mod.type === 'Video';
    return mod.category === activeEduCategory;
  });

  if (filtered.length === 0) {
    eduGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        Belum ada materi edukasi di kategori ini.
      </div>
    `;
    return;
  }

  filtered.forEach(mod => {
    const isVideo = mod.type === 'Video';
    const mediaBadgeIcon = isVideo 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>` 
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

    const card = document.createElement('div');
    card.className = 'edu-card';
    card.innerHTML = `
      <div class="edu-media">
        <img src="${mod.image}" alt="${mod.title}">
        <div class="edu-media-badge">
          ${mediaBadgeIcon}
          ${mod.type}
        </div>
        ${isVideo ? `
          <div class="video-play-overlay">
            <div class="play-btn-circle">
              <!-- Play Arrow SVG -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
        ` : ''}
      </div>
      
      <div class="edu-content">
        <span class="edu-card-tag">${mod.tag}</span>
        <h3 class="edu-card-title">${mod.title}</h3>
        <p class="edu-card-desc">${mod.desc}</p>
        <a href="#" class="edu-card-link">
          Pelajari selengkapnya
          <!-- Chevron Right -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>
    `;

    // Click handler for learn more or playing mock video
    card.addEventListener('click', (e) => {
      e.preventDefault();
      if (isVideo) {
        openVideoModal(mod);
      } else {
        openArticleModal(mod);
      }
    });

    eduGrid.appendChild(card);
  });
}

function openVideoModal(videoItem) {
  const previewModal = document.getElementById('modal-preview-dataset');
  const title = document.getElementById('preview-dataset-title');
  const sender = document.getElementById('preview-dataset-sender');
  const date = document.getElementById('preview-dataset-date');
  const status = document.getElementById('preview-dataset-status');
  const headersRow = document.getElementById('preview-dataset-headers');
  const rowsBody = document.getElementById('preview-dataset-rows');
  const importBtn = document.getElementById('btn-import-from-preview');

  title.innerText = videoItem.title;
  sender.innerText = 'Dapur Pelatihan';
  date.innerText = 'Mei 2026';
  status.innerHTML = `<span class="badge badge-active">Video SOP</span>`;
  importBtn.style.display = 'none';

  headersRow.innerHTML = '';
  rowsBody.innerHTML = `
    <div style="text-align: center; padding: 10px 0;">
      <video width="100%" height="auto" controls style="border-radius: 8px;">
        <source src="${videoItem.videoUrl}" type="video/mp4">
        Browser Anda tidak mendukung pemutar video.
      </video>
      <p style="margin-top: 10px; font-size: 13px; color: var(--text-muted); text-align: left; line-height: 1.5;">
        Video ini mendemonstrasikan kepatuhan standar higienitas meliputi pemakaian celemek, pencucian bahan pokok mengalir, dan proses packing makanan box tahan panas (bPA-free) untuk menjaga kesegaran menu hingga ke tangan anak didik.
      </p>
    </div>
  `;

  previewModal.classList.add('open');
}

function openArticleModal(articleItem) {
  const previewModal = document.getElementById('modal-preview-dataset');
  const title = document.getElementById('preview-dataset-title');
  const sender = document.getElementById('preview-dataset-sender');
  const date = document.getElementById('preview-dataset-date');
  const status = document.getElementById('preview-dataset-status');
  const headersRow = document.getElementById('preview-dataset-headers');
  const rowsBody = document.getElementById('preview-dataset-rows');
  const importBtn = document.getElementById('btn-import-from-preview');

  title.innerText = articleItem.title;
  sender.innerText = 'Tim Gizi Nasional';
  date.innerText = 'Juni 2026';
  status.innerHTML = `<span class="badge badge-active">Materi Edukasi</span>`;
  importBtn.style.display = 'none';

  headersRow.innerHTML = '';
  rowsBody.innerHTML = `
    <div style="font-size: 14px; line-height: 1.6; color: var(--text-main); text-align: justify; max-height: 350px; overflow-y: auto; padding-right: 8px;">
      <p style="margin-bottom: 12px;"><b>Standar Porsi Makanan Harian Program Makan Bergizi Gratis:</b></p>
      <ul style="margin-left: 20px; margin-bottom: 16px;">
        <li><b>Karbohidrat:</b> Nasi putih/merah atau kentang, porsi rata-rata 120-150 gram per saji.</li>
        <li><b>Protein Hewani:</b> Ayam panggang, daging sapi semur, atau telur dadar tebal, porsi 60-80 gram.</li>
        <li><b>Protein Nabati:</b> Tempe bacem atau tahu goreng garing, porsi 40 gram.</li>
        <li><b>Serat (Sayuran):</b> Tumis brokoli-wortel atau sup sayur bening, porsi 80-100 gram.</li>
        <li><b>Tambahan:</b> Buah potong segar (Pisang atau Pepaya) serta air mineral gelas.</li>
      </ul>
      <p style="margin-bottom: 12px;">Penyusunan ini dibuat demi memenuhi kecukupan kalori harian minimal 750-900 kkal untuk anak usia sekolah dasar sebagai bekal konsentrasi belajar yang prima.</p>
    </div>
  `;

  previewModal.classList.add('open');
}


// --- PUSAT DATA MASUK MODULE ---
const datasetTableBody = document.getElementById('pusatdata-table-body');

function renderPusatDataTable() {
  datasetTableBody.innerHTML = '';
  
  if (datasets.length === 0) {
    datasetTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px;">
          Antrean dataset kosong.
        </td>
      </tr>
    `;
    return;
  }

  datasets.forEach(d => {
    let badgeClass = 'badge-active';
    if (d.status === 'Menunggu') badgeClass = 'badge-prep';
    if (d.status === 'Perlu Perbaikan') badgeClass = 'badge-rejected';
    
    // Choose icon based on file type
    const isLink = d.name.startsWith('http');
    const docIconColorClass = isLink ? 'blue' : 'yellow';
    const docIconSvg = isLink
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

    const showImportButton = d.status === 'Valid';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="doc-title-cell">
          <div class="doc-icon-box ${docIconColorClass}">
            ${docIconSvg}
          </div>
          <span style="font-weight: 600; color: var(--primary);" title="${d.name}">
            ${d.name}
          </span>
        </div>
      </td>
      <td>${d.type}</td>
      <td>${d.sender}</td>
      <td>${d.date}</td>
      <td><span class="badge ${badgeClass}">${d.status}</span></td>
      <td>
        <div class="table-actions" style="align-items: center;">
          <button class="action-text-btn preview-data-btn" data-id="${d.id}" style="font-weight: 600; color: #1e293b;">Preview</button>
          ${showImportButton ? `
            <button class="action-btn-import import-data-btn" data-id="${d.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right: 2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Import
            </button>
          ` : ''}
        </div>
      </td>
    `;

    // Action listener
    row.querySelector('.preview-data-btn').addEventListener('click', () => {
      openDatasetPreview(d);
    });

    if (showImportButton) {
      row.querySelector('.import-data-btn').addEventListener('click', () => {
        importDataset(d.id, d.name);
      });
    }

    datasetTableBody.appendChild(row);
  });
}

function importDataset(id, name) {
  showToast(`Mengimpor dataset "${name}"...`);
  setTimeout(() => {
    // Update statuses or remove imported dataset
    datasets = datasets.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
    
    // Add mock location or update overall counters
    if (name.includes('SPPG')) {
      sppgLocations.push({
        id: Date.now(),
        name: 'SPPG Semarang Barat (Imported)',
        province: 'Jawa Tengah',
        maxCapacity: 4500,
        activePortions: 4300,
        chefCount: 11,
        status: 'Aktif'
      });
      localStorage.setItem(STORAGE_KEYS.SPPG, JSON.stringify(sppgLocations));
    }

    renderPusatDataTable();
    renderSppgGrid();
    updateStatsCounters();
    showToast(`Dataset "${name}" berhasil diintegrasikan ke sistem utama!`);
  }, 1000);
}

function openDatasetPreview(dataset) {
  const previewModal = document.getElementById('modal-preview-dataset');
  const title = document.getElementById('preview-dataset-title');
  const sender = document.getElementById('preview-dataset-sender');
  const date = document.getElementById('preview-dataset-date');
  const status = document.getElementById('preview-dataset-status');
  const headersRow = document.getElementById('preview-dataset-headers');
  const rowsBody = document.getElementById('preview-dataset-rows');
  const importBtn = document.getElementById('btn-import-from-preview');

  title.innerText = `Pratinjau Dataset: ${dataset.name}`;
  sender.innerText = dataset.sender;
  date.innerText = dataset.date;

  let badgeClass = 'badge-active';
  if (dataset.status === 'Menunggu') badgeClass = 'badge-prep';
  if (dataset.status === 'Perlu Perbaikan') badgeClass = 'badge-rejected';
  status.innerHTML = `<span class="badge ${badgeClass}">${dataset.status}</span>`;

  // Dynamic Import Button visibility
  if (dataset.status === 'Valid') {
    importBtn.style.display = 'block';
    importBtn.onclick = () => {
      previewModal.classList.remove('open');
      importDataset(dataset.id, dataset.name);
    };
  } else {
    importBtn.style.display = 'none';
  }

  // Define column headers based on type
  if (dataset.type === 'Makanan') {
    headersRow.innerHTML = `
      <th>Bahan Makanan</th>
      <th>Energi (Kkal)</th>
      <th>Protein (g)</th>
      <th>Karbohidrat (g)</th>
      <th>Lemak (g)</th>
    `;
    rowsBody.innerHTML = `
      <tr><td>Nasi Putih Premium</td><td>130</td><td>2.7</td><td>28.0</td><td>0.3</td></tr>
      <tr><td>Daging Sapi Has Luar</td><td>250</td><td>26.0</td><td>0.0</td><td>15.0</td></tr>
      <tr><td>Brokoli Hijau Segar</td><td>34</td><td>2.8</td><td>6.6</td><td>0.4</td></tr>
      <tr><td>Tempe Kedelai Murni</td><td>193</td><td>19.0</td><td>9.0</td><td>11.0</td></tr>
    `;
  } else if (dataset.type === 'Lokasi SPPG') {
    headersRow.innerHTML = `
      <th>Nama Lokasi</th>
      <th>Wilayah / Prov</th>
      <th>Kapasitas</th>
      <th>Koki</th>
      <th>Status Usulan</th>
    `;
    rowsBody.innerHTML = `
      <tr><td>SPPG Semarang Barat</td><td>Jawa Tengah</td><td>4,500 Porsi</td><td>11 koki</td><td>Siap Aktif</td></tr>
      <tr><td>SPPG Malang Kota</td><td>Jawa Timur</td><td>3,800 Porsi</td><td>8 koki</td><td>Menunggu Review</td></tr>
      <tr><td>SPPG Balikpapan</td><td>Kalimantan Timur</td><td>2,500 Porsi</td><td>5 koki</td><td>Draf Proposal</td></tr>
    `;
  } else {
    headersRow.innerHTML = `
      <th>Kolom Parameter</th>
      <th>Nilai Entri</th>
      <th>Kesesuaian Validasi</th>
    `;
    rowsBody.innerHTML = `
      <tr><td>Rerata Harga Beras</td><td>Rp14.800/kg</td><td><span class="badge badge-active">Sesuai HET</span></td></tr>
      <tr><td>Rerata Harga Telur</td><td>Rp28.500/kg</td><td><span class="badge badge-active">Sesuai Pasar</span></td></tr>
      <tr><td>Rerata Harga Minyak</td><td>Rp18.200/lt</td><td><span class="badge badge-prep">Tinggi</span></td></tr>
    `;
  }

  previewModal.classList.add('open');
}

function initPreviewModal() {
  const modal = document.getElementById('modal-preview-dataset');
  const btnClose = document.getElementById('close-modal-preview');
  const btnCloseFooter = document.getElementById('close-preview-footer');

  const closeModal = () => modal.classList.remove('open');
  
  btnClose.addEventListener('click', closeModal);
  btnCloseFooter.addEventListener('click', closeModal);
}

function initUploadModal() {
  const modal = document.getElementById('modal-upload');
  const btnUpload = document.getElementById('btn-upload-dataset');
  const btnClose = document.getElementById('close-modal-upload');
  const btnCancel = document.getElementById('cancel-modal-upload');
  const form = document.getElementById('form-upload');
  const submitBtn = document.getElementById('btn-submit-upload');

  // Drag & Drop
  const dragDropArea = document.getElementById('drag-drop-area');
  const fileInput = document.getElementById('file-input');
  const dragDropFilename = document.getElementById('drag-drop-filename');

  let selectedFile = null;

  const openModal = () => modal.classList.add('open');
  const closeModal = () => {
    modal.classList.remove('open');
    form.reset();
    selectedFile = null;
    dragDropFilename.innerText = "Tarik file ke sini atau klik untuk mencari";
    submitBtn.disabled = true;
  };

  btnUpload.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  // File search trigger
  dragDropArea.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      selectedFile = e.target.files[0];
      dragDropFilename.innerHTML = `File terpilih: <b>${selectedFile.name}</b> (${(selectedFile.size/1024/1024).toFixed(2)} MB)`;
      submitBtn.disabled = false;
    }
  });

  // Drag over effects
  dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = 'var(--accent-blue)';
  });

  dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.style.borderColor = 'var(--border-color)';
  });

  dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
      dragDropFilename.innerHTML = `File terpilih: <b>${selectedFile.name}</b> (${(selectedFile.size/1024/1024).toFixed(2)} MB)`;
      submitBtn.disabled = false;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newDataset = {
      id: Date.now(),
      name: selectedFile.name,
      type: document.getElementById('upload-jenis').value,
      sender: document.getElementById('upload-pengirim').value,
      date: 'Hari ini',
      status: 'Valid' // default uploaded by admin is Valid for testing imports
    };

    datasets.unshift(newDataset);
    localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
    
    renderPusatDataTable();
    updateStatsCounters();
    closeModal();
    showToast(`Dataset "${newDataset.name}" berhasil diunggah!`);
  });

  // Mock Input Link Button
  const btnInputLink = document.getElementById('btn-input-link');
  btnInputLink.addEventListener('click', () => {
    const link = prompt("Masukkan Link Google Sheet / Excel Online:");
    if (link && link.trim() !== "") {
      const newDataset = {
        id: Date.now(),
        name: link.length > 30 ? link.substring(0, 30) + '...' : link,
        type: 'Makanan',
        sender: 'Admin Kemenkes',
        date: 'Hari ini',
        status: 'Valid'
      };
      
      datasets.unshift(newDataset);
      localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
      
      renderPusatDataTable();
      updateStatsCounters();
      showToast("Tautan dataset berhasil direferensikan!");
    }
  });
}
