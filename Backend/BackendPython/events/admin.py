from django.contrib import admin

from events.models import OutboxEvent, RevokedToken


@admin.register(OutboxEvent)
class OutboxEventAdmin(admin.ModelAdmin):
    list_display = ("id", "event_type", "status", "attempts", "created_at", "published_at")
    list_filter = ("event_type", "status")
    readonly_fields = ("created_at", "updated_at", "published_at")


@admin.register(RevokedToken)
class RevokedTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "jti", "created_at")
    search_fields = ("jti",)
