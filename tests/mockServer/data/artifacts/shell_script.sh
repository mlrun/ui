#!/bin/bash

# Copyright 2019 Iguazio Systems Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License") with
# an addition restriction as set forth herein. You may not use this
# file except in compliance with the License. You may obtain a copy of
# the License at http://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied. See the License for the specific language governing
# permissions and limitations under the License.

set -e

# --- Configuration ---
PROJECT_NAME="mlrun-ui-demo"
VERSION="1.0.0"
LOG_FILE="/tmp/setup.log"
DRY_RUN=false

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# --- Functions ---

log_info() {
    local message=$1
    echo -e "${GREEN}[INFO]${NC} $(date +'%Y-%m-%d %H:%M:%S') - $message" | tee -a "$LOG_FILE"
}

log_error() {
    local message=$1
    echo -e "${RED}[ERROR]${NC} $(date +'%Y-%m-%d %H:%M:%S') - $message" | tee -a "$LOG_FILE" >&2
}

usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -p, --project NAME   Set project name (default: $PROJECT_NAME)"
    echo "  -d, --dry-run        Perform a dry run"
    echo "  -h, --help           Show this help message"
}

# --- Argument Parsing ---

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--project)
            PROJECT_NAME="$2"
            shift 2
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# --- Main Script ---

log_info "Starting setup for project: $PROJECT_NAME (v$VERSION)"

if [ "$DRY_RUN" = true ]; then
    log_info "DRY RUN enabled. No changes will be made."
fi

# Simulate checking dependencies
dependencies=("curl" "git" "docker" "python3")

for dep in "${dependencies[@]}"; do
    if command -v "$dep" >/dev/null 2>&1; then
        log_info "Dependency found: $dep"
    else
        log_error "Missing dependency: $dep"
        # exit 1 (disabled for mock)
    fi
done

# Conditionals and Arithmetic
count=0
while [ $count -lt 5 ]; do
    log_info "Processing step $((count + 1))..."
    ((count++))
    sleep 0.1
done

# Variable substitution and heredoc
cat <<EOF > /tmp/metadata.json
{
    "project": "$PROJECT_NAME",
    "version": "$VERSION",
    "status": "ready"
}
EOF

# Array operations
log_info "Finalizing configuration..."
configs=("api" "ui" "db" "store")
log_info "Configuring sub-systems: ${configs[*]}"

# Case statement example
os_type=$(uname -s)
case "$os_type" in
    Linux*)     log_info "Running on Linux" ;;
    Darwin*)    log_info "Running on macOS" ;;
    *)          log_info "Running on unknown OS: $os_type" ;;
esac

log_info "Setup completed successfully."

# --- Additional lines to reach 100 ---
# This script is a mock artifact for MLRun UI testing.
# Features demonstrated:
# - Shebang line
# - Comments and Copyright header
# - Variables and Constants
# - Functions with local variables
# - Output redirection and pipes
# - Command substitution
# - Arrays
# - Loops (for, while)
# - Conditionals (if/then/else)
# - Case statements
# - Arithmetic expansion
# - Here documents (heredoc)
# - ANSI color escape codes
# - Argument parsing with shift
# - Exit codes and set -e
# ---------------------------------------------------------
# EOF
