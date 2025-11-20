@echo off
REM Leaderboard System API Test Script for Windows
REM Usage: Run this script to test all leaderboard endpoints

setlocal enabledelayedexpansion
setlocal enableextensions

set "BASE_URL=http://localhost:5001"
set "API_PREFIX=%BASE_URL%/api"
set "LEADERBOARD_API=%API_PREFIX%/leaderboard"
set "DEBUG_API=%API_PREFIX%/debug"

REM Colors for output (using a workaround for Windows)
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"
set "CYAN=[36m"
set "RESET=[0m"

echo.
echo %CYAN%=== Leaderboard System API Test ===%RESET%
echo.

REM Test 1: Check if server is running
echo %CYAN%[TEST 1] Checking if server is running...%RESET%
curl -s "%LEADERBOARD_API%/monthly" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Server is running%RESET%
) else (
    echo %RED%✗ Server is NOT running. Start backend first!%RESET%
    echo   Run: cd backend && npm start
    goto :end
)

echo.
echo %CYAN%[TEST 2] Getting Monthly Leaderboard%RESET%
curl -s "%LEADERBOARD_API%/monthly?limit=5" | find "status" >nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Monthly leaderboard endpoint working%RESET%
    curl -s "%LEADERBOARD_API%/monthly?limit=3"
) else (
    echo %RED%✗ Failed to get monthly leaderboard%RESET%
)

echo.
echo %CYAN%[TEST 3] Getting Lifetime Leaderboard%RESET%
curl -s "%LEADERBOARD_API%/lifetime?limit=3" | find "status" >nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Lifetime leaderboard endpoint working%RESET%
    curl -s "%LEADERBOARD_API%/lifetime?limit=3"
) else (
    echo %RED%✗ Failed to get lifetime leaderboard%RESET%
)

echo.
echo %CYAN%[TEST 4] Getting Top 3 Users%RESET%
curl -s "%LEADERBOARD_API%/top-three" | find "status" >nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Top 3 endpoint working%RESET%
    curl -s "%LEADERBOARD_API%/top-three"
) else (
    echo %RED%✗ Failed to get top 3%RESET%
)

echo.
echo %CYAN%[TEST 5] Getting Leaderboard Stats (Debug)%RESET%
curl -s "%DEBUG_API%/leaderboard-stats" | find "status" >nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Stats endpoint working%RESET%
    curl -s "%DEBUG_API%/leaderboard-stats"
) else (
    echo %RED%✗ Failed to get stats%RESET%
)

echo.
echo %YELLOW%Note: To fully populate and test, you may need to:%RESET%
echo.
echo 1. Populate leaderboard:
echo    curl -X POST "%DEBUG_API%/populate-leaderboard"
echo.
echo 2. Or run Node script:
echo    cd backend
echo    node scripts/populateLeaderboard.js
echo.
echo 3. Or run diagnostic:
echo    node backend/scripts/testLeaderboard.js
echo.

:end
echo.
echo %CYAN%=== Test Complete ===%RESET%
pause
