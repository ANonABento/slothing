# Dogfood Fixtures - 2026-05-13

## Extension Scraper Fixtures

| Fixture                                                                       | Purpose                                                                                                 | Expected Behavior                                                                                                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unknown-jsonld-job.html`                                                     | Unknown job board with complete JSON-LD only.                                                           | Generic scraper returns a valid opportunity payload with cleaned description, salary, type, remote flag, and keywords.                                     |
| `workday-apply-multistep.html`                                                | Workday apply-flow fixture with contact, demographics, upload, disabled, and late review-step controls. | Multi-step handler should persist session state, fill safe contact fields, skip file/disabled/sensitive fields, refill late controls, and clear on submit. |
| Existing Greenhouse, Lever, Workday, Indeed, LinkedIn, WaterlooWorks fixtures | Supported board regression coverage.                                                                    | Specialized scrapers remain preferred and produce stable expected fields.                                                                                  |

## Website Upload Fixtures

| Fixture                            | Purpose                                                                                                             | Expected Behavior                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `edge-case-resume.md`              | Dense but realistic resume with career change, gap, multilingual text, quantified bullets, and ATS keywords.        | Parser and bank ingestion should preserve dates, skills, metrics, language, and gap context without hallucinating fields. |
| `cover-letter-upload-prose.md`     | Realistic cover letter with a generic possible upload filename, bullets, role intent, and sign-off.                 | Deterministic content classification should identify it as `cover_letter` when LLM credentials are absent.                |
| `cover-letter-tracked-comments.md` | Cover-letter draft with editor comments, inserted/deleted text markers, and referral wording.                       | Classifier should keep it as `cover_letter`, not mistake "recommended I apply" for a reference letter.                    |
| `table-docx-resume.txt`            | Text as commonly extracted from DOCX tables: column headers, pipe-delimited rows, and mixed bullet glyphs.          | Smart parser should ignore table headers, preserve role/company/location/date columns, and keep unusual bullets.          |
| `table-docx-resume.docx`           | Real binary DOCX resume with table cells, mixed bullet glyphs, and education credential rows.                       | Mammoth extraction plus smart parser should preserve title/company/date/location fields and education metadata; browser upload should classify it as a resume, open review, and show source metadata. |
| Existing persona PDFs              | Broad parser coverage across entry, mid, senior, career gap, multilingual, heavy formatting, and scanned PDF cases. | Existing fixture schema remains valid.                                                                                    |

## Synthetic Job Descriptions

| Fixture                   | Purpose                                                                                 | Expected Behavior                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `ambiguous-hybrid-job.md` | Job description with hybrid/remote ambiguity and salary range phrased in multiple ways. | ATS/tailoring should identify required skills, avoid overclaiming remote status, and preserve compensation context. |

## Next Additions

- Add new fixtures when future dogfood loops uncover an unrepresented risk.
