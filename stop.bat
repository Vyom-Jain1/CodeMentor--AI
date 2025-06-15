@echo off
echo Stopping CodeMentor AI...

:: Kill processes on ports 3000 (frontend) and 5000 (backend)
echo Stopping Frontend (port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    if %errorlevel% equ 0 (
        echo Frontend process stopped successfully
    ) else (
        echo No frontend process found on port 3000
    )
)

echo Stopping Backend (port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    if %errorlevel% equ 0 (
        echo Backend process stopped successfully
    ) else (
        echo No backend process found on port 5000
    )
)

:: Stop MongoDB if running locally
echo Stopping MongoDB...
taskkill /F /IM mongod.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB stopped successfully
) else (
    echo No MongoDB process found
)

echo.
echo CodeMentor AI has been stopped.
echo.

timeout /t 2 /nobreak
