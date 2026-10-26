from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class FiveWhyStep(BaseModel):
    step: int
    why_question: str
    answer: str
    evidence: Optional[str] = ""
    verified: bool = False
    ai_suggested: bool = True

class FishboneData(BaseModel):
    machine: List[str] = Field(default_factory=list, description="Equipment, instruments, reactors, valves, sensors")
    method: List[str] = Field(default_factory=list, description="SOPs, batch records, recipes, processing parameters")
    material: List[str] = Field(default_factory=list, description="Raw materials, solvents, reagents, packaging")
    man: List[str] = Field(default_factory=list, description="Personnel, training, shift handover, execution error")
    measurement: List[str] = Field(default_factory=list, description="Testing, calibration, HPLC methods, sampling")
    milieu: List[str] = Field(default_factory=list, description="Environment, HVAC, temperature, humidity, cleanroom")

class MissingEvidenceItem(BaseModel):
    id: str
    gap_description: str
    recommended_action: str
    priority: str = "High"  # High, Medium, Low
    status: str = "Open"    # Open, Gathered, In Review

class ContributingFactor(BaseModel):
    factor: str
    evidence: Optional[str] = ""

class CAPAItem(BaseModel):
    id: str
    action_type: str = "Corrective"  # Corrective or Preventive
    description: str
    rationale: str
    department: str = "Manufacturing"
    owner: str = "Pending Assignment"
    due_date: str = "30 Days from Approval"
    priority: str = "High"  # High, Medium, Low
    status: str = "Proposed"  # Proposed, In Progress, Verified Closed
    ai_suggested: bool = True

class InvestigationBase(BaseModel):
    deviation_number: str
    title: str
    api_product_name: str
    batch_lot_number: str
    manufacturing_stage: str
    date_of_occurrence: str
    severity: str = "Major"
    initial_containment_action: Optional[str] = ""
    
    raw_input_type: str = "Pasted Text"
    raw_input_content: Optional[str] = ""
    
    investigation_approach: str = "Combined (5 Whys + Fishbone)"
    five_whys_data: List[FiveWhyStep] = Field(default_factory=list)
    fishbone_data: FishboneData = Field(default_factory=FishboneData)
    
    primary_root_cause: Optional[str] = ""
    root_cause_category: Optional[str] = "Equipment"
    contributing_factors: List[ContributingFactor] = Field(default_factory=list)
    
    missing_evidence: List[MissingEvidenceItem] = Field(default_factory=list)
    capa_actions: List[CAPAItem] = Field(default_factory=list)
    
    status: str = "Draft"
    investigator_name: str = "Quality Lead"
    qa_reviewer_name: str = "QA Manager"
    ai_confidence_score: float = 0.90
    ai_review_status: str = "AI Suggestions Populated - Pending Review"

class InvestigationCreate(InvestigationBase):
    pass

class InvestigationUpdate(BaseModel):
    deviation_number: Optional[str] = None
    title: Optional[str] = None
    api_product_name: Optional[str] = None
    batch_lot_number: Optional[str] = None
    manufacturing_stage: Optional[str] = None
    date_of_occurrence: Optional[str] = None
    severity: Optional[str] = None
    initial_containment_action: Optional[str] = None
    
    investigation_approach: Optional[str] = None
    five_whys_data: Optional[List[FiveWhyStep]] = None
    fishbone_data: Optional[FishboneData] = None
    
    primary_root_cause: Optional[str] = None
    root_cause_category: Optional[str] = None
    contributing_factors: Optional[List[ContributingFactor]] = None
    
    missing_evidence: Optional[List[MissingEvidenceItem]] = None
    capa_actions: Optional[List[CAPAItem]] = None
    
    status: Optional[str] = None
    investigator_name: Optional[str] = None
    qa_reviewer_name: Optional[str] = None
    ai_review_status: Optional[str] = None

class InvestigationResponse(InvestigationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AIProcessRequest(BaseModel):
    raw_text: Optional[str] = None
    input_type: str = "Pasted Text"  # "Pasted Text", "Email", "PDF"
    groq_api_key: Optional[str] = None
    groq_model: Optional[str] = None

class AIProcessResponse(BaseModel):
    success: bool
    summary: str
    model_used: str
    extracted_data: InvestigationBase
    processing_steps: List[str]
    missing_evidence_summary: List[str]
    root_cause_summary: str
    capa_summary: str
    message: str
