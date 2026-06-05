<?php
// View Component - Statistik Gizi (NutriTrack MBG)
?>

<!-- Section Header -->
<div class="section-header">
  <div class="section-title">
    <h1>Statistik &amp; Analisis Gizi</h1>
    <p>Pemantauan tren dan pencapaian target gizi nasional program MBG.</p>
  </div>
  <div class="filter-buttons">
    <button class="btn btn-secondary" onclick="triggerToast('Menyaring rentang waktu...')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
      Filter Waktu
    </button>
    <button class="btn btn-accent" onclick="triggerToast('Mengunduh laporan PDF program MBG...')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
      </svg>
      Unduh Laporan
    </button>
  </div>
</div>

<!-- Trend Card -->
<div class="panel-card stats-main-card">
  <svg class="panel-target-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" stroke="#b8a848" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="9"  stroke="#b8a848" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="4"  stroke="#b8a848" stroke-width="1.5"/>
  </svg>
  <div class="panel-header">
    <h3 class="panel-title">Tren Pemenuhan Protein vs Target</h3>
    <p class="panel-subtitle">Rata-rata gram protein per porsi makanan dibandingkan dengan target standar (<?= $statsData['targetProtein'] ?>g/porsi).</p>
  </div>
  <div style="position:relative;height:320px;width:100%;">
    <canvas id="chart-protein-trend"></canvas>
  </div>
</div>

<!-- Bottom Row -->
<div class="stats-bottom-row">

  <!-- Area Chart -->
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Distribusi Makronutrien Bulanan</h3>
      <p class="panel-subtitle">Perbandingan Kalori, Karbohidrat, dan Lemak.</p>
    </div>
    <div style="position:relative;height:260px;width:100%;">
      <canvas id="chart-monthly-macros"></canvas>
    </div>
  </div>

  <!-- Regional Progress -->
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Pemenuhan Gizi per Wilayah</h3>
      <p class="panel-subtitle">Persentase kecukupan gizi per regional.</p>
    </div>
    <div class="regional-list" id="regional-progress-list">
      <?php foreach ($statsData['regionalFulfillment'] as $item): ?>
        <div class="regional-item">
          <span class="regional-name"><?= htmlspecialchars($item['region']) ?></span>
          <div class="progress-track">
            <div
              class="progress-fill"
              id="regional-bar-<?= htmlspecialchars(str_replace([' ', '&'], '', $item['region'])) ?>"
              data-percentage="<?= htmlspecialchars($item['percentage']) ?>"
            ></div>
          </div>
          <span class="regional-percentage"><?= htmlspecialchars($item['percentage']) ?>%</span>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

</div>