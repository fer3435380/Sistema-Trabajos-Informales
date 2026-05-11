# Sistema-Trabajos-Informales

Repositorio del trabajo interciclo de Sistemas Distribuidos.

## Estructura

- `Frontend/` front-end del proyecto
- `Backend/BackendPython/` backend principal en Django REST Framework

El backend Python cubre usuarios, trabajos precargados, postulaciones, aceptacion/rechazo, notificaciones, publicacion de eventos a RabbitMQ y un worker con hilos.

## Backend Python

```powershell
cd Backend\BackendPython
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_demo
python main.py
```

## Datos demo

- `owner@demo.com` / `Owner123!`
- `worker@demo.com` / `Worker123!`

## Docker distribuido

Para correr Python, PostgreSQL, RabbitMQ y el worker de hilos en una sola maquina:

```powershell
copy .env.docker.example .env
docker compose up -d --build
```

La otra computadora, donde corre Java, debe conectarse a `http://IP_DE_LA_PC_PYTHON:8000` y a RabbitMQ en `IP_DE_LA_PC_PYTHON:5672`.

Guia completa: `docs/DISTRIBUTED_SETUP.md`.
