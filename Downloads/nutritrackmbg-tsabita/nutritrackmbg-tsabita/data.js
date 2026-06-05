// Data referensi makanan dan statistik NutriTrack MBG (JS)
const FoodDatabase = [
  {
    id: 1,
    name: "Nasi Putih",
    category: "Karbohidrat",
    calories: 130,
    protein: 2.7,
    fat: 0.3,
    carbs: 28.0,
    sodium: 1,
    sugar: 0.1,
    servingSize: "100g",
    tags: ["Rendah Kalori"]
  },
  {
    id: 2,
    name: "Ayam Goreng",
    category: "Lauk Hewani",
    calories: 246,
    protein: 27.0,
    fat: 14.0,
    carbs: 0.0,
    sodium: 82,
    sugar: 0.0,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 3,
    name: "Tempe Mendoan",
    category: "Lauk Nabati",
    calories: 200,
    protein: 11.0,
    fat: 12.0,
    carbs: 13.0,
    sodium: 150,
    sugar: 0.5,
    servingSize: "100g",
    tags: []
  },
  {
    id: 4,
    name: "Sayur Bayam",
    category: "Sayuran",
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    carbs: 3.6,
    sodium: 79,
    sugar: 0.4,
    servingSize: "100g",
    tags: ["Rendah Kalori"]
  },
  {
    id: 5,
    name: "Susu UHT",
    category: "Minuman",
    calories: 61,
    protein: 3.2,
    fat: 3.3,
    carbs: 4.8,
    sodium: 44,
    sugar: 4.5,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 6,
    name: "Sosis Sapi Goreng",
    category: "Lauk Hewani",
    calories: 300,
    protein: 12.0,
    fat: 25.0,
    carbs: 5.0,
    sodium: 800,
    sugar: 1.2,
    servingSize: "100g",
    tags: ["Tinggi Sodium"]
  },
  {
    id: 7,
    name: "Telur Rebus",
    category: "Lauk Hewani",
    calories: 155,
    protein: 13.0,
    fat: 11.0,
    carbs: 1.1,
    sodium: 124,
    sugar: 0.6,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 8,
    name: "Dada Ayam Fillet",
    category: "Lauk Hewani",
    calories: 165,
    protein: 31.0,
    fat: 3.6,
    carbs: 0.0,
    sodium: 74,
    sugar: 0.0,
    servingSize: "100g",
    tags: ["Tinggi Protein", "Rendah Lemak"]
  },
  {
    id: 9,
    name: "Ikan Tuna Segar",
    category: "Lauk Hewani",
    calories: 144,
    protein: 28.0,
    fat: 4.9,
    carbs: 0.0,
    sodium: 54,
    sugar: 0.0,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 10,
    name: "Tempe Kedelai Rebus",
    category: "Lauk Nabati",
    calories: 193,
    protein: 19.0,
    fat: 11.0,
    carbs: 9.4,
    sodium: 9,
    sugar: 0.8,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 11,
    name: "Susu Coklat Manis",
    category: "Minuman",
    calories: 89,
    protein: 3.0,
    fat: 2.5,
    carbs: 12.0,
    sodium: 60,
    sugar: 24.0,
    servingSize: "100g",
    tags: ["Tinggi Gula"]
  },
  {
    id: 12,
    name: "Mie Instan",
    category: "Karbohidrat",
    calories: 440,
    protein: 9.0,
    fat: 15.0,
    carbs: 62.0,
    sodium: 1200,
    sugar: 3.5,
    servingSize: "100g",
    tags: ["Tinggi Sodium"]
  },
  {
    id: 13,
    name: "Tahu Goreng",
    category: "Lauk Nabati",
    calories: 271,
    protein: 17.0,
    fat: 20.0,
    carbs: 8.0,
    sodium: 15,
    sugar: 0.3,
    servingSize: "100g",
    tags: []
  },
  {
    id: 14,
    name: "Sayur Sop Wortel Kentang",
    category: "Sayuran",
    calories: 27,
    protein: 1.2,
    fat: 0.2,
    carbs: 6.0,
    sodium: 320,
    sugar: 1.5,
    servingSize: "100g",
    tags: ["Rendah Kalori"]
  },
  {
    id: 15,
    name: "Pisang Ambon",
    category: "Buah",
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    carbs: 22.8,
    sodium: 1,
    sugar: 12.2,
    servingSize: "100g",
    tags: ["Rendah Lemak"]
  },
  {
    id: 16,
    name: "Kentang Rebus",
    category: "Karbohidrat",
    calories: 87,
    protein: 1.9,
    fat: 0.1,
    carbs: 20.1,
    sodium: 4,
    sugar: 0.9,
    servingSize: "100g",
    tags: ["Rendah Kalori"]
  },
  {
    id: 17,
    name: "Pepaya",
    category: "Buah",
    calories: 43,
    protein: 0.5,
    fat: 0.3,
    carbs: 10.8,
    sodium: 8,
    sugar: 7.8,
    servingSize: "100g",
    tags: ["Rendah Kalori"]
  },
  {
    id: 18,
    name: "Roti Gandum",
    category: "Karbohidrat",
    calories: 247,
    protein: 13.0,
    fat: 3.4,
    carbs: 41.0,
    sodium: 450,
    sugar: 4.2,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 19,
    name: "Kacang Hijau Rebus",
    category: "Lauk Nabati",
    calories: 105,
    protein: 7.0,
    fat: 0.4,
    carbs: 19.0,
    sodium: 2,
    sugar: 2.0,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 20,
    name: "Ikan Kembung Goreng",
    category: "Lauk Hewani",
    calories: 215,
    protein: 21.4,
    fat: 13.6,
    carbs: 0.0,
    sodium: 95,
    sugar: 0.0,
    servingSize: "100g",
    tags: ["Tinggi Protein"]
  },
  {
    id: 21,
    name: "Tumis Kangkung",
    category: "Sayuran",
    calories: 45,
    protein: 2.1,
    fat: 3.1,
    carbs: 4.2,
    sodium: 290,
    sugar: 0.8,
    servingSize: "100g",
    tags: ["Rendah Kalori"]
  },
  {
    id: 22,
    name: "Apel Merah",
    category: "Buah",
    calories: 52,
    protein: 0.3,
    fat: 0.2,
    carbs: 13.8,
    sodium: 1,
    sugar: 10.4,
    servingSize: "100g",
    tags: ["Rendah Kalori"]
  }
];

