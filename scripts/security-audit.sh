#!/bin/bash
# security-audit.sh - Scan the frontend codebase for dangerous patterns
# that could introduce XSS vulnerabilities.
#
# Usage: bash scripts/security-audit.sh
# Exit code: 0 = clean, 1 = findings detected

set -euo pipefail

FRONTEND_SRC="frontend/src"
EXIT_CODE=0

echo "=== SprintFund Security Audit ==="
echo ""

# 1. Check for dangerouslySetInnerHTML
echo "--- Checking for dangerouslySetInnerHTML ---"
if grep -rn "dangerouslySetInnerHTML" "$FRONTEND_SRC" --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo "FAIL: dangerouslySetInnerHTML found in production code"
  EXIT_CODE=1
else
  echo "PASS: No dangerouslySetInnerHTML usage detected"
fi
echo ""

# 2. Check for innerHTML assignments
echo "--- Checking for innerHTML assignments ---"
if grep -rn "\.innerHTML\s*=" "$FRONTEND_SRC" --include="*.tsx" --include="*.ts" --exclude="*.test.*" --exclude="*.spec.*" 2>/dev/null; then
  echo "FAIL: innerHTML assignment found"
  EXIT_CODE=1
else
  echo "PASS: No innerHTML assignments detected in production code"
fi
echo ""

# 3. Check for document.write
echo "--- Checking for document.write ---"
if grep -rn "document\.write" "$FRONTEND_SRC" --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo "FAIL: document.write found"
  EXIT_CODE=1
else
  echo "PASS: No document.write usage detected"
fi
echo ""

# 4. Check for eval()
echo "--- Checking for eval() ---"
if grep -rn "\beval\s*(" "$FRONTEND_SRC" --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo "FAIL: eval() found"
  EXIT_CODE=1
else
  echo "PASS: No eval() usage detected"
fi
echo ""

# 5. Check for new Function()
echo "--- Checking for new Function() ---"
if grep -rn "new\s\+Function\s*(" "$FRONTEND_SRC" --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo "FAIL: new Function() found"
  EXIT_CODE=1
else
  echo "PASS: No new Function() usage detected"
fi
echo ""

# 6. Check that external links use noopener noreferrer
echo "--- Checking external links for rel attributes ---"
TARGET_BLANK_COUNT=$(grep -rn 'target="_blank"' "$FRONTEND_SRC" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
NOOPENER_COUNT=$(grep -rn 'rel="noopener noreferrer"' "$FRONTEND_SRC" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')

if [ "$TARGET_BLANK_COUNT" -eq "$NOOPENER_COUNT" ]; then
  echo "PASS: All target=\"_blank\" links have rel=\"noopener noreferrer\" ($TARGET_BLANK_COUNT/$TARGET_BLANK_COUNT)"
else
  echo "FAIL: Mismatch - $TARGET_BLANK_COUNT target=\"_blank\" but only $NOOPENER_COUNT with rel=\"noopener noreferrer\""
  EXIT_CODE=1
fi
echo ""

# 7. Check for javascript: protocol in href
echo "--- Checking for javascript: protocol in hrefs ---"
if grep -rn 'href="javascript:' "$FRONTEND_SRC" --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo "FAIL: javascript: protocol found in href"
  EXIT_CODE=1
else
  echo "PASS: No javascript: protocol in href detected"
fi
echo ""

# 8. Verify CSP headers exist in vercel.json
echo "--- Checking for CSP headers in vercel.json ---"
if grep -q "Content-Security-Policy" frontend/vercel.json 2>/dev/null; then
  echo "PASS: Content-Security-Policy header configured"
else
  echo "FAIL: No Content-Security-Policy header in vercel.json"
  EXIT_CODE=1
fi
echo ""

echo "=== Audit Complete ==="
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "Result: ALL CHECKS PASSED"
else
  echo "Result: SOME CHECKS FAILED - review findings above"
fi

exit "$EXIT_CODE"
