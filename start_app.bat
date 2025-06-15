@echo off
REM start_app.bat – Starts the app (all backend (server) and frontend (client) servers) in separate windows (and installs dependencies)

REM Check if a server folder exists and install dependencies (if it does) and then start the server (using start cmd.exe /k so that the terminal remains open)
if exist server (
  echo Installing dependencies (server)...
  cd server && npm install && cd ..
  echo Starting server (backend)...
  start cmd.exe /k "cd server && npm start"
) else (
  echo No server folder found. Skipping server (backend) start.
)

REM Check if a src folder (backend) exists and install dependencies (if it does) and then start it (using start cmd.exe /k so that the terminal remains open)
if exist src (
  echo Installing dependencies (src)...
  cd src && npm install && cd ..
  echo Starting src (backend)...
  start cmd.exe /k "cd src && npm start"
) else (
  echo No src folder (backend) found. Skipping src (backend) start.
)

REM Install dependencies (client) and then start the client (using start cmd.exe /k so that the terminal remains open)
echo Installing dependencies (client)...
cd client && npm install && cd ..
echo Starting client (frontend)...
start cmd.exe /k "cd client && npm start"

REM Open the frontend app in the default browser
start http://localhost:3000

echo App started. (All dependencies installed and all backend (server and src) and frontend (client) servers are running in separate windows.) 