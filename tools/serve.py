#!/usr/bin/env python3
"""Serve the site for a local run: this Mac only, and never cached.

Caching off, so a reload always shows the files as saved: a browser that kept
an old forms.js once ran it against a new content.js. Bound to 127.0.0.1,
because site/data/endpoint.local.json (this machine's live form endpoint)
sits in the served folder and must not be readable from the network.

Usage: python3 tools/serve.py [port] [directory]   (defaults: 8765, site)
"""
import functools
import http.server
import sys


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    directory = sys.argv[2] if len(sys.argv) > 2 else "site"
    handler = functools.partial(NoStoreHandler, directory=directory)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    print("Serving " + directory + " at http://127.0.0.1:" + str(port) + "/ (no cache)", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
