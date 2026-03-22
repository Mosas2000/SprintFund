#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

check_env_var() {
  local var_name=$1
  local required=$2

  if [ -z "${!var_name}" ]; then
    if [ "$required" = "true" ]; then
      echo -e "${RED}[ERROR]${NC} $var_name is not set"
      ERRORS=$((ERRORS + 1))
    else
      echo -e "${YELLOW}[WARN]${NC} $var_name is not set (optional)"
    fi
  else
    echo -e "${GREEN}[OK]${NC} $var_name is configured"
  fi
}

echo "Validating deployment environment..."
echo ""

echo "Required environment variables:"
check_env_var "NEXT_PUBLIC_NETWORK" "true"
check_env_var "NEXT_PUBLIC_CONTRACT_ADDRESS" "true"
check_env_var "NEXT_PUBLIC_STACKS_API_URL" "true"

echo ""
echo "Build validation:"

if [ -f "package.json" ]; then
  echo -e "${GREEN}[OK]${NC} package.json exists"
else
  echo -e "${RED}[ERROR]${NC} package.json not found"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "next.config.ts" ]; then
  echo -e "${GREEN}[OK]${NC} next.config.ts exists"
else
  echo -e "${RED}[ERROR]${NC} next.config.ts not found"
  ERRORS=$((ERRORS + 1))
fi

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}[OK]${NC} Node.js installed: $NODE_VERSION"

  MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d'.' -f1 | tr -d 'v')
  if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo -e "${RED}[ERROR]${NC} Node.js 18+ required"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${RED}[ERROR]${NC} Node.js not installed"
  ERRORS=$((ERRORS + 1))
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}Validation passed${NC}"
  exit 0
else
  echo -e "${RED}Validation failed with $ERRORS error(s)${NC}"
  exit 1
fi
