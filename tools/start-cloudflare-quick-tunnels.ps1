param(
  [string]$CloudflaredPath = ".\cloudflared-windows-amd64.exe",
  [string]$LogDir = ".cloudflare-tunnels"
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$cloudflared = Resolve-Path (Join-Path $root $CloudflaredPath)
$logPath = Join-Path $root $LogDir
New-Item -ItemType Directory -Force -Path $logPath | Out-Null

$services = @(
  @{ Name = "frontend"; Url = "http://127.0.0.1:5173" },
  @{ Name = "api-gateway"; Url = "http://127.0.0.1:8080" },
  @{ Name = "keycloak"; Url = "http://127.0.0.1:8081" }
)

foreach ($service in $services) {
  $logFile = Join-Path $logPath "$($service.Name).log"
  if (Test-Path $logFile) {
    Remove-Item -LiteralPath $logFile -Force
  }

  $command = "& '$cloudflared' tunnel --url $($service.Url) *> '$logFile'"
  $process = Start-Process -FilePath "powershell.exe" `
    -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $command) `
    -WorkingDirectory $root `
    -WindowStyle Hidden `
    -PassThru

  Write-Host "$($service.Name): iniciado en PID $($process.Id), log: $logFile"
}

Write-Host ""
Write-Host "Espera 10-20 segundos y ejecuta:"
Write-Host "  .\tools\show-cloudflare-tunnel-urls.ps1"
