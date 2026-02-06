@echo off
echo ========================================
echo RESET COMPLET SI FORCE PUSH LA GITHUB
echo ========================================
echo.
echo ATENTIE: Aceasta va sterge tot istoricul si va crea unul nou!
echo.
pause
echo.

echo Pasul 1: Backup si stergere folder .git...
if exist .git.backup (
    rmdir /s /q .git.backup
)
if exist .git (
    move .git .git.backup
    echo [OK] Backup creat in .git.backup
)
echo.

echo Pasul 2: Initializeaza repository nou...
git init
git branch -M main
echo [OK] Repository initializat
echo.

echo Pasul 3: Adauga toate fisierele...
git add .
echo [OK] Fisiere adaugate
echo.

echo Pasul 4: Creaza commit initial...
git commit -m "Fresh start - Clean repository upload"
echo [OK] Commit creat
echo.

echo Pasul 5: Adauga remote (stergem daca exista)...
git remote remove origin 2>nul
git remote add origin https://github.com/Romulus75-romeo/prezentare-liceu.git
echo [OK] Remote setat
echo.

echo Pasul 6: FORCE PUSH la GitHub (suprascrie tot)...
echo ATENTIE: Se va suprascrie complet repository-ul de pe GitHub!
pause
git push -u --force origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo [SUCCESS] Repository uploadat cu succes!
    echo ========================================
    echo.
    echo Site-ul este disponibil la:
    echo https://romulus75-romeo.github.io/prezentare-liceu/
    echo.
    echo GitHub Pages se va actualiza automat in 1-2 minute.
    echo.
    
    echo Stergere backup vechi...
    if exist .git.backup (
        rmdir /s /q .git.backup
        echo [OK] Backup sters
    )
) else (
    echo ========================================
    echo [ERROR] A aparut o eroare la push!
    echo ========================================
    echo.
    echo Restaurare backup...
    if exist .git.backup (
        if exist .git (
            rmdir /s /q .git
        )
        move .git.backup .git
        echo [OK] Repository restaurat
    )
)

echo.
pause
