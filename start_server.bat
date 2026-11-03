@echo off
echo ========================================================
echo   Flying Boss - Birthday Surprise Local Server
echo   (Open on this PC or send link to Mobile Phone!)
echo ========================================================
echo.
python -m http.server 8080
if %ERRORLEVEL% NEQ 0 (
    echo Python not found, opening index.html directly...
    start "" "%~dp0index.html"
)
pause
