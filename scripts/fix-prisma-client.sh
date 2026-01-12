#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Prisma v7 can generate to node_modules/.prisma/client, while @prisma/client
# expects to be able to resolve ".prisma/client/*" from within its package.
# In some workspace/hoist setups, the symlink isn't present, so we create it.

PRISMA_PKG_DIR="${ROOT_DIR}/node_modules/@prisma/client"
PRISMA_GEN_DIR="${ROOT_DIR}/node_modules/.prisma/client"

if [[ -d "${PRISMA_PKG_DIR}" && -d "${PRISMA_GEN_DIR}" ]]; then
  mkdir -p "${PRISMA_PKG_DIR}/.prisma"

  if [[ ! -e "${PRISMA_PKG_DIR}/.prisma/client" ]]; then
    ln -s "../../../.prisma/client" "${PRISMA_PKG_DIR}/.prisma/client"
  fi
fi


