from decimal import Decimal

from jobs.models import Job
from users.models import User


def seed_demo_data():
    owner, _ = User.objects.update_or_create(
        email="owner@demo.com",
        defaults={"name": "Dueño Demo", "role": User.Role.OWNER, "is_active": True},
    )
    owner.set_password("Owner123!")
    owner.save()

    worker, _ = User.objects.update_or_create(
        email="worker@demo.com",
        defaults={"name": "Trabajador Demo", "role": User.Role.WORKER, "is_active": True},
    )
    worker.set_password("Worker123!")
    worker.save()

    for data in [
        {"title": "Ayuda para mudanza", "description": "Apoyo cargando cajas y muebles pequeños.", "type": "mudanza", "location": "Cuenca, Centro", "payment": Decimal("15.00")},
        {"title": "Limpieza de casa", "description": "Limpieza general por horas.", "type": "limpieza", "location": "Totoracocha", "payment": Decimal("12.00")},
        {"title": "Pintura de pared", "description": "Pintar una pared interior.", "type": "pintura", "location": "Sucre", "payment": Decimal("10.00")},
    ]:
        Job.objects.update_or_create(title=data["title"], creator=owner, defaults={**data, "status": Job.Status.OPEN})
