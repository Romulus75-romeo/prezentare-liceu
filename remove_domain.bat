@echo off
echo ========================================
echo STERGERE CUSTOM DOMAIN DE PE GITHUB
echo ========================================
echo.

echo Pasul 1: Creare fisier CNAME gol pentru stergere...
echo. 2>CNAME
if exist CNAME (
    del CNAME
    echo [OK] Fisier CNAME sters local
)
echo.

echo Pasul 2: Verificare status Git...
git status
echo.

echo Pasul 3: Add si commit stergere CNAME...
git add -A
git commit -m "Remove custom domain - use GitHub Pages URL only"
echo.

echo Pasul 4: Push la GitHub...
git push origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo [SUCCESS] Custom domain sters!
    echo ========================================
    echo.
    echo Asteapta 2-3 minute si acceseaza:
    echo https://romulus75-romeo.github.io/prezentare-liceu/
    echo.
    echo SAU mai simplu:
    echo Deschide fisierul "Deschide_Site.html" de pe Desktop!
    echo.
) else (
    echo ========================================
    echo [WARNING] Posibil fara modificari
    echo ========================================
)

echo.
pause
