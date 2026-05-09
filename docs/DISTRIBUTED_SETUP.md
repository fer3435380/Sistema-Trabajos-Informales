# Despliegue distribuido

Este despliegue esta pensado para dos computadoras en la misma red.

## Computadora 1: Python

Esta maquina ejecuta:

- Backend Python con Django REST Framework
- PostgreSQL
- RabbitMQ
- Worker de outbox con hilos

Arranque:

```powershell
copy .env.docker.example .env
docker compose up -d --build
```

Servicios expuestos:

- API Python: `http://IP_DE_ESTA_PC:8000/api/v1/`
- RabbitMQ AMQP: `IP_DE_ESTA_PC:5672`
- RabbitMQ panel web: `http://IP_DE_ESTA_PC:15672`

Credenciales RabbitMQ:

- usuario: `trabajos`
- clave: `trabajos123`
- cola: `job_events`

## Computadora 2: Java

El consumidor Java debe conectarse a la maquina Python.

Configuracion esperada:

```text
RABBITMQ_HOST=IP_DE_LA_PC_PYTHON
RABBITMQ_PORT=5672
RABBITMQ_USER=trabajos
RABBITMQ_PASSWORD=trabajos123
RABBITMQ_QUEUE=job_events
PYTHON_API_BASE_URL=http://IP_DE_LA_PC_PYTHON:8000/api/v1
INTERNAL_API_KEY=dev-internal-key
```

Cuando Java procese un evento, puede registrar notificaciones en:

```text
POST http://IP_DE_LA_PC_PYTHON:8000/api/v1/notifications/
Header: X-Internal-Api-Key: dev-internal-key
```

## Puertos a permitir en firewall

- `8000`: API REST Python
- `5672`: RabbitMQ para Java
- `15672`: panel web RabbitMQ
