# Guia de conexion para Frontend

Este documento resume como conectarse al backend, que puertos ocupa y que endpoints estan disponibles.

## Modos de ejecucion

### Opcion A: Docker Compose

Usar cuando el backend se levanta con:

```powershell
docker compose up -d --build
```

URLs:

```text
API Gateway: http://localhost:8080/api/v1
WebSocket:   ws://localhost:8080/ws/notifications/?token=JWT
Keycloak:    http://localhost:8081/realms/nexojobs
RabbitMQ UI: http://localhost:15672
```

### Opcion B: Minikube

Usar cuando el backend se levanta en Kubernetes local.

Primero abrir port-forwards:

```powershell
.\tools\minikube-port-forward.ps1
```

URLs:

```text
API Gateway: http://localhost:18000/api/v1
WebSocket:   ws://localhost:18000/ws/notifications/?token=JWT
RabbitMQ UI: http://localhost:18172
```

Para desarrollo frontend se recomienda usar **Minikube con port-forward**, porque evita conflictos con puertos habituales del frontend.

## Puertos ocupados

### Docker Compose

| Servicio | Puerto host | Uso |
|---|---:|---|
| API Gateway | `8080` | REST API y WebSocket publicos |
| Keycloak | `8081` | SSO OAuth2/OIDC |
| Backend API Django | interno | REST API |
| Notifier ASGI/Daphne | interno | WebSocket |
| PostgreSQL | `5432` | Base de datos |
| RabbitMQ AMQP | `5672` | Cola interna |
| RabbitMQ Management | `15672` | Panel web |
| Redis | `6379` | Canales WebSocket |

### Minikube con port-forward

| Servicio | Puerto host | Uso |
|---|---:|---|
| Backend API Django | `18000` | REST API |
| API Gateway | `18000` | REST API y WebSocket |
| Notifier ASGI/Daphne | interno | WebSocket |
| RabbitMQ Management | `18172` | Panel web |

### Puertos libres recomendados para frontend

Pueden usar sin conflicto:

```text
3000, 3001, 5173, 5174, 4200, 8080
```

Evitar usar estos puertos mientras el backend este activo:

```text
8080, 5432, 5672, 6379, 15672, 18000, 18172
```

## Usuarios demo SSO

```text
maria.piedra@nexojobs.ec        / maria123   / worker
operaciones@eventosaustro.ec    / empresa123 / owner
admin@nexojobs.ec               / Admin123!  / admin
```

Roles:

```text
owner  = dueño, puede crear trabajos y aceptar/rechazar postulaciones
worker = trabajador, puede postular a trabajos
admin  = administrador
```

## Autenticacion

El flujo principal del frontend usa OAuth2/OIDC con Keycloak:

```text
Authority: http://localhost:8081/realms/nexojobs
Client ID: nexojobs-front
Flow: Authorization Code Flow con PKCE S256
Callback: http://localhost:5173/auth/callback
```

El usuario entra desde `/login`, el frontend redirige a Keycloak, intercambia el `code` por tokens en `/auth/callback` y guarda el `access_token`.

El API Gateway valida JWT RS256 firmados por Keycloak, rechaza tokens vencidos o invalidos y propaga los datos utiles a servicios internos mediante:

```http
X-User-Id
X-User-Role
X-User-Email
```

Para servicios Django legacy, el gateway reemite un JWT interno HS256 despues de validar el token Keycloak. Esto permite mantener protegidos los endpoints internos sin exponerlos directamente al frontend.

Despues del callback OAuth2, enviar el `access_token` en cada endpoint protegido:

```http
Authorization: Bearer ACCESS_TOKEN
```

Los endpoints `/auth/login/` y `/auth/register/` siguen existiendo como compatibilidad interna/demo, pero no deben ser el flujo principal de autenticacion para cumplir SSO.

Claims esperados en el token:

```json
{
  "iss": "http://localhost:8081/realms/nexojobs",
  "azp": "nexojobs-front",
  "email": "maria.piedra@nexojobs.ec",
  "realm_access": {
    "roles": ["worker"]
  }
}
```

## Endpoints REST

En los ejemplos se usa:

```text
BASE_URL=http://localhost:8080/api/v1
```

