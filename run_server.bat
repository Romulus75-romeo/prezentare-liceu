@echo off
echo Starting local web server on http://localhost:8000
echo.
echo Open in browser: http://localhost:8000/epas.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
