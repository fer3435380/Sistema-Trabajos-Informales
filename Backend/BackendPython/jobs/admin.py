from django.contrib import admin

from jobs.models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "type", "location", "payment", "creator", "status")
    list_filter = ("type", "status", "location")
    search_fields = ("title", "description", "location")
