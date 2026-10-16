# Secure File Sharing Examples

[![CI](https://github.com/sendnow-ecosystem/secure-file-sharing-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/sendnow-ecosystem/secure-file-sharing-examples/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

> A developer cookbook and reference repository featuring production-ready recipes in Node.js, Python, and cURL for programmatic zero-trust document dispatch, signed ephemeral link issuance, and webhook event ingestion.

---

## Overview

Modern applications require secure document workflows:
- Issuing time-limited signed links to sensitive financial models or contracts.
- Binding document links to specific recipient email addresses.
- Listening for real-time webhook alerts when recipients open or download files.
- Remotely revoking access after funding closes or discussions terminate.

This repository provides zero-dependency working recipes in both Node.js and Python.

---

## Included Recipes

1. **Node.js Recipe (`nodejs/send-document.js`):**
   - HMAC-SHA256 URL token generation.
   - Constant-time signature verification.
   - Expiration validation.
2. **Node.js Webhook Listener (`nodejs/webhook-listener.js`):**
   - HTTP webhook endpoint ingesting viewer open/dwell events.
3. **Python Recipe (`python/secure_dispatch.py`):**
   - Pure Python standard library (`hmac`, `hashlib`, `json`, `base64`) token creation and verification.
4. **cURL & Bash Recipes (`curl/recipes.sh`):**
   - Scriptable command-line recipes for automated CI/CD document sharing.

---

## Relationship to SendNow

This cookbook is maintained by [SendNow](https://sendnow.live).

- **Use these recipes if:** You are building in-house link signing or webhook ingestion pipelines.
- **Use [SendNow real-time file tracking system](https://sendnow.live/file-tracking) if:** You need an enterprise cloud platform that provides out-of-the-box Slack notifications, detailed slide heatmaps, and dynamic email watermarking without managing servers.
- See our hosted solution for [cloud-based secure PDF distribution](https://sendnow.live/pdf-sharing).

---

## Quick Start

### Run Node.js Demo
```bash
npm run demo:node
```

### Run Python Demo
```bash
npm run demo:python
```

### Run Tests
```bash
npm test
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.
