#!/usr/bin/env python3
"""
==============================================================================
JAGUNG NIDUN · LOCAL DEVELOPMENT & ASSET SERVER
Menyajikan file statis (HTML, CSS minified, JS, JSON, dan 3D GLB Model)
dengan MIME-types yang akurat dan zero-cache untuk development.
==============================================================================
"""
import http.server
import socketserver
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

class JagungHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def guess_type(self, path):
        # Pastikan MIME types untuk 3D GLB dan CSS terdefinisi dengan tepat
        if path.endswith(".glb"):
            return "model/gltf-binary"
        elif path.endswith(".gltf"):
            return "model/gltf+json"
        elif path.endswith(".css"):
            return "text/css; charset=utf-8"
        elif path.endswith(".js"):
            return "application/javascript; charset=utf-8"
        elif path.endswith(".json"):
            return "application/json; charset=utf-8"
        return super().guess_type(path)

    def end_headers(self):
        # Header custom untuk optimasi
        self.send_header("X-Powered-By", "GNU Fortran 14.3.1 & Dart Sass 1.107")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), JagungHTTPHandler) as httpd:
        print("🌽 ============================================================")
        print(f"🚀 JagungNidun Web Server aktif di http://localhost:{PORT}")
        print("   Melayani: 3D GLB, Canvas Pollen, Dart Sass CSS, & Fortran JSON")
        print("   Tekan Ctrl + C untuk berhenti.")
        print("🌽 ============================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server dihentikan dengan aman.")
