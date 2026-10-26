# Video 2: Technical Walkthrough & Code Explanation (5–10 Minutes)
## AIVOA.AI — AI-Powered Root Cause Analysis (RCA) Module

This script provides a structured guide to record **Video 2 (Code Explanation & Technical Walkthrough)** required for the AIVOA AI Product Engineer Challenge.

---

### Key Technical Topics to Cover:
1. **Frontend Architecture & Redux Store** (`frontend/src/`)
2. **FastAPI Backend & API Endpoints** (`backend/app/api/`)
3. **Document Ingestion & Multi-Modal Parsing** (`backend/app/ai/document_parser.py`)
4. **LangGraph StateGraph Workflow & Groq Integration** (`backend/app/ai/workflow.py`, `groq_client.py`)
5. **Form Auto-Population & Human-in-the-Loop Safeguards**
6. **SQLAlchemy ORM & Database Persistence** (`backend/app/models/investigation.py`, `database.py`)
7. **ReportLab PDF Exporter** (`backend/app/api/investigations.py`)

---

### Minute-by-Minute Code Explanation Script

#### [0:00 - 1:15] Architecture Overview & Tech Stack
- **Screen:** Show repository file tree in the IDE / editor.
- **Narration:**
  > "Welcome to the technical code walkthrough for the AIVOA Root Cause Analysis module.
  > Following the mandatory tech stack specifications, this application is engineered with:
  > - **Frontend:** React 18, Redux Toolkit, Tailwind CSS, Lucide Icons, Vite.
  > - **Backend:** Python 3.12, FastAPI, SQLAlchemy ORM, Pydantic v2.
  > - **AI Orchestration:** LangGraph StateGraph workflow combined with Groq (`llama-3.3-70b-versatile`, `gemma2-9b-it`).
  > - **Database:** PostgreSQL / MySQL compatible via SQLAlchemy (defaulting to SQLite for immediate zero-config execution).
  > Let's start by walking through the backend AI workflow."

#### [1:15 - 3:15] LangGraph StateGraph Workflow & Groq Integration
- **File to show:** `backend/app/ai/workflow.py` and `backend/app/ai/groq_client.py`.
- **Narration:**
  > "Open `backend/app/ai/workflow.py`. Rather than relying on a single monolithic prompt, we built a modular **LangGraph StateGraph** that models the pharmaceutical quality investigation lifecycle.
  > 
  > 1. **State Definition (`RCAInvestigationState`):** Stores raw input, metadata, 5 Whys, 6Ms Fishbone, root causes, evidence gaps, and CAPA actions.
  > 2. **Node 1: `node_intake_and_extract`:** Normalizes raw incident text, extracts deviation numbers, API product names, batch/lot numbers, manufacturing stages, and initial containment actions.
  > 3. **Node 2: `node_investigate_five_whys_and_fishbone`:** Builds the causal tree (from observable non-conformance down to root procedural failure) and groups contributing factors into the Ishikawa 6Ms (Machine, Method, Material, Man, Measurement, Milieu).
  > 4. **Node 3: `node_evaluate_root_cause_and_evidence`:** Synthesizes the primary root cause, classifies it (e.g. Equipment, Process Drift, Procedure), and explicitly extracts **Missing Evidence Gaps** that an investigator must gather before closing the incident.
  > 5. **Node 4: `node_formulate_capas`:** Derives ICH Q10 compliant Corrective and Preventive Actions with justification, assigned department, and due dates.
  > 6. **Node 5: `node_assemble_investigation`:** Consolidates all state parameters into the canonical RCA payload.
  > 
  > In `backend/app/ai/groq_client.py`, we connect to Groq via the official `groq` SDK with JSON-mode output. We also implemented an intelligent pharmaceutical domain fallback engine so the application remains 100% functional during local testing or if an API key is not yet set."

