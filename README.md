# AIVOA.AI — AI-Powered Root Cause Analysis (RCA) & CAPA Module
### AI Product Engineer Challenge | Pharmaceutical API Manufacturing Quality Suite

An enterprise-grade, AI-assisted **Root Cause Analysis (RCA)** and **Corrective and Preventive Action (CAPA)** workflow for Active Pharmaceutical Ingredient (API) manufacturers, adhering to **ICH Q10**, **FDA cGMP 21 CFR Part 211**, and **EU GMP Annex 11** guidelines.

---

## 1. Executive Summary & Quality Workflow

In API chemical synthesis and processing, when a quality deviation occurs—such as an out-of-specification (OOS) particle size distribution, thermal runaway during an exothermic coupling, or elevated residual solvents—quality investigators must transition through the regulated lifecycle:

$$\text{Deviation Identification} \longrightarrow \text{Root Cause Analysis (RCA)} \longrightarrow \text{Corrective \& Preventive Actions (CAPA)}$$

This application implements the **Split-Pane Copilot Interaction Pattern**:
- **Left Panel (AI Investigation Copilot):** Ingests raw incident documents (PDFs, emails, or pasted text), coordinates a multi-node **LangGraph** pipeline powered by **Groq (`llama-3.3-70b-versatile` / `gemma2-9b-it`)**, and streams extracted parameters with confidence metrics.
- **Right Canvas (Pharmaceutical RCA Form):** Features structured tabs for **Incident Identification**, **5 Whys Causal Hierarchy**, **Fishbone (Ishikawa 6Ms)**, **Root Cause & Missing Evidence Verification**, and **ICH Q10 CAPA Formulation**.
- **Human-in-the-Loop Safeguards:** AI deductions are explicitly flagged as `AI Suggestion - Review Required` until verified by empirical evidence (BMR, DCS logs, QC certificates) and signed off by a qualified person.

---

## 2. Mandatory Tech Stack Implementation

| Component | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | **React + Redux** | React 18, Redux Toolkit (`rcaSlice`, `investigationListSlice`), Tailwind CSS, Lucide Icons, Vite |
| **Backend** | **Python + FastAPI** | FastAPI async API, Pydantic v2 schemas, CORS middleware, Uvicorn |
| **AI Orchestration** | **LangGraph + Groq** | Multi-node `StateGraph` workflow, Groq API client with JSON Mode (`llama-3.3-70b-versatile`, `gemma2-9b-it`, `llama-3.1-8b-instant`), Domain Fallback Engine |
| **Database** | **PostgreSQL / MySQL / SQLite** | SQLAlchemy ORM with JSON-column models; defaults to SQLite for zero-setup execution, seamlessly connects to PostgreSQL via `DATABASE_URL` |
| **Document Processing** | **pypdf + ReportLab** | PDF text extraction (`pypdf`), Formal GMP Investigation PDF Report generation (`ReportLab`) |

---

## 3. Key Features

1. **Multi-Modal Document Intake:**
   - **Upload PDF:** Drag-and-drop or select deviation reports (tested with authentic pharmaceutical PDF documents).
   - **Paste Text / Email:** Normalizes email headers (Subject, Date, Sender) and free-form incident memos.
   - **1-Click Preloaded API Incidents:**
     - *Atorvastatin Calcium Trihydrate API* — OOS Particle Size Distribution (PSD) due to runaway crystallization cooling.
     - *Paracetamol (Acetaminophen) API* — Critical Impurity B thermal excursion in reactor.
     - *Metformin HCl API* — OOS residual acetone in vacuum tray drying.
2. **LangGraph StateGraph Workflow (4 Sequential Nodes):**
   - **Node 1 (`intake_and_extract`):** Extracts deviation numbers, API products, batch/lot, manufacturing stage, severity, and initial containment actions.
   - **Node 2 (`investigate_five_whys_and_fishbone`):** Derives 5 Whys causal hierarchy and maps factors into 6Ms (Machine, Method, Material, Man, Measurement, Milieu).
   - **Node 3 (`evaluate_root_cause_and_evidence`):** Synthesizes the fundamental root cause and explicitly highlights **Missing Evidence Gaps** required for formal closure.
   - **Node 4 (`formulate_capas`):** Generates targeted Corrective Actions and systemic Preventive Actions with rationales, owners, and due dates.
   - **Node 5 (`assemble_investigation`):** Assembles verified payload ready for form population.
3. **Interactive Visual Diagramming & Form Filling:**
   - Visual 5 Whys tree with verified check-toggles and line connectors.
   - Interactive Ishikawa 6Ms Fishbone diagram and dynamic factor cards.
   - Missing evidence tracker with status toggles (`Open`, `Gathered`, `Not Needed`).
   - CAPA matrix distinguishing immediate containment repairs from systemic preventative interlocks.
4. **Interactive RCA Copilot Assistant:**
   - Real-time Q&A copilot to ask follow-up questions about root cause theories, evidence prioritization, or CAPA strengthening.
5. **Database Persistence & Formal GMP PDF Export:**
   - Full CRUD operations: Save, retrieve, update, and delete investigations.
   - 1-Click generation of formal, printable PDF Investigation Reports with signature sign-off blocks.

---

## 4. Repository Structure

