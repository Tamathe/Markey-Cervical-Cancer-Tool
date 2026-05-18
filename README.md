# Markey HPV Helper — Prototype

A working prototype of a patient-facing chatbot that explains HPV and Pap results in plain, bilingual language and helps the patient figure out the next step.

**Audience for this prototype:** Pam Hull, Juan Canedo, Dr. Cooper, and Markey leadership.
**Status:** prototype. All clinical content is **placeholder material** from public guidelines (CDC, ACOG, NCI, ASCCP, KCP). It has not yet been reviewed by Dr. Cooper or Markey clinical staff.

## What this is

Two modes in one chat:

1. **Guided flow** — a scripted decision tree that walks the patient through their result (photo simulation or describe) and lands on a calm, plain-language outcome card with a clear next step.
2. **Ask Anything** — a free-text panel where the patient can ask any question about HPV, Pap tests, colposcopy, partners, cost, or follow-up. Powered by Claude with retrieval over a curated corpus of CDC, ACOG, NCI, ASCCP, and Markey/KCP source documents. Every answer is cited to a source.

Both modes are **bilingual** (English / Español) with a single toggle. Spanish is parallel-authored, not afterthought-translated.

The prototype is **voice-friendly**:

- 🔊 Read-aloud toggle in the header auto-speaks every bot bubble (browser TTS, no external service).
- 🔊 button on each bubble to replay.
- 🎤 dictation on the composer (browser SpeechRecognition, EN+ES).
- **A+ Larger text** toggle for low-vision users.

## What's real vs simulated

| | Real | Simulated |
|---|---|---|
| Plain-language answers | ✅ Real Claude responses from real source corpus | |
| Bilingual EN/ES | ✅ | |
| Read-aloud (TTS) | ✅ Native browser | |
| Dictation (STT) | ✅ Native browser (Chrome/Edge/Safari) | |
| Source citations | ✅ | |
| Outcome decision tree | ✅ 4 scenarios (placeholder content) | |
| Phone call to clinic | ✅ Real `tel:` link to the placeholder number | |
| Photo OCR | | ❌ Photo path returns a canned result based on the selected demo scenario |
| SMS deep link | | ❌ The chat opens directly in the browser |
| Real clinic data / EMR | | ❌ None — by design |
| Patient navigator handoff | | ❌ Simulated confirmation |
| Calendar reminder | | ❌ Simulated confirmation |
| Voice agent (true voice-to-voice) | | ❌ Future phase |

## Run it

### Prerequisites

- Node.js 20+
- An Anthropic API key

### Setup

```bash
cd "deliverables/helper-prototype"
cp .env.example .env.local
# Edit .env.local — paste your ANTHROPIC_API_KEY
npm install
npm run dev
```

Open <http://localhost:3000>.

## How to demo it (for Pam / Juan / Markey)

A clean 5-minute walk-through:

1. **Open the page on a phone or in a desktop browser.** On desktop, the chat appears inside a phone-shaped frame on a soft paper backdrop — that signals "this is a mobile tool."
4. **Walk the guided flow.** Tap **"I have my result paper"** → tap **"Take photo"** → the bot reads the (simulated) paper and shows what it found → tap **"Yes, that's right"** → the **outcome card** appears: plain-language reassurance, a clear next step, and a script for the call.
5. **Tap "Read aloud: ON"** in the header. Tap the 🔊 on any earlier bubble — it replays in plain English. Then tap **Español** in the header and replay. Same content, native voice in each language.
6. **Tap "Ask anything about HPV"** chip. Ask: *"Do I have to tell my partner?"* Watch the bot pull a plain answer from the corpus with a cited source. Then ask: *"Will this hurt the baby if I'm pregnant?"* Different source, different answer.
7. **Use the 🎤 mic** in the composer. Speak: *"Will my partner have to be tested?"* — the bot answers from the corpus.
8. **Tap "A+ Larger text"** — every word grows for low-vision use.
9. **Use the Demo scenario picker** at the top to jump between the four scripted outcomes (HPV+/Normal, HPV+/ASC-US, HPV+/LSIL, HPV−/ASC-US) without walking through describe each time.
10. **Tap "Back to my results"** at any point in Ask Anything to return to the guided flow.

## The corpus

`app/corpus/*.md` — twelve plain-language reference documents:

