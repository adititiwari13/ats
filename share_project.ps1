# ATS Sharing Utility Script
Write-Host "--- ATS Project Sharing Instructions ---" -ForegroundColor Cyan
Write-Host "To share your project with others, follow these steps:"

Write-Host "`n1. Open two separate terminals." -ForegroundColor Yellow

Write-Host "`n2. In Terminal 1 (Backend), run:" -ForegroundColor Yellow
Write-Host "   ngrok http 8080" -ForegroundColor Green

Write-Host "`n3. In Terminal 2 (Frontend), run:" -ForegroundColor Yellow
Write-Host "   ngrok http 5173" -ForegroundColor Green

Write-Host "`n4. Update your Frontend to point to the new Backend link:" -ForegroundColor Yellow
Write-Host "   Open a new terminal and run:"
Write-Host "   `$env:VITE_API_URL='https://YOUR_BACKEND_NGROK_URL/api'; npm run dev" -ForegroundColor Green

Write-Host "`n--- Important Note ---" -ForegroundColor Red
Write-Host "Every time you restart ngrok, the links will change. You must update VITE_API_URL accordingly."
