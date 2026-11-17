#!/usr/bin/env bash
# Copyright 2019 Iguazio
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# The resource sampler of the E2E regression on CI (.github/workflows/e2e.yaml): runs in the background during the
# tests and appends a line every N seconds to the log, read by scripts/e2eCiSummary.js. Linux only (/proc).
#
#   scripts/e2eResources.sh <log> [interval seconds, 5]
#
# A line: `ts=<epoch s> load=<1m>,<5m>,<15m>,<running/total> cpu=<the cumulative "cpu" counters of /proc/stat>
# procs_running=N procs_blocked=N MemTotal=kB MemAvailable=kB SwapTotal=kB SwapFree=kB`. The CPU idle and iowait
# shares are the differences of the counters between two lines. E2E_PROC_DIR - another /proc (the parsing tests)
set -u

log=${1:?usage: e2eResources.sh <log> [interval seconds]}
interval=${2:-5}
proc=${E2E_PROC_DIR:-/proc}

mkdir -p "$(dirname "$log")"
echo "# cpus=$(getconf _NPROCESSORS_ONLN) interval=${interval}" > "$log"

# stopped by the workflow after the tests (the pending sleep is stopped too)
trap 'kill "$sleep_pid" 2>/dev/null; exit 0' TERM INT
sleep_pid=

while :; do
  {
    printf 'ts=%s ' "$(date +%s)"
    awk '{ printf "load=%s,%s,%s,%s ", $1, $2, $3, $4 }' "$proc/loadavg"
    awk '$1 == "cpu" { $1 = ""; sub(/^ +/, ""); gsub(/ +/, ","); printf "cpu=%s ", $0 }
      $1 ~ /^procs_(running|blocked)$/ { printf "%s=%s ", $1, $2 }' "$proc/stat"
    awk '$1 ~ /^(MemTotal|MemAvailable|SwapTotal|SwapFree):$/ { sub(/:$/, "", $1); printf "%s=%s ", $1, $2 }
      END { print "" }' "$proc/meminfo"
  } >> "$log"
  sleep "$interval" &
  sleep_pid=$!
  wait "$sleep_pid"
done
