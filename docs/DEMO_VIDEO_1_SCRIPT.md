# Video 1: Product Demonstration (5–8 Minutes)
## AIVOA.AI — AI-Powered Root Cause Analysis (RCA) Module

This script provides a structured, minute-by-minute walkthrough designed to record **Video 1 (Product Demonstration)** required for the AIVOA AI Product Engineer Challenge.

---

### Recording Checklist & Setup
- **Frontend URL:** `http://localhost:5173`
- **Backend URL:** `http://localhost:8000/docs`
- **Sample Files:** Located in `backend/sample_documents/`
  - `Deviation_DEV-2026-0412_Atorvastatin_PSD_OOS.pdf`
  - `Deviation_DEV-2026-0589_Paracetamol_Impurity_Excursion.txt`
  - `Quality_Email_Incident_Metformin_Residual_Solvent.txt`

---

### Minute-by-Minute Demonstration Script

#### [0:00 - 1:00] Introduction & Quality Workflow Context
- **Screen:** Show the full application UI at `http://localhost:5173`.
- **Narration:**
  > "Hello everyone. Today I'm presenting the AI-Powered Root Cause Analysis (RCA) and CAPA Module built for AIVOA.AI.
  > In Active Pharmaceutical Ingredient (API) manufacturing under ICH Q10 and FDA cGMP standards, when a deviation occurs—such as an out-of-specification particle size or an exothermic reaction runaway—quality professionals must conduct an evidence-based root cause analysis rather than guessing.
  > Following the interaction pattern of the AIVOA quality suite, our application uses a **Split-Pane Copilot Workflow**: on the left is the **AI Investigation Copilot**, and on the right is the formal **Pharmaceutical RCA Form**. Rather than manually typing dozens of fields, the AI extracts the incident data, synthesizes 5 Whys and Fishbone analyses, flags missing evidence, and suggests actionable CAPAs while keeping the human investigator firmly in the loop."

#### [1:00 - 2:30] Document Intake & Multi-Modal Input
- **Action 1 (API Samples):** Click on the **"API Samples"** tab in the AI panel. Click on *"Out-of-Specification (OOS) Particle Size in Atorvastatin Calcium Batch 26ATC-089"*.
  - *Narration:* "The module supports three flexible intake modalities: pre-configured authentic API incidents, direct PDF document upload, and pasted emails or investigation memos."
- **Action 2 (Upload PDF):** Switch to the **"Upload PDF"** tab. Select or drag `backend/sample_documents/Deviation_DEV-2026-0412_Atorvastatin_PSD_OOS.pdf`.
  - *Narration:* "Here we upload an actual PDF manufacturing deviation report. Notice how our backend parses the PDF structure and prepares it for the LangGraph agent."
- **Action 3 (Execute AI Analysis):** Click the primary button: **"Extract & Populate RCA with AI"**.
  - *Show the Screen:* Point to the animated **"LangGraph RCA Pipeline"** progress tracker.
  - *Narration:* "As I trigger the analysis, LangGraph executes a multi-node workflow powered by Groq (`llama-3.3-70b-versatile`):
    1. Parsing document text and extracting core batch metadata.
    2. Structuring the 5 Whys causal chain and 6Ms Fishbone diagram.
    3. Evaluating the primary root cause and detecting critical missing evidence.
    4. Formulating ICH Q10 compliant Corrective and Preventive Actions."

#### [2:30 - 3:45] Auto-Population & 5 Whys Causal Hierarchy
- **Action 1:** Highlight the **AI Investigation Insights** card that appears on the left, then show that the RCA form on the right has been populated.
  - *Narration:* "Notice that in seconds, the form is populated with the deviation reference `DEV-2026-0412`, Atorvastatin Calcium Trihydrate API, batch `26ATC-089`, and the immediate containment actions."
- **Action 2:** Click on **"2. 5 Whys Analysis"** tab on the form.
  - *Narration:* "The AI constructed a 5-level causal tree:
    - Why 1: High particle size (d90 = 78.4 µm) due to suppressed nucleation.
    - Why 2: Runaway jacket cooling at 2.4°C/min instead of 0.8°C/min.
    - Why 3: Chilled water valve CV-301 stuck 85% open due to actuator diaphragm fatigue.
    - Why 4: Preventive maintenance was deferred 45 days.
    - Why 5 (Root Cause): Systemic gap in SOP-MAINT-014 allowing maintenance deferral of Critical Process Parameter equipment without QA risk assessment.
    - Notice that every AI deduction is marked with an *'AI Suggestion (Review Required)'* badge. The investigator can click *'Mark Verified'* to confirm the step once supported by physical records."

#### [3:45 - 4:45] Fishbone 6Ms & Missing Evidence Gaps
- **Action 1:** Click on **"3. Fishbone (6Ms)"** tab.
  - *Narration:* "The system maps contributing factors across all 6 pharmaceutical manufacturing dimensions: Machine, Method, Material, Man, Measurement, and Milieu. You can add new factors or delete non-contributing ones with one click."
- **Action 2:** Click on **"4. Root Cause & Gaps"** tab.
  - *Narration:* "This is a critical feature: **Missing Evidence Highlighting**. In pharmaceutical investigations, a hypothesis is invalid without proof. The AI automatically flagged 3 evidence gaps:
    1. Actuator diaphragm polymer degradation analysis to confirm mechanical wear vs chemical exposure.
    2. Historical DCS event logs for preceding 14 days to check for valve hunting.
    3. Seed crystal addition sign-off from physical batch records.
    Investigators can track each gap as *'Open'*, *'Gathered'*, or *'Not Needed'*."

#### [4:45 - 5:45] CAPA Formulation, Interactive Copilot & User Edits
- **Action 1:** Click on **"5. CAPA Matrix"** tab.
  - *Narration:* "The AI separates immediate **Corrective Actions** (controlled micronization of Batch 26ATC-089 and valve replacement) from systemic **Preventive Actions** (automated DCS cooling rate-of-change interlocks and revision of SOP-MAINT-014). Each action includes a clear rationale, assigned department, owner, and deadline."
- **Action 2 (User Edit):** Edit one of the CAPA deadlines or descriptions inline to prove full editability.
- **Action 3 (Copilot Chat):** In the bottom left Copilot Chat, click the quick prompt: *"What missing evidence should I prioritize?"* or type a question. Show the intelligent response.

#### [5:45 - 6:30] Saving Investigation & Exporting GMP Report
- **Action 1:** Click on **"6. Quality Review"** tab.
- **Action 2:** Check the verification checkboxes: *"I confirm the evidence supports the identified root cause."*
- **Action 3:** Click **"Save Investigation Record"**. Show the green success toast!
- **Action 4:** Click **"Download GMP Report (PDF)"**. Show the generated formal PDF report opening with tables, 5 Whys hierarchy, CAPA table, and signature blocks.
- **Action 5:** Open the **"Saved Incidents"** modal in the header to show the record persisted in the database.
- **Conclusion:**
  > "In summary, this application provides an end-to-end, compliant, and intuitive AI-assisted RCA workflow tailored specifically for API manufacturers. Thank you!"
