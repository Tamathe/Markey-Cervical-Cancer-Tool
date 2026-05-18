# Corpus sources

Every fact in the corpus traces to one of these. Listed in rough order of authority for this domain.

## Clinical guidelines (primary)

- **ASCCP 2024 Enduring Consensus Guidelines for Cervical Cancer Screening and Management** — *Journal of Lower Genital Tract Disease*, April 2024. Updates the 2019 Risk-Based Management Consensus Guidelines. Adds: extended HPV genotyping management (16, 18, 45, 33/58, 31, 52, 35/39/68, 51, 59/56/66), p16/Ki-67 dual-stain triage, and incremental refinements to surveillance and expedited treatment. https://www.asccp.org/enduring-guidelines
  - Used in: `05-follow-up-by-result.md`, `03-result-meanings.md`
  - Supersedes the 2019 citation across the corpus.

- **USPSTF Cervical Cancer Screening Recommendation (2018, Grade A)** — current at time of writing; refresh in progress. https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening
  - Used in: `02-pap-and-hpv-tests.md`

- **American Cancer Society Cervical Cancer Screening Guideline (2020 update)** — earlier start age (25), HPV primary preferred. https://www.cancer.org/cancer/types/cervical-cancer/detection-diagnosis-staging/screening-recommendations.html
  - Used in: `02-pap-and-hpv-tests.md`

- **ACOG Practice Bulletin / FAQ 168 (Cervical Cancer Screening)** and **FAQ 187 (Abnormal Results)** — the OB/GYN-facing reference Dr. Cooper and Markey colposcopy will be working from. https://www.acog.org/womens-health/faqs/cervical-cancer-screening
  - Used in: `02-pap-and-hpv-tests.md`, `03-result-meanings.md`

- **ACIP HPV Vaccination Recommendations (CDC)** — vaccine schedule, age-specific dosing logic. https://www.cdc.gov/vaccines/acip/recommendations.html
  - Used in: `08-vaccination.md`

## NCI / NIH (federal patient-facing)

- **NCI PDQ Cervical Cancer Screening — Patient version** https://www.cancer.gov/types/cervical/patient/cervical-screening-pdq
  - Used in: `02-pap-and-hpv-tests.md`, `13-benefits-and-harms-of-screening.md`

- **NCI PDQ Cervical Cancer Screening — Health Professional version** https://www.cancer.gov/types/cervical/hp/cervical-screening-pdq
  - Used in: `13-benefits-and-harms-of-screening.md` (for numbers and trade-offs)

- **NCI "Understanding Cervical Changes" / Abnormal HPV and Pap Test Results** https://www.cancer.gov/types/cervical/understanding-abnormal-hpv-and-pap-test-results
  - Used in: `03-result-meanings.md`

## CDC

- **CDC HPV pages (English + Spanish)** https://www.cdc.gov/hpv/ and https://www.cdc.gov/spanish/cancer/hpv/
- **CDC "Inside Knowledge" gynecologic cancer campaign assets** — patient-friendly, public-domain.
  - Used in: `01-what-is-hpv.md`, `06-hpv-and-partners.md`, `07-hpv-and-cancer.md`

## Kentucky-specific

- **Kentucky Cancer Program (KCP) — Cervical Cancer Fact Sheet** (reviewed Feb 2025). Source for `10-markey-cervical-fact-sheet.md`.
- **Kentucky Women's Cancer Screening Program** — 844-249-0708, income-based screening coverage. Used in `09-cost-and-coverage.md` and `10-markey-cervical-fact-sheet.md`.
- **Kentucky Cancer Registry (KCR)** — county-level incidence/mortality. Not yet cited; held in reserve for "in your county" framing.
- **BRFSS Kentucky module** — population screening behavior data. Not yet cited; held in reserve.

## Spanish-language authoritative sources (used for parallel translation, not Google Translate)

- **NCI en Español** — https://www.cancer.gov/espanol
- **CDC en Español — VPH** — https://www.cdc.gov/spanish/cancer/hpv/
- **American Cancer Society en Español** — https://www.cancer.org/es.html

Translation principle: every Spanish string in the bot must be vetted against one of these three. Spanish is not a Google-Translate afterthought — it is parallel canon.

## Health literacy and readability (for build process, not corpus)

These are tools used to evaluate the corpus itself, not sources cited inside it.

- **PEMAT** (AHRQ Patient Education Materials Assessment Tool) — understandability + actionability scoring.
- **SMOG and Flesch-Kincaid** — reading-grade-level estimators. Corpus target ≈ 6th grade.
- **AHRQ Health Literacy Universal Precautions Toolkit** — teach-back patterns. Voice basis for "lead with reassurance, then action."

## Held in reserve (not yet ingested)

These are authoritative and ready to add if a future scenario needs them:

- **HPV Information Centre (ICO/IARC)** — global HPV type prevalence, hpvcentre.net
- **NCCN Cervical Cancer Guidelines (Patient version)** — for any future post-diagnosis scenarios
- **WHO HPV elimination strategy (2020)** — global frame; not patient-facing in v1
- **SEER cancer statistics** — for portfolio-level dashboards, not patient corpus

## Review cadence

- ASCCP guidelines: re-check **annually** (Enduring Guidelines model means rolling updates, not big rewrites).
- USPSTF: re-check on update notification (the 2018 recommendation refresh is currently in progress as of 2026-05).
- NCI PDQ: monthly date stamp shown on each page; check on substantive edits to corpus.
- KCP / Markey fact sheets: re-check annually with Pam Hull and Juan Canedo.

## Citation discipline

Every corpus file's frontmatter lists its `origin`. If a file blends two sources, list both. If you cannot trace a sentence back to one of these, it does not belong in the corpus.
