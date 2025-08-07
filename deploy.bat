@echo off
echo 🚀 GitHub Pages Deployment Script
echo.

echo 📦 Building portfolio...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo 📋 Next steps:
echo.
echo 1. Copy this folder to your NAME0x0.github.io repository
echo 2. Or follow the DEPLOYMENT-GUIDE.md for detailed instructions
echo.

echo 🌐 After deployment, your portfolio will be live at:
echo    https://name0x0.is-a.dev
echo.

pause