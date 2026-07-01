from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse


class SpaHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        requested = Path(self.translate_path(self.path))
        if not requested.exists() and "." not in Path(self.path).name:
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), SpaHandler)
    print(f"Serving SPA on http://{args.host}:{args.port}", flush=True)
    server.serve_forever()
