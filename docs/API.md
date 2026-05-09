# API Reference

All API routes are located under `/api/`. Responses are JSON.

## Profile

### GET /api/profile

Get user profile data.

**Response:**

```json
{
  "profile": {
    "id": "default",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, NY",
    "summary": "Experienced developer...",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "githubUrl": "https://github.com/johndoe",
    "portfolioUrl": "https://johndoe.dev"
  }
}
```

### PUT /api/profile

Update user profile.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "summary": "Updated summary..."
}
```

---

## Browser Extension

### GET /api/opportunities

List all tracked opportunities.

**Response:**

```json
{
  "jobs": [
    {
      "id": "job-123",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "Remote",
      "status": "applied",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### POST /api/opportunities

Create a new opportunity.

**Request Body:**

```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "description": "Full job description...",
  "requirements": ["JavaScript", "React"],
  "responsibilities": ["Build features"],
  "url": "https://example.com/job"
}
```

### GET /api/opportunities/[id]

Get a specific opportunity.

### PATCH /api/opportunities/[id]

Update an opportunity.

### DELETE /api/opportunities/[id]

Delete an opportunity.

### GET /api/export/opportunities

Export tracked opportunities. Accepts `format=json` or `format=csv`.

Legacy compatibility: `/api/export/jobs` returns the same data.

### POST /api/import/opportunities

Import opportunities from JSON or CSV payloads.

Legacy compatibility: `/api/import/jobs` accepts the same payloads.

---

## Opportunities

### POST /api/opportunities/from-extension

Import scraped opportunities from the Columbus browser extension. Requires `X-Extension-Token`.

Scraped opportunities are always created with `status: "pending"` so the user can review them before moving them to Saved, Applied, or another workflow status. The endpoint also creates an unread in-app notification and returns the current pending count for badge/review UI.

**Request Body (single):**

```json
{
  "title": "Frontend Engineer",
  "company": "Acme",
  "location": "Remote",
  "description": "Full job description...",
  "requirements": ["React", "TypeScript"],
  "responsibilities": ["Build product UI"],
  "keywords": ["React"],
  "type": "full-time",
  "remote": true,
  "salary": "$120k-$150k",
  "url": "https://example.com/careers/frontend",
  "source": "linkedin",
  "sourceJobId": "abc-123",
  "postedAt": "2026-04-29",
  "deadline": "2026-05-15"
}
```

**Request Body (batch):**

```json
{
  "jobs": [
    {
      "title": "Frontend Engineer",
      "company": "Acme",
      "url": "https://example.com/a"
    },
    {
      "title": "Backend Engineer",
      "company": "Beta",
      "url": "https://example.com/b"
    }
  ]
}
```

`opportunities` is also accepted instead of `jobs` for batch payloads.

**Response:**

```json
{
  "imported": 2,
  "opportunityIds": ["job-123", "job-456"],
  "pendingCount": 5
}
```

**Errors:**

- `401` when the extension token is missing, invalid, or expired.
- `400` with validation details when a required field such as `title` or `company` is missing.

---

## Opportunity AI

### POST /api/opportunities/[id]/analyze

Analyze opportunity match with profile.

**Response:**

```json
{
  "match": {
    "overallScore": 85,
    "skillMatches": ["JavaScript", "React"],
    "skillGaps": ["GraphQL"],
    "experienceMatch": true,
    "suggestions": ["Add GraphQL projects"]
  }
}
```

### POST /api/opportunities/[id]/generate

Generate tailored resume.

**Request Body:**

```json
{
  "template": "modern",
  "emphasis": ["leadership", "technical"]
}
```

### POST /api/opportunities/[id]/cover-letter

Generate cover letter.

---

## Interview

### POST /api/interview/start

Generate interview questions.

**Request Body:**

```json
{
  "jobId": "job-123",
  "mode": "text",
  "difficulty": "mid"
}
```

**Response:**

```json
{
  "questions": [
    {
      "question": "Tell me about yourself",
      "category": "behavioral",
      "suggestedAnswer": "Use STAR method..."
    }
  ]
}
```

### POST /api/interview/sessions

Create interview session.

### GET /api/interview/sessions

List interview sessions.

### POST /api/interview/sessions/[id]/answer

Submit answer and get feedback.

**Request Body:**

```json
{
  "questionIndex": 0,
  "answer": "My answer..."
}
```

**Response:**

```json
{
  "answer": "My answer...",
  "feedback": "Good structure, consider adding...",
  "isComplete": false
}
```

---

## Salary

### POST /api/salary/calculate

Calculate salary range or compare offers.

**Request Body (range):**

```json
{
  "action": "range",
  "role": "Software Engineer",
  "location": "San Francisco",
  "yearsExperience": 5
}
```

**Response:**

```json
{
  "range": {
    "min": 130000,
    "median": 165000,
    "max": 220000,
    "percentile25": 147500,
    "percentile75": 192500
  }
}
```

**Request Body (compare):**

```json
{
  "action": "compare",
  "offers": [
    {
      "id": "offer-1",
      "company": "Company A",
      "baseSalary": 150000,
      "signingBonus": 20000,
      "equityValue": 100000
    }
  ]
}
```

### POST /api/salary/negotiate

Generate negotiation script.

**Request Body:**

```json
{
  "company": "Tech Corp",
  "role": "Software Engineer",
  "currentOffer": 150000,
  "targetSalary": 175000,
  "marketMedian": 165000,
  "marketMax": 220000
}
```

---

## Analytics

### GET /api/analytics

Get analytics overview.

**Response:**

```json
{
  "profileCompleteness": 85,
  "totalJobs": 15,
  "appliedJobs": 8,
  "interviewCount": 3,
  "generatedResumes": 5,
  "statusBreakdown": {
    "saved": 7,
    "applied": 5,
    "interviewing": 2,
    "offered": 1
  }
}
```

### GET /api/analytics/export

Export analytics data.

**Query Parameters:**

- `format`: `csv` or `json`
- `range`: `7d`, `30d`, or `all`

---

## Notifications

### GET /api/notifications

Get notifications.

**Query Parameters:**

- `limit`: Number of notifications (default: 20)
- `countOnly`: Return only unread count

### POST /api/notifications

Batch actions.

**Request Body:**

```json
{
  "action": "markAllRead"
}
```

### PATCH /api/notifications/[id]

Mark notification as read.

### DELETE /api/notifications/[id]

Delete notification.

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**

- `400` - Bad request (validation error)
- `404` - Resource not found
- `500` - Server error
