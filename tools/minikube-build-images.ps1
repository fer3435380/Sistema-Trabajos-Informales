$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$minikube = (Get-Command minikube -ErrorAction SilentlyContinue).Source
if (-not $minikube) {
    $candidate = "C:\Program Files\Kubernetes\Minikube\minikube.exe"
    if (Test-Path $candidate) {
        $minikube = $candidate
    }
}
if (-not $minikube) {
    throw "No se encontro minikube.exe. Instala Minikube o agregalo al PATH."
}

Write-Host "Construyendo imagen Django/ASGI para Minikube..."
docker build -t trabajos-backend-python:local "$root\Backend\BackendPython"

Write-Host "Construyendo imagen API Gateway para Minikube..."
docker build -t trabajos-api-gateway:local "$root\Backend\api-gateway"

Write-Host "Construyendo imagen Courses Service para Minikube..."
docker build -t trabajos-courses-service:local "$root\Backend\courses-service"

Write-Host "Construyendo imagen Frontend para Minikube..."
docker build -t trabajos-frontend:local "$root\nexo-front"

Write-Host "Construyendo imagen Java Consumer para Minikube..."
docker build -t trabajos-java-consumer:local "$root\Backend\java-consumer"

Write-Host "Cargando imagenes en Minikube..."
& $minikube image load trabajos-backend-python:local
& $minikube image load trabajos-api-gateway:local
& $minikube image load trabajos-courses-service:local
& $minikube image load trabajos-frontend:local
& $minikube image load trabajos-java-consumer:local

Write-Host "Imagenes listas dentro de Minikube."
