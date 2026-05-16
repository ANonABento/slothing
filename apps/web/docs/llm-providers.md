# LLM Providers

Slothing routes AI work through BentoRouter. Instead of choosing one global provider, you can add one or more provider keys and assign models per task.

## Add a Provider

1. Open Settings, then AI keys.
2. Add a provider with a display name, provider type, API key, and optional base URL.
3. Use Test to validate the key before relying on it for AI features.

Provider keys are encrypted at rest with AES-256-GCM using key material derived from `NEXTAUTH_SECRET`.

## Task Policies

Each Slothing AI task has its own BentoRouter policy. Examples:

- `slothing.parse_resume`
- `slothing.score_match`
- `slothing.tailor_resume`
- `slothing.cover_letter_generate`
- `slothing.answer_generate`
- `slothing.embedding`

Use stronger models for writing and reasoning tasks, and cheaper or faster models for classification and extraction tasks. Fallback models are tried when the primary model fails or is unavailable.

## Usage

The usage table groups BentoRouter events by task so you can see where tokens and estimated cost are going. Use it to tune primary models and fallback chains.

## Legacy Settings

Older Slothing installs stored a single `provider` and `model` setting. Slothing now migrates that setting silently into BentoRouter providers and task policies on first AI use. The old user-facing `provider` field is no longer part of the settings API.

## Choomfie

When Choomfie exposes its OpenAI-compatible endpoint, add it as a custom provider by entering its base URL and API key in the provider form. Assign Choomfie-backed models to individual Slothing tasks the same way as OpenAI-compatible providers.
