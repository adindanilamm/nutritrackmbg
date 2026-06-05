<?php
// View Component - Simulasi Menu (NutriTrack MBG)
?>
<div class="section-header">
  <div class="section-title">
    <h1>Simulasi Menu MBG</h1>
    <p>Susun kombinasi menu dan analisis nilai gizi secara instan.</p>
  </div>
</div>

<!-- Simulation Dashboard Grid Layout -->
<div class="simulasi-grid">
  
  <!-- Left: Material / Food items selector -->
  <div>
    <!-- Search & Category Filters -->
    <div class="toolbar-row" style="margin-bottom:12px;">
      <div class="search-input-wrapper" style="max-width:none;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="sim-search" class="search-input" placeholder="Cari makanan..." oninput="handleSimSearch()">
      </div>
    </div>

    <!-- Category Chips -->
    <div class="category-chips-row" style="margin-bottom: 20px;" id="sim-category-chips">
      <button class="category-chip active" onclick="setSimCategory('Semua')">Semua</button>
      <button class="category-chip" onclick="setSimCategory('Karbohidrat')">Karbohidrat</button>
      <button class="category-chip" onclick="setSimCategory('Lauk Hewani')">Lauk Hewani</button>
      <button class="category-chip" onclick="setSimCategory('Lauk Nabati')">Lauk Nabati</button>
      <button class="category-chip" onclick="setSimCategory('Sayuran')">Sayuran</button>
      <button class="category-chip" onclick="setSimCategory('Buah')">Buah</button>
    </div>

    <!-- Food items list cards -->
    <div class="food-list-container" id="sim-food-list">
      <!-- Dynamically populated by app.php JS -->
    </div>
  </div>

  <!-- Right Sidebar: Selected Menu Panel -->
  <div class="sidebar-panel">
    <div class="sidebar-header">
      <h3>Menu Terpilih</h3>
      <p>Kombinasi menu untuk satu kali makan.</p>
    </div>
    <div class="sidebar-content">
      
      <!-- Items Selected List -->
      <div id="selected-menu-items" class="selected-food-list">
        <!-- Dynamically populated by app.php JS -->
      </div>

      <!-- Target Progress Tracker inside Sidebar -->
      <div class="sidebar-targets">
        <h4>Analisis Nilai Gizi Target</h4>
        
        <!-- Calories Target Track -->
        <div class="target-progress-item">
          <div class="target-progress-labels">
            <span>Energi / Kalori</span>
            <span id="target-calories-text">0 / 600 kcal</span>
          </div>
          <div class="target-progress-track">
            <div class="target-progress-fill" id="target-calories-fill" style="width: 0%"></div>
          </div>
        </div>

        <!-- Protein Target Track -->
        <div class="target-progress-item">
          <div class="target-progress-labels">
            <span>Protein</span>
            <span id="target-protein-text">0.0 / 15.0 g</span>
          </div>
          <div class="target-progress-track">
            <div class="target-progress-fill" id="target-protein-fill" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <!-- Nutrition totals summary -->
      <div class="summary-container">
        <div class="summary-row">
          <span class="summary-label">Total Kalori</span>
          <span class="summary-value" id="summary-total-calories">0 kcal</span>
        </div>
        <div class="summary-row total">
          <span class="summary-label">Total Protein</span>
          <span class="summary-value large" id="summary-total-protein">0.0g</span>
        </div>
      </div>

      <!-- Simulation Action buttons -->
      <div class="simulasi-actions">
        <button class="btn btn-primary" onclick="saveSimulatedMenu()" id="btn-save-sim">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          Simpan
        </button>
        <button class="btn btn-secondary" onclick="exportSimulatedReport()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        </button>
      </div>

    </div>
  </div>

</div>
