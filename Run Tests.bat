@echo off
cd /d "%~dp0"
echo Checking every level (free, no AI)...
node src\verify.js
echo.
echo Replaying saved player attempts...
node src\test-cases.js
pause
