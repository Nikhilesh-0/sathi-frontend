# Sathi (साथी) — Vernacular FD Advisor

> *Your trusted companion for Fixed Deposits — in Hindi, Punjabi, and Bengali.*

Built for the **Blostem AI Builder Hackathon** (backed by Rainmatter/Zerodha).

---

## What is Sathi?

Sathi is a **multilingual, AI-powered Fixed Deposit advisory product** for semi-urban and rural Indian users with zero financial literacy. It is not a chatbot — it is a structured advisory flow with:

- **RAG pipeline** grounded in real RBI documents and FD guidelines (FAISS + sentence-transformers)
- **12 real FD products** with accurate 2024 rates, rendered as inline product cards
- **Tool-calling booking flow** — extracts 4 entities (amount, tenor, PAN, nominee) and generates a mock FD receipt
- **3 languages**: Hindi (Devanagari), Punjabi (Gurmukhi), Bengali (Bengali script)
- **Firebase Auth** (Google Sign-In) + **Firestore** conversation history
- **Mobile-first UI** with a warm, saffron-amber design system

---

## Architecture

```
sathi-frontend/          ← React + Vite + Tailwind (deploy to Vercel)
sathi-backend/           ← FastAPI + Gemini 1.5 Flash + FAISS (deploy to Railway)
```

### Backend services:
| Service | Purpose |
|---|---|
| `gemini_service.py` | Builds system prompt, calls Gemini 1.5 Flash, parses structured outputs |
| `faiss_service.py` | Builds FAISS index from 3 knowledge files, retrieves top-2 chunks per query |
| `booking_service.py` | Generates mock FD receipt with compound interest calculation |
| `auth_service.py` | Verifies Firebase ID tokens, exposes Firestore client |

### FAISS RAG Pipeline:
1. At startup: reads `fd_jargon.txt`, `rbi_guidelines.txt`, `fd_comparison_guide.txt`
2. Splits into ~200-word chunks, encodes with `paraphrase-multilingual-MiniLM-L12-v2`
3. Stores 47+ vectors in an in-memory `IndexFlatL2` FAISS index
4. At query time: encodes user query → finds top-2 chunks → injects into Gemini system prompt
5. The multilingual model maps Hindi/Punjabi/Bengali queries to the same embedding space as English knowledge

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- A Firebase project (free tier works)
- Gemini API key (free at aistudio.google.com)

---

### Phase 1: Firebase Setup (15 minutes)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → Create project → name it `sathi-fd-advisor`
2. **Authentication** → Sign-in methods → Google → Enable
3. **Firestore Database** → Start in production mode → Region: `asia-south1` (Mumbai)
4. **Project Settings** → Your apps → Add web app → Copy config values
5. **Project Settings** → Service Accounts → Generate new private key → Download JSON → rename to `firebase-credentials.json`