const StatsData = {
  caloriesComparison: {
    labels: ["Nasi", "Ayam", "Tempe", "Bayam", "Susu"],
    data: [130, 246, 200, 23, 61]
  },
  nutritionComposition: {
    labels: ["Karbohidrat", "Protein", "Lemak"],
    data: [55, 20, 25]
  },
  proteinRankings: [
    { rank: 1, name: "Dada Ayam Fillet", amount: "31g / 100g" },
    { rank: 2, name: "Ikan Tuna", amount: "28g / 100g" },
    { rank: 3, name: "Tempe Kedelai", amount: "19g / 100g" }
  ],
  warnings: [
    { name: "Sosis Sapi", type: "Sodium", value: "800mg Sodium", level: "high" },
    { name: "Susu Coklat Manis", type: "Gula", value: "24g Gula", level: "high" },
    { name: "Mie Instan", type: "Sodium", value: "1200mg Sodium", level: "high" }
  ],
  proteinTrend: {
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    values: [18, 19, 21, 20, 21.5, 23],
    target: 20
  },
  monthlyMacros: {
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    carbs: [60, 62, 65, 63, 66, 64],
    protein: [18, 19, 21, 20, 21.5, 23],
    fat: [22, 23, 22, 24, 23, 22]
  },
  regionalFulfillment: [
    { region: "Jawa", percentage: 85 },
    { region: "Sumatera", percentage: 82 },
    { region: "Kalimantan", percentage: 80 },
    { region: "Sulawesi", percentage: 78 },
    { region: "Papua", percentage: 72 },
    { region: "Bali & Nusa", percentage: 81 },
    { region: "Maluku", percentage: 77 }
  ]
};

window.FoodDatabase = FoodDatabase;
window.StatsData = StatsData;
