#!/usr/bin/env python3
"""
Python Recipe: Zero-Trust Document Link Signing & Verification
Pure Python standard library (no external pip dependencies).
"""

import hmac
import hashlib
import time
import json
import base64
import sys

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def base64url_decode(s: str) -> bytes:
    padding = '=' * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + padding)

def create_signed_token(document_id: str, secret_key: str, recipient_email: str = "", expires_in_sec: int = 3600) -> str:
    expires_at = int(time.time()) + expires_in_sec
    payload = {
        "doc_id": document_id,
        "email": recipient_email.lower().strip(),
        "exp": expires_at
    }
    payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64url_encode(payload_bytes)

    sig = hmac.new(secret_key.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64url_encode(sig)

    return f"{payload_b64}.{sig_b64}"

def verify_signed_token(token: str, secret_key: str) -> dict:
    parts = token.split('.')
    if len(parts) != 2:
        return {"valid": False, "error": "Malformed token structure"}

    payload_b64, sig_b64 = parts
    expected_sig = base64url_encode(
        hmac.new(secret_key.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).digest()
    )

    if not hmac.compare_digest(sig_b64, expected_sig):
        return {"valid": False, "error": "Signature mismatch"}

    try:
        payload = json.loads(base64url_decode(payload_b64).decode('utf-8'))
    except Exception as e:
        return {"valid": False, "error": f"Invalid payload: {e}"}

    if time.time() > payload.get("exp", 0):
        return {"valid": False, "error": "Token expired"}

    return {"valid": True, "payload": payload}

if __name__ == "__main__":
    secret = "secret-key-python-recipe-32chars!"
    tok = create_signed_token("financial_model_2026.xlsx", secret, "cfo@acme.com", expires_in_sec=1800)
    print("Generated Python Token:", tok)
    ver = verify_signed_token(tok, secret)
    print("Verification:", ver)
