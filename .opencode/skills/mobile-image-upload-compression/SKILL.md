---
name: mobile-image-upload-compression
description: Use when building the admin photo workflow — selecting multiple phone photos, previewing, validating type/size, resizing and compressing before Supabase Storage upload, with cleanup on failure.
---

# Mobile Image Picker, Compression & Upload

## When to use

Milestone 5 image work: the admin image picker, image utilities, storage cleanup, and the two-minute publishing flow.

## Requirements

- Support selecting **several phone photos** at once (`<input type="file" multiple accept="image/*">`); prefer `capture`/camera-friendly markup for mobile.
- Show previews with individual **remove** controls.
- Validate **type** (MIME allowlist) and **size** before upload; show concise, mobile-friendly errors.
- **Resize and compress** client-side before upload so a large phone photo lands below the configured storage limit. Prefer canvas/`createImageBitmap`; keep the UI responsive (do not block the main thread on large images).
- Keep the total workflow simple — no crop editor, no gallery management in Tier A.

## Upload integrity

- Upload images first, then save the post with references. If any upload fails, do not publish a broken post; surface the failure and allow retry.
- Store image **references** in `posts`; never store binaries in Postgres.
- On delete, remove or mark associated storage files per the storage policy; avoid uncontrolled orphaned images in the normal flow.

## Definition of done

A large phone photo previews, compresses below the configured limit, and uploads without freezing the UI; create/edit/delete leaves no uncontrolled orphans in the normal flow.
