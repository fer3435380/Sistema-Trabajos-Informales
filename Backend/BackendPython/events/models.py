from django.db import models


class OutboxEvent(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pendiente"
        PUBLISHED = "published", "Publicado"
        FAILED = "failed", "Fallido"

    event_type = models.CharField(max_length=80)
    payload = models.JSONField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    attempts = models.PositiveIntegerField(default=0)
    last_error = models.TextField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.event_type} #{self.id}"


class RevokedToken(models.Model):
    jti = models.CharField(max_length=80, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.jti
