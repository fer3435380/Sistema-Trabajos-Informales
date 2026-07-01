# Demo HTTPS/WSS con Cloudflare Tunnel

Esta guia publica el proyecto completo desde la misma PC usando quick tunnels gratuitos de Cloudflare:

- Frontend React: `http://127.0.0.1:5173`
- API Gateway REST/WSS: `http://127.0.0.1:8080`
- Keycloak OAuth2/OIDC: `http://127.0.0.1:8081`

No requiere abrir puertos del router ni pagar un dominio. Las URLs `trycloudflare.com` son temporales y cambian cada vez que reinicias los tuneles.

## 1. Levantar servicios locales

En una terminal con Docker disponible:

```powershell
docker compose up -d --build
```

Construye el frontend con las variables locales actuales:

```powershell
cd nexo-front
npm run build
cd ..
docker compose up -d frontend
```

Comprueba localmente:

```text
http://localhost:8080/api/v1/health/
http://localhost:8081/realms/nexojobs
http://localhost:5173
```

## 2. Iniciar los tres tuneles

Desde la raiz del proyecto:

```powershell
.\tools\start-cloudflare-quick-tunnels.ps1
```

Espera 10 a 20 segundos y lee las URLs:

```powershell
.\tools\show-cloudflare-tunnel-urls.ps1
```

La salida tendra esta forma:

```text
frontend=https://frontend-temporal.trycloudflare.com
api-gateway=https://gateway-temporal.trycloudflare.com
keycloak=https://auth-temporal.trycloudflare.com
```

## 3. Aplicar URLs al proyecto

Usa las tres URLs reales obtenidas:

```powershell
.\tools\apply-cloudflare-demo-urls.ps1 `
  -FrontendUrl "https://frontend-temporal.trycloudflare.com" `
  -GatewayUrl "https://gateway-temporal.trycloudflare.com" `
  -AuthUrl "https://auth-temporal.trycloudflare.com"
```

Esto actualiza:

- `.env`
- `nexo-front/.env.local`

Tambien crea respaldo:

```text
.env.cloudflare.bak
```

## 4. Reiniciar servicios que dependen de URLs publicas

Reinicia contenedores para que Keycloak emita tokens con issuer publico y el gateway valide ese issuer:

```powershell
docker compose up -d --force-recreate keycloak api-gateway backend-python notifier
```

Reconstruye el frontend para que Vite incluya las URLs publicas en el bundle y reinicia Nginx:

```powershell
cd nexo-front
npm run build
cd ..
docker compose up -d frontend
```

## 5. Probar

Abre la URL publica del frontend:

```text
https://frontend-temporal.trycloudflare.com
```

El frontend debe usar:

```text
VITE_API_BASE_URL=https://gateway-temporal.trycloudflare.com/api/v1
VITE_WS_URL=wss://gateway-temporal.trycloudflare.com/ws/notifications/
VITE_OAUTH_AUTHORITY=https://auth-temporal.trycloudflare.com/realms/nexojobs
```

Usuarios demo:

```text
maria.piedra@nexojobs.ec        / maria123   / worker
operaciones@eventosaustro.ec    / empresa123 / owner
admin@nexojobs.ec               / Admin123!  / admin
```

## Evidencias para la entrega

- Captura de la URL publica del frontend con candado HTTPS.
- Captura de `https://gateway...trycloudflare.com/api/v1/health/`.
- Captura de Keycloak en `https://auth...trycloudflare.com/realms/nexojobs`.
- Captura de DevTools mostrando WebSocket `wss://gateway.../ws/notifications/`.
- Captura de login OAuth2 y retorno a `/auth/callback`.
- Captura de `docker compose ps`.

## Notas

- Si reinicias los tuneles, debes repetir los pasos 2, 3 y 4 porque las URLs cambian.
- Si Keycloak rechaza el callback, recrea el contenedor de Keycloak para reimportar el realm actualizado:

```powershell
docker compose rm -sf keycloak
docker compose up -d keycloak api-gateway
```

- Para una URL estable necesitas un dominio agregado a Cloudflare y un named tunnel. Para la entrega academica local, los quick tunnels suelen ser suficientes.
- Los scripts usan `127.0.0.1` en vez de `localhost` para evitar que Windows resuelva el origen como IPv6 `::1`.

## Alternativa Kubernetes con Ingress TLS

El manifiesto `k8s/ingress.yaml` publica:

```text
https://api.nexojobs.local  -> api-gateway
https://auth.nexojobs.local -> keycloak
```

Antes de aplicarlo en un cluster real, cambia esos hosts por tus dominios publicos y crea el Secret TLS:

```powershell
kubectl create secret tls trabajos-tls `
  -n trabajos `
  --cert .\certs\fullchain.pem `
  --key .\certs\privkey.pem
```

Si usas Cloudflare Tunnel en vez de Ingress TLS dentro del cluster, puedes mantener `ingress.yaml` como evidencia de la ruta Kubernetes y usar los scripts de tunnel para la demo local.
