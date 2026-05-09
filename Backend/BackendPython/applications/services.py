from django.db import transaction
from rest_framework import exceptions

from applications.models import Application
from events.models import OutboxEvent
from jobs.models import Job


EVENT_TYPE_BY_STATUS = {
    Application.Status.ACCEPTED: "postulacion_aceptada",
    Application.Status.REJECTED: "postulacion_rechazada",
}


def build_payload(event_type, application):
    return {
        "event_type": event_type,
        "application_id": application.id,
        "job_id": application.job_id,
        "job_title": application.job.title,
        "applicant_id": application.applicant_id,
        "owner_id": application.job.creator_id,
        "status": application.status,
    }


@transaction.atomic
def create_application(user, job, cover_letter=""):
    if job.creator_id == user.id:
        raise exceptions.ValidationError("No puedes postular a tu propio trabajo.")
    if job.status != Job.Status.OPEN:
        raise exceptions.ValidationError("El trabajo no está disponible.")
    if Application.objects.filter(job=job, applicant=user).exists():
        raise exceptions.ValidationError("Ya postulaste a este trabajo.")

    application = Application.objects.create(job=job, applicant=user, cover_letter=cover_letter)
    event_type = "postulacion_creada"
    OutboxEvent.objects.create(event_type=event_type, payload=build_payload(event_type, application))
    return application


@transaction.atomic
def change_application_status(user, application, new_status):
    if application.job.creator_id != user.id and user.role != "admin":
        raise exceptions.PermissionDenied("Solo el dueño del trabajo puede cambiar esta postulación.")
    if application.status != Application.Status.PENDING:
        raise exceptions.ValidationError("La postulación ya fue procesada.")
    if new_status not in EVENT_TYPE_BY_STATUS:
        raise exceptions.ValidationError("Estado inválido.")

    application.status = new_status
    application.save(update_fields=["status", "updated_at"])

    if new_status == Application.Status.ACCEPTED:
        application.job.status = Job.Status.ASSIGNED
        application.job.save(update_fields=["status", "updated_at"])

    event_type = EVENT_TYPE_BY_STATUS[new_status]
    OutboxEvent.objects.create(event_type=event_type, payload=build_payload(event_type, application))
    return application
