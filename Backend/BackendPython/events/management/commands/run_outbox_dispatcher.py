import time

from django.core.management.base import BaseCommand

from core.dispatcher import OutboxDispatcher


class Command(BaseCommand):
    help = "Publica eventos pendientes del outbox a RabbitMQ usando un hilo."

    def handle(self, *args, **options):
        dispatcher = OutboxDispatcher()
        dispatcher.start()
        self.stdout.write(self.style.SUCCESS("Outbox dispatcher iniciado con threading.Thread."))
        try:
            while dispatcher.is_alive():
                time.sleep(1)
        except KeyboardInterrupt:
            dispatcher.stop()
            self.stdout.write(self.style.WARNING("Outbox dispatcher detenido."))
