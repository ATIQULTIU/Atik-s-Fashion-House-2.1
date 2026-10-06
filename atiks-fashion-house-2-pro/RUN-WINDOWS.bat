@echo off
setlocal
cd /d "%~dp0"
echo ================================================
echo   Atik's Fashion House - Windows Launcher
echo ================================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  echo Install Node.js from https://nodejs.org/en/download
  pause
  exit /b 1
)
node -v
echo.
if not exist node_modules (
  echo Installing project dependencies. This may take a minute...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed. Check your internet connection and npm error above.
    pause
    exit /b 1
  )
)
if not exist .env copy .env.example .env >nul
call npm start
pause
