# Despliegue local con Minikube

Este modo permite demostrar Kubernetes localmente sin GKE.

## Servicios expuestos

El overlay `k8s/minikube` cambia los servicios publicos a `NodePort`:

- API Gateway: `api-gateway`, puerto interno `8080`, NodePort `30082`.
- API REST Django: `backend-python`, puerto interno `8000`, NodePort `30080` solo para diagnostico interno.
- WebSocket notifier: `notifier`, puerto interno `8001`, NodePort `30081` solo para diagnostico interno.
- RabbitMQ panel: `rabbitmq`, puerto interno `15672`, NodePort `31672`.

## 1. Iniciar Minikube

Si Minikube no esta instalado en Windows:

```powershell
winget install Kubernetes.minikube
```

Verifica:

```powershell
minikube version
kubectl version --client
```

Si abriste la terminal antes de instalar, cierrala y vuelve a abrirla para refrescar el `PATH`.

```powershell
minikube start --driver=docker --cpus=4 --memory=6144
```

Activa metrics-server para que funcione el HPA:

```powershell
minikube addons enable metrics-server
```

## 2. Construir y cargar imagenes

```powershell
.\tools\minikube-build-images.ps1
```

Si PowerShell bloquea scripts locales:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\minikube-build-images.ps1
```

El script construye:

- `trabajos-backend-python:local`
- `trabajos-api-gateway:local`
- `trabajos-java-consumer:local`

y luego las carga dentro de Minikube.

## 3. Desplegar

```powershell
.\tools\minikube-deploy.ps1
```

Con bypass de politicas:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\minikube-deploy.ps1
```

Tambien puedes hacerlo manualmente:

```powershell
kubectl kustomize --load-restrictor=LoadRestrictionsNone k8s/minikube | kubectl apply -f -
kubectl get pods -n trabajos
kubectl get svc -n trabajos
kubectl get hpa -n trabajos
```

## 4. Obtener URLs locales

En Windows, la opcion mas estable es abrir port-forwards:

```powershell
.\tools\minikube-port-forward.ps1
```

Quedan disponibles:

```text
API Gateway REST: http://localhost:18000/api/v1/
WebSocket via Gateway: ws://localhost:18000/ws/notifications/
RabbitMQ panel: http://localhost:18172
```

Tambien puedes usar los servicios de Minikube:

```powershell
minikube service api-gateway -n trabajos --url
minikube service rabbitmq -n trabajos --url
```

Si `api-gateway` devuelve, por ejemplo, `http://127.0.0.1:50000`, entonces la API queda en:

```text
http://127.0.0.1:50000/api/v1/
```

Para WebSocket via Gateway usa:

```text
ws://127.0.0.1:50000/ws/notifications/
```

## 5. Prueba funcional

Usuarios demo:

- `owner@demo.com` / `Owner123!`
- `worker@demo.com` / `Worker123!`

Usa la URL obtenida del servicio `api-gateway`:

```powershell
python tools/load_test.py http://localhost:18000/api/v1 30 5
```

## 6. Evidencia de HPA

El consumer Java en Minikube usa `CPU_BURN_MS=750` para generar consumo de CPU durante el procesamiento. Esto ayuda a demostrar el HPA:

```powershell
kubectl get hpa -n trabajos -w
kubectl get pods -n trabajos -w
```

Genera carga con:

```powershell
python tools/load_test.py http://localhost:18000/api/v1 100 20
```

## 7. Limpieza

```powershell
kubectl delete namespace trabajos
```

O elimina todo el cluster local:

```powershell
minikube delete
```
