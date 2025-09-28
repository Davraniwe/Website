#!/usr/bin/env bash
set -euo pipefail

PORT=1000

pids=$(lsof -ti tcp:${PORT} -sTCP:LISTEN || true)
if [[ -z "${pids}" ]]; then
    echo "На порту ${PORT} ничего не запущено." >&2
    exit 0
fi

xargs -r kill <<< "${pids}"
echo "Остановлены процессы: ${pids}" >&2
