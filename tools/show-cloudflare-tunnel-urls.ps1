param(
  [string]$LogDir = ".cloudflare-tunnels"
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$logPath = Join-Path $root $LogDir
$pattern = "https://[a-zA-Z0-9-]+\.trycloudflare\.com"

$services = "frontend", "api-gateway", "keycloak"
foreach ($service in $services) {
  $logFile = Join-Path $logPath "$service.log"
  if (!(Test-Path $logFile)) {
    Write-Host "${service}: log no encontrado"
    continue
  }

  $content = Get-Content -Raw -LiteralPath $logFile
  $matches = [regex]::Matches($content, $pattern)
  if ($matches.Count -eq 0) {
    Write-Host "${service}: URL aun no disponible"
    continue
  }

  Write-Host "$service=$($matches[$matches.Count - 1].Value)"
}
