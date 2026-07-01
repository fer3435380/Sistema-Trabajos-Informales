# Cambios necesarios para cumplir Programacion Web y Sistemas Distribuidos

Revision actualizada del proyecto `Sistema-Trabajos-Informales` contra los requerimientos minimos de Programacion Web y del trabajo final de Sistemas Distribuidos.

Fecha de revision: 2026-06-30.

No se debe usar `Backend-deprecated` como base de trabajo. La carpeta activa del backend es `Backend/` y el frontend activo es `nexo-front/`.

## Resumen ejecutivo

El proyecto ya cubre una parte importante de la arquitectura distribuida: API Gateway en Node.js, backend Django REST, microservicio de cursos en Node.js, worker Java, RabbitMQ, Redis, WebSockets, Docker Compose y manifiestos Kubernetes con HPA para el consumer Java.

Los faltantes criticos para cubrir completamente la rubrica son:

- (listo) PWA real en `nexo-front`: falta `manifest.json`, registro de Service Worker y estrategia de cache.
- Offline-first real: falta IndexedDB o libreria equivalente; actualmente se usa `localStorage`, que no cumple el requisito de lectura/escritura offline robusta.
- Sincronizacion offline transparente: falta cola local de mutaciones pendientes, reintentos, resolucion de conflictos y envio automatico al recuperar conexion.
- (listo)WebSocket en frontend: el backend/gateway lo soportan, pero la app React no abre una conexion WebSocket autenticada ni actualiza la UI en tiempo real.
- HTTPS/WSS publico: falta evidencia/configuracion de certificados validos, Cloudflare Tunnel, ngrok, Traefik/Let's Encrypt o Ingress TLS.
- Kubernetes de SSO/HTTPS: falta manifiesto `keycloak.yaml` o documentar que Keycloak solo corre por Docker Compose; tambien falta `ingress.yaml` o alternativa equivalente para TLS.
- Persistencia real del `courses-service`: actualmente usa `Map` en memoria; para una entrega mas solida debe persistir en PostgreSQL/Redis/DB propia o quedar justificado como microservicio demostrativo.
- Pruebas/evidencias: falta guardar capturas o logs de PWA offline, sincronizacion, WebSocket y escalado HPA bajo carga.

## Estado actual verificado

### Backend y distribuidos ya implementado

- `Backend/api-gateway`: API Gateway Node.js que valida JWT HS256 legacy y JWT RS256 de Keycloak por JWKS.
- `Backend/BackendPython`: backend Django REST para usuarios, trabajos, postulaciones, notificaciones y outbox.
- `Backend/courses-service`: microservicio Node.js para cursos, modulos y progreso.
- `Backend/java-consumer`: worker Java que consume eventos desde RabbitMQ.
- `docker-compose.yml`: incluye PostgreSQL, RabbitMQ, Redis, Keycloak, API Gateway, backend Python, notifier, outbox worker, courses service y Java consumer.
- `Backend/keycloak/nexojobs-realm.json`: realm local con cliente `nexojobs-front` y roles `worker`, `owner`, `admin`.
- `Backend/BackendPython/config/asgi.py` y `notifications/consumers.py`: WebSockets con Django Channels/Daphne.
- `k8s/`: contiene namespace, ConfigMap, Secret de ejemplo, PostgreSQL, RabbitMQ, Redis, API Gateway, courses-service, backend-python, notifier, outbox-worker y java-consumer.
- `k8s/java-consumer.yaml`: HPA CPU para `java-consumer` con `minReplicas: 1`, `maxReplicas: 5` y `averageUtilization: 60`.
- Manifiestos K8s tienen `resources.requests` y `resources.limits` en los componentes principales.

### Frontend ya implementado parcialmente

- `nexo-front/src/services/apiClient.js`: cliente HTTP centralizado con `VITE_API_BASE_URL` y Bearer token.
- Repositorios de worker/company consumen endpoints del API Gateway cuando estan disponibles y conservan fallback local.
- `nexo-front/src/services/authRepository.js`: implementa Authorization Code Flow + PKCE contra Keycloak.
- `ProtectedRoute` valida sesion, expiracion y rol en el frontend.
- El rol `owner` del backend/Keycloak se normaliza como `company` en frontend mediante `normalizeBackendRole`.