Si usan Minikube con port-forward, cambiar por:

```text
BASE_URL=http://localhost:18000/api/v1
```

## Health check

### GET `/health/`

Publico.

Respuesta:

```json
{
  "status": "ok",
  "service": "backend-python"
}
```

## Auth

### POST `/auth/register/`

Publico.

Body:

```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@demo.com",
  "password": "Password123!",
  "role": "worker"
}
```

`role` puede ser:

```text
worker, owner
```

### POST `/auth/login/`

Publico.

Body:

```json
{
  "email": "worker@demo.com",
  "password": "Worker123!"
}
```

### POST `/auth/logout/`

Requiere JWT.

Revoca el token actual.

Respuesta:

```text
204 No Content
```

## Usuarios

### GET `/users/me/`

Requiere JWT.

Devuelve el usuario autenticado.

### GET `/users/stats/`

Publico.

Respuesta:

```json
{
  "workers": 10,
  "owners": 3
}
```

## Trabajos

### GET `/jobs/`

Publico.

Query params opcionales:

```text
search=texto
type=limpieza
location=quito
status=open
```

Estados:

```text
open, assigned, closed
```

Respuesta: lista de trabajos.

```json
[
  {
    "id": 1,
    "title": "Pintura de pared",
    "description": "Pintar una pared interior",
    "type": "Pintura",
    "location": "Quito",
    "payment": "25.00",
    "creator": 1,
    "creator_name": "Dueño Demo",
    "status": "open",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

### POST `/jobs/`

Requiere JWT de usuario `owner` o `admin`.

Body:

```json
{
  "title": "Ayuda con mudanza",
  "description": "Subir cajas a un segundo piso",
  "type": "Mudanza",
  "location": "Quito",
  "payment": "30.00"
}
```

### GET `/jobs/{id}/`

Publico.

Devuelve el detalle de un trabajo.

## Cursos

Los endpoints de cursos son atendidos por `courses-service` a traves del API Gateway.

### GET `/courses/`

Requiere JWT.

Query params opcionales:

```text
status=Publicado
category=Datos
level=Basico
```

### POST `/courses/`

Requiere JWT con rol `owner` o `admin`.

### POST `/courses/{id}/start/`

Requiere JWT.

Inicia el progreso del curso para el usuario autenticado.

### POST `/courses/{id}/advance/`

Requiere JWT.

Marca el siguiente modulo como completado y recalcula el progreso.

## Postulaciones

### GET `/applications/`

Requiere JWT.

Devuelve postulaciones del usuario autenticado como trabajador.

### POST `/applications/`

Requiere JWT de trabajador.

Body:

```json
{
  "job": 1,
  "cover_letter": "Estoy disponible para realizar este trabajo."
}
```

Respuesta:

```json
{
  "id": 1,
  "job": 1,
  "job_title": "Pintura de pared",
  "applicant": 2,
  "applicant_name": "Trabajador Demo",
  "status": "pending",
  "cover_letter": "Estoy disponible para realizar este trabajo.",
  "created_at": "...",
  "updated_at": "..."
}
```

Estados de postulacion:

```text
pending, accepted, rejected
```

### GET `/applications/mine/`

Requiere JWT.

Lista postulaciones realizadas por el usuario autenticado.

### GET `/applications/received/`

Requiere JWT de `owner`.

Lista postulaciones recibidas en los trabajos creados por el usuario.

### GET `/applications/{id}/`

Requiere JWT, excepto llamadas internas del backend.

Puede verlo:

- el postulante
- el dueño del trabajo
- admin

### PATCH `/applications/{id}/accept/`

Requiere JWT de `owner` dueño del trabajo o `admin`.

Acepta una postulacion.

Efectos:

- cambia la postulacion a `accepted`
- cambia el trabajo a `assigned`
- rechaza automaticamente otras postulaciones pendientes del mismo trabajo
- genera eventos y notificaciones

### PATCH `/applications/{id}/reject/`

Requiere JWT de `owner` dueño del trabajo o `admin`.

Rechaza una postulacion.

## Notificaciones

### GET `/notifications/`

Requiere JWT.

Query params opcionales:

```text
unread=true
limit=20
offset=0
```

Respuesta:

```json
{
  "items": [
    {
      "id": 1,
      "recipient": 1,
      "type": "postulacion_creada",
      "message": "Trabajador Demo se postulo a tu trabajo 'Pintura de pared'",
      "dedupe_key": "postulacion_creada:1:1",
      "extra_data": {
        "application_id": 1,
        "job_id": 1
      },
      "is_read": false,
      "read_at": null,
      "created_at": "..."
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### PATCH `/notifications/{id}/read/`

Requiere JWT.

Marca una notificacion como leida.

## WebSocket de notificaciones

Endpoint recomendado:

```text
ws://localhost:18000/ws/notifications/
```

En Docker Compose:

```text
ws://localhost:8080/ws/notifications/
```

Enviar el JWT como subprotocolo WebSocket:

```js
const socket = new WebSocket("ws://localhost:18000/ws/notifications/", ["bearer", token]);
```

Por compatibilidad de demo tambien existe `?token=JWT`, pero no se recomienda porque el token queda en la URL.

Conexion inicial exitosa:

```json
{
  "type": "connected",
  "user_id": 1
}
```

Evento cuando llega una notificacion:

```json
{
  "type": "notification.created",
  "notification": {
    "id": 1,
    "recipient": 1,
    "type": "postulacion_creada",
    "message": "Trabajador Demo se postulo a tu trabajo 'Pintura de pared'",
    "dedupe_key": "postulacion_creada:1:1",
    "extra_data": {
      "application_id": 1,
      "job_id": 1
    },
    "is_read": false,
    "read_at": null,
    "created_at": "..."
  }
}
```

Evento cuando se marca como leida:

```json
{
  "type": "notification.read",
  "notification": {
    "id": 1,
    "is_read": true,
    "read_at": "..."
  }
}
```

## Ejemplo JavaScript

```js
const API_URL = "http://localhost:8080/api/v1";
const WS_URL = "ws://localhost:8080/ws/notifications/";

async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login fallido");
  }

  return response.json();
}

function connectNotifications(token, onMessage) {
  const socket = new WebSocket(WS_URL, ["bearer", token]);

  socket.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };

  socket.onclose = () => {
    console.log("WebSocket cerrado");
  };

  return socket;
}

async function getJobs() {
  const response = await fetch(`${API_URL}/jobs/?status=open`);
  return response.json();
}

async function createApplication(token, jobId) {
  const response = await fetch(`${API_URL}/applications/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      job: jobId,
      cover_letter: "Estoy disponible para este trabajo.",
    }),
  });

  return response.json();
}
```

## Flujo recomendado para frontend

### Trabajador

1. Login.
2. Guardar `access_token`.
3. Conectar WebSocket con el token.
4. Consultar `GET /jobs/?status=open`.
5. Crear postulacion con `POST /applications/`.
6. Consultar sus postulaciones con `GET /applications/mine/`.
7. Recibir notificaciones por WebSocket.

### Dueño

1. Login.
2. Guardar `access_token`.
3. Conectar WebSocket con el token.
4. Crear trabajos con `POST /jobs/`.
5. Consultar postulaciones recibidas con `GET /applications/received/`.
6. Aceptar/rechazar con:
   - `PATCH /applications/{id}/accept/`
   - `PATCH /applications/{id}/reject/`
7. Recibir notificaciones por WebSocket cuando un trabajador se postula.

## Errores comunes

### 401 Unauthorized

Falta token o el token esta mal enviado.

Usar:

```http
Authorization: Bearer JWT
```

### 403 Forbidden

El usuario no tiene el rol correcto.

Ejemplo: un `worker` no puede crear trabajos.

### 400 Bad Request

Datos invalidos o regla de negocio incumplida.

Ejemplos:

- trabajador intenta postular a su propio trabajo
- postulacion duplicada al mismo trabajo
- trabajo ya no esta abierto

## Notas para CORS

Actualmente el backend permite por defecto:

```text
http://localhost:3000
http://127.0.0.1:3000
```

Si el frontend usa otro puerto, avisar para agregarlo a `CORS_ALLOWED_ORIGINS`.

Puertos frontend recomendados:

```text
3000 o 5173
```