1. What is HPV
2. Pap and HPV tests
3. What the words on your result mean (ASC-US, LSIL, HSIL, AGC, AIS, etc.)
4. What a colposcopy is
5. What follow-up is recommended for each result (ASCCP-derived)
6. HPV, sex, and partners
7. HPV and cancer — what the risk really is
8. HPV vaccination
9. Cost, insurance, and help in Kentucky
10. Kentucky Cancer Program cervical cancer fact sheet (from the Markey-provided PDF)
11. HPV and pregnancy
12. Treatment after colposcopy (LEEP, cone, cryo, laser)

Each file has a `title:` and `origin:` in its frontmatter — the bot cites by origin in every answer. To swap in Markey-reviewed content later, just edit these files; nothing else changes.

## Architecture

Single Next.js 15 app, no separate backend, no database, no vector store.

- **Why so simple?** The corpus is ~3-4k tokens total — it fits in a single Claude prompt with room to spare. No vector retrieval is needed at this size. Prompt caching keeps the corpus warm for repeat queries.
- **Patterns lifted from the KCH Network tool:** system prompt structure, citation-by-id format, confidence-level extraction, conversation history pattern. Skipped: FastAPI backend, ChromaDB, OpenAI embeddings, JWT auth, document admin UI — none needed at this scale.

```
app/
  page.tsx                 # PhoneFrame wraps Chat
  layout.tsx
  globals.css              # Tokens for the Markey design system
  api/
    ask/route.ts           # Claude RAG endpoint
  components/
    Chat.tsx               # State machine: greeting → describe/photo → outcome → ask-anything
    PhoneFrame.tsx         # iOS-shaped frame on desktop; full-screen on mobile
    ChatHeader.tsx         # Logo, language toggle, read-aloud toggle, larger-text toggle
    Bubble.tsx             # Bot / me bubbles with optional 🔊 and Sources block
    Chips.tsx               # Action chips, ≥44px hit target
    Composer.tsx            # Input pill + 🎤 dictation + Send
    NextStepCard.tsx        # Peach card with "YOUR NEXT STEP"
    ScriptCard.tsx          # Neutral card with italic call-script + tel: link
    TypingDots.tsx
    ScenarioPicker.tsx      # Demo-only — jump between the 4 outcomes
  lib/
    copy.ts                 # Bilingual strings + scenario outcomes
    types.ts
    voice.ts                # useSpeech() and useDictation() hooks
    corpus-loader.ts        # Reads app/corpus/*.md at request time, caches in module memory
  corpus/
    01-what-is-hpv.md … 12-treatment-after-colposcopy.md
```

## Known limitations / next steps

These are explicit so the team knows what to push on after the demo:

1. **All clinical content is placeholder.** Dr. Cooper sign-off needed on each of the 12 corpus docs and the 4 outcome cards.
2. **Spanish is AI-translated parallel text, not bilingual-authored.** Juan or a bilingual nurse navigator should review every string.
3. **Only 4 outcome scenarios.** Missing: HSIL, ASC-H, AGC, AIS, unsatisfactory. Cooper should tell us which 8–10 cover ~95% of real results.
4. **No real photo OCR.** The photo path is wired but returns a canned result based on the demo scenario. Photo OCR for a paper Pap result is a real engineering effort and is intentionally deferred.
5. **No analytics, no audit log, no consent flow.** This is local-only. Adding analytics is a Phase B decision.
6. **TTS quality depends on the browser.** Chrome and Safari ship high-quality EN and ES voices. Android voices can be uneven. A future phase would use a paid TTS service (Microsoft, ElevenLabs) for production quality.
7. **No real SMS deep link.** This prototype opens directly in a browser. Wiring Twilio is a Phase B task.

## Decisions worth defending

- **Scripted decision tree for outcomes, RAG for FAQs.** The decision tree is the clinically risky part — never let an LLM generate "your next step is X." The FAQ panel is where the AI shines.
- **No EMR, no auth, no PHI storage.** The patient brings the result. The bot does not pull it. This is the design constraint that makes the tool *deployable*.
- **Single design family (Atkinson Hyperlegible).** Designed for low-vision readability. Patients with limited literacy benefit too.
- **Iconography is emoji as glyphs, not custom SVGs.** Renders natively, accessible, no CDN dependency.
- **Voice from day one, not bolted on later.** Pam's research found low literacy is a barrier — text-only would have shipped the wrong tool.
