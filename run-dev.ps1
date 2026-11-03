$env:Path = "$env:Path;C:\Users\sreej\nodejs"
Set-Location -Path $PSScriptRoot
Write-Host "Starting Game Intelligence Platform on http://localhost:3000 ..." -ForegroundColor Cyan
& "C:\Users\sreej\nodejs\npm.cmd" run dev