#### [3:15 - 4:45] Document Ingestion & FastAPI Endpoints
- **Files to show:** `backend/app/ai/document_parser.py` and `backend/app/api/ai_investigation.py`.
- **Narration:**
  > "In `backend/app/ai/document_parser.py`, we implement `extract_text_from_pdf` using `pypdf.PdfReader` to extract text from multi-page PDF deviation reports, as well as `parse_incident_input` which detects email headers (Subject, Date, Sender).
  > 
  > In `backend/app/api/ai_investigation.py`:
  > - `POST /api/v1/ai/analyze-text`: Accepts raw text or email, creates the LangGraph initial state, and awaits the completed graph state.
  > - `POST /api/v1/ai/upload-pdf`: Receives a multipart PDF upload, extracts the text, and streams it into the LangGraph pipeline.
  > - `POST /api/v1/ai/chat-copilot`: Provides an interactive assistant for follow-up questions, injecting the active investigation state as context.
  > - `GET /api/v1/samples`: Serves realistic API manufacturing deviation templates."

#### [4:45 - 6:30] Frontend Architecture & Redux State Management
- **Files to show:** `frontend/src/store/rcaSlice.js` and `frontend/src/store/investigationListSlice.js`.
- **Narration:**
  > "On the frontend, state management is centered around **Redux Toolkit**:
  > - `rcaSlice.js`: Manages the active form data (`formData`), AI processing state (`isAiProcessing`), extraction results, 5 Whys steps, Fishbone categories, missing evidence items, and CAPAs.
  > - Actions like `populateFromAi` transfer all extracted fields into the form in one click.
  > - Granular reducers like `updateFiveWhyStep`, `addFishboneFactor`, `updateMissingEvidenceStatus`, and `updateCapaAction` allow full user review and inline editing before saving.
  > - `investigationListSlice.js`: Uses `createAsyncThunk` (`fetchSavedInvestigations`, `saveInvestigationRecord`, `deleteInvestigationRecord`) to interact with the FastAPI backend and persist records."

#### [6:30 - 8:00] Form-Filling Interactions & Human-in-the-Loop Safeguards
- **Files to show:** `frontend/src/components/AIPanel/` and `frontend/src/components/RCAForm/`.
- **Narration:**
  > "Notice how our UI enforces the requirement: *'Do not manually fill the form as the primary workflow. Use the AI panel to extract information and populate the form.'*
  > 
  > - `DocumentIntake.jsx`: Gives the investigator 3 tabs (Samples, PDF Upload, Paste/Email).
  > - `ExtractionProgress.jsx`: Shows visual feedback during the LangGraph execution.
  > - `AIInsightCard.jsx`: Gives the user both an *'Auto-Populate Entire RCA Form'* button and granular *'Apply Section'* buttons.
  > - In `FiveWhysEditor.jsx` and `EvidenceAndCauses.jsx`, we display the `<AiSuggestionBadge />` which indicates *'AI Suggestion (Review Required)'*. Investigators can toggle *'Mark Verified'* once physical evidence (e.g. DCS logs, BMR) is confirmed.
  > - In `CAPATable.jsx`, actions are tagged as *'Corrective'* or *'Preventive'* with full inline editing."

#### [8:00 - 9:30] Database Persistence & GMP PDF Report Generation
- **Files to show:** `backend/app/models/investigation.py` and `backend/app/api/investigations.py`.
- **Narration:**
  > "In `backend/app/models/investigation.py`, the `Investigation` SQLAlchemy model maps all attributes:
  > - String/Text columns for core metadata, primary root cause, and classification.
  > - JSON columns for `five_whys_data`, `fishbone_data`, `missing_evidence`, and `capa_actions`.
  > - Compatible with PostgreSQL, MySQL, and SQLite.
  > 
  > Finally, in `backend/app/api/investigations.py`, the `GET /investigations/{id}/export-pdf` endpoint uses ReportLab to generate a formal, printable GMP Root Cause Analysis report with structured tables, 5 Whys causal hierarchy, CAPA action plans, and regulatory investigator sign-off boxes.
  > 
  > Thank you for reviewing the technical architecture!"
