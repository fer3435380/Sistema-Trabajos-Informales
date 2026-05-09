import os
import sys

from django.apps import AppConfig
from django.conf import settings


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        if not settings.ENABLE_BACKGROUND_WORKERS:
            return
        if "runserver" not in sys.argv:
            return
        if os.environ.get("RUN_MAIN") != "true":
            return

        from core.dispatcher import start_outbox_dispatcher

        start_outbox_dispatcher()
