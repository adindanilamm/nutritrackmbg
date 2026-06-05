// NutriTrack MBG - Application Logic Controller (JS)

// --- STATE MANAGEMENT ---
let currentView = 'dashboard';
let charts = {}; // Chart.js instances storage

// Food Explorer Table State
let tableState = {
  searchQuery: '',
  category: 'Semua',
  quickFilter: null, // 'Tinggi Protein' | 'Rendah Kalori' | null
  currentPage: 1,
  itemsPerPage: 7
};

// Menu Simulator State
let simulatorState = {
  selectedItems: [], // Array of { foodId: Number, qtyGrams: Number }
  category: 'Semua',
  searchQuery: ''
};

// Target Nutrition values for Simulator
const SIM_TARGETS = {
  calories: 600,
  protein: 15
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Initial navigation
  navigateTo('dashboard');

  // Set up event listener to close modal on overlay click
  const modalOverlay = document.getElementById('food-detail-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeFoodModal();
      }
    });
  }
});

// --- SPA NAVIGATION ROUTER ---
function navigateTo(viewId) {
  currentView = viewId;

  // Toggle active class on Navigation Header Link
  document.querySelectorAll('.nav-menu .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeNavItem = document.getElementById(`nav-${viewId}`);
  if (activeNavItem) {
    activeNavItem.classList.add('active');
  }

  // Toggle Active Page View section
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const activeView = document.getElementById(`view-${viewId}`);
  if (activeView) {
    activeView.classList.add('active');
  }

  // View specific setups
  if (viewId === 'dashboard') {
    initDashboard();
  } else if (viewId === 'statistik') {
    initStatistik();
  } else if (viewId === 'makanan') {
    initFoodTable();
  } else if (viewId === 'simulasi') {
    initSimulator();
  }
}

// Navigation placeholder for tabs without layout pages
function triggerNavAction(title) {
  triggerToast(`Membuka menu ${title}...`, 'info');
}

// Mock login action
function triggerLoginModal() {
  triggerToast("Fungsi masuk sistem segera tersedia!", "info");
}

// --- TOAST NOTIFICATIONS ---
function triggerToast(message, type = 'info') {
  const container = document.getElementById('toast-root-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'success' : ''}`;
  
  // Icon
  let iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  if (type === 'success') {
    iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
  }
  
  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);
  
  // Slide out after 3.5 seconds
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// --- 1. DASHBOARD VIEW CONTROLLER ---
function initDashboard() {
  // Populate Rankings
  const rankContainer = document.getElementById('dashboard-protein-rankings');
  if (rankContainer) {
    rankContainer.innerHTML = StatsData.proteinRankings.map(item => `
      <div class="ranking-item">
        <div class="ranking-info">
          <span class="rank-number">${item.rank}</span>
          <span class="ranking-name">${item.name}</span>
        </div>
        <span class="ranking-value">${item.amount}</span>
      </div>
    `).join('');
  }

  // Populate Warnings
  const warningContainer = document.getElementById('dashboard-nutrition-warnings');
  if (warningContainer) {
    warningContainer.innerHTML = StatsData.warnings.map(item => `
      <div class="warning-item">
        <div class="warning-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span class="warning-name">${item.name}</span>
        </div>
        <span class="warning-value">${item.value}</span>
      </div>
    `).join('');
  }

  // Initialize Charts
  initDashboardCharts();
}

function initDashboardCharts() {
  // Destroy existing charts to reload fresh
  if (charts.caloriesComparison) charts.caloriesComparison.destroy();
  if (charts.nutritionComposition) charts.nutritionComposition.destroy();

  const barCanvas = document.getElementById('chart-calories-comparison');
  const pieCanvas = document.getElementById('chart-nutrition-composition');

  if (barCanvas) {
    const barCtx = barCanvas.getContext('2d');
    charts.caloriesComparison = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: StatsData.caloriesComparison.labels,
        datasets: [{
          label: 'Kalori (kcal)',
          data: StatsData.caloriesComparison.data,
          backgroundColor: '#0e214d',
          borderRadius: 4,
          barThickness: 28,
          hoverBackgroundColor: '#1e3a8a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0e214d',
            padding: 10,
            titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' },
            bodyFont: { family: 'Inter' }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#475569', font: { family: 'Inter', size: 12 } }
          },
          y: {
            max: 260,
            ticks: {
              stepSize: 65,
              color: '#475569',
              font: { family: 'Inter', size: 12 }
            },
            border: { dash: [4, 4] },
            grid: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

  if (pieCanvas) {
    const pieCtx = pieCanvas.getContext('2d');
    charts.nutritionComposition = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: StatsData.nutritionComposition.labels,
        datasets: [{
          data: StatsData.nutritionComposition.data,
          backgroundColor: ['#0e214d', '#10b981', '#d97706'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              font: { family: 'Inter', size: 12, weight: 600 },
              color: '#475569',
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  }
}

// --- 2. STATISTIK GIZI VIEW CONTROLLER ---
function initStatistik() {
  // Initialize charts
  if (charts.proteinTrend) charts.proteinTrend.destroy();
  if (charts.monthlyMacros) charts.monthlyMacros.destroy();

  const proteinCanvas = document.getElementById('chart-protein-trend');
  const macroCanvas = document.getElementById('chart-monthly-macros');

  if (proteinCanvas) {
    const proteinCtx = proteinCanvas.getContext('2d');
    charts.proteinTrend = new Chart(proteinCtx, {
      type: 'bar',
      data: {
        labels: StatsData.proteinTrend.months,
        datasets: [
          {
            type: 'line',
            label: 'Target Standar (20g)',
            data: Array(StatsData.proteinTrend.months.length).fill(StatsData.proteinTrend.target),
            borderColor: '#d97706',
            borderWidth: 2.5,
            borderDash: [5, 5],
            pointRadius: 4,
            pointBackgroundColor: '#d97706',
            fill: false,
            order: 1
          },
          {
            label: 'Rata-rata Protein (g)',
            data: StatsData.proteinTrend.values,
            backgroundColor: '#0e214d',
            borderRadius: 4,
            barThickness: 32,
            order: 2,
            hoverBackgroundColor: '#1e3a8a'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 15,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 },
              color: '#475569',
              padding: 15
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#475569', font: { family: 'Inter', size: 12 } }
          },
          y: {
            max: 24,
            ticks: {
              stepSize: 6,
              color: '#475569',
              font: { family: 'Inter', size: 12 }
            },
            border: { dash: [4, 4] },
            grid: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

  if (macroCanvas) {
    const macroCtx = macroCanvas.getContext('2d');
    const carbGradient = macroCtx.createLinearGradient(0, 0, 0, 200);
    carbGradient.addColorStop(0, 'rgba(217, 119, 6, 0.4)');
    carbGradient.addColorStop(1, 'rgba(217, 119, 6, 0)');

    charts.monthlyMacros = new Chart(macroCtx, {
      type: 'line',
      data: {
        labels: StatsData.monthlyMacros.months,
        datasets: [{
          label: 'Komposisi Karbohidrat / Kalori',
          data: StatsData.monthlyMacros.carbs,
          borderColor: '#d97706',
          backgroundColor: carbGradient,
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#d97706'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#475569', font: { family: 'Inter', size: 12 } }
          },
          y: {
            max: 80,
            ticks: {
              stepSize: 20,
              color: '#475569',
              font: { family: 'Inter', size: 12 }
            },
            border: { dash: [4, 4] },
            grid: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

  // Generate Regional Progress Bars
  const regionalContainer = document.getElementById('regional-progress-list');
  if (regionalContainer) {
    regionalContainer.innerHTML = StatsData.regionalFulfillment.map(item => `
      <div class="regional-item">
        <span class="regional-name">${item.region}</span>
        <div class="progress-track">
          <div class="progress-fill" id="regional-bar-${item.region.replace(/\s+/g, '')}"></div>
        </div>
        <span class="regional-percentage">${item.percentage}%</span>
      </div>
    `).join('');

    // Animate progress bars
    setTimeout(() => {
      StatsData.regionalFulfillment.forEach(item => {
        const element = document.getElementById(`regional-bar-${item.region.replace(/\s+/g, '')}`);
        if (element) {
          element.style.width = `${item.percentage}%`;
        }
      });
    }, 100);
  }
}

// --- 3. DATA MAKANAN VIEW CONTROLLER ---
function initFoodTable() {
  tableState.currentPage = 1;
  renderFoodTable();
}

function getFilteredFoods() {
  return FoodDatabase.filter(food => {
    // Search Query filter
    const matchesSearch = food.name.toLowerCase().includes(tableState.searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = tableState.category === 'Semua' || food.category === tableState.category;
    
    // Quick tags filter (Protein Tinggi / Kalori Rendah)
    let matchesQuick = true;
    if (tableState.quickFilter) {
      matchesQuick = food.tags.includes(tableState.quickFilter);
    }

    return matchesSearch && matchesCategory && matchesQuick;
  });
}

function renderFoodTable() {
  const filteredList = getFilteredFoods();
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / tableState.itemsPerPage) || 1;

  // Clamp current page
  if (tableState.currentPage > totalPages) tableState.currentPage = totalPages;
  if (tableState.currentPage < 1) tableState.currentPage = 1;

  const startIndex = (tableState.currentPage - 1) * tableState.itemsPerPage;
  const endIndex = Math.min(startIndex + tableState.itemsPerPage, totalItems);
  const itemsToRender = filteredList.slice(startIndex, endIndex);

  // Table Body rendering
  const tableBody = document.getElementById('food-table-body');
  if (!tableBody) return;

  if (itemsToRender.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state" style="text-align: center; padding: 40px 0;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 40px; height: 40px; stroke: var(--text-muted); margin-bottom: 8px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <div>Tidak ada makanan yang cocok dengan penyaringan.</div>
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = itemsToRender.map(food => {
      // Tags formatting
      const tagBadges = food.tags.map(tag => {
        let colorClass = 'blue';
        if (tag === 'Tinggi Protein') colorClass = 'green';
        if (tag === 'Tinggi Sodium' || tag === 'Tinggi Gula') colorClass = 'red';
        return `<span class="food-tag ${colorClass}">${tag}</span>`;
      }).join(' ');

      return `
        <tr>
          <td>
            <div class="food-name-cell">
              <span>${food.name}</span>
              <div class="food-tag-container">${tagBadges}</div>
            </div>
          </td>
          <td style="color: var(--text-secondary); font-weight: 500;">${food.category}</td>
          <td>${food.calories} kcal</td>
          <td>${food.protein}g</td>
          <td>${food.fat}g</td>
          <td>${food.carbs}g</td>
          <td>${food.sodium}mg</td>
          <td style="text-align: center;">
            <button class="action-btn" onclick="openFoodModal(${food.id})" title="Lihat detail gizi">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Pagination Text Info
  const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
  const infoText = document.getElementById('pagination-info');
  if (infoText) {
    infoText.innerText = `Menampilkan ${startDisplay}-${endIndex} dari ${totalItems} data`;
  }

  // Render Page buttons
  const controlsWrapper = document.getElementById('pagination-controls-wrapper');
  if (controlsWrapper) {
    let pageButtonsHTML = `
      <button class="pagination-btn" onclick="changeTablePage(${tableState.currentPage - 1})" ${tableState.currentPage === 1 ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      pageButtonsHTML += `
        <button class="pagination-btn ${tableState.currentPage === i ? 'active' : ''}" onclick="changeTablePage(${i})">
          ${i}
        </button>
      `;
    }

    pageButtonsHTML += `
      <button class="pagination-btn" onclick="changeTablePage(${tableState.currentPage + 1})" ${tableState.currentPage === totalPages ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    controlsWrapper.innerHTML = pageButtonsHTML;
  }
}

function handleTableSearch() {
  const searchInput = document.getElementById('food-table-search');
  if (searchInput) {
    tableState.searchQuery = searchInput.value;
    tableState.currentPage = 1;
    renderFoodTable();
  }
}

function setTableCategory(catName) {
  tableState.category = catName;
  tableState.currentPage = 1;

  // Toggle Chip UI active class
  document.querySelectorAll('#table-category-chips .category-chip').forEach(btn => {
    if (btn.innerText.trim() === catName.trim()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderFoodTable();
}

function toggleQuickFilter(filterTag) {
  const btn = filterTag === 'Tinggi Protein' ? document.getElementById('btn-filter-protein') : document.getElementById('btn-filter-calories');
  
  if (tableState.quickFilter === filterTag) {
    tableState.quickFilter = null;
    if (btn) btn.classList.remove('active');
  } else {
    // Clear other tag active state
    const pBtn = document.getElementById('btn-filter-protein');
    const cBtn = document.getElementById('btn-filter-calories');
    if (pBtn) pBtn.classList.remove('active');
    if (cBtn) cBtn.classList.remove('active');
    
    tableState.quickFilter = filterTag;
    if (btn) btn.classList.add('active');
  }
  
  tableState.currentPage = 1;
  renderFoodTable();
}

function changeTablePage(pageNumber) {
  tableState.currentPage = pageNumber;
  renderFoodTable();
}

// Category filter dropdown menu action placeholder
function toggleDropdownFilters(event) {
  triggerToast("Menampilkan panel penyaringan lanjutan...", "info");
}

// --- 4. MENU SIMULATOR VIEW CONTROLLER ---
function initSimulator() {
  renderSimFoodsList();
  renderSelectedSimulatorMenu();
}

function getFilteredSimFoods() {
  return FoodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(simulatorState.searchQuery.toLowerCase());
    const matchesCategory = simulatorState.category === 'Semua' || food.category === simulatorState.category;
    return matchesSearch && matchesCategory;
  });
}

function renderSimFoodsList() {
  const filtered = getFilteredSimFoods();
  const listContainer = document.getElementById('sim-food-list');
  if (!listContainer) return;

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state" style="background-color: var(--bg-card); border-radius: var(--border-radius-md); border:1px solid var(--border-color); padding: 40px 0;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; stroke: var(--text-muted); margin-bottom: 12px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <div>Bahan makanan tidak ditemukan. Silakan cari nama lain.</div>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered.map(food => `
    <div class="food-card-item">
      <div class="food-card-details">
        <h4>${food.name}</h4>
        <div class="food-card-meta">
          <strong>${food.category}</strong> &bull; ${food.servingSize} &bull; ${food.calories} kcal &bull; ${food.protein}g protein
        </div>
      </div>
      <button class="add-food-btn" onclick="addFoodToSimulator(${food.id})">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Tambah
      </button>
    </div>
  `).join('');
}

function handleSimSearch() {
  const searchInput = document.getElementById('sim-search');
  if (searchInput) {
    simulatorState.searchQuery = searchInput.value;
    renderSimFoodsList();
  }
}

function setSimCategory(catName) {
  simulatorState.category = catName;

  // Toggle active class
  document.querySelectorAll('#sim-category-chips .category-chip').forEach(btn => {
    if (btn.innerText.trim() === catName.trim()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderSimFoodsList();
}

// SIMULATOR CART ACTIONS
function addFoodToSimulator(foodId) {
  const foodItem = FoodDatabase.find(f => f.id === foodId);
  if (!foodItem) return;

  const existing = simulatorState.selectedItems.find(item => item.foodId === foodId);
  if (existing) {
    existing.qtyGrams += 100;
  } else {
    simulatorState.selectedItems.push({
      foodId: foodId,
      qtyGrams: 100
    });
  }

  triggerToast(`${foodItem.name} berhasil ditambahkan!`, 'success');
  renderSelectedSimulatorMenu();
}

function removeFoodFromSimulator(foodId) {
  const foodItem = FoodDatabase.find(f => f.id === foodId);
  
  simulatorState.selectedItems = simulatorState.selectedItems.filter(item => item.foodId !== foodId);
  
  if (foodItem) {
    triggerToast(`${foodItem.name} dihapus dari menu.`, 'info');
  }
  renderSelectedSimulatorMenu();
}

function renderSelectedSimulatorMenu() {
  const container = document.getElementById('selected-menu-items');
  if (!container) return;

  if (simulatorState.selectedItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <div>Belum ada makanan yang dipilih.</div>
      </div>
    `;

    // Reset Totals
    updateSimulatorTotals(0, 0);
    return;
  }

  let totalCalories = 0;
  let totalProtein = 0;

  const itemsHtml = simulatorState.selectedItems.map(item => {
    const food = FoodDatabase.find(f => f.id === item.foodId);
    if (!food) return '';

    const ratio = item.qtyGrams / 100;
    const itemCalories = Math.round(food.calories * ratio);
    const itemProtein = parseFloat((food.protein * ratio).toFixed(1));

    totalCalories += itemCalories;
    totalProtein += itemProtein;

    return `
      <div class="selected-item">
        <div class="selected-item-info">
          <h5>${food.name}</h5>
          <p>${item.qtyGrams}g &bull; ${itemCalories} kcal &bull; ${itemProtein}g Pro</p>
        </div>
        <button class="remove-item-btn" onclick="removeFoodFromSimulator(${food.id})" title="Hapus bahan">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;
  }).join('');

  container.innerHTML = itemsHtml;
  updateSimulatorTotals(totalCalories, parseFloat(totalProtein.toFixed(1)));
}

function updateSimulatorTotals(calories, protein) {
  // Update numerical text displays
  const cSum = document.getElementById('summary-total-calories');
  const pSum = document.getElementById('summary-total-protein');
  const cTargetText = document.getElementById('target-calories-text');
  const pTargetText = document.getElementById('target-protein-text');

  if (cSum) cSum.innerText = `${calories} kcal`;
  if (pSum) pSum.innerText = `${protein}g`;
  if (cTargetText) cTargetText.innerText = `${calories} / ${SIM_TARGETS.calories} kcal`;
  if (pTargetText) pTargetText.innerText = `${protein} / ${SIM_TARGETS.protein} g`;

  // Calculate percentages
  const caloriesPercent = Math.min((calories / SIM_TARGETS.calories) * 100, 100);
  const proteinPercent = Math.min((protein / SIM_TARGETS.protein) * 100, 100);

  const caloriesFill = document.getElementById('target-calories-fill');
  const proteinFill = document.getElementById('target-protein-fill');

  if (caloriesFill) caloriesFill.style.width = `${caloriesPercent}%`;
  if (proteinFill) proteinFill.style.width = `${proteinPercent}%`;

  // Dynamic colors depending on adequacy
  if (caloriesFill) setProgressBarColor(caloriesFill, calories, SIM_TARGETS.calories);
  if (proteinFill) setProgressBarColor(proteinFill, protein, SIM_TARGETS.protein);
}

function setProgressBarColor(progressBarElement, value, target) {
  progressBarElement.classList.remove('success', 'overlimit');
  
  const percentage = (value / target) * 100;
  if (percentage >= 90 && percentage <= 115) {
    progressBarElement.classList.add('success'); // Green
  } else if (percentage > 115) {
    progressBarElement.classList.add('overlimit'); // Red
  }
}

function saveSimulatedMenu() {
  if (simulatorState.selectedItems.length === 0) {
    triggerToast("Pilihlah minimal 1 bahan makanan terlebih dahulu!", "info");
    return;
  }

  // Display saving animation feedback
  const saveBtn = document.getElementById('btn-save-sim');
  if (!saveBtn) return;

  const originalHTML = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin-animation"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg> Menyimpan...';

  if (!document.getElementById('style-spin-inject')) {
    const style = document.createElement('style');
    style.id = 'style-spin-inject';
    style.innerHTML = `
      .spin-animation { animation: spin 1s linear infinite; }
      @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  // Hitung total kalori & protein dari item terpilih (per 100 g)
  let totalCalories = 0, totalProtein = 0;
  simulatorState.selectedItems.forEach(item => {
    const food = (window.FoodDatabase || []).find(f => f.id === item.foodId);
    if (food) {
      const factor = (item.qtyGrams || 0) / 100;
      totalCalories += (food.calories || 0) * factor;
      totalProtein  += (food.protein  || 0) * factor;
    }
  });

  // Simpan ke database lewat API PHP
  fetch((window.NT_API || '../../api') + '/simulations.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Menu Simulasi MBG',
      items: simulatorState.selectedItems,
      total_calories: Math.round(totalCalories),
      total_protein: Math.round(totalProtein * 10) / 10
    })
  })
  .then(r => r.json())
  .then(res => {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalHTML;
    if (res && res.ok) {
      triggerToast("Kombinasi menu berhasil disimpan ke database! (ID #" + res.id + ")", "success");
      simulatorState.selectedItems = [];
      renderSelectedSimulatorMenu();
    } else {
      triggerToast("Gagal menyimpan: " + (res && res.error ? res.error : "kesalahan server"), "info");
    }
  })
  .catch(err => {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalHTML;
    triggerToast("Gagal terhubung ke server database.", "info");
  });
}

function exportSimulatedReport() {
  if (simulatorState.selectedItems.length === 0) {
    triggerToast("Pilihlah bahan makanan sebelum mengunduh laporan!", "info");
    return;
  }

  // Mock Menu report export
  let reportText = "=== LAPORAN SIMULASI MENU MAKAN BERGIZI GRATIS ===\n";
  reportText += `Tanggal Pembuatan: ${new Date().toLocaleDateString('id-ID')}\n\n`;
  reportText += "Bahan Makanan terpilih:\n";

  let totalCalories = 0;
  let totalProtein = 0;

  simulatorState.selectedItems.forEach(item => {
    const food = FoodDatabase.find(f => f.id === item.foodId);
    if (food) {
      const ratio = item.qtyGrams / 100;
      const cals = Math.round(food.calories * ratio);
      const prot = parseFloat((food.protein * ratio).toFixed(1));
      totalCalories += cals;
      totalProtein += prot;
      
      reportText += `- ${food.name}: ${item.qtyGrams}g (${cals} kcal, ${prot}g Protein, Kategori: ${food.category})\n`;
    }
  });

  reportText += `\nTOTAL RINGKASAN GIZI:\n`;
  reportText += `- Total Kalori: ${totalCalories} kcal (Target: ~${SIM_TARGETS.calories} kcal)\n`;
  reportText += `- Total Protein: ${totalProtein.toFixed(1)}g (Target: ~${SIM_TARGETS.protein}g)\n`;
  reportText += `- Status Kalori: ${totalCalories >= SIM_TARGETS.calories * 0.9 ? 'Sesuai Standar' : 'Kurang dari Standar'}\n`;
  reportText += `- Status Protein: ${totalProtein >= SIM_TARGETS.protein * 0.9 ? 'Sesuai Standar' : 'Kurang dari Standar'}\n`;
  reportText += "\nLaporan digenerasi secara otomatis oleh NutriTrack MBG.";

  // Create file download link
  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NutriTrack_MBG_Simulasi_Menu_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  triggerToast("Mengunduh laporan simulasi menu...", "success");
}

// --- 5. FOOD DETAIL MODAL CONTROLLER ---
function openFoodModal(foodId) {
  const food = FoodDatabase.find(f => f.id === foodId);
  if (!food) return;

  const modalTitle = document.getElementById('modal-food-title');
  const modalName = document.getElementById('modal-food-name');
  const modalCat = document.getElementById('modal-food-category');
  const modalServe = document.getElementById('modal-food-serving');

  if (modalTitle) modalTitle.innerText = "Detail Nilai Gizi Makanan";
  if (modalName) modalName.innerText = food.name;
  if (modalCat) modalCat.innerText = food.category;
  if (modalServe) modalServe.innerText = food.servingSize;

  // Render Tags inside modal
  const tagsContainer = document.getElementById('modal-food-tags');
  if (tagsContainer) {
    if (food.tags.length === 0) {
      tagsContainer.innerHTML = '';
    } else {
      tagsContainer.innerHTML = food.tags.map(tag => {
        let colorClass = 'blue';
        if (tag === 'Tinggi Protein') colorClass = 'green';
        if (tag === 'Tinggi Sodium' || tag === 'Tinggi Gula') colorClass = 'red';
        return `<span class="food-tag ${colorClass}">${tag}</span>`;
      }).join(' ');
    }
  }

  // Set nutrition numbers
  const cCell = document.getElementById('modal-nut-calories');
  const pCell = document.getElementById('modal-nut-protein');
  const fCell = document.getElementById('modal-nut-fat');
  const cbCell = document.getElementById('modal-nut-carbs');
  const sdCell = document.getElementById('modal-nut-sodium');
  const sgCell = document.getElementById('modal-nut-sugar');

  if (cCell) cCell.innerText = `${food.calories} kcal`;
  if (pCell) pCell.innerText = `${food.protein}g`;
  if (fCell) fCell.innerText = `${food.fat}g`;
  if (cbCell) cbCell.innerText = `${food.carbs}g`;
  if (sdCell) sdCell.innerText = `${food.sodium}mg`;
  if (sgCell) sgCell.innerText = `${food.sugar}g`;

  // Open Modal overlay
  const detailModal = document.getElementById('food-detail-modal');
  if (detailModal) detailModal.classList.add('active');
}

function closeFoodModal() {
  const detailModal = document.getElementById('food-detail-modal');
  if (detailModal) detailModal.classList.remove('active');
}
