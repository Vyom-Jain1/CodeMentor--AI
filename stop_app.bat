@echo off
REM stop_app.bat – Stops the app (kills any cmd window running npm start)

echo Stopping app (killing any cmd window running npm start)...
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq npm start" /T
 
echo App stopped. 