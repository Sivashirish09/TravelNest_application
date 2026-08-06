@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   TRAVELNEST - AUTOMATIC ANDROID APK INSTALLER
echo ========================================================

:: 1. Locate adb executable
set "ADB_PATH="
if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
    set "ADB_PATH=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
) else if exist "C:\Users\sirish\AppData\Local\Android\Sdk\platform-tools\adb.exe" (
    set "ADB_PATH=C:\Users\sirish\AppData\Local\Android\Sdk\platform-tools\adb.exe"
) else (
    where adb >nul 2>nul
    if !errorlevel! equ 0 (
        set "ADB_PATH=adb"
    )
)

if "%ADB_PATH%"=="" (
    echo [ERROR] Could not find adb.exe.
    echo Please ensure Android SDK Platform-Tools is installed.
    pause
    exit /b 1
)

echo [INFO] Using ADB at: "%ADB_PATH%"
echo.

:: 2. Check for connected devices
echo [INFO] Checking for connected Android devices/emulators...
"%ADB_PATH%" devices

set "APK_PATH=%~dp0android\app\build\outputs\apk\debug\app-debug.apk"

if not exist "%APK_PATH%" (
    echo [ERROR] APK not found at: "%APK_PATH%"
    echo Building APK now...
    cd "%~dp0android"
    call gradlew.bat assembleDebug
    cd "%~dp0"
)

echo.
echo [INFO] Installing APK to your connected device: "%APK_PATH%"
"%ADB_PATH%" install -r "%APK_PATH%"

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] TravelNest APK installed successfully!
    echo [INFO] Launching TravelNest application...
    "%ADB_PATH%" shell am start -n com.travelnest.app/com.travelnest.app.MainActivity
    echo.
    echo ========================================================
    echo   TRAVELNEST IS NOW RUNNING ON YOUR DEVICE!
    echo ========================================================
) else (
    echo.
    echo [NOTICE] Installation failed.
    echo 1. Make sure your Android phone is connected via USB.
    echo 2. Make sure 'USB Debugging' is enabled in Settings > Developer Options.
    echo 3. Check your phone screen and tap 'Allow USB debugging'.
)

echo.
pause
