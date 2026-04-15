#!/bin/bash

# ATS Pro - Startup Script for Unix/Linux/Mac

echo "🚀 Starting ATS Pro - Full Stack Application..."

# Function to handle cleanup on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo "Backend: Starting Spring Boot on http://localhost:8080..."
cd ats-backend || exit
./mvnw spring-boot:run &
BACKEND_PID=$!

# Start Frontend
echo "Frontend: Starting Vite on http://localhost:5173..."
cd ../ats-frontend || exit
npm run dev &
FRONTEND_PID=$!

cd ..

echo "✅ Both services are starting!"
echo "📡 Backend: http://localhost:8080"
echo "🌐 Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop all services."

# Wait for background processes
wait