## Matriz de cumplimiento actualizada

| Requerimiento | Estado actual | Punto faltante para cumplir |
|---|---|---|
| Microservicios con dominios justificados | Parcialmente cubierto | Documentar formalmente dominios: gateway, jobs/applications, courses, notifier, worker. Persistir `courses-service` o justificar alcance demo. |
| Dos stacks tecnologicos | Cubierto | Mantener evidencia: Python/Django, Node.js, Java. |
| API Gateway como punto unico | Cubierto en backend | Asegurar que frontend y demo consuman solo `VITE_API_BASE_URL` del gateway; no exponer servicios internos. |
| Intercomunicacion entre servicios | Cubierto parcialmente | Preparar prueba del flujo completo: REST gateway -> Django -> outbox -> RabbitMQ -> Java consumer -> notificacion -> WebSocket. |
| PWA manifest | Falta | Crear `nexo-front/public/manifest.json` con nombre, iconos, theme color, display standalone y start_url. |
| Service Worker/cache | Falta | Registrar Service Worker desde `src/main.jsx` o usar `vite-plugin-pwa`; cachear shell y GET criticos. |
| IndexedDB/offline writes | Falta | Agregar Dexie.js o `idb`; reemplazar/acompanar `localStorage` con tablas offline. |
| Sincronizacion al reconectar | Falta | Crear cola `pending_mutations`, procesarla con evento `online`, reintentos y estados de conflicto. |
| OAuth2 SSO | Cubierto localmente | Documentar demo Keycloak y callback; opcionalmente eliminar login local como modo principal de defensa. |
| JWT firmado | Cubierto | Mantener validacion RS256 por JWKS en gateway y JWT interno HS256 hacia Django. |
| Proteccion de rutas frontend/backend | Parcial | Agregar pruebas/evidencia por rol; revisar rutas `admin` si se van a defender. |
| HTTPS/WSS | Falta | Publicar gateway con Cloudflare Tunnel/ngrok/Ingress TLS; usar `https://` y `wss://`. |
| Colas async | Cubierto | Mostrar RabbitMQ/outbox/consumer en ejecucion. |
| Componentes Producer/Worker/Notifier | Cubierto | Gateway/outbox como producer, Java consumer como worker, Django Channels como notifier. |
| REST/JSON externo | Cubierto | Mantener REST solo a traves del gateway. |
| WebSockets backend | Cubierto | Falta cliente React conectado con token y reconexion. |
| Dockerfile por componente | Cubierto para gateway, Django, courses y Java | Verificar build de imagenes antes de la entrega. |
| Kubernetes Deployments/Services | Cubierto para componentes principales | Falta Keycloak si SSO debe estar dentro del cluster; falta Ingress/TLS. |
| ConfigMaps/Secrets | Parcial | Hay `configmap.yaml` y `secret.example.yaml`; crear/aplicar Secret real fuera de git. |
| Requests/Limits | Cubierto en manifiestos principales | Mantenerlos al agregar Keycloak/Ingress u otros componentes. |
| HPA CPU workers | Cubierto en manifiesto | Falta prueba de carga con evidencia de escalado real. |

## Cambios necesarios por prioridad

### Prioridad 1: PWA y offline-first

Estos puntos son obligatorios para Programacion Web y actualmente son la brecha mas grande.

1. Agregar `nexo-front/public/manifest.json`.
2. Agregar iconos PNG instalables, minimo `192x192` y `512x512`.
3. Registrar un Service Worker desde `nexo-front/src/main.jsx`.
4. Cachear shell de la aplicacion: HTML, JS, CSS, fuentes e iconos.
5. Cachear lecturas criticas con estrategia `NetworkFirst` o `StaleWhileRevalidate`:

```text
GET /api/v1/worker/dashboard/
GET /api/v1/company/dashboard/
GET /api/v1/jobs/
GET /api/v1/courses/
GET /api/v1/applications/mine/
GET /api/v1/applications/received/
GET /api/v1/notifications/
```

6. Agregar IndexedDB con Dexie.js o `idb`.

Tablas minimas recomendadas:

```text
profiles
jobs
applications
courses
course_progress
notifications
pending_mutations
auth_session
sync_log
```

7. Implementar cola local de mutaciones pendientes:

```json
{
  "id": "uuid-local",
  "type": "application.create",
  "endpoint": "/applications/",
  "method": "POST",
  "payload": {},
  "createdAt": "2026-06-30T00:00:00.000Z",
  "status": "pending",
  "retryCount": 0,
  "lastError": null
}
```

Mutaciones minimas a soportar:

```text
application.create
application.cancel
course.start
course.advance
notification.mark_read
profile.update
```

8. Procesar la cola cuando vuelva la conexion:

- Escuchar `window.addEventListener('online', syncPendingMutations)`.
- Sincronizar tambien al iniciar sesion y al abrir dashboards.
- Aplicar actualizacion optimista en UI.
- Marcar cada mutacion como `synced`, `failed` o `conflict`.
- Mostrar estado visible cuando una accion esta pendiente de sincronizacion.

### Prioridad 2: WebSocket real en React

El gateway y el notifier ya soportan WebSocket. Falta conectar el frontend.

Cambios concretos:

- Crear `nexo-front/src/services/notificationSocket.js`.
- Agregar `VITE_WS_URL`.
- Abrir conexion despues del login usando subprotocolos:

```js
new WebSocket(import.meta.env.VITE_WS_URL, ['bearer', accessToken])
```

- Evitar enviar JWT por query string en la demo principal.
- Reintentar conexion con backoff.
- Al recibir `notification.created`, guardar en IndexedDB y actualizar paneles de notificaciones.
- Al recuperar conexion, refrescar `GET /notifications/` para cubrir mensajes perdidos.

Eventos minimos:

```text
connected
notification.created
notification.read
application.status_changed
course.completed
```

### Prioridad 3: HTTPS/WSS y exposicion publica

Este requisito aun no esta cubierto por el repo.

Opciones validas para la entrega:

- Cloudflare Tunnel apuntando al API Gateway local.
- ngrok con HTTPS apuntando al API Gateway.
- Traefik o Nginx Ingress con cert-manager/Let's Encrypt.
- Ingress TLS en Kubernetes si se usa un cluster con dominio.

Configuracion esperada para frontend:

```text
VITE_API_BASE_URL=https://dominio-publico/api/v1
VITE_WS_URL=wss://dominio-publico/ws/notifications/
VITE_OAUTH_AUTHORITY=https://dominio-publico/realms/nexojobs
```

Reglas:

- Solo exponer `api-gateway`.
- No exponer PostgreSQL, RabbitMQ AMQP, Redis, backend-python, courses-service ni notifier directamente.
- Si Keycloak se mantiene fuera del gateway, debe quedar tambien bajo HTTPS para que el flujo OAuth2 sea consistente.

### Prioridad 4: Kubernetes completo para SSO y TLS

`k8s/` ya contiene los componentes principales, pero faltan piezas si la defensa exige todo dentro del cluster.

Agregar o documentar:

- `k8s/keycloak.yaml` con Deployment, Service, recursos y variables necesarias.
- `k8s/ingress.yaml` o manifiestos equivalentes de tunnel/LoadBalancer con TLS.
- Secret real aplicado al cluster, no versionado, basado en `k8s/secret.example.yaml`.
- ConfigMap actualizado con URLs internas y publicas:

```text
KEYCLOAK_ISSUER_URL
KEYCLOAK_JWKS_URL
COURSES_SERVICE_URL
BACKEND_SERVICE_URL
NOTIFIER_SERVICE_URL
CORS_ALLOWED_ORIGINS
```

Si Keycloak se mantiene solo en Docker Compose, dejarlo explicitamente como "SSO local para demo fuera de Kubernetes" y no presentarlo como parte del despliegue K8s completo.

### Prioridad 5: endurecer seguridad y roles

El sistema ya valida JWT en gateway y roles en servicios, pero faltan evidencias y algunos ajustes para defensa.

- Probar que un token vencido recibe `401`.
- Probar que un `worker` no puede crear cursos ni aceptar/rechazar postulaciones.
- Probar que un `owner` no puede acceder a vistas de trabajador si no corresponde.
- Probar que requests sin Bearer token a rutas protegidas reciben `401`.
- Revisar si la ruta `/admin` existira; si existe, protegerla con rol `admin`.
- Mantener la normalizacion `owner -> company` en frontend, pero documentarla para evitar confusiones en la exposicion.
- Agregar validacion de `Origin` en WebSocket para produccion.
- Rotar secretos reales y no usar valores `change-me`.

