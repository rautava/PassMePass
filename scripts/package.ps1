# Package Extension for Distribution
# Creates a .zip file ready for Edge Add-ons store submission

param(
    [string]$Version = "1.0.0",
    [string]$OutputDir = ".\dist"
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Password Generator Extension" -ForegroundColor Cyan
Write-Host "  Package Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get extension root directory
$ExtensionRoot = Split-Path $PSScriptRoot -Parent
$PackageName = "password-generator-v$Version.zip"
$OutputPath = Join-Path $OutputDir $PackageName

# Create output directory if it doesn't exist
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "[+] Created output directory: $OutputDir" -ForegroundColor Green
}

# Files and folders to include
$FilesToInclude = @(
    "manifest.json",
    "README.md",
    "src",
    "ui",
    "assets"
)

# Files to exclude (if they exist)
$ExcludePatterns = @(
    "*.md",  # Exclude markdown in subdirectories
    ".git*",
    "*.log",
    "node_modules",
    "dist",
    ".vscode",
    "*.ps1"  # Don't include scripts in package
)

Write-Host "[*] Validating files..." -ForegroundColor Yellow

# Check if manifest exists
if (!(Test-Path "manifest.json")) {
    Write-Host "[!] Error: manifest.json not found!" -ForegroundColor Red
    exit 1
}

# Read and validate manifest
$manifest = Get-Content "manifest.json" -Raw | ConvertFrom-Json
Write-Host "[+] Extension: $($manifest.name) v$($manifest.version)" -ForegroundColor Green

# Check if version matches
if ($manifest.version -ne $Version) {
    Write-Host "[!] Warning: Manifest version ($($manifest.version)) doesn't match package version ($Version)" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
}

# Create temporary staging directory
$TempDir = Join-Path $env:TEMP "PassMePass_package_$(Get-Random)"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

Write-Host "[*] Copying files to staging area..." -ForegroundColor Yellow

try {
    # Copy files to temp directory
    foreach ($item in $FilesToInclude) {
        $sourcePath = Join-Path $ExtensionRoot $item
        if (Test-Path $sourcePath) {
            $destPath = Join-Path $TempDir $item
            if (Test-Path $sourcePath -PathType Container) {
                Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
                Write-Host "  [+] Copied: $item/" -ForegroundColor Gray
            }
            else {
                Copy-Item -Path $sourcePath -Destination $destPath -Force
                Write-Host "  [+] Copied: $item" -ForegroundColor Gray
            }
        }
        else {
            Write-Host "  [!] Skipped (not found): $item" -ForegroundColor DarkGray
        }
    }

    # Remove excluded files
    foreach ($pattern in $ExcludePatterns) {
        Get-ChildItem -Path $TempDir -Recurse -Include $pattern -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    }

    Write-Host "[*] Creating package..." -ForegroundColor Yellow

    # Remove old package if exists
    if (Test-Path $OutputPath) {
        Remove-Item $OutputPath -Force
        Write-Host "[+] Removed old package" -ForegroundColor Gray
    }

    # Create zip file
    Compress-Archive -Path "$TempDir\*" -DestinationPath $OutputPath -CompressionLevel Optimal

    $fileSize = (Get-Item $OutputPath).Length
    $fileSizeKB = [math]::Round($fileSize / 1KB, 2)

    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "  Package Created Successfully!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Package: $PackageName" -ForegroundColor Cyan
    Write-Host "Size: $fileSizeKB KB" -ForegroundColor Cyan
    Write-Host "Location: $OutputPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[*] Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Test the package by loading it in Edge" -ForegroundColor Gray
    Write-Host "  2. Submit to Edge Add-ons Partner Center" -ForegroundColor Gray
    Write-Host "  3. https://partner.microsoft.com/dashboard/microsoftedge" -ForegroundColor Gray
    Write-Host ""

}
finally {
    # Cleanup temp directory
    if (Test-Path $TempDir) {
        Remove-Item $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
