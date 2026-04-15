@echo off
TITLE ATS Pro - Startup Manager

echo 🚀 Starting ATS Pro - Full Stack Application...

:: Start Backend in a new window
echo Backend: Starting Spring Boot on http://localhost:8080...
start "ATS Backend" cmd /c "cd ats-backend && mvnw spring-boot:run"

:: Start Frontend in a new window
echo Frontend: Starting Vite on http://localhost:5173...
start "ATS Frontend" cmd /c "cd ats-frontend && npm run dev"

echo.
echo ✅ Commands sent to separate windows.
echo 📡 Backend URL: http://localhost:8080
echo 🌐 Frontend URL: http://localhost:5173
echo.
pause
