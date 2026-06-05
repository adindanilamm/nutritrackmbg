<?php
// View Component - Dashboard (NutriTrack MBG)
?>
<div class="section-header">
  <div class="section-title">
    <h1>Dashboard Gizi & Monitoring MBG</h1>
    <p>Visualisasi data menu bergizi dan persebaran lokasi SPPG seluruh Indonesia.</p>
  </div>
  <a href="index.php?page=simulasi" class="btn btn-primary" style="text-decoration: none;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
    Mulai Simulasi Menu
  </a>
</div>

<!-- Stat Cards Overview Grid -->
<div class="overview-grid">
  <!-- 1. Data Makanan -->
  <div class="stat-card">
    <div class="stat-label">Data Makanan</div>
    <div class="stat-value">1,245</div>
    <div class="stat-subtext positive">
      +12 minggu ini
    </div>
    <div class="stat-icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
    </div>
  </div>

  <!-- 2. Menu Dianalisis -->
  <div class="stat-card">
    <div class="stat-label">Menu Dianalisis</div>
    <div class="stat-value">8,432</div>
    <div class="stat-subtext positive">
      Naik 15%
    </div>
    <div class="stat-icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
    </div>
  </div>

  <!-- 3. Rata-rata Kalori -->
  <div class="stat-card">
    <div class="stat-label">Rata-rata Kalori</div>
    <div class="stat-value">680 kcal</div>
    <div class="stat-subtext positive">
      Sesuai standar
    </div>
    <div class="stat-icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    </div>
  </div>

  <!-- 4. Lokasi SPPG -->
  <div class="stat-card">
    <div class="stat-label">Lokasi SPPG</div>
    <div class="stat-value">12,500</div>
    <div class="stat-subtext neutral">
      Tersebar di 34 Prov
    </div>
    <div class="stat-icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    </div>
  </div>

  <!-- 5. Laporan Publik -->
  <div class="stat-card">
    <div class="stat-label">Laporan Publik</div>
    <div class="stat-value">432</div>
    <div class="stat-subtext negative">
      23 perlu cek
    </div>
    <div class="stat-icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    </div>
  </div>
</div>

<!-- Dashboard Charts Row -->
<div class="dashboard-row-1">
  <!-- Bar Chart: Perbandingan Kalori Menu Umum -->
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Perbandingan Kalori Menu Umum</h3>
      <p class="panel-subtitle">Visualisasi kalori pada 5 menu teratas yang sering digunakan.</p>
    </div>
    <div style="position: relative; height: 250px; width: 100%;">
      <canvas id="chart-calories-comparison"></canvas>
    </div>
  </div>

  <!-- Doughnut Chart: Rata-rata Komposisi Gizi -->
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Rata-rata Komposisi Gizi</h3>
      <p class="panel-subtitle">Distribusi makronutrien menu simulasi</p>
    </div>
    <div class="doughnut-wrapper">
      <canvas id="chart-nutrition-composition"></canvas>
      <div class="doughnut-center-text">
        <span class="number">100%</span>
        <span class="label">Total</span>
      </div>
    </div>
  </div>
</div>

<!-- Rankings and Warnings Row -->
<div class="dashboard-row-2">
  <!-- Rankings List -->
  <div class="panel-card">
    <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h3 class="panel-title">Ranking Tinggi Protein</h3>
        <p class="panel-subtitle">Bahan makanan untuk lauk sehat</p>
      </div>
      <span class="panel-badge green">Disarankan</span>
    </div>
    <div class="ranking-list" id="dashboard-protein-rankings">
      <?php foreach ($statsData['proteinRankings'] as $item): ?>
        <div class="ranking-item">
          <div class="ranking-info">
            <span class="rank-number"><?= htmlspecialchars($item['rank']) ?></span>
            <span class="ranking-name"><?= htmlspecialchars($item['name']) ?></span>
          </div>
          <span class="ranking-value"><?= htmlspecialchars($item['amount']) ?></span>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Warnings List -->
  <div class="panel-card">
    <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h3 class="panel-title">Perhatian Tinggi Sodium/Gula</h3>
        <p class="panel-subtitle">Bahan yang perlu dibatasi</p>
      </div>
      <span class="panel-badge red">Batasi</span>
    </div>
    <div class="warning-list" id="dashboard-nutrition-warnings">
      <?php foreach ($statsData['warnings'] as $item): ?>
        <div class="warning-item">
          <div class="warning-info">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span class="warning-name"><?= htmlspecialchars($item['name']) ?></span>
          </div>
          <span class="warning-value"><?= htmlspecialchars($item['value']) ?></span>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</div>

<!-- Quick Action Banner -->
<div class="cta-banner">
  <div class="cta-content">
    <h2 class="cta-title">Simulasi Cepat Menu MBG</h2>
    <p class="cta-description">Rancang kombinasi menu harian dan dapatkan analisis keseimbangan gizi (Kalori, Protein, Lemak, Karbohidrat) secara instan.</p>
  </div>
  <a href="index.php?page=simulasi" class="cta-btn" style="text-decoration: none;">
    Mulai Simulasi 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
  </a>
</div>
