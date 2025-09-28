#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_LOG="${ROOT_DIR}/server.log"

if [[ -f "${ROOT_DIR}/.env" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "${ROOT_DIR}/.env"
    set +a
fi

PRIMARY_PORT="${PORT:-${CANCERO_PORT:-1000}}"
BIOGROW_PORT="${BIOGROW_PORT:-1001}"

ports_to_check=()
ports_to_check+=("${PRIMARY_PORT}")
if [[ -n "${BIOGROW_PORT}" ]]; then
    ports_to_check+=("${BIOGROW_PORT}")
fi

declare -A seen_ports=()
unique_ports=()
for port in "${ports_to_check[@]}"; do
    if [[ -n "${port}" && -z "${seen_ports[$port]:-}" ]]; then
        unique_ports+=("${port}")
        seen_ports[$port]=1
    fi
done

for port in "${unique_ports[@]}"; do
    existing_pids=$(lsof -ti tcp:${port} -sTCP:LISTEN || true)
    if [[ -n "${existing_pids}" ]]; then
        echo "Порт ${port} уже занят. Останавливаю процессы: ${existing_pids}" >&2
        xargs -r kill <<< "${existing_pids}"
        sleep 1
    fi
done

export PORT="${PRIMARY_PORT}"
export BIOGROW_PORT

cd "${ROOT_DIR}"
nohup node server.js > "${SERVER_LOG}" 2>&1 &
new_pid=$!

echo "Сервер запущен на http://localhost:${PORT} (PID: ${new_pid})." >&2
echo "Логи записываются в ${SERVER_LOG}." >&2
