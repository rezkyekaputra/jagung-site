// ==============================================================================
// JAGUNG NIDUN · CLIENT-SIDE INTERACTIVITY & PHYSICS RUNTIME
// Mengatur Slider Biometrik Fortran, Canvas Golden Pollen, & 3D Model Viewer
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initPollenCanvas();
  initGrowthLab();
  initRomanzaToggle();
  initFaseShowcase();
});

// ------------------------------------------------------------------------------
// 1. GOLDEN POLLEN DUST CANVAS ANIMATION (Partikel Serbuk Sari Emas)
// ------------------------------------------------------------------------------
function initPollenCanvas() {
  const canvas = document.getElementById('pollenCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 65;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.15),
      speedX: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.65 + 0.25,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.phase += 0.02;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.phase) * 0.35;

      // Wrap around screen
      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // Render glowing golden pollen particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha * (0.8 + 0.2 * Math.sin(p.phase))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

// ------------------------------------------------------------------------------
// 2. INTERACTIVE CORN GROWTH LAB (SIMULATOR BIOMETRIK ZEAL MAYS)
// ------------------------------------------------------------------------------
function initGrowthLab() {
  const slider = document.getElementById('daySlider');
  const badgeDay = document.getElementById('badgeDay');
  const stageCode = document.getElementById('stageCode');
  const stageName = document.getElementById('stageName');
  const stageDesc = document.getElementById('stageDesc');

  const valHeight = document.getElementById('valHeight');
  const valBiomass = document.getElementById('valBiomass');
  const valGdd = document.getElementById('valGdd');
  const valMoisture = document.getElementById('valMoisture');

  if (!slider) return;

  // Formula Sigmoid & Biometrik Fortran yang di-replicate ke Client JS
  // H(t) = 265 / (1 + exp(-0.085 * (t - 44)))
  function calculateCornBiometrics(day) {
    const t = parseFloat(day);
    const height = (265.0 / (1.0 + Math.exp(-0.085 * (t - 44.0)))).toFixed(1);
    const biomass = (380.0 / (1.0 + Math.exp(-0.078 * (t - 60.0)))).toFixed(1);
    const gdd = (t * 18.2).toFixed(0);

    let moisture;
    if (t < 65) {
      moisture = (85.0).toFixed(1);
    } else {
      const drop = (85.0 - 14.5) * Math.pow((t - 65.0) / 55.0, 1.25);
      moisture = Math.max(14.5, 85.0 - drop).toFixed(1);
    }

    // Penentuan Fase Agronomi Jagung
    let code = 'VE';
    let name = 'Emergensi (Tunas Awal)';
    let desc = 'Koleoptil menembus tanah, akar seminal mulai menyerap nutrisi.';

    if (t >= 15 && t < 30) {
      code = 'V3';
      name = 'Fase Daun Tiga (V3)';
      desc = 'Akar nodal aktif mengambil alih nutrisi dari biji ke fotosintesis mandiri.';
    } else if (t >= 30 && t < 48) {
      code = 'V6';
      name = 'Fase Elongasi Batang (V6)';
      desc = 'Titik tumbuh muncul di atas tanah, inisiasi bakal tongkol dan akar tunjang.';
    } else if (t >= 48 && t < 62) {
      code = 'V12';
      name = 'Diferensiasi Tongkol (V12)';
      desc = 'Potensi jumlah baris biji pada tongkol ditetapkan secara permanen.';
    } else if (t >= 62 && t < 70) {
      code = 'VT';
      name = 'Tasseling (Bunga Jantan)';
      desc = 'Malai bunga jantan mekar penuh, melepaskan hingga 5 juta butir serbuk sari.';
    } else if (t >= 70 && t < 80) {
      code = 'R1';
      name = 'Silking (Polinasi Rambut)';
      desc = 'Rambut tongkol siap menangkap serbuk sari, periode paling kritis kebutuhan air.';
    } else if (t >= 80 && t < 92) {
      code = 'R3';
      name = 'Milk Stage (Fase Masak Susu)';
      desc = 'Endosperma terisi cairan pati putih manis, biji mengembang pesat.';
    } else if (t >= 92 && t < 110) {
      code = 'R5';
      name = 'Dent Stage (Fase Biji Cekung)';
      desc = 'Pati mengering membentuk lekukan mahkota biji (dent) khas varietas unggul.';
    } else if (t >= 110) {
      code = 'R6';
      name = 'Kematangan Fisiologis (Black Layer)';
      desc = 'Lapisan hitam terbentuk di pangkal biji, fotosintat berhenti masuk. Siap panen raya!';
    }

    return { height, biomass, gdd, moisture, code, name, desc };
  }

  function updateDisplay(day) {
    const data = calculateCornBiometrics(day);

    badgeDay.textContent = `${day} HST`;
    stageCode.textContent = data.code;
    stageName.textContent = data.name;
    stageDesc.textContent = data.desc;

    valHeight.textContent = data.height;
    valBiomass.textContent = data.biomass;
    valGdd.textContent = data.gdd;
    valMoisture.textContent = `${data.moisture}%`;
  }

  slider.addEventListener('input', (e) => {
    updateDisplay(e.target.value);
  });

  // Nilai awal: 72 HST (Fase Silking / Rambut Emas)
  updateDisplay(slider.value);
}

// ------------------------------------------------------------------------------
// 3. ROMANZA PURE SASS RENDER TOGGLE (SWITCHER ANTARA BASE64 VS PURE CSS ART)
// ------------------------------------------------------------------------------
function initRomanzaToggle() {
  const btnSassUri = document.getElementById('btnSassUri');
  const btnCssArt = document.getElementById('btnCssArt');
  const panelEmbedded = document.getElementById('panelEmbedded');
  const panelCssArt = document.getElementById('panelCssArt');
  const badgeSassRender = document.getElementById('badgeSassRender');

  if (!btnSassUri || !btnCssArt || !panelEmbedded || !panelCssArt) return;

  btnSassUri.addEventListener('click', () => {
    btnSassUri.classList.add('active');
    btnCssArt.classList.remove('active');
    panelEmbedded.classList.add('active');
    panelCssArt.classList.remove('active');
    badgeSassRender.textContent = '🎨 Sass Embedded URI · 100% via Stylesheet';
  });

  btnCssArt.addEventListener('click', () => {
    btnCssArt.classList.add('active');
    btnSassUri.classList.remove('active');
    panelCssArt.classList.add('active');
    panelEmbedded.classList.remove('active');
    badgeSassRender.textContent = '✨ Pure CSS Art · 3.587 Box-Shadow Pixels';
  });
}

// ------------------------------------------------------------------------------
// 4. 5 FASE PERTUMBUHAN BOTANI TABS & 3D SWITCHER
// ------------------------------------------------------------------------------
function initFaseShowcase() {
  const tabs = document.querySelectorAll('.fase-visual-tabs .tab-btn');
  const panels = document.querySelectorAll('.fase-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.dataset.targetPanel;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  const btnInspectFase3D = document.getElementById('btnInspectFase3D');
  if (btnInspectFase3D) {
    btnInspectFase3D.addEventListener('click', () => {
      const btnModelTimeline = document.getElementById('btnModelTimeline');
      const btnModelCob = document.getElementById('btnModelCob');
      if (btnModelTimeline && btnModelCob) {
        btnModelTimeline.classList.add('active');
        btnModelCob.classList.remove('active');
      }
      if (window.cornShaderStudio) {
        window.cornShaderStudio.loadCornModel('models/fase_pertumbuhan_jagung.glb');
      }
      const studioSec = document.getElementById('3d-studio');
      if (studioSec) {
        studioSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
