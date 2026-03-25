---
name: go2gg
description: Shortens URLs and generates QR codes for sharing. Use when user wants to create a short link, trackable URL, or QR code for campaigns, print materials, or social media.
---

# go2gg

## When to Use
- Creating short links for campaigns
- Generating QR codes for print or digital use
- Tracking click-through rates on shared links
- Creating vanity URLs for marketing materials

## Free APIs (No Auth Required)

### URL Shortening
```
GET https://tinyurl.com/api-create.php?url=<URL>
```

### QR Code Generation
```
GET https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=<URL>
```

## Workflow
1. Receive long URL from user
2. Shorten via TinyURL API
3. Generate QR code via qrserver.com
4. Return both outputs

## Output Format
```
Short URL: https://tinyurl.com/xxxxx
QR Code: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://tinyurl.com/xxxxx
```

## Larger QR Code
Append `&size=600x600` to the QR code URL for higher resolution print use.
