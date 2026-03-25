@echo off
REM SparksStream Build Script for Windows
REM This script builds the frontend and prepares the application for production

echo.
echo ========================================
echo   SparksStream Build Process
echo ========================================
echo.

REM Step 1: Check if Node.js is installed
echo Step 1: Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)
node -v
echo [OK] Node.js found
echo.

REM Step 2: Install frontend dependencies
echo Step 2: Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo [OK] Frontend dependencies already installed
)
cd ..
echo.

REM Step 3: Install backend dependencies
echo Step 3: Installing backend dependencies...
cd backend
if not exist "node_modules" (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo [OK] Backend dependencies already installed
)
cd ..
echo.

REM Step 4: Build frontend
echo Step 4: Building frontend for production...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend build completed successfully
cd ..
echo.

REM Step 5: Check if dist folder exists
echo Step 5: Verifying build output...
if exist "frontend\dist" (
    echo [OK] Build output found at frontend\dist\
) else (
    echo [ERROR] Build output not found
    pause
    exit /b 1
)
echo.

REM Step 6: Check environment files
echo Step 6: Checking environment configuration...
if exist "backend\.env" (
    echo [OK] Backend .env file found
) else (
    echo [WARNING] backend\.env file not found
    echo Please create backend\.env with required variables
)
echo.

REM Step 7: Create uploads directory if it doesn't exist
echo Step 7: Setting up uploads directory...
if not exist "backend\uploads" mkdir backend\uploads
echo [OK] Uploads directory ready
echo.

REM Success message
echo ========================================
echo   Build completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend\.env with your environment variables
echo 2. Start the server: cd backend ^&^& npm start
echo 3. Access the application at: http://localhost:5000
echo.
echo For production deployment, see DEPLOYMENT_GUIDE.md
echo.
pause
