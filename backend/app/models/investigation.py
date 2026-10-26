import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Float
from app.database import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    deviation_number = Column(String(64), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    
    # API Manufacturing Context
    api_product_name = Column(String(128), nullable=False)
    batch_lot_number = Column(String(64), index=True, nullable=False)
    manufacturing_stage = Column(String(128), nullable=False)
    date_of_occurrence = Column(String(32), nullable=False)
    severity = Column(String(32), default="Major")  # Critical, Major, Minor
    initial_containment_action = Column(Text, nullable=True)
    
    # Input Source Information
    raw_input_type = Column(String(32), default="Pasted Text")  # PDF, Pasted Text, Email
    raw_input_content = Column(Text, nullable=True)
    
    # Investigation Methodologies
    investigation_approach = Column(String(64), default="Combined (5 Whys + Fishbone)")
    five_whys_data = Column(JSON, default=list)  # List of {step, why_question, answer, evidence, verified}
    fishbone_data = Column(JSON, default=dict)   # {machine: [], method: [], material: [], man: [], measurement: [], milieu: []}
    
    # Root Cause Identification
    primary_root_cause = Column(Text, nullable=True)
    root_cause_category = Column(String(64), nullable=True)  # Equipment, Process Drift, Human Error, Material, Procedure, Environment
    contributing_factors = Column(JSON, default=list)        # List of {factor, evidence}
    
    # Evidence & Information Gaps
    missing_evidence = Column(JSON, default=list)            # List of {id, gap_description, recommended_action, status}
    
    # Corrective and Preventive Actions (CAPA)
    capa_actions = Column(JSON, default=list)                # List of {id, action_type, description, rationale, department, owner, due_date, priority, status}
    
    # Quality & Governance Tracking
    status = Column(String(32), default="Draft")             # Draft, Under Investigation, QA Review, Approved
    investigator_name = Column(String(128), default="Quality Lead")
    qa_reviewer_name = Column(String(128), default="QA Manager")
    ai_confidence_score = Column(Float, default=0.88)
    ai_review_status = Column(String(64), default="AI Suggestions Populated - Pending Review")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
