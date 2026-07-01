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

Write-Host "Habilitando metrics-server para HPA..."
& $minikube addons enable metrics-server

Write-Host "Creando namespace y Secret local si no existen..."
kubectl apply -f k8s/namespace.yaml

$secretName = kubectl get secret trabajos-secret -n trabajos --ignore-not-found -o name
$secretExists = -not [string]::IsNullOrWhiteSpace($secretName)

if (-not $secretExists) {
    $postgresPassword = "pg-$([guid]::NewGuid().ToString('N'))"
    $rabbitPassword = "rabbit-$([guid]::NewGuid().ToString('N'))"
    $djangoSecret = "django-$([guid]::NewGuid().ToString('N'))-$([guid]::NewGuid().ToString('N'))"
    $jwtSecret = "jwt-$([guid]::NewGuid().ToString('N'))-$([guid]::NewGuid().ToString('N'))"
    $internalApiKey = "internal-$([guid]::NewGuid().ToString('N'))"

    kubectl create secret generic trabajos-secret -n trabajos `
        --from-literal=POSTGRES_PASSWORD=$postgresPassword `
        --from-literal=RABBITMQ_DEFAULT_PASS=$rabbitPassword `
        --from-literal=RABBITMQ_PASSWORD=$rabbitPassword `
        --from-literal=DJANGO_SECRET_KEY=$djangoSecret `
        --from-literal=JWT_SECRET_KEY=$jwtSecret `
        --from-literal=INTERNAL_API_KEY=$internalApiKey | Out-Null

    Write-Host "Secret trabajos-secret creado con valores locales generados."
} else {
    Write-Host "Secret trabajos-secret ya existe; se reutiliza."
}

Write-Host "Aplicando manifiestos del overlay Minikube..."
kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/minikube | kubectl apply -f -

Write-Host "Esperando despliegues principales..."
kubectl rollout status deployment/backend-python -n trabajos --timeout=180s
kubectl rollout status deployment/frontend -n trabajos --timeout=180s
kubectl rollout status deployment/api-gateway -n trabajos --timeout=180s
kubectl rollout status deployment/courses-service -n trabajos --timeout=180s
kubectl rollout status deployment/keycloak -n trabajos --timeout=240s
kubectl rollout status deployment/notifier -n trabajos --timeout=180s
kubectl rollout status deployment/outbox-worker -n trabajos --timeout=180s
kubectl rollout status deployment/java-consumer -n trabajos --timeout=180s

Write-Host "Estado actual:"
kubectl get pods,svc,hpa -n trabajos

Write-Host ""
Write-Host "Frontend: usa 'minikube service frontend -n trabajos --url'"
Write-Host "API Gateway: usa 'minikube service api-gateway -n trabajos --url'"
Write-Host "WebSocket: usa la misma URL de api-gateway y cambia http por ws, ruta /ws/notifications/"
Write-Host "RabbitMQ panel: usa 'minikube service rabbitmq -n trabajos --url'"
