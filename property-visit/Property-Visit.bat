@echo off
setlocal
cd /d "%~dp0"

if not exist "package.json" (
    echo Project files nahi mile. Launcher ko project folder se chalayein.
    pause
    exit /b 1
)

where node.exe >nul 2>&1
if errorlevel 1 (
    echo Node.js installed nahi hai.
    echo Pehle Node.js install karein: https://nodejs.org/
    pause
    exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo npm nahi mila. Node.js ko reinstall karein.
    pause
    exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
    echo Dependencies install ho rahi hain...
    call npm.cmd install
    if errorlevel 1 (
        echo Dependencies install nahi hui.
        pause
        exit /b 1
    )
)

set "APP_PORT=8080"
:choose_port
netstat -ano | findstr /C:":%APP_PORT% " | findstr /I "LISTENING" >nul
if errorlevel 1 goto port_ready
set /a APP_PORT+=1 >nul
if %APP_PORT% gtr 65535 goto no_port
goto choose_port

:port_ready
echo Property Visit app start ho rahi hai...
start "Property Visit Server" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --port %APP_PORT% --strictPort"

for /l %%i in (1,1,30) do (
    powershell -NoProfile -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port %APP_PORT% -InformationLevel Quiet" | findstr /I "True" >nul 2>&1
    if not errorlevel 1 goto open_app
    ping 127.0.0.1 -n 2 >nul
)

echo App start nahi hui. Server window mein error check karein.
pause
exit /b 1

:open_app
set "APP_URL=http://127.0.0.1:%APP_PORT%/"
echo Browser mein khol raha hoon: %APP_URL%
start "" "%APP_URL%"
endlocal
exit /b 0

:no_port
echo Koi free port nahi mila. Dusri apps band karke dobara chalayein.
pause
exit /b 1
