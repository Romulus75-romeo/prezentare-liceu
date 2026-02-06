@echo off
echo ========================================
echo GitHub Repository Setup
echo ========================================
echo.

REM Verificare dacă git este instalat
git --version >nul 2>&1
if errorlevel 1 (
    echo EROARE: Git nu este instalat!
    echo Te rog instalează Git de la: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] Verificare Git - OK
echo.

REM Inițializare repository
if not exist ".git" (
    echo [2/5] Inițializare repository Git...
    git init
    echo Repository Git inițializat!
) else (
    echo [2/5] Repository Git deja existent
)
echo.

REM Adăugare fișiere
echo [3/5] Adăugare fișiere...
git add .
echo Fișiere adăugate!
echo.

REM Commit
echo [4/5] Creare commit inițial...
git commit -m "Initial commit - Proiect Liceu"
echo Commit creat!
echo.

echo [5/5] Repository local pregătit!
echo.
echo ========================================
echo PASI URMATORI:
echo ========================================
echo.
echo 1. Mergi pe https://github.com și loghează-te
echo 2. Click pe "+" (sus dreapta) -> "New repository"
echo 3. Nume repository (ex: proiect-liceu)
echo 4. Setează ca PUBLIC
echo 5. NU bifa "Initialize with README"
echo 6. Click "Create repository"
echo.
echo 7. Apoi rulează:
echo    git remote add origin https://github.com/USERNAME/REPO_NAME.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo Înlocuiește USERNAME și REPO_NAME cu ale tale!
echo.
pause
