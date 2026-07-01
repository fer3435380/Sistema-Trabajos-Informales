# Auditoria de seguridad del backend

Fecha: 2026-06-28

Alcance revisado:

- Backend Django REST/ASGI.
- WebSocket de notificaciones.
- Consumer Java.
- Docker Compose.
- Manifiestos Kubernetes/Minikube.
- Manejo de secretos, autenticacion, autorizacion y exposicion de servicios.

## Resumen ejecutivo

El sistema cumple bien como arquitectura academica distribuida: separa API, worker, consumer, mensajeria RabbitMQ, Redis, PostgreSQL y notificador WebSocket. Para un entorno local y demostrativo funciona correctamente.

Desde seguridad, el mayor riesgo esta en que varias configuraciones son de desarrollo: secretos por defecto, `DEBUG=True`, `ALLOWED_HOSTS=*`, servicios internos expuestos, tokens largos y poca proteccion contra abuso de endpoints. Para produccion o una demo expuesta en red, conviene endurecer autenticacion, secretos, red, contenedores y Kubernetes.

## Hallazgos prioritarios

## Critico

### 1. Secretos y credenciales de desarrollo en archivos versionables

Evidencia:

- `.env.docker.example`
- `k8s/secret.yaml`
- `docker-compose.yml`

Valores observados:

```text
POSTGRES_PASSWORD=postgres
RABBITMQ_DEFAULT_PASS=trabajos123
DJANGO_SECRET_KEY=dev-django-secret
JWT_SECRET_KEY=dev-jwt-secret-change-me-32-bytes!
INTERNAL_API_KEY=dev-internal-key
```

Riesgo:

Si el sistema se comparte o se expone en red, cualquiera que conozca esos valores podria acceder a servicios internos, firmar tokens si obtiene la clave JWT o invocar endpoints internos.

Recomendaciones:

- Mantener estos valores solo para demo local.
- Crear secretos reales por ambiente.
- No reutilizar secretos entre Django y JWT.
- Para Kubernetes, generar `Secret` desde comandos o archivos no versionados:

```powershell
kubectl create secret generic trabajos-secret -n trabajos `
  --from-literal=POSTGRES_PASSWORD="valor-seguro" `
  --from-literal=RABBITMQ_PASSWORD="valor-seguro" `
  --from-literal=DJANGO_SECRET_KEY="valor-seguro" `
  --from-literal=JWT_SECRET_KEY="valor-seguro" `
  --from-literal=INTERNAL_API_KEY="valor-seguro"
