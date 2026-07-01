$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $root ".env"

if (Test-Path $envPath) {
    Write-Host ".env ya existe; no se sobrescribe."
    exit 0
}

function New-Secret($prefix) {
    return "$prefix-$([guid]::NewGuid().ToString('N'))-$([guid]::NewGuid().ToString('N'))"
}

$content = @"
POSTGRES_DB=trabajos_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(New-Secret "postgres")

RABBITMQ_DEFAULT_USER=trabajos
RABBITMQ_DEFAULT_PASS=$(New-Secret "rabbitmq")
RABBITMQ_QUEUE=job_events
RABBITMQ_PREFETCH_COUNT=10

THREAD_POOL_SIZE=10
PROCESSING_DELAY_MS=5000
CPU_BURN_MS=0

DJANGO_SECRET_KEY=$(New-Secret "django")
DJANGO_DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000,http://localhost:8001,http://127.0.0.1:8001

JWT_SECRET_KEY=$(New-Secret "jwt")
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_MINUTES=60
INTERNAL_API_KEY=$(New-Secret "internal")

REDIS_URL=redis://redis:6379/0
"@

Set-Content -LiteralPath $envPath -Value $content -Encoding UTF8
Write-Host ".env local generado con secretos aleatorios."
