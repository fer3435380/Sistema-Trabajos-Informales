# Guia rapida para levantar el proyecto

Usar estos comandos desde la raiz del repositorio:

```powershell
cd "C:\Users\mateo\Documentos\universidad\sistemas distribuidos\trabajo final\Sistema-Trabajos-Informales"
```

## 1. Levantar backend

```powershell
docker compose up -d
```

Verificar que el backend este sano:

```powershell
Invoke-RestMethod http://localhost:8080/api/v1/health/
```

Debe responder:

```json
{
  "status": "ok",
  "service": "backend-python"
}
```

Servicios disponibles:

- API Gateway REST: `http://localhost:8080/api/v1/`
- WebSocket via Gateway: `ws://localhost:8080/ws/notifications/`
- Keycloak SSO: `http://localhost:8081/realms/nexojobs`
- Consola Keycloak: `http://localhost:8081/` (`admin` / valor de `KEYCLOAK_ADMIN_PASSWORD`)
- RabbitMQ panel: `http://localhost:15672/`

Servicios internos del backend:

- `backend-python`: jobs-service, auth-user-service y notification REST en Django.
- `keycloak`: proveedor OAuth2/OIDC local con cliente PKCE para el frontend.
- `courses-service`: cursos, modulos y progreso en Node.js.
- `notifier`: WebSockets en Django Channels/Daphne.
- `java-consumer`: procesamiento asincrono de eventos.

## 2. Levantar frontend estable

Este modo sirve el build del frontend en Docker.

```powershell
cd nexo-front
npm run build
cd ..
docker run -d --name trabajos-frontend-static -p 127.0.0.1:5173:8000 -v "${PWD}\nexo-front\dist:/site:ro" -v "${PWD}\tools\serve-spa.py:/serve-spa.py:ro" -w /site sistema-trabajos-informales-backend-python:latest python /serve-spa.py
```

Abrir:

```text
http://127.0.0.1:5173/
```

Nota: este modo sirve archivos estaticos con fallback SPA, por lo que `/auth/callback` funciona despues del retorno de Keycloak.

## 3. Alternativa para desarrollo frontend

Si necesitas hot reload mientras editas React:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\start-frontend-dev.ps1
```

Abrir:

```text
http://127.0.0.1:5173/
```

## 4. Credenciales demo SSO

Trabajador:

```text
maria.piedra@nexojobs.ec
maria123
```

Empresa:

```text
operaciones@eventosaustro.ec
empresa123
```

Administrador:

```text
admin@nexojobs.ec
Admin123!
```

El frontend redirige a Keycloak usando Authorization Code Flow con PKCE. Los roles del token son:

```text
worker, owner, admin
```

`owner` se muestra en el frontend como perfil de empresa.

## 5. Ver estado de contenedores

```powershell
docker ps --filter name=trabajos --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## 6. Bajar todo

```powershell
docker rm -f trabajos-frontend-static
docker compose down
```

Si `trabajos-frontend-static` no existe, Docker mostrara un aviso; no pasa nada.

## 7. Si PostgreSQL falla por password

Si el backend falla con `password authentication failed for user "postgres"`, significa que el volumen viejo de PostgreSQL fue creado con otra clave.

Solo si puedes regenerar datos demo, ejecutar:

```powershell
docker compose down
docker volume rm sistema-trabajos-informales_postgres_data
docker compose up -d
```

Esto no borra el codigo; solo recrea la base de datos local del proyecto.
