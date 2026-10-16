#!/usr/bin/env bash
# cURL & Bash Recipes: Programmatic Secure Document Sharing

set -euo pipefail

# 1. Dispatch document link via API
echo "=== Recipe 1: Dispatch Document Link ==="
curl -X POST "https://api.sendnow.live/v1/links" \
  -H "Authorization: Bearer $SENDNOW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "doc_pitch_deck_series_a",
    "recipient_email": "partner@sequoia.com",
    "expires_in_hours": 48,
    "require_nda": true,
    "dynamic_watermark": true
  }'

# 2. Check Document Viewing Analytics
echo "=== Recipe 2: Query Viewer Engagement Analytics ==="
curl -X GET "https://api.sendnow.live/v1/documents/doc_pitch_deck_series_a/analytics" \
  -H "Authorization: Bearer $SENDNOW_API_KEY"

# 3. Emergency Revoke Access
echo "=== Recipe 3: Emergency Link Access Revocation ==="
curl -X POST "https://api.sendnow.live/v1/links/tok_12345/revoke" \
  -H "Authorization: Bearer $SENDNOW_API_KEY"
