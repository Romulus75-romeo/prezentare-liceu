@echo off
echo ========================================
echo GitHub Repository - Push Instructions
echo ========================================
echo.

echo Repository local pregătit cu succes!
echo 79 fișiere au fost comise.
echo.
echo PAȘI URMĂTORI:
echo.
echo 1. Deschide browser și mergi pe: https://github.com/new
echo.
echo 2. Completează:
echo    Repository name: prezentare-liceu
echo    Description: Website de prezentare pentru Liceul Tehnologic Aurel Vlaicu
echo    Public (bifat)
echo    NU bifa "Add a README file"
echo.
echo 3. Click "Create repository"
echo.
echo 4. După creare, GitHub îți va arăta comenzi. Tu trebuie să rulezi:
echo.
echo    git remote add origin https://github.com/romulus75-romeo/prezentare-liceu.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 5. Pentru GitHub Pages:
echo    - Mergi la Settings -^> Pages
echo    - Source: Deploy from branch
echo    - Branch: main
echo    - Folder: / (root)
echo    - Save
echo.
echo Site-ul va fi disponibil la:
echo https://romulus75-romeo.github.io/prezentare-liceu/
echo.
echo Așteaptă 2-3 minute după push pentru ca site-ul să fie activ!
echo.
pause