### Prioridad 6: persistencia del courses-service

El microservicio `Backend/courses-service` cumple diversidad tecnologica y dominio separado, pero hoy guarda cursos/progreso en memoria (`Map`). Esto puede perder datos al reiniciar el contenedor o pod.

Opciones:

- Conectarlo a PostgreSQL con su propia base/tablas.
- Usar Redis para progreso si se acepta persistencia ligera.
- Mantenerlo en memoria solo como demo, pero documentar claramente la limitacion.

Para una entrega mas fuerte, se recomienda PostgreSQL o SQLite persistente en desarrollo y PostgreSQL en Docker/K8s.

### Prioridad 7: prueba de carga y evidencia HPA

El HPA existe, pero se debe demostrar.

Pasos recomendados:

```powershell
kubectl apply -k k8s
kubectl get pods,svc,hpa -n trabajos
kubectl get hpa -n trabajos -w
kubectl get pods -n trabajos -w
python tools/load_test.py http://localhost:18000/api/v1 100 20
```

Evidencia esperada:

- Captura inicial con `java-consumer` en 1 replica.
- Captura del HPA mostrando CPU mayor al objetivo.
- Captura de nuevos pods `java-consumer` creados automaticamente.
- Captura final del sistema procesando eventos y notificaciones.

## Arquitectura objetivo para defender

```text
Frontend React PWA
  | HTTPS REST/JSON
  | WSS notificaciones
  v
API Gateway Node.js
  | valida JWT Keycloak RS256
  | emite JWT interno HS256
  | enruta REST y WebSocket
  v
+----------------------+----------------------+----------------------+
| Django REST          | Courses Service      | Notifier             |
| jobs/applications    | Node.js              | Django Channels      |
| users/notifications  | cursos/progreso      | WebSockets + Redis   |
+----------+-----------+----------+-----------+----------+-----------+
           |                      |                      ^
           | outbox               | REST interno          |
           v                      |                      |
        RabbitMQ ----------------> Java Worker ----------+
```

Justificacion de dominios:

- API Gateway: entrada unica, CORS, autenticacion, proxy y WebSocket upgrade.
- Jobs/Application Service: reglas de negocio de microtrabajos y postulaciones.
- Courses Service: cursos, modulos, avance y habilidades desbloqueadas.
- Notification Service: entrega en tiempo real y persistencia de notificaciones.
- Worker/Consumer: procesamiento asincrono de eventos de negocio.

## Evidencias recomendadas para entrega

- Diagrama de arquitectura final.
- Captura de `docker compose ps` con servicios arriba.
- Captura de login Keycloak/OAuth2 y callback exitoso.
- Captura de JWT decodificado con rol.
- Captura de endpoint protegido rechazando token invalido.
- Captura de frontend instalado como PWA.
- Captura de app funcionando offline.
- Captura de IndexedDB con tablas y datos.
- Captura de `pending_mutations` antes y despues de recuperar conexion.
- Captura de WebSocket recibiendo notificaciones.
- Captura de `kubectl get pods,svc,hpa -n trabajos`.
- Captura de HPA escalando `java-consumer`.
- Captura o log de HTTPS/WSS publico con certificado valido.

## Checklist final de faltantes

- [ ] Crear manifest PWA e iconos instalables.
- [ ] Registrar Service Worker y cachear app shell.
- [ ] Implementar IndexedDB.
- [ ] Implementar cola `pending_mutations`.
- [ ] Sincronizar cola al recuperar conexion.
- [ ] Conectar WebSocket en React usando subprotocolo `bearer`.
- [ ] Actualizar notificaciones en UI desde WebSocket.
- [ ] Publicar API Gateway por HTTPS.
- [ ] Publicar WebSocket por WSS.
- [ ] Definir despliegue de Keycloak en K8s o documentarlo como servicio externo/local.
- [ ] Agregar Ingress/TLS o documentar tunnel seguro.
- [ ] Crear Secret real en Kubernetes fuera de git.
- [ ] Persistir datos de `courses-service` o documentar limitacion demo.
- [ ] Ejecutar prueba de carga y guardar evidencia del HPA.
- [ ] Agregar evidencias de autorizacion por roles y JWT vencido/invalido.
