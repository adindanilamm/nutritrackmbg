// bootstrap.js — ambil data SPPG nyata dari API PHP (MySQL) sebelum app.js jalan
var NT_API = '../../api';
async function NT_loadIzza() {
  try {
    window.NT_SPPG = await fetch(NT_API + '/sppg.php').then(r => r.json());
  } catch (e) {
    window.NT_SPPG = []; // fallback: app.js pakai data bawaan
  }
}
window.NT_loadIzza = NT_loadIzza;
