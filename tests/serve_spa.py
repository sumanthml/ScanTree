import http.server
import socketserver
import os
import sys

PORT = 8081
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

class SPADirectoryRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Translate the URL path to physical filesystem path
        translated_path = self.translate_path(self.path)
        
        # If the physical file does not exist, check if it's an SPA route
        if not os.path.exists(translated_path):
            base, ext = os.path.splitext(self.path)
            # If the route doesn't look like a static file (e.g., has no extension),
            # serve index.html to allow client-side routing to handle it
            if not ext:
                self.path = '/index.html'
        
        return super().do_GET()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        PORT = int(sys.argv[1])
    
    print(f"Starting SPA Static Server on port {PORT} serving {DIRECTORY}...")
    handler = SPADirectoryRequestHandler
    with socketserver.ThreadingTCPServer(("", PORT), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()
            sys.exit(0)
