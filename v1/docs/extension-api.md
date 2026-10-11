# Extension API

## Profile vs. Answer Bank

Profile is the source of truth for structured facts: name, email, phone, location, headline, LinkedIn, GitHub, website, and compensation preferences.

Answer Bank is the source of truth for freeform Q&A: reusable long-form answers such as sponsorship explanations, references, relocation details, and "why this company" prompts.

Extension autofill should try Profile exact fields first, then Answer Bank semantic question matching, then AI generation.

## Match Answer Bank Entries

`GET /api/answer-bank/match?q=<question>&limit=<n>`

Returns ranked Answer Bank matches for an application question.

Query parameters:

- `q` required. The question text from the application form.
- `limit` optional. Defaults to `5`; capped server-side.

Response:

```json
{
  "results": [
    {
      "id": "answer-id",
      "question": "Will you require sponsorship?",
      "answer": "No, I am authorized to work in the United States.",
      "score": 0.75,
      "category": "work_authorization"
    }
  ]
}
```

Results are ordered by descending score. Version 1 uses keyword/Jaccard similarity; embedding search can replace the scorer later without changing this response shape.
