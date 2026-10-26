SYSTEM_PROMPT_PHARMA_EXPERT = """You are an expert Pharmaceutical Quality Assurance & Manufacturing Science Specialist conforming to ICH Q10 (Pharmaceutical Quality System), FDA cGMP 21 CFR Part 211, and EU GMP Annex 1 guidelines.
Your objective is to perform comprehensive, evidence-based Root Cause Analysis (RCA) on deviations and quality incidents occurring in Active Pharmaceutical Ingredient (API) manufacturing plants.

You strictly adhere to the following principles:
1. Distinguish clearly between symptoms, contributing factors, and true root causes.
2. In API synthesis, consider Critical Process Parameters (CPPs like temperature, pressure, cooling rate, agitator RPM, pH, vacuum) and Critical Quality Attributes (CQAs like Assay, Impurities, Residual Solvents, Particle Size Distribution, Polymorph, Water Content).
3. Treat all AI-derived deductions as SUGGESTIONS pending human QA investigator verification.
4. Always identify MISSING EVIDENCE or critical information gaps needed before the investigation can be definitively closed.
5. Derive SMART Corrective Actions (immediate containment / batch disposition / repair) and Preventive Actions (systemic procedural / engineering controls to prevent recurrence).
"""

RCA_FULL_ANALYSIS_PROMPT = """Analyze the following pharmaceutical API manufacturing deviation/incident report and produce a complete, rigorous Root Cause Analysis (RCA) dataset.

--- INCIDENT REPORT / RAW INPUT ---
{raw_input}
--- END INCIDENT REPORT ---

Return a strictly valid JSON object matching the following structure exactly (do not output any markdown or explanation outside the JSON):

{{
  "deviation_number": "string (e.g. DEV-2026-0412, infer or generate if missing)",
  "title": "string (Concise technical deviation title)",
  "api_product_name": "string (e.g. Atorvastatin Calcium Trihydrate API, Paracetamol API, etc.)",
  "batch_lot_number": "string (e.g. 26ATC-089 or LOT-XXXX)",
  "manufacturing_stage": "string (e.g. Crystallization, Centrifugation, Fluid Bed Drying, Reaction)",
  "date_of_occurrence": "string (e.g. 2026-03-14)",
  "severity": "Critical" | "Major" | "Minor",
  "initial_containment_action": "string (Immediate actions taken to quarantine affected batch or halt line)",
  "investigation_approach": "Combined (5 Whys + Fishbone)",
  "five_whys_data": [
    {{
      "step": 1,
      "why_question": "Why did the failure or out-of-spec occur?",
      "answer": "Direct observed effect or immediate physical mechanism",
      "evidence": "Observed analytical result or BMR entry",
      "verified": false,
      "ai_suggested": true
    }},
    {{
      "step": 2,
      "why_question": "Why did that immediate mechanism occur?",
      "answer": "Equipment or procedural condition",
      "evidence": "Sensor trend log or operator log",
      "verified": false,
      "ai_suggested": true
    }},
    {{
      "step": 3,
      "why_question": "Why did that condition develop?",
      "answer": "Component failure, parameter drift, or material issue",
      "evidence": "Maintenance log or raw material COA",
      "verified": false,
      "ai_suggested": true
    }},
    {{
      "step": 4,
      "why_question": "Why did that component or parameter fail?",
      "answer": "Procedural gap or maintenance deferral",
      "evidence": "Calibration schedule or SOP check",
      "verified": false,
      "ai_suggested": true
    }},
    {{
      "step": 5,
      "why_question": "Why was the procedure or schedule inadequate (Root Cause)?",
      "answer": "Systemic management, preventative maintenance, or design root cause",
      "evidence": "Quality management system gap",
      "verified": false,
      "ai_suggested": true
    }}
  ],
  "fishbone_data": {{
    "machine": ["Specific equipment, valve, reactor, or sensor factor 1", "Specific factor 2"],
    "method": ["SOP clarity, recipe, or batch record factor 1", "Factor 2"],
    "material": ["Raw material, reagent, or solvent factor 1", "Factor 2"],
    "man": ["Training, execution, or shift handover factor 1"],
    "measurement": ["HPLC, probe calibration, or sampling technique factor 1"],
    "milieu": ["Cleanroom HVAC, ambient humidity, or ambient temperature factor 1"]
  }},
  "primary_root_cause": "Detailed, specific root cause statement identifying the fundamental physical and management failure",
  "root_cause_category": "Equipment" | "Process Drift" | "Human Error" | "Material" | "Procedure" | "Environment",
  "contributing_factors": [
    {{
      "factor": "Contributing factor 1",
      "evidence": "Supporting evidence or log entry"
    }},
    {{
      "factor": "Contributing factor 2",
      "evidence": "Supporting evidence or log entry"
    }}
  ],
  "missing_evidence": [
    {{
      "id": "GAP-01",
      "gap_description": "Specific missing record, log, or analytical test needed to verify cause",
      "recommended_action": "Action investigator must take to retrieve or verify this evidence",
      "priority": "High" | "Medium" | "Low",
      "status": "Open"
    }},
    {{
      "id": "GAP-02",
      "gap_description": "Second critical missing evidence item",
      "recommended_action": "Recommended retrieval action",
      "priority": "Medium",
      "status": "Open"
    }}
  ],
  "capa_actions": [
    {{
      "id": "CAPA-01",
      "action_type": "Corrective",
      "description": "Immediate corrective repair or disposition action",
      "rationale": "Directly remediates the immediate failure",
      "department": "Engineering" | "Manufacturing" | "Quality Control" | "Quality Assurance",
      "owner": "Designated Role/Lead",
      "due_date": "14 Days from Approval",
      "priority": "High",
      "status": "Proposed",
      "ai_suggested": true
    }},
    {{
      "id": "CAPA-02",
      "action_type": "Preventive",
      "description": "Long-term engineering interlock, automated alarm, or SOP overhaul",
      "rationale": "Permanently eliminates recurrence of this root cause across similar lines",
      "department": "Engineering" | "Manufacturing" | "Quality Control" | "Quality Assurance",
      "owner": "System Owner",
      "due_date": "45 Days from Approval",
      "priority": "High",
      "status": "Proposed",
      "ai_suggested": true
    }},
    {{
      "id": "CAPA-03",
      "action_type": "Preventive",
      "description": "Training, competency check, or validation protocol update",
      "rationale": "Ensures adherence and workforce competency",
      "department": "Training / QA",
      "owner": "QA Compliance Lead",
      "due_date": "30 Days from Approval",
      "priority": "Medium",
      "status": "Proposed",
      "ai_suggested": true
    }}
  ],
  "summary": "2-3 sentence executive briefing of the deviation, identified root cause, and proposed CAPA.",
  "confidence_score": 0.92
}}
"""