**Firestore Security Rules** (paste in Firebase console → Firestore → Rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /conversations/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### Phase 2: Backend Setup

```bash
cd sathi-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env:
#   GEMINI_API_KEY=your_key_from_aistudio.google.com
#   FIREBASE_CREDENTIALS_PATH=firebase-credentials.json

# Place firebase-credentials.json in sathi-backend/

# Start server
uvicorn app.main:app --reload --port 8000
```

**First startup takes 2-3 minutes** — the sentence-transformers model (~120MB) downloads and FAISS index builds. You'll see:
```
[FAISS] Total chunks to index: 47
[FAISS] Index built. 47 vectors stored.
INFO: Application startup complete.
```

Test:
```bash
curl http://localhost:8000/health
# → {"status": "ok", "service": "Sathi FD Advisor"}
```

---

### Phase 3: Frontend Setup

```bash
cd sathi-frontend
npm install

cp .env.example .env
# Edit .env with your Firebase config values:
#   VITE_FIREBASE_API_KEY=...
#   VITE_FIREBASE_AUTH_DOMAIN=...
#   VITE_FIREBASE_PROJECT_ID=...
#   VITE_FIREBASE_STORAGE_BUCKET=...
#   VITE_FIREBASE_MESSAGING_SENDER_ID=...
#   VITE_FIREBASE_APP_ID=...
#   VITE_API_BASE_URL=http://localhost:8000

npm run dev
# → http://localhost:3000
```

---

## Deployment

### Backend → Railway

1. Push `sathi-backend/` to a GitHub repo
2. [railway.app](https://railway.app) → New Project → Deploy from GitHub → select repo
3. Add environment variables in Railway dashboard:
   - `GEMINI_API_KEY` = your key
   - `FIREBASE_CREDENTIALS_JSON` = paste the entire `firebase-credentials.json` content as a single-line JSON string
4. Railway auto-detects the `Procfile`. Build takes ~5 min (model download).
5. Copy your Railway URL (e.g. `https://sathi-backend.up.railway.app`)

> **Tip for Railway**: Use `FIREBASE_CREDENTIALS_JSON` env var (the full JSON as a string) instead of a file — it's cleaner for cloud deployment. The `auth_service.py` supports both methods.

### Frontend → Vercel

1. Push `sathi-frontend/` to a GitHub repo
2. [vercel.com](https://vercel.com) → New Project → Import repo
3. Add all `VITE_*` environment variables with real values
4. Set `VITE_API_BASE_URL` to your Railway backend URL
5. Deploy → ~60 seconds
6. Go to Firebase Auth → Authorized domains → Add your Vercel domain (e.g. `sathi.vercel.app`)

---

## Booking Flow

The booking flow extracts 4 entities across the conversation:

| Entity | Example |
|---|---|
| `principal_amount` | ₹50,000 |
| `tenor_months` | 12 |
| `pan_number` | ABCDE1234F (validated format) |
| `nominee_name` | Priya Sharma |

Once all 4 are collected, `create_fd_booking()` is called and returns a styled receipt with:
- Reference number (e.g. `SATHI2024ABC12XYZ`)
- Maturity amount (quarterly compound interest)
- TDS calculation (if annual interest > ₹40,000)
- DICGC insurance status
- Masked PAN, nominee name, booking & maturity dates

To trigger booking mode, user can say: *"FD book karna chahta hoon"* / *"FD book karna chahunda haan"* / *"FD বুক করতে চাই"*

---

## Production Upgrade to Blostem API

Replace two lines to go live:

1. In `booking_service.py`: Replace `create_fd_booking()` mock with `POST /api/v1/fd/create` call to Blostem's API
2. In `gemini_service.py`: Replace the hardcoded `FD_PRODUCTS` JSON load with `GET /api/v1/fd-products` from Blostem's API

The advisory layer, RAG pipeline, language handling, auth, and UX are production-complete.

---

## Demo Script (for hackathon video)

| Scene | Action | What to show |
|---|---|---|
| 1 (30s) | Land on app, Google Sign-In, pick Hindi | Auth flow, language picker |
| 2 (45s) | Type: "FD kya hota hai?" | Hindi response + 📚 RBI badge (RAG in action) |
| 3 (30s) | Type: "8.5% p.a. ka matlab?" | Relatable rupee example explanation |
| 4 (45s) | Type: "Mujhe achha FD batao" | Sathi asks goal → user answers → 3 FD cards rendered inline |
| 5 (30s) | Switch to Punjabi, type booking intent | Language switch, entity collection begins |
| 6 (30s) | Provide amount, tenor, PAN, nominee | Booking receipt appears with reference number |
| End | Show conversation history in sidebar | Per-user persistence |

---

## Evaluation Rubric Coverage

| Criterion | How Sathi addresses it |
|---|---|
| **Relevance (25%)** | Directly targets Blostem's FD advisory use case for tier-2/3 India |
| **Technical execution (25%)** | FastAPI + FAISS RAG + Gemini tool calling + Firebase Auth + Firestore + Vercel/Railway |
| **Innovation (20%)** | Multilingual embedding (Hindi/Punjabi/Bengali → same vector space), structured booking flow, inline FD cards |
| **Demo & narrative (20%)** | Clear 6-scene demo, warm Sathi persona, cultural design (saffron palette, Devanagari font) |
| **Scale potential (10%)** | Plugs directly into Blostem API; language model + RAG scales to any language/product vertical |

---

## File Structure

```
sathi-backend/
├── app/
│   ├── main.py                    # FastAPI app, CORS, routes
│   ├── routers/
│   │   ├── chat.py                # POST /api/v1/chat
│   │   └── history.py             # GET /api/v1/history/sessions
│   ├── services/
│   │   ├── gemini_service.py      # Gemini 1.5 Flash + prompt engineering
│   │   ├── faiss_service.py       # FAISS RAG pipeline
│   │   ├── booking_service.py     # FD receipt generation
│   │   └── auth_service.py        # Firebase token verification
│   ├── data/
│   │   ├── fd_products.json       # 12 FD products
│   │   ├── fd_jargon.txt          # 25 FD terms (RAG knowledge)
│   │   ├── rbi_guidelines.txt     # RBI rules (RAG knowledge)
│   │   └── fd_comparison_guide.txt # How to choose FDs (RAG knowledge)
│   └── models/
│       └── schemas.py             # Pydantic request/response models
├── requirements.txt
├── Procfile
└── .env.example

sathi-frontend/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatWindow.jsx     # Main chat area + quick prompts
│   │   │   ├── MessageBubble.jsx  # Text + FD cards + receipt
│   │   │   ├── InputBar.jsx       # Auto-resize textarea + send
│   │   │   ├── FDCard.jsx         # Inline FD product card
│   │   │   └── BookingReceipt.jsx # Dashed-border receipt card
│   │   ├── Layout/
│   │   │   ├── Header.jsx         # Logo + language picker + user
│   │   │   └── Sidebar.jsx        # Conversation history
│   │   ├── Auth/
│   │   │   └── GoogleSignIn.jsx   # Landing / auth page
│   │   └── UI/
│   │       ├── LanguagePicker.jsx # Hindi/Punjabi/Bengali pills
│   │       └── TypingIndicator.jsx # Bouncing dots
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── ChatPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useChat.js             # Message state + booking state
│   │   └── useHistory.js
│   ├── lib/
│   │   ├── firebase.js            # Firebase init + Google auth
│   │   └── api.js                 # Axios client with auth headers
│   ├── context/
│   │   └── AppContext.jsx         # Auth state + language preference
│   ├── App.jsx                    # Routes + protected route
│   ├── main.jsx
│   └── index.css                  # Tailwind + Google Fonts + variables
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── .env.example
```
