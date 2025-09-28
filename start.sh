#!/usr/bin/env bash
set -euo pipefail

PORT=1000
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_LOG="${ROOT_DIR}/server.log"

existing_pids=$(lsof -ti tcp:${PORT} -sTCP:LISTEN || true)
if [[ -n "${existing_pids}" ]]; then
    echo "Порт ${PORT} уже занят. Останавливаю процессы: ${existing_pids}" >&2
    xargs -r kill <<< "${existing_pids}"
    sleep 1
fi

cd "${ROOT_DIR}"
nohup node server.js > "${SERVER_LOG}" 2>&1 &
new_pid=$!

echo "Сервер запущен на http://localhost:${PORT} (PID: ${new_pid})." >&2
echo "Логи записываются в ${SERVER_LOG}." >&2
