from django.core.management.base import BaseCommand

from core.seed import seed_demo_data


class Command(BaseCommand):
    help = "Carga usuarios y trabajos demo."

    def handle(self, *args, **options):
        seed_demo_data()
        self.stdout.write(self.style.SUCCESS("Datos demo cargados correctamente."))
