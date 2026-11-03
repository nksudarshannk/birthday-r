@echo off
title Flying Boss - Birthday Surprise Server
cd /d "%~dp0"
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node server.js
) else (
    echo Node.js not detected in PATH. Opening index.html directly...
    start "" index.html
)
pause
