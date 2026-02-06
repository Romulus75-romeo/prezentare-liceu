@echo off
echo ========================================
echo PUSH to GitHub
echo ========================================
echo.

echo Această comandă va face push la repository-ul GitHub.
echo.
echo IMPORTANT: Asigură-te că ai creat repository-ul pe GitHub mai întâi!
echo           https://github.com/romulus75-romeo/prezentare-liceu
echo.
set /p confirm="Ai creat deja repository-ul? (da/nu): "

if /i not "%confirm%"=="da" (
    echo.
    echo Te rog creează mai întâi repository-ul pe GitHub:
    echo 1. Mergi la https://github.com/new
    echo 2. Nume: prezentare-liceu
    echo 3. Public
    echo 4. Click "Create repository"
    echo.
    pause
    exit /b
)

echo.
echo [1/3] Adăugare remote origin...
git remote add origin https://github.com/romulus75-romeo/prezentare-liceu.git

echo.
echo [2/3] Redenumire branch la main...
git branch -M main

echo.
echo [3/3] Push către GitHub...
git push -u origin main

echo.
echo ========================================
echo SUCCES!
echo ========================================
echo.
echo Codul a fost încărcat pe GitHub!
echo.
echo URMĂTORII PAȘI - Activare GitHub Pages:
echo.
echo 1. Mergi la: https://github.com/romulus75-romeo/prezentare-liceu/settings/pages
echo 2. Source: Deploy from branch
echo 3. Branch: main
echo 4. Folder: / (root)
echo 5. Click Save
echo.
echo După 2-3 minute, site-ul va fi live la:
echo https://romulus75-romeo.github.io/prezentare-liceu/
echo.
pause