```
Aivoa_AI_Product/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI entry point, CORS, routers
│   │   ├── config.py                   # Pydantic Settings (Groq key, DB URL)
│   │   ├── database.py                 # SQLAlchemy engine & session factory
│   │   ├── models/
│   │   │   └── investigation.py        # Investigation database ORM model
│   │   ├── schemas/
│   │   │   └── investigation.py        # Pydantic v2 schemas & request/response
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   ├── groq_client.py          # Groq LLM integration & domain fallback
│   │   │   ├── prompts.py              # ICH Q10 pharmaceutical expert prompts
│   │   │   ├── workflow.py             # LangGraph StateGraph (4-node RCA pipeline)
│   │   │   └── document_parser.py      # PDF text extractor (pypdf) & email parser
│   │   └── api/
│   │       ├── __init__.py
│   │       ├── investigations.py       # CRUD & ReportLab PDF export endpoints
│   │       ├── ai_investigation.py     # AI analysis & Copilot chat endpoints
│   │       └── sample_data.py          # Preloaded API deviation incident samples
│   ├── sample_documents/               # Realistic PDF & text test documents
│   │   ├── Deviation_DEV-2026-0412_Atorvastatin_PSD_OOS.pdf
│   │   ├── Deviation_DEV-2026-0589_Paracetamol_Impurity_Excursion.txt
│   │   └── Quality_Email_Incident_Metformin_Residual_Solvent.txt
│   ├── requirements.txt
│   ├── run_backend.py                  # Standalone backend server runner
│   └── generate_samples.py             # Generates sample PDF and text files
├── frontend/
│   ├── src/
│   │   ├── main.jsx                    # React 18 root with Redux Provider
│   │   ├── App.jsx                     # Split-pane copilot application layout
│   │   ├── index.css                   # Tailwind styles & animations
│   │   ├── store/
│   │   │   ├── index.js                # Redux store configuration
│   │   │   ├── rcaSlice.js             # RCA form, 5 Whys, 6Ms, CAPA state
│   │   │   └── investigationListSlice.js # Saved database records slice
│   │   ├── components/
│   │   │   ├── Header.jsx              # Pharma quality header & actions
│   │   │   ├── AIPanel/
│   │   │   │   ├── AIPanel.jsx         # Docked AI Copilot drawer
│   │   │   │   ├── DocumentIntake.jsx  # PDF upload, Paste, Sample tabs
│   │   │   │   ├── ExtractionProgress.jsx # LangGraph visual execution tracker
│   │   │   │   ├── AIInsightCard.jsx   # Extracted insights & form-fill actions
│   │   │   │   └── CopilotChat.jsx     # Interactive ICH Q10 Q&A copilot
│   │   │   ├── RCAForm/
│   │   │   │   ├── RCAForm.jsx         # Main form container with 6 tabs
│   │   │   │   ├── IncidentDetails.jsx # Core deviation identification
│   │   │   │   ├── FiveWhysEditor.jsx  # Interactive 5 Whys causal hierarchy
│   │   │   │   ├── FishboneEditor.jsx  # Ishikawa 6Ms interactive diagram
│   │   │   │   ├── EvidenceAndCauses.jsx # Root cause & Missing Evidence gaps
│   │   │   │   ├── CAPATable.jsx       # ICH Q10 CAPA matrix
│   │   │   │   └── QualityReview.jsx   # Governance, sign-off & save action
│   │   │   ├── Modals/
│   │   │   │   ├── SavedInvestigationsModal.jsx # Browse & load saved records
│   │   │   │   └── ApiKeyModal.jsx     # Groq API key & model settings
│   │   │   └── common/
│   │   │       ├── StatusBadge.jsx     # Severity & status badges
│   │   │       ├── AiSuggestionBadge.jsx # AI Suggestion review indicator
│   │   │       └── Toast.jsx           # Floating notifications
│   │   └── services/
│   │       └── api.js                  # Axios client for backend endpoints
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/
│   ├── DEMO_VIDEO_1_SCRIPT.md          # 5-8 min Product Demo Recording Script
│   └── DEMO_VIDEO_2_SCRIPT.md          # 5-10 min Technical Walkthrough Script
└── README.md
```

---

## 5. Quickstart & Installation

### Prerequisites
- **Python 3.10+** (Tested on Python 3.12)
- **Node.js 18+** & **npm**

### Backend Setup

1. **Activate Virtual Environment & Install Dependencies:**
   ```powershell
   # In project root:
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r backend\requirements.txt
   ```

2. **(Optional) Configure Groq API Key & Database:**
   - Create a `.env` file in `backend/` (or enter your key directly inside the UI):
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   # Default is SQLite; for PostgreSQL use:
   # DATABASE_URL=postgresql://user:pass@localhost:5432/pharma_rca
   ```
   > *Note:* If no Groq API key is provided, the application automatically runs its pharmaceutical domain engine with zero errors.

3. **Start FastAPI Backend:**
   ```powershell
   python backend\run_backend.py
   ```
   *Backend is live at:* `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`).

### Frontend Setup

1. **Install Dependencies & Start Vite Server:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend is live at:* `http://localhost:5173`.

---

## 6. Demonstration & Submission Deliverables

Per the challenge requirements:
- **Video 1 (Product Demonstration, 5–8 min):** Step-by-step walkthrough script provided in [`docs/DEMO_VIDEO_1_SCRIPT.md`](docs/DEMO_VIDEO_1_SCRIPT.md).
- **Video 2 (Technical Walkthrough, 5–10 min):** Step-by-step code explanation script provided in [`docs/DEMO_VIDEO_2_SCRIPT.md`](docs/DEMO_VIDEO_2_SCRIPT.md).
- **Submission Form:** `https://forms.gle/5rLhrBMGeprAqJiB9`
- **Notice:** Source code, assignment documents, and demo videos must remain private and not uploaded to public repositories.
