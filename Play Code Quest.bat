@echo off
title Code Quest
cd /d "%~dp0"
echo.
echo   ===============================
echo      C O D E   Q U E S T
echo   ===============================
echo.
where git >/dev/null 2>nul
if %errorlevel%==0 if exist ".git" (
  echo   Checking GitHub for game updates...
  git pull --ff-only --quiet >/dev/null 2>nul
  if errorlevel 1 (echo   Could not update. Playing your local copy.) else (echo   Game is up to date.)
)
echo   Opening the game in your browser...
start "" "%~dp0index.html"
timeout /t 2 >nul
