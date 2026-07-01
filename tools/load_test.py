import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from email.utils import make_msgid
from urllib.error import HTTPError
from urllib.request import Request, urlopen


BASE_URL = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:8080/api/v1"
TOTAL = int(sys.argv[2]) if len(sys.argv) > 2 else 50
CONCURRENCY = int(sys.argv[3]) if len(sys.argv) > 3 else 10


def request(method, path, body=None, token=None):
    data = None if body is None else json.dumps(body).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = Request(f"{BASE_URL}{path}", data=data, headers=headers, method=method)
    try:
        with urlopen(req, timeout=20) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else None
    except HTTPError as exc:
        raw = exc.read().decode("utf-8")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            payload = raw
        return exc.code, payload


def login(email, password):
    status, payload = request("POST", "/auth/login/", {"email": email, "password": password})
    if status != 200:
        raise RuntimeError(f"No se pudo iniciar sesion con {email}: {status} {payload}")
    return payload["access_token"]


def register_worker(index):
    unique = make_msgid(domain="load.local").strip("<>").replace("@", ".")
    email = f"load-{index}-{unique}@demo.com"
    status, payload = request(
        "POST",
        "/auth/register/",
        {
            "name": f"Load Worker {index}",
            "email": email,
            "password": "Worker123!",
            "role": "worker",
        },
    )
    if status != 201:
        raise RuntimeError(f"Registro fallido {email}: {status} {payload}")
    return payload["access_token"]


def first_open_job():
    status, payload = request("GET", "/jobs/?status=open")
    if status != 200 or not payload:
        raise RuntimeError(f"No se pudo consultar trabajos: {status} {payload}")
    return payload[0]["id"]


def apply_once(index, job_id):
    token = register_worker(index)
    status, payload = request(
        "POST",
        "/applications/",
        {"job": job_id, "cover_letter": f"Postulacion de carga #{index}"},
        token=token,
    )
    return index, status, payload


def main():
    started = time.time()
    owner_token = login("owner@demo.com", "Owner123!")
    job_id = first_open_job()
    print(f"API: {BASE_URL}")
    print(f"Owner token OK: {bool(owner_token)}")
    print(f"Trabajo usado para la carga: {job_id}")
    print(f"Solicitudes: {TOTAL}, concurrencia: {CONCURRENCY}")

    ok = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = [executor.submit(apply_once, index, job_id) for index in range(TOTAL)]
        for future in as_completed(futures):
            index, status, payload = future.result()
            if status == 201:
                ok += 1
            else:
                failed += 1
                print(f"[{index}] fallo {status}: {payload}")

    elapsed = time.time() - started
    print(f"Completadas: {ok}, fallidas: {failed}, tiempo: {elapsed:.2f}s")
    print("Revisa RabbitMQ, logs de java-consumer y HPA para evidenciar procesamiento/escalado.")


if __name__ == "__main__":
    main()
