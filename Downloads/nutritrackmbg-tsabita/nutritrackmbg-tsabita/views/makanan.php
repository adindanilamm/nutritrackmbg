<?php
// View Component - Data Makanan (NutriTrack MBG)
?>
<div class="section-header">
  <div class="section-title">
    <h1>Data Makanan & Minuman</h1>
    <p>Database nilai gizi referensi untuk penyusunan menu MBG.</p>
  </div>
</div>

<!-- Toolbar Search & Quick Category Filters -->
<div class="toolbar-row">
  <div class="search-input-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    <input type="text" id="food-table-search" class="search-input" placeholder="Cari nama makanan atau minuman..." oninput="handleTableSearch()">
  </div>

  <!-- Toolbar Tag Filters -->
  <div class="filter-buttons">
    <button class="filter-chip" id="btn-filter-category" onclick="toggleDropdownFilters(event)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
      <span>Kategori</span>
    </button>
    <button class="filter-chip" id="btn-filter-protein" onclick="toggleQuickFilter('Tinggi Protein')">
      Protein Tinggi
    </button>
    <button class="filter-chip" id="btn-filter-calories" onclick="toggleQuickFilter('Rendah Kalori')">
      Kalori Rendah
    </button>
  </div>
</div>

<!-- Sub categories chips for active filtration -->
<div class="category-chips-row" id="table-category-chips">
  <button class="category-chip active" onclick="setTableCategory('Semua')">Semua</button>
  <button class="category-chip" onclick="setTableCategory('Karbohidrat')">Karbohidrat</button>
  <button class="category-chip" onclick="setTableCategory('Lauk Hewani')">Lauk Hewani</button>
  <button class="category-chip" onclick="setTableCategory('Lauk Nabati')">Lauk Nabati</button>
  <button class="category-chip" onclick="setTableCategory('Sayuran')">Sayuran</button>
  <button class="category-chip" onclick="setTableCategory('Minuman')">Minuman</button>
  <button class="category-chip" onclick="setTableCategory('Buah')">Buah</button>
</div>

<!-- Food Table Container -->
<div class="table-wrapper">
  <table class="food-table">
    <thead>
      <tr>
        <th>Nama Makanan</th>
        <th>Kategori</th>
        <th>Kalori</th>
        <th>Protein</th>
        <th>Lemak</th>
        <th>Karbo</th>
        <th>Sodium</th>
        <th style="width: 80px; text-align: center;">Aksi</th>
      </tr>
    </thead>
    <tbody id="food-table-body">
      <!-- Dynamically populated by app.php JS -->
    </tbody>
  </table>
</div>

<!-- Pagination Container -->
<div class="pagination-container">
  <span id="pagination-info">Menampilkan 1-7 dari 1,245 data</span>
  <div class="pagination-controls" id="pagination-controls-wrapper">
    <!-- Dynamically populated by app.php JS -->
  </div>
</div>
