# Changelog

## Unreleased

### Breaking

- Replaced Slothing's user-facing LLM `provider` settings field with BentoRouter provider and task-policy management. Existing OpenAI, Anthropic, OpenRouter, and Ollama settings migrate silently on first AI use.

### Added

- Added encrypted BentoRouter provider storage, per-task model policies, provider validation routes, and usage reporting in Settings.
