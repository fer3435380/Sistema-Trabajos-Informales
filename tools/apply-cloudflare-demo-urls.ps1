param(
  [Parameter(Mandatory = $true)][string]$FrontendUrl,
  [Parameter(Mandatory = $true)][string]$GatewayUrl,
  [Parameter(Mandatory = $true)][string]$AuthUrl
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$envPath = Join-Path $root ".env"
$frontendEnvPath = Join-Path $root "nexo-front\.env.local"

function Normalize-BaseUrl([string]$value) {
  return $value.TrimEnd("/")
}

function Set-EnvValue([string[]]$lines, [string]$key, [string]$value) {
  $updated = $false
  $nextLines = foreach ($line in $lines) {
    if ($line -match "^\s*$([regex]::Escape($key))=") {
      $updated = $true
      "$key=$value"
    } else {
      $line
    }
  }

  if (!$updated) {
    $nextLines += "$key=$value"
  }

  return $nextLines
}

$frontend = Normalize-BaseUrl $FrontendUrl
$gateway = Normalize-BaseUrl $GatewayUrl
$auth = Normalize-BaseUrl $AuthUrl
$wsUrl = $gateway.Replace("https://", "wss://")

$localOrigins = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
$corsOrigins = "$localOrigins,$frontend"
$csrfOrigins = "http://localhost:8000,http://127.0.0.1:8000,http://localhost:8001,http://127.0.0.1:8001,$gateway,$auth"

Copy-Item -LiteralPath $envPath -Destination "$envPath.cloudflare.bak" -Force
$lines = Get-Content -LiteralPath $envPath
$lines = Set-EnvValue $lines "CORS_ALLOWED_ORIGINS" $corsOrigins
$lines = Set-EnvValue $lines "CSRF_TRUSTED_ORIGINS" $csrfOrigins
$lines = Set-EnvValue $lines "KEYCLOAK_PUBLIC_URL" $auth
$lines = Set-EnvValue $lines "KEYCLOAK_ISSUER_URL" "$auth/realms/nexojobs"
$lines = Set-EnvValue $lines "VITE_API_BASE_URL" "$gateway/api/v1"
$lines = Set-EnvValue $lines "VITE_WS_URL" "$wsUrl/ws/notifications/"
$lines = Set-EnvValue $lines "VITE_OAUTH_AUTHORITY" "$auth/realms/nexojobs"
Set-Content -LiteralPath $envPath -Value $lines

$frontendLines = @(
  "VITE_API_BASE_URL=$gateway/api/v1",
  "VITE_WS_URL=$wsUrl/ws/notifications/",
  "VITE_OAUTH_AUTHORITY=$auth/realms/nexojobs",
  "VITE_OAUTH_CLIENT_ID=nexojobs-front",
  "VITE_OAUTH_REDIRECT_PATH=/auth/callback"
)
Set-Content -LiteralPath $frontendEnvPath -Value $frontendLines

Write-Host "Actualizado .env y nexo-front\.env.local"
Write-Host "Respaldo creado en .env.cloudflare.bak"
Write-Host "Reinicia keycloak, api-gateway, backend-python y notifier."
Write-Host "Luego ejecuta npm run build en nexo-front y docker compose up -d frontend."
