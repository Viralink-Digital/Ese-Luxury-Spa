# Changelog

## 2026-10-01

- Fixed backend-hosted image URLs across product cards, product details, cart, checkout, orders, admin previews, and other API-managed media.
- Added centralized image URL resolution using `VITE_API_URL`; absolute HTTP(S) URLs remain unchanged, and missing or failed images use a fallback.
- Added a production build check requiring a public HTTPS `VITE_API_URL` and rejecting localhost values.
- Documented the expected Render setting in `frontend/.env.example`.
- Verified the rendered product image uses an absolute backend URL and the production build succeeds with the variable configured.