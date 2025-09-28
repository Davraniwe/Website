#!/usr/bin/env bash
set -euo pipefail

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

stopped_any=false
for port in "${unique_ports[@]}"; do
    pids=$(lsof -ti tcp:${port} -sTCP:LISTEN || true)
    if [[ -z "${pids}" ]]; then
        echo "На порту ${port} ничего не запущено." >&2
        continue
    fi

    xargs -r kill <<< "${pids}"
    echo "Остановлены процессы на порту ${port}: ${pids}" >&2
    stopped_any=true
done

if [[ "${stopped_any}" != true ]]; then
    exit 0
fi
