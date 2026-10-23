@echo off
cd /d "%~dp0"
echo Checking every level (free, no AI)...
node srcerify.js
echo.
echo Replaying saved player attempts...
node src	est-cases.js
pause
