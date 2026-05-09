from pathlib import Path
import os
import sys


BASE_DIR = Path(__file__).resolve().parent / "BackendPython"
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from django.core.management import execute_from_command_line  # noqa: E402


if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    args = sys.argv[1:]
    if not args:
        args = ["runserver", "0.0.0.0:8000"]
    execute_from_command_line([sys.argv[0], *args])