```

### 2. `ALLOWED_HOSTS=*` y `DEBUG=True` en Docker Compose

Evidencia:

```yaml
DJANGO_DEBUG: ${DJANGO_DEBUG:-True}
ALLOWED_HOSTS: ${ALLOWED_HOSTS:-*}
```

Riesgo:

`DEBUG=True` puede exponer trazas con informacion sensible. `ALLOWED_HOSTS=*` permite aceptar cualquier host header, lo que puede facilitar ataques de host header si el sistema se expone.

Recomendaciones:

- En ambientes compartidos usar:

```text
DJANGO_DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,IP_DEL_HOST
```

- Si el frontend accede desde otra maquina, agregar explicitamente la IP o dominio.

## Alto

### 3. API interna protegida solo por `X-Internal-Api-Key`

Evidencia:

- `notifications/views.py`
- `core/permissions.py`

El endpoint `POST /api/v1/notifications/` permite crear notificaciones si se conoce `X-Internal-Api-Key`.

Riesgo:

Si la API queda expuesta y la clave se filtra, un atacante podria crear notificaciones falsas para usuarios.

Recomendaciones:

- Mantener el endpoint solo accesible dentro del cluster/red interna.
- No exponerlo al frontend.
- Usar una clave robusta y rotarla.
- Mejorar con firma HMAC por mensaje o mTLS en despliegues reales.
- Validar que el `recipient` exista y que el evento tenga coherencia con una postulacion real.

### 4. Tokens JWT con duracion larga

Evidencia:

```text
JWT_ACCESS_TOKEN_MINUTES=1440
```

Riesgo:

Un token robado puede usarse durante 24 horas.

Recomendaciones:

- Reducir access token a 15-60 minutos.
- Implementar refresh tokens si el frontend necesita sesion larga.
- Mantener logout con revocacion por `jti`, como ya existe.

### 5. Token JWT en query string para WebSocket

Evidencia:

```text
ws://localhost:18000/ws/notifications/?token=JWT
```

Riesgo:

Los tokens en URL pueden quedar en logs, historial del navegador, herramientas de monitoreo o capturas.

Correcciones aplicadas:

- Se agrego soporte para enviar el JWT mediante subprotocolo WebSocket:

```js
new WebSocket("ws://localhost:18000/ws/notifications/", ["bearer", token])
```

- Docker Compose ahora exige `.env` para secretos y se agrego `tools/generate-local-env.ps1` para generar valores locales aleatorios.
- Los manifests Kubernetes ya no incluyen `k8s/secret.yaml` con credenciales fijas; `tools/minikube-deploy.ps1` crea `trabajos-secret` si no existe.
- `JWT_ACCESS_TOKEN_MINUTES` se redujo a `60`.
- PostgreSQL, Redis y RabbitMQ AMQP dejaron de publicarse al host en Docker Compose.

Recomendaciones:

- Para demo local es aceptable.
- Para produccion, preferir autenticacion por cookie segura o subprotocolo WebSocket.
- Si se mantiene query string, usar HTTPS/WSS y tokens de corta duracion.

### 6. Servicios internos expuestos al host

Evidencia en Docker Compose:

```text
PostgreSQL: 5432
RabbitMQ AMQP: 5672
RabbitMQ UI: 15672
Redis: 6379
```

Evidencia en Minikube:

```text
RabbitMQ UI: 18172 por port-forward
```

Riesgo:

PostgreSQL, Redis y RabbitMQ no deberian estar disponibles para el frontend ni para usuarios externos.

Recomendaciones:

- Para demo local, exponer solo lo necesario.
- En Docker Compose, quitar puertos de PostgreSQL, Redis y RabbitMQ AMQP si no se necesitan desde el host.
- En Kubernetes, mantener PostgreSQL, Redis y RabbitMQ AMQP como `ClusterIP`.
- Exponer RabbitMQ UI solo cuando se necesite demostrar.

## Medio

### 7. Falta rate limiting en login, registro y creacion de recursos

Riesgo:

Permite fuerza bruta contra login, registros masivos o abuso de creacion de postulaciones.

Recomendaciones:

- Agregar throttling de Django REST Framework.
- Definir limites por IP y por usuario.
- Endpoints prioritarios:
  - `/auth/login/`
  - `/auth/register/`
  - `/applications/`
  - `/jobs/`

Ejemplo conceptual:

```python
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "30/min",
        "user": "120/min",
    },
}
```

### 8. Falta politica de origen para WebSocket

Riesgo:

Otro sitio podria intentar abrir conexiones WebSocket si obtiene un token.

Recomendaciones:

- Validar `Origin` en el consumer WebSocket.
- Permitir solo origenes del frontend:

```text
http://localhost:3000
http://localhost:5173
```

### 9. Contenedores ejecutandose como root

Evidencia:

- `Backend/BackendPython/Dockerfile`
- `Backend/java-consumer/Dockerfile`

No se define usuario no privilegiado.

Riesgo:

Si una aplicacion es comprometida, el atacante tendria mas privilegios dentro del contenedor.

Recomendaciones:

- Crear usuario no root en ambos Dockerfiles.
- Agregar `securityContext` en Kubernetes:

```yaml
securityContext:
  runAsNonRoot: true
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
```

### 10. Manifiestos Kubernetes sin NetworkPolicy

Riesgo:

Por defecto, los pods pueden comunicarse libremente dentro del namespace.

Recomendaciones:

- Crear `NetworkPolicy` para limitar:
  - frontend/API puede hablar con backend.
  - backend puede hablar con PostgreSQL, RabbitMQ y Redis.
  - Java consumer puede hablar con RabbitMQ y backend.
  - PostgreSQL y Redis no reciben trafico externo innecesario.

### 11. Uso de credenciales en URLs de entorno

Evidencia:

```text
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/trabajos_db
RABBITMQ_URL=amqp://trabajos:trabajos123@rabbitmq:5672/
```

Riesgo:

Las credenciales pueden aparecer en logs, outputs de `kubectl describe`, dumps o capturas.

Recomendaciones:

- Construir estas URLs desde variables separadas provenientes de Secret.
- Evitar imprimirlas en logs.

## Bajo

### 12. Datos demo cargados automaticamente

Evidencia:

```text
SEED_DEMO_DATA=True
python manage.py seed_demo
```

Riesgo:

Usuarios demo con credenciales conocidas quedan activos.

Recomendaciones:

- Mantener solo en demo local.
- Desactivar en ambientes compartidos:

```text
SEED_DEMO_DATA=False
```

### 13. No hay politicas explicitas de seguridad HTTP

Riesgo:

Si se publica en internet, faltarian headers y HTTPS.

Recomendaciones:

- Usar HTTPS/WSS.
- Configurar:

```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

Para local no activarlo porque romperia HTTP.

## Recomendaciones priorizadas

## Acciones inmediatas para demo segura local

1. No compartir `.env` real.
2. No exponer `5432`, `5672` ni `6379` si no se necesitan.
3. Usar Minikube con port-forward solo durante la prueba.
4. Mantener RabbitMQ UI cerrado cuando no se use.
5. Cambiar `INTERNAL_API_KEY` antes de presentar si el proyecto se comparte.
6. Agregar el puerto real del frontend a `CORS_ALLOWED_ORIGINS`.

## Acciones recomendadas antes de entregar

1. Reducir `JWT_ACCESS_TOKEN_MINUTES`.
2. Agregar rate limiting.
3. Validar `Origin` en WebSocket.
4. Cambiar secretos demo por valores fuertes.
5. Agregar `NetworkPolicy`.
6. Agregar `securityContext` a los pods.
7. Evitar usuarios demo cuando no sea una demo controlada.

## Acciones si se despliega fuera de local

1. Activar `DJANGO_DEBUG=False`.
2. Definir `ALLOWED_HOSTS` explicito.
3. Usar HTTPS/WSS.
4. No exponer PostgreSQL, Redis ni RabbitMQ AMQP a internet.
5. Rotar claves y contrasenas.
6. Usar un gestor de secretos real.
7. Agregar monitoreo de logs y alertas.

## Estado general

El sistema es adecuado para una demostracion academica local con Minikube. Para un entorno publico o multiusuario, los puntos mas urgentes son secretos, configuracion de debug, exposicion de servicios internos, duracion de tokens y proteccion contra abuso.
