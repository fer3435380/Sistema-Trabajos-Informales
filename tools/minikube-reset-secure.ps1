$ErrorActionPreference = "Stop"

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

Write-Host "Eliminando namespace trabajos para rotar secretos y recrear datos demo..."
kubectl delete namespace trabajos --ignore-not-found=true

Write-Host "Esperando eliminacion del namespace..."
$namespaceExists = $true
while ($namespaceExists) {
    $namespaceName = kubectl get namespace trabajos --ignore-not-found -o name
    $namespaceExists = -not [string]::IsNullOrWhiteSpace($namespaceName)
    if (-not $namespaceExists) {
        break
    }
    Start-Sleep -Seconds 2
}

Write-Host "Reconstruyendo imagenes locales..."
powershell -ExecutionPolicy Bypass -File .\tools\minikube-build-images.ps1

Write-Host "Desplegando con secretos nuevos..."
powershell -ExecutionPolicy Bypass -File .\tools\minikube-deploy.ps1
