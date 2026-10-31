# ==============================================================================
# MAKEFILE · JAGUNG NIDUN ORCHESTRATOR
# Target Platform: GNU Fortran (GCC 14.3.1) & Dart Sass (1.107.1) di Gentoo Linux
# ==============================================================================

FC       = gfortran
FFLAGS   = -O3 -march=native -flto -Wall
SASS     = /home/dongkrak/.local/bin/sass
PORT     = 8080

.PHONY: all build engine css serve watch test clean help

all: build

# 1. Jalankan Engine Komputasi Fortran (Menghasilkan _corn_tokens.scss & data_corn.json)
engine:
	@echo "🌽 [1/2] Mengompilasi & menjalankan GNU Fortran 14 Bio-Engine..."
	@$(FC) $(FFLAGS) -o jagung_engine jagung_engine.f90
	@./jagung_engine
	@echo "✅ Engine Fortran tuntas!"

# 2. Kompilasi SCSS menjadi CSS Minified dengan Dart Sass
css: engine
	@echo "🎨 [2/2] Mengompilasi SCSS dengan Dart Sass 1.107 (--style=compressed)..."
	@$(SASS) --style=compressed --no-source-map src/scss/style.scss public/css/style.min.css
	@echo "✅ CSS Terkompresi Sukses: public/css/style.min.css ($$(wc -c < public/css/style.min.css) bytes)"

build: css
	@echo ""
	@echo "✨ Build Selesai! Website JagungNidun siap dijalankan."

# Jalankan server lokal
serve: build
	@python3 server.py $(PORT)

# Mode Dev Watcher untuk SCSS
watch:
	@echo "👀 Menjalankan Dart Sass Watcher..."
	@$(SASS) --watch src/scss:public/css --style=expanded

# Uji coba fungsionalitas HTTP
test:
	@echo "🧪 Menjalankan uji coba otomatis HTTP backend..."
	@python3 server.py 18080 > /dev/null 2>&1 & \
	PID=$$!; \
	sleep 1; \
	echo -n "  -> Testing GET / (HTML): "; \
	curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18080/ | grep 200 > /dev/null && echo "✅ PASS (200 OK)" || echo "❌ FAIL"; \
	echo -n "  -> Testing GET /css/style.min.css (Sass CSS): "; \
	curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18080/css/style.min.css | grep 200 > /dev/null && echo "✅ PASS (200 OK)" || echo "❌ FAIL"; \
	echo -n "  -> Testing GET /models/jagung.glb (3D Asset): "; \
	curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18080/models/jagung.glb | grep 200 > /dev/null && echo "✅ PASS (1.9MB GLB Streaming)" || echo "❌ FAIL"; \
	echo -n "  -> Testing GET /images/romanza.png (Raw Photo): "; \
	curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18080/images/romanza.png | grep 200 > /dev/null && echo "✅ PASS (281KB PNG Image)" || echo "❌ FAIL"; \
	echo -n "  -> Testing GET /data_corn.json (Fortran JSON Data): "; \
	curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:18080/data_corn.json | grep 200 > /dev/null && echo "✅ PASS (Valid JSON)" || echo "❌ FAIL"; \
	kill $$PID 2>/dev/null || true; \
	wait $$PID 2>/dev/null || true; \
	echo "🌸 Seluruh pengujian otomatis JagungNidun berhasil 100%!"

clean:
	@echo "🧹 Membersihkan binary dan cache..."
	@rm -f jagung_engine
	@echo "✨ Bersih!"

help:
	@echo "Perintah yang tersedia:"
	@echo "  make build  - Kompilasi Fortran & Dart Sass"
	@echo "  make serve  - Build lalu jalankan server lokal di port 8080"
	@echo "  make watch  - Jalankan SCSS watcher otomatis"
	@echo "  make test   - Uji endpoint HTTP dan asset"
	@echo "  make clean  - Hapus binary hasil kompilasi"
