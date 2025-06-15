@echo off
echo Starting CodeMentor AI...

:: Set the base directory
set BASE_DIR=%~dp0

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed! Please install Node.js first.
    pause
    exit /b 1
)

:: Check for .env file
if not exist "%BASE_DIR%server\.env" (
    echo Error: .env file not found in server directory!
    echo Creating default .env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo MONGO_URI=mongodb://localhost:27017/codementor
        echo JWT_SECRET=your_jwt_secret_key_change_this
        echo JWT_EXPIRE=30d
        echo HF_API_KEY=your_huggingface_api_key
        echo AI_PROVIDER=huggingface
    ) > "%BASE_DIR%server\.env"
    echo Created default .env file. Please update it with your actual credentials.
    timeout /t 3 /nobreak
)

:: Start MongoDB (if running locally)
echo Checking MongoDB status...
mongod --version >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB is installed
    start "MongoDB" mongod
    timeout /t 2 /nobreak
) else (
    echo Warning: MongoDB is not installed. Make sure you're using MongoDB Atlas or have MongoDB running.
    timeout /t 3 /nobreak
)

:: Start the server
echo Starting backend server...
cd "%BASE_DIR%server"
if not exist node_modules (
    echo Installing server dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Error installing server dependencies!
        pause
        exit /b 1
    )
)
start cmd /k "title CodeMentor AI - Backend && npm start"

:: Wait for server to initialize
echo Waiting for server to initialize...
timeout /t 10 /nobreak

:: Start the client
echo Starting frontend client...
cd "%BASE_DIR%client"
if not exist node_modules (
    echo Installing client dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Error installing client dependencies!
        pause
        exit /b 1
    )
)
start cmd /k "title CodeMentor AI - Frontend && npm start"

echo.
echo CodeMentor AI is starting up. Please wait...
echo.
echo Server will be available at http://localhost:5000
echo Client will be available at http://localhost:3000
echo.
echo To stop the application, run stop.bat

:: Wait a moment before checking server status
timeout /t 5 /nobreak

:: Check if server is responding
curl -s http://localhost:5000/api/auth/check >nul 2>&1
if %errorlevel% equ 0 (
    echo Server is running successfully!
) else (
    echo Warning: Server might not be running properly.
    echo Please check the server console for errors.
    echo Common issues:
    echo 1. MongoDB not running
    echo 2. Missing environment variables
    echo 3. Port 5000 already in use
)

echo.
echo Press any key to exit...
pause >nul
