# Backend Python

Backend principal en Django REST Framework para usuarios, trabajos precargados, postulaciones, aceptacion/rechazo, notificaciones y publicacion de eventos a RabbitMQ.

## Ejecutar local

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_demo
.\.venv\Scripts\python.exe main.py
```

## Worker de eventos

```powershell
.\.venv\Scripts\python.exe manage.py run_outbox_dispatcher
```

El worker usa hilos con `threading.Thread` y publica eventos pendientes a RabbitMQ.
