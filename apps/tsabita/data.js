// data.js — Loader data NutriTrack MBG
// Mengambil data ASLI dari API PHP (MySQL), bukan lagi data dummy.
// Endpoint berada di folder /api pada root project (dua tingkat di atas).

var NT_API = '../../api';

// Variabel global yang dipakai app.js (diisi setelah fetch selesai)
var FoodDatabase = [];
var StatsData = {};
var AkgReference = [];

async function NT_loadData() {
  const [foods, stats, akg] = await Promise.all([
    fetch(NT_API + '/foods.php').then(r => r.json()),
    fetch(NT_API + '/stats.php').then(r => r.json()),
    fetch(NT_API + '/akg.php').then(r => r.json()).catch(() => [])
  ]);
  FoodDatabase = foods;
  StatsData = stats;
  AkgReference = akg;
  window.FoodDatabase = FoodDatabase;
  window.StatsData = StatsData;
  window.AkgReference = AkgReference;
}
window.NT_loadData = NT_loadData;
