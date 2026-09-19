@echo off
title SATORI - Personal Admission Route
cd /d "%~dp0"
echo.
echo  SATORI - Personal Admission Route
echo  ---------------------------------
where node >nul 2>nul
if errorlevel 1 (
  echo  Node.js is not installed on this computer.
  echo  Download the LTS version from https://nodejs.org , install it, then double-click this file again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo  First start: installing the site building blocks. This takes about a minute...
  call npm ci
  if errorlevel 1 (
    echo  Installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo  Building the site...
call npm run build
if errorlevel 1 (
  echo  The build failed. The messages above say why.
  pause
  exit /b 1
)
echo.
echo  The site is opening in your browser at http://localhost:4173
echo  Keep this window open while you use the site. Close it to stop the site.
echo.
call npm run preview -- --open
pause
