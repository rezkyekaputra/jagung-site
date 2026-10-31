// ==============================================================================
// JAGUNG NIDUN · THREE.JS + CUSTOM GLSL SHADER STUDIO
// Menghidupkan Model 3D Jagung (jagung.glb) dengan Shader GLSL Visual FX
// ==============================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class CornShaderStudio {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.cornModel = null;
    this.pollenPoints = null;
    this.pbrMaterials = new Map(); // Simpan material asli GLB
    this.clock = new THREE.Clock();

    // Shader Uniforms
    this.uniforms = {
      uTime: { value: 0.0 },
      uColorCore: { value: new THREE.Color(0xf59e0b) }, // Golden Maize
      uColorGlow: { value: new THREE.Color(0xfbbf24) }, // Radiant Glow
      uGlowIntensity: { value: 1.2 },
      uMoisture: { value: 0.85 },
      uLightPosition: { value: new THREE.Vector3(5.0, 8.0, 5.0) },
    };

    this.activeShaderMode = 'pbr'; // 'pbr', 'glsl-sss', 'glsl-heatmap', 'glsl-wireframe'
    this.autoRotate = true;
    this.rotationSpeed = 0.008;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 580;

    // 1. Scene & Background
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0.8, 5.2);

    // 3. Renderer dengan Anti-Aliasing & Tone Mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 10;
    this.controls.minDistance = 1.5;
    this.controls.target.set(0, 0, 0);

    // 5. Pencahayaan
    this.setupLights();

    // 6. 3D GLSL Particle Cloud (Serbuk Sari Emas di Ruang 3D)
    this.setupGpuPollenParticles();

    // 7. Load GLTF / GLB Model Jagung
    this.loadCornModel();

    // 8. Event Listener Resize
    window.addEventListener('resize', () => this.onWindowResize());

    // 9. Pasang Interaksi UI HUD
    this.setupUIControls();

    // 10. Mulai Render Loop
    this.animate();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    this.scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfffaed, 2.8);
    mainSun.position.set(5, 8, 5);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    this.scene.add(mainSun);

    const rimLight = new THREE.DirectionalLight(0x10b981, 1.5); // Emerald rim light
    rimLight.position.set(-6, -2, -5);
    this.scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xf59e0b, 2.0, 12);
    warmFill.position.set(0, -3, 3);
    this.scene.add(warmFill);
  }

  setupGpuPollenParticles() {
    const count = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 1.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 5.0;

      positions[i * 3 + 0] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      scales[i] = 0.8 + Math.random() * 1.6;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    // Custom GLSL Shader untuk Serbuk Sari Emas 3D
    const particleVertexShader = `
      uniform float uTime;
      attribute float aScale;
      attribute float aPhase;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        float angle = uTime * 0.25 + aPhase;
        float dist = length(pos.xz);
        
        // Gerakan spiral melayang naik perlahan
        pos.x = cos(angle) * dist;
        pos.z = sin(angle) * dist;
        pos.y = mod(pos.y + uTime * 0.35 + 2.5, 5.0) - 2.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (aScale * 38.0) / -mvPosition.z;
        vAlpha = 0.35 + 0.45 * sin(uTime * 2.0 + aPhase);
      }
    `;

    const particleFragmentShader = `
      varying float vAlpha;

      void main() {
        // Lingkaran partikel halus (Soft Circular Radial Falloff)
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float glow = pow(1.0 - (dist * 2.0), 1.8);
        vec3 goldColor = mix(vec3(0.96, 0.62, 0.04), vec3(0.99, 0.82, 0.25), glow);
        gl_FragColor = vec4(goldColor, vAlpha * glow);
      }
    `;

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: this.uniforms.uTime,
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.pollenPoints = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.pollenPoints);
  }

  loadCornModel() {
    const loader = new GLTFLoader();
    const loadingElem = document.getElementById('threeLoading');
    if (loadingElem) loadingElem.style.display = 'flex';

    loader.load(
      'models/jagung.glb',
      (gltf) => {
        this.cornModel = gltf.scene;

        // Auto Center & Scale
        const box = new THREE.Box3().setFromObject(this.cornModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / maxDim;

        this.cornModel.position.sub(center.multiplyScalar(scale));
        this.cornModel.scale.setScalar(scale);

        // Simpan material PBR asli
        this.cornModel.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            this.pbrMaterials.set(node.id, node.material);
          }
        });

        this.scene.add(this.cornModel);
        if (loadingElem) loadingElem.style.display = 'none';

        // Update Shader Materials
        this.createCustomShaderMaterials();
      },
      undefined,
      (err) => {
        console.error('Gagal memuat jagung.glb di Three.js:', err);
        if (loadingElem) loadingElem.innerText = '❌ Gagal memuat model 3D';
      }
    );
  }

  createCustomShaderMaterials() {
    // -------------------------------------------------------------------------
    // 1. GLSL GOLDEN SUBSURFACE SCATTERING (SSS) & MOISTURE BUTTERY SHEEN
    // -------------------------------------------------------------------------
    const sssVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vPosition = position;
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const sssFragmentShader = `
      uniform float uTime;
      uniform vec3 uColorCore;
      uniform vec3 uColorGlow;
      uniform float uGlowIntensity;
      uniform float uMoisture;
      uniform vec3 uLightPosition;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(uLightPosition - vPosition);

        // Diffuse Lambertian
        float NdotL = max(dot(normal, lightDir), 0.0);

        // Subsurface Scattering (Cahaya menembus biji jagung kuning transparan)
        vec3 sssLightDir = lightDir + normal * 0.4;
        float sssTerm = max(dot(viewDir, -sssLightDir), 0.0);
        sssTerm = pow(sssTerm, 2.6) * 2.2;

        // Fresnel Rim Light (Kilau transparan kulit bulir jagung)
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

        // Specular Blinn-Phong (Kilau mentega basah / bulir manis)
        vec3 halfVec = normalize(lightDir + viewDir);
        float NdotH = max(dot(normal, halfVec), 0.0);
        float specular = pow(NdotH, 42.0) * uMoisture * 2.5;

        // Denyut Fotosintesis Zea Mays (Formula Fortran)
        float pulse = 0.96 + 0.04 * sin(uTime * 3.5);

        // Komposisi Warna Emas Jagung
        vec3 baseGold = mix(uColorCore, uColorGlow, clamp(vPosition.y * 0.3 + 0.5, 0.0, 1.0));
        vec3 color = baseGold * (NdotL * 0.65 + 0.35) * pulse;
        color += uColorGlow * sssTerm * uGlowIntensity;
        color += vec3(1.0, 0.92, 0.65) * fresnel * uGlowIntensity * 0.75;
        color += vec3(1.0, 1.0, 0.95) * specular;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.matGlslSss = new THREE.ShaderMaterial({
      vertexShader: sssVertexShader,
      fragmentShader: sssFragmentShader,
      uniforms: this.uniforms,
    });

    // -------------------------------------------------------------------------
    // 2. GLSL BIOMETRIC GROWTH HEATMAP (Peta Distribusi GDD & Kadar Air)
    // -------------------------------------------------------------------------
    const heatmapFragmentShader = `
      uniform float uTime;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        // Normalisasi elevasi batang ke tongkol (Y-Axis)
        float yNorm = clamp((vPosition.y + 1.6) / 3.2, 0.0, 1.0);

        // Palet Biometrik: Pangkal (Hijau Batang) -> Tongkol (Emas) -> Rambut (Coklat Amber)
        vec3 colBase = vec3(0.06, 0.72, 0.45);   // Emerald Stalk
        vec3 colCob  = vec3(0.96, 0.75, 0.12);   // Golden Kernel
        vec3 colSilk = vec3(0.85, 0.42, 0.05);   // Amber Silk

        vec3 color = yNorm < 0.5 ? mix(colBase, colCob, yNorm * 2.0) : mix(colCob, colSilk, (yNorm - 0.5) * 2.0);

        // Kontur Isoline Biometrik Berjalan (Radar Scan)
        float contour = sin(vPosition.y * 28.0 - uTime * 2.5);
        if (abs(contour) > 0.88) {
          color += vec3(0.35, 0.35, 0.1);
        }

        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.2);
        color += rim * vec3(0.2, 0.8, 0.4);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.matGlslHeatmap = new THREE.ShaderMaterial({
      vertexShader: sssVertexShader,
      fragmentShader: heatmapFragmentShader,
      uniforms: this.uniforms,
    });

    // -------------------------------------------------------------------------
    // 3. GLSL CYBER-AGRO WIREFRAME PULSE
    // -------------------------------------------------------------------------
    this.matGlslWireframe = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      wireframe: true,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
    });
  }

  setShaderMode(mode) {
    if (!this.cornModel) return;
    this.activeShaderMode = mode;

    this.cornModel.traverse((node) => {
      if (node.isMesh) {
        if (mode === 'pbr') {
          node.material = this.pbrMaterials.get(node.id);
        } else if (mode === 'glsl-sss') {
          node.material = this.matGlslSss;
        } else if (mode === 'glsl-heatmap') {
          node.material = this.matGlslHeatmap;
        } else if (mode === 'glsl-wireframe') {
          node.material = this.matGlslWireframe;
        }
      }
    });

    // Update Label UI
    const modeLabel = document.getElementById('activeShaderBadge');
    if (modeLabel) {
      const names = {
        'pbr': 'PBR Photorealistic',
        'glsl-sss': 'GLSL Golden SSS (Subsurface Glow)',
        'glsl-heatmap': 'GLSL Biometric Heatmap (GDD)',
        'glsl-wireframe': 'GLSL Cyber-Agro Mesh',
      };
      modeLabel.innerText = names[mode] || mode;
    }
  }

  setupUIControls() {
    // Mode Buttons
    const buttons = document.querySelectorAll('[data-shader-mode]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.setShaderMode(btn.dataset.shaderMode);
      });
    });

    // Sliders
    const sliderGlow = document.getElementById('sliderShaderGlow');
    if (sliderGlow) {
      sliderGlow.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.uniforms.uGlowIntensity.value = val;
        const valLabel = document.getElementById('valShaderGlow');
        if (valLabel) valLabel.innerText = val.toFixed(1) + 'x';
      });
    }

    const sliderMoisture = document.getElementById('sliderShaderMoisture');
    if (sliderMoisture) {
      sliderMoisture.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.uniforms.uMoisture.value = val;
        const valLabel = document.getElementById('valShaderMoisture');
        if (valLabel) valLabel.innerText = Math.round(val * 100) + '%';
      });
    }

    // Auto Rotate Toggle
    const toggleRotate = document.getElementById('btnToggleRotate');
    if (toggleRotate) {
      toggleRotate.addEventListener('click', () => {
        this.autoRotate = !this.autoRotate;
        toggleRotate.classList.toggle('active', this.autoRotate);
      });
    }

    // Reset Camera
    const btnResetCam = document.getElementById('btnResetCamera');
    if (btnResetCam) {
      btnResetCam.addEventListener('click', () => {
        this.camera.position.set(0, 0.8, 5.2);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
      });
    }
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Update Uniforms
    this.uniforms.uTime.value = elapsedTime;

    // Auto-Rotate Model Jagung
    if (this.autoRotate && this.cornModel) {
      this.cornModel.rotation.y += this.rotationSpeed;
    }

    // Rotasi awan serbuk sari perlahan
    if (this.pollenPoints) {
      this.pollenPoints.rotation.y += 0.0015;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  const studio = new CornShaderStudio('threeStudioContainer');
  window.cornShaderStudio = studio;
});
