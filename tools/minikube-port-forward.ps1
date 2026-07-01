$ErrorActionPreference = "Stop"

Write-Host "Abriendo port-forwards en segundo plano..."
Start-Process -FilePath powershell -ArgumentList @("-NoProfile", "-Command", "kubectl port-forward -n trabajos service/frontend 18080:80") -WindowStyle Hidden
Start-Process -FilePath powershell -ArgumentList @("-NoProfile", "-Command", "kubectl port-forward -n trabajos service/api-gateway 18000:8080") -WindowStyle Hidden
Start-Process -FilePath powershell -ArgumentList @("-NoProfile", "-Command", "kubectl port-forward -n trabajos service/rabbitmq 18172:15672") -WindowStyle Hidden

Write-Host "Frontend: http://localhost:18080"
Write-Host "API Gateway REST: http://localhost:18000/api/v1/"
Write-Host "WebSocket via Gateway: ws://localhost:18000/ws/notifications/ con subprotocolos ['bearer', JWT]"
Write-Host "RabbitMQ panel: http://localhost:18172"
