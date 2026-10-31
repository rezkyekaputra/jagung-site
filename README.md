# JagungNidun 🌽 · Agro-Tech Futuristik

> Website agrikultur modern dan visualisasi biometrik tanaman jagung (*Zea mays L.*) berbasis **GNU Fortran 14**, **Dart Sass 1.107**, **Three.js WebGL**, dan **GLSL Custom Shaders (Visual FX)**.

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

3. **3D Interactive Studio (Three.js + GLSL Visual FX):**
   - Model 3D tongkol jagung (`jagung.glb`) dirender dengan engine Three.js murni di 60 FPS.
   - **GLSL Subsurface Scattering (SSS):** Mensimulasikan transmisi cahaya menembus bulir jagung kuning transparan dan kilau mentega basah (*buttery moisture sheen*).
   - **GLSL Biometric Heatmap:** Memetakan gradien akumulasi GDD dan kadar air dari pangkal batang hingga rambut tongkol.
   - **3D GPU Golden Pollen Particles:** 750 partikel serbuk sari emas melayang dalam koordinat silindrikal 3D bertenaga GLSL Vertex & Fragment Shader.
   - Interaksi HUD realtime: switcher mode shader, slider intensitas kilau SSS, slider kadar air bulir, dan auto-rotation.

4. **Lab Pertumbuhan Interaktif:**
   - Slider dinamik dari 0 hingga 120 Hari Setelah Tanam (HST).
   - Menampilkan transisi fase agronomis dari *Emergensi (VE)*, *Elongasi (V6)*, *Silking (R1)*, hingga *Kematangan Fisiologis (R6)*.

5. **Deploy Otomatis ke GitHub Pages:**
   - Dilengkapi pipeline CI/CD GitHub Actions (`.github/workflows/deploy.yml`) untuk kompilasi dan deploy otomatis ke GitHub Pages saat `git push origin master`.

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

## 📁 Struktur Direktori (GitHub Pages Ready)

```
jagungnidun/
├── .nojekyll              # Bypass Jekyll processing untuk GitHub Pages
├── index.html             # Halaman web single-page utama (Root Entry)
├── data_corn.json         # Dataset pertumbuhan 120 HST hasil Fortran
├── Makefile               # Orchestrator kompilasi & testing
├── README.md              # Dokumentasi proyek
├── server.py              # Server lokal Python dengan MIME-types akurat
├── jagung_engine.f90      # Source code Fortran 14 komputasi biometrik
├── css/
│   └── style.min.css      # CSS minified hasil kompilasi Dart Sass
├── js/
│   ├── app.js             # Runtime interaktif slider & canvas pollen
│   ├── three_studio.js    # Interactive Three.js & GLSL Shader Studio
│   └── model-viewer.min.js# Engine 3D Model Viewer WebGL
├── images/
│   └── romanza.png        # Foto mentah jagung manis varietas Romanza (281 KB)
├── models/
│   └── jagung.glb         # Aset 3D model tongkol jagung (1.9 MB)
└── src/
    └── scss/
        ├── _corn_tokens.scss    # Token & keyframes hasil auto-generate Fortran
        ├── _romanza_tokens.scss # Token warna hasil ekstraksi foto romanza.png
        ├── _romanza_art.scss    # Konversi foto ke Sass (Base64 URI & 3.5k Pure CSS Box-Shadow Art)
        └── style.scss           # Stylesheet utama Dart Sass
```

---

## 📜 Lisensi
MIT License © 2026 **Cefneal / rezkyekaputra**
