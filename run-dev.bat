@echo off
set "PATH=%PATH%;C:\Users\sreej\nodejs"
cd /d "%~dp0"
echo Starting Game Intelligence Platform...
call npm run dev
pause
