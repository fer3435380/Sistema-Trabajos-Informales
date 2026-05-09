from django.conf import settings
from django.db import models


class Job(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Abierto"
        ASSIGNED = "assigned", "Asignado"
        CLOSED = "closed", "Cerrado"

    title = models.CharField(max_length=160)
    description = models.TextField()
    type = models.CharField(max_length=80)
    location = models.CharField(max_length=160)
    payment = models.DecimalField(max_digits=10, decimal_places=2)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_jobs")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
