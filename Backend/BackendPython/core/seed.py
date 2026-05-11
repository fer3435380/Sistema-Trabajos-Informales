from decimal import Decimal

from jobs.models import Job
from users.models import User


def upsert_demo_job(owner, data):
    existing_job = (
        Job.objects.filter(title=data["title"], creator=owner)
        .order_by("id")
        .first()
    )

    if existing_job:
        for field, value in {**data, "status": Job.Status.OPEN}.items():
            setattr(existing_job, field, value)
        existing_job.save()
        return existing_job

    return Job.objects.create(
        creator=owner,
        status=Job.Status.OPEN,
        **data,
    )


def seed_demo_data():
    owner, _ = User.objects.update_or_create(
        email="owner@demo.com",
        defaults={"name": "Dueno Demo", "role": User.Role.OWNER, "is_active": True},
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
        {
            "title": "Ayuda para mudanza",
            "description": "Apoyo cargando cajas y muebles pequenos.",
            "type": "mudanza",
            "location": "Cuenca, Centro",
            "payment": Decimal("15.00"),
        },
        {
            "title": "Limpieza de casa",
            "description": "Limpieza general por horas.",
            "type": "limpieza",
            "location": "Totoracocha",
            "payment": Decimal("12.00"),
        },
        {
            "title": "Pintura de pared",
            "description": "Pintar una pared interior.",
            "type": "pintura",
            "location": "Sucre",
            "payment": Decimal("10.00"),
        },
    ]:
        upsert_demo_job(owner, data)
