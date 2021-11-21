#!/usr/bin/env python3
import http.server
import socketserver

Handler = http.server.SimpleHTTPRequestHandler

def run(port=8080):

    with socketserver.TCPServer(("", port), Handler) as httpd:

        print("Web Server is running at http://localhost:%s" %port)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        httpd.server_close()
        print('Stopping Server')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()