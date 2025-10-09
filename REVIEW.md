# Code Review Summary

## Deployment blockers (must fix before Google Cloud launch)
- **Runtime file writes to the `public/` directory.** Both `/api/generate-blog-image` and `/api/upload-blog-image` stream or write generated images into `public/blog-images`. This directory does not exist in the repo, and even if it did, Cloud Run/GCP builds mount the application root as read-only at runtime, so these handlers will fail with `ENOENT` or `EROFS`. Store assets in Cloud Storage or another writable bucket instead of the container filesystem. 【F:pages/api/generate-blog-image.ts†L42-L66】【F:pages/api/upload-blog-image.ts†L22-L34】
- **Hard-coded Xano base URL in `save-blog` API.** The API route uses an environment-specific Xano URL baked into the source. That prevents per-environment configuration and leaks an internal endpoint. Move this to an environment variable (and never commit real endpoints/keys). 【F:pages/api/save-blog.ts†L3-L47】
- **Environment template is out of sync with the code.** `.env.example` exposes the wrong variable names (`NEXT_PUBLIC_MEMBERSTACK_PK`, `NEXT_PUBLIC_XANO_API`) so anyone following the instructions will deploy without the configuration the app actually reads (`NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_MEMBERSTACK_APP_ID`, `NEXT_PUBLIC_XANO_API_URL`, `OPENAI_API_KEY`, etc.). In production this silently flips the app into mock/offline behaviour (see `useMockData`) or breaks Memberstack initialization. Update the template and README instructions to match the real keys. 【F:.env.example†L1-L4】【F:lib/xano.ts†L3-L43】【F:pages/_app.tsx†L9-L30】

## High priority issues
- **Sensitive logging of Memberstack keys.** `_app.tsx` logs the Memberstack publishable key prefix/suffix and metadata to the browser console. This information is not needed in production and increases exposure of credentials. Remove the logging before launch. 【F:pages/_app.tsx†L18-L27】
- **Unbounded, unauthenticated OpenAI spend.** Multiple API routes allow anonymous calls that forward to OpenAI (chat, images, avatar generation). Without authentication, rate limiting, or quota controls, anyone can drain the API budget once deployed. Add auth (Memberstack session, API key) and quotas before exposing publicly. 【F:pages/api/generate-blog.ts†L24-L94】【F:pages/api/generate-blog-content.ts†L22-L118】【F:pages/api/generate-profile-avatar.ts†L22-L58】【F:pages/api/generate-blog-image.ts†L25-L83】
- **Missing deployment metadata.** There is no Dockerfile or Cloud Build configuration, and the project does not specify the Node.js version via `engines` or `.nvmrc`. For Cloud Run “easy deploy”, add at least an `engines.node` entry (Next.js 15 requires Node 18.18+ / 20) or provide a Dockerfile/`gcloud run` instructions so the platform picks the right runtime. 【F:package.json†L1-L44】

## Additional observations / recommendations
- Ensure `public/blog-images/` (or the alternative storage) exists and is referenced by the frontend components that expect these assets.
- Consider adding integration/unit tests and wiring `npm run lint`/`npm run build` into CI before shipping.
- Verify that all required secrets (OpenAI, Memberstack, Xano, SendGrid) are present in Google Secret Manager or Cloud Run environment variables.
- Review GDPR/PHI implications before uploading client PDFs to OpenAI (`extract-protocol` forwards the raw PDF text). 【F:pages/api/extract-protocol.ts†L21-L116】

## Launch readiness verdict
The current codebase is **not ready** for a straightforward Google Cloud launch. Address the blockers above (file storage, configuration, secrets) and lock down the API surfaces before deploying.
