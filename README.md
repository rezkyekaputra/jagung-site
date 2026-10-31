# JagungNidun 🌽 · Agro-Tech Futuristik

> Website agrikultur modern dan visualisasi biometrik tanaman jagung (*Zea mays L.*) berbasis **GNU Fortran 14**, **Dart Sass 1.107**, dan **3D WebGL (Three.js / Google Model-Viewer)**.

---

## 🌟 Arsitektur & Teknologi

JagungNidun dirancang dengan memisahkan komputasi sains berkecepatan tinggi dengan sistem desain UI modern:

```
[ GNU Fortran 14.3.1 ] ──> Komputasi Sigmoid & GDD ──> _corn_tokens.scss & data_corn.json
                                                              │
[ Dart Sass 1.107.1 ]  ──> Theming & Kompresi CSS    ──> public/css/style.min.css
                                                              │
[ Three.js / WebGL ]   ──> Rendering 3D Real-Time    ──> public/models/jagung.glb (360°)
                                                              │
[ Python 3 HTTP Server ] ──> Static & Asset Delivery ──> Browser (localhost:8080)
```

1. **Math Engine (GNU Fortran 14):**
   - Menghitung kurva pertumbuhan logistik Von Bertalanffy $H(t) = \frac{H_{\max}}{1 + e^{-k(t - t_0)}}$.
   - Mengkalkulasi akumulasi biomassa dan indeks panas harian *Growing Degree Days* (GDD).
   - Meng-generate file SCSS partial (`_corn_tokens.scss`) yang berisi keyframe denyut fotosintesis dan token warna botani.
   - Waktu eksekusi rata-rata: **< 0.5 ms** (Kompilasi `-O3 -march=native -flto`).

2. **Design System (Dart Sass 1.107):**
   - Palette *Obsidian Dark & Golden Corn Glow*.
   - Komponen kaca akrilik (*Frosted Glassmorphism*) dengan *backdrop-filter blur*.
   - Output dikompresi otomatis (`--style=compressed --no-source-map`) menjadi **16 KB**.

3. **3D Interactive Studio (WebGL / Three.js):**
   - Model 3D tongkol jagung resolusi tinggi (`jagung.glb`) dapat diputar 360°, di-zoom, dan diinspeksi secara real-time di 60 FPS.
   - Efek latar belakang partikel serbuk sari emas (*golden pollen dust*) bertenaga HTML5 Canvas 2D.

4. **Lab Pertumbuhan Interaktif:**
   - Slider dinamik dari 0 hingga 120 Hari Setelah Tanam (HST).
   - Menampilkan transisi fase agronomis dari *Emergensi (VE)*, *Elongasi (V6)*, *Silking (R1)*, hingga *Kematangan Fisiologis (R6)*.

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
- `gfortran` (GNU Fortran 14+)
- `sass` (Dart Sass 1.107+)
- `python3` (Python 3.10+)

### 2. Kompilasi & Jalankan
```bash
# Clone repositori
git clone https://github.com/rezkyekaputra/jagung-site.git
cd jagung-site

# Kompilasi Fortran & Sass
make build

# Jalankan web server lokal
make serve
```

Buka browser di: **`http://localhost:8080`**

### 3. Perintah Tambahan
```bash
make test    # Uji otomatis semua endpoint HTTP dan asset 3D
make watch   # Mode dev watcher otomatis untuk SCSS
make clean   # Bersihkan file binary kompilasi
```

---

## 📁 Struktur Direktori

```
jagungnidun/
├── Makefile               # Orchestrator kompilasi & testing
├── README.md              # Dokumentasi proyek
├── server.py              # Server lokal Python dengan MIME-types akurat
├── jagung_engine.f90      # Source code Fortran 14 komputasi biometrik
├── src/
│   └── scss/
│       ├── _corn_tokens.scss  # Token & keyframes hasil auto-generate Fortran
│       └── style.scss         # Stylesheet utama Dart Sass
└── public/
    ├── index.html             # Halaman web single-page utama
    ├── data_corn.json         # Dataset pertumbuhan 120 HST hasil Fortran
    ├── css/
    │   └── style.min.css      # CSS minified hasil kompilasi Dart Sass
    ├── js/
    │   ├── app.js             # Runtime interaktif slider & canvas pollen
    │   └── model-viewer.min.js# Engine 3D Model Viewer WebGL
    └── models/
        └── jagung.glb         # Aset 3D model tongkol jagung (1.9 MB)
```

---

## 📜 Lisensi
MIT License © 2026 **Cefneal / rezkyekaputra**
