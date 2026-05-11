import logging
import threading

from django.db import close_old_connections
from django.utils import timezone

from core.queue import get_queue_publisher
from events.models import OutboxEvent


logger = logging.getLogger(__name__)
_dispatcher = None


class OutboxDispatcher(threading.Thread):
    def __init__(self, interval_seconds=3):
        super().__init__(name="outbox-dispatcher", daemon=True)
        self.interval_seconds = interval_seconds
        self.publisher = get_queue_publisher()
        self._stop_event = threading.Event()

    def stop(self):
        self._stop_event.set()

    def run(self):
        while not self._stop_event.is_set():
            close_old_connections()
            self.dispatch_once()
            self._stop_event.wait(self.interval_seconds)

    def dispatch_once(self):
        pending_events = OutboxEvent.objects.filter(status=OutboxEvent.Status.PENDING).order_by("created_at")[:10]
        for event in pending_events:
            try:
                self.publisher.publish(event)
                event.status = OutboxEvent.Status.PUBLISHED
                event.published_at = timezone.now()
                event.last_error = ""
            except Exception as exc:
                event.attempts += 1
                event.last_error = str(exc)[:500]
                if event.attempts >= 5:
                    event.status = OutboxEvent.Status.FAILED
                logger.warning("No se pudo publicar evento %s: %s", event.id, exc)
            finally:
                event.save(update_fields=["status", "attempts", "last_error", "published_at", "updated_at"])


def start_outbox_dispatcher():
    global _dispatcher
    if _dispatcher and _dispatcher.is_alive():
        return _dispatcher
    _dispatcher = OutboxDispatcher()
    _dispatcher.start()
    return _dispatcher
