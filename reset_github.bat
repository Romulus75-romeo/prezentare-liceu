@echo off
echo ========================================
echo Reset si Push Fresh la GitHub
echo ========================================
echo.

echo Pasul 1: Sterge folderul .git existent...
if exist .git (
    rmdir /s /q .git
    echo [OK] Folderul .git a fost sters
) else (
    echo [INFO] Nu exista folder .git
)
echo.

echo Pasul 2: Initializeaza repository nou...
git init
echo [OK] Repository initializat
echo.

echo Pasul 3: Adauga toate fisierele...
git add .
echo [OK] Fisiere adaugate
echo.

echo Pasul 4: Creaza commit initial...
git commit -m "Initial commit - Fresh upload"
echo [OK] Commit creat
echo.

echo Pasul 5: Seteaza branch-ul main...
git branch -M main
echo [OK] Branch setat pe main
echo.

echo Pasul 6: Adauga remote origin...
git remote add origin https://github.com/Romulus75-romeo/prezentare-liceu.git
echo [OK] Remote origin adaugat
echo.

echo Pasul 7: Push la GitHub...
git push -u origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo [SUCCESS] Repository uploadat cu succes!
    echo ========================================
    echo.
    echo Acum activeaza GitHub Pages:
    echo 1. Mergi la: https://github.com/Romulus75-romeo/prezentare-liceu/settings/pages
    echo 2. La "Source" selecteaza "Deploy from a branch"
    echo 3. La "Branch" selecteaza "main" si "/ (root)"
    echo 4. Click pe "Save"
    echo.
    echo Site-ul tau va fi live la:
    echo https://romulus75-romeo.github.io/prezentare-liceu/
    echo.
) else (
    echo ========================================
    echo [ERROR] A aparut o eroare la push!
    echo ========================================
    echo.
    echo Verifica ca ai sters si recreat repository-ul pe GitHub
    echo Link: https://github.com/Romulus75-romeo/prezentare-liceu
)

echo.
pause
