# Development Helper Script
# Quick commands for extension development

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Password Generator Extension" -ForegroundColor Cyan
Write-Host "  Development Helper" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

function Show-Menu {
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  1. Package extension" -ForegroundColor White
    Write-Host "  2. Open Edge extensions page" -ForegroundColor White
    Write-Host "  3. Validate manifest" -ForegroundColor White
    Write-Host "  4. View file structure" -ForegroundColor White
    Write-Host "  5. Run tests (if implemented)" -ForegroundColor White
    Write-Host "  0. Exit" -ForegroundColor White
    Write-Host ""
}

function Open-ExtensionsPage {
    Start-Process "msedge" "edge://extensions"
    Write-Host "[+] Opened Edge extensions page" -ForegroundColor Green
}

function Validate-Manifest {
    if (!(Test-Path "manifest.json")) {
        Write-Host "[!] Error: manifest.json not found!" -ForegroundColor Red
        return
    }
    
    try {
        $manifest = Get-Content "manifest.json" -Raw | ConvertFrom-Json
        Write-Host "[+] Manifest is valid JSON" -ForegroundColor Green
        Write-Host ""
        Write-Host "Name: $($manifest.name)" -ForegroundColor Cyan
        Write-Host "Version: $($manifest.version)" -ForegroundColor Cyan
        Write-Host "Description: $($manifest.description)" -ForegroundColor Cyan
        Write-Host "Manifest Version: $($manifest.manifest_version)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Permissions:" -ForegroundColor Yellow
        $manifest.permissions | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
        Write-Host ""
        Write-Host "Host Permissions:" -ForegroundColor Yellow
        $manifest.host_permissions | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    }
    catch {
        Write-Host "[!] Error: Invalid manifest.json - $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Show-Structure {
    Write-Host "File structure:" -ForegroundColor Yellow
    Get-ChildItem -Recurse -File | Where-Object { 
        $_.FullName -notmatch "\\dist\\" -and 
        $_.FullName -notmatch "\\.git\\" -and
        $_.Extension -ne ".ps1"
    } | ForEach-Object {
        $relativePath = $_.FullName.Replace($PWD.Path + "\", "")
        $indent = "  " * ($relativePath.Split("\").Count - 1)
        Write-Host "$indent$($_.Name)" -ForegroundColor Gray
    }
}

function Package-Extension {
    $packageScript = Join-Path $PSScriptRoot "package.ps1"
    if (Test-Path $packageScript) {
        & $packageScript
    }
    else {
        Write-Host "[!] Error: package.ps1 not found!" -ForegroundColor Red
    }
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    Write-Host ""
    
    switch ($choice) {
        "1" { Package-Extension }
        "2" { Open-ExtensionsPage }
        "3" { Validate-Manifest }
        "4" { Show-Structure }
        "5" { Write-Host "[!] Tests not yet implemented" -ForegroundColor Yellow }
        "0" { Write-Host "Goodbye!" -ForegroundColor Green; break }
        default { Write-Host "[!] Invalid choice" -ForegroundColor Red }
    }
    
    if ($choice -ne "0") {
        Write-Host ""
        Write-Host "Press any key to continue..." -ForegroundColor DarkGray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Clear-Host
    }
} while ($choice -ne "0")
