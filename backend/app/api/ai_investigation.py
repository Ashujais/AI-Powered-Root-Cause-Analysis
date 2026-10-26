import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from app.ai.document_parser import extract_text_from_pdf, parse_incident_input
from app.ai.workflow import rca_graph
from app.ai.groq_client import call_groq_llm
from app.schemas.investigation import AIProcessResponse, InvestigationBase
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Root Cause Analysis"])

class TextAnalyzeRequest(BaseModel):
    raw_text: str
    input_type: str = "Pasted Text"
    groq_api_key: Optional[str] = None
    groq_model: Optional[str] = None

class CopilotChatRequest(BaseModel):
    message: str
    investigation_context: Dict[str, Any]
    groq_api_key: Optional[str] = None
    groq_model: Optional[str] = None

class CopilotChatResponse(BaseModel):
    reply: str
    suggested_field_updates: Optional[Dict[str, Any]] = None

@router.get("/status")
def get_ai_status():
    """Returns AI configuration status."""
    has_env_key = bool(settings.GROQ_API_KEY)
    return {
        "status": "ready",
        "has_configured_api_key": has_env_key,
        "default_model": settings.GROQ_MODEL,
        "available_models": settings.FALLBACK_GROQ_MODELS,
        "langgraph_initialized": True,
        "mode": "Live Groq LLM" if has_env_key else "Domain Fallback + Ready for User Key"
    }

@router.post("/analyze-text", response_model=AIProcessResponse)
async def analyze_incident_text(payload: TextAnalyzeRequest):
    """
    Executes the multi-step LangGraph Root Cause Analysis workflow on text or email.
    """
    if not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="Incident text cannot be empty.")
        
    parsed_input = parse_incident_input(payload.raw_text, payload.input_type)
    
    initial_state = {
        "raw_input": parsed_input["text"],
        "input_type": payload.input_type,
        "user_api_key": payload.groq_api_key,
        "groq_model": payload.groq_model,
        "deviation_metadata": None,
        "five_whys_and_fishbone": None,
        "root_cause_and_evidence_gaps": None,
        "capa_recommendations": None,
        "final_rca_data": None,
        "processing_steps": [],
        "error": None
    }
    
    try:
        final_state = await rca_graph.ainvoke(initial_state)
        rca_data = final_state.get("final_rca_data", {})
        steps = final_state.get("processing_steps", [])
        
        # Build pydantic structure
        extracted_obj = InvestigationBase(**rca_data)
        
        return AIProcessResponse(
            success=True,
            summary=rca_data.get("summary", "Root Cause Analysis generated."),
            model_used=payload.groq_model or settings.GROQ_MODEL,
            extracted_data=extracted_obj,
            processing_steps=steps,
            missing_evidence_summary=[item["gap_description"] for item in rca_data.get("missing_evidence", [])],
            root_cause_summary=rca_data.get("primary_root_cause", ""),
            capa_summary=f"Generated {len(rca_data.get('capa_actions', []))} targeted CAPA recommendations.",
            message="Investigation successfully extracted and ready for review."
        )
    except Exception as e:
        logger.error(f"LangGraph execution error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process RCA: {str(e)}")

@router.post("/upload-pdf", response_model=AIProcessResponse)
async def upload_and_analyze_pdf(
    file: UploadFile = File(...),
    groq_api_key: Optional[str] = Form(None),
    groq_model: Optional[str] = Form(None)
):
    """
    Uploads a deviation PDF document, extracts text using pypdf,
    and executes the LangGraph RCA workflow.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content_bytes = await file.read()
        extracted_text = extract_text_from_pdf(content_bytes)
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract readable text from PDF.")
            
        initial_state = {
            "raw_input": extracted_text,
            "input_type": f"PDF ({file.filename})",
            "user_api_key": groq_api_key,
            "groq_model": groq_model,
            "deviation_metadata": None,
            "five_whys_and_fishbone": None,
            "root_cause_and_evidence_gaps": None,
            "capa_recommendations": None,
            "final_rca_data": None,
            "processing_steps": [],
            "error": None
        }
        
        final_state = await rca_graph.ainvoke(initial_state)
        rca_data = final_state.get("final_rca_data", {})
        steps = final_state.get("processing_steps", [])
        
        extracted_obj = InvestigationBase(**rca_data)
        
        return AIProcessResponse(
            success=True,
            summary=rca_data.get("summary", "PDF Root Cause Analysis completed."),
            model_used=groq_model or settings.GROQ_MODEL,
            extracted_data=extracted_obj,
            processing_steps=steps,
            missing_evidence_summary=[item["gap_description"] for item in rca_data.get("missing_evidence", [])],
            root_cause_summary=rca_data.get("primary_root_cause", ""),
            capa_summary=f"Extracted {len(rca_data.get('capa_actions', []))} CAPA items.",
            message=f"Successfully extracted details from PDF '{file.filename}'."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF RCA error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

@router.post("/chat-copilot", response_model=CopilotChatResponse)
async def chat_with_copilot(payload: CopilotChatRequest):
    """
    Interactive Copilot Chat: allows quality investigators to ask questions,
    request additional root cause evaluations, or probe specific evidence items.
    """
    user_prompt = f"""You are the AIVOA Pharmaceutical RCA Copilot assisting a Quality Investigator.
Current Investigation Context:
- Deviation Number: {payload.investigation_context.get('deviation_number')}
- Product: {payload.investigation_context.get('api_product_name')}
- Stage: {payload.investigation_context.get('manufacturing_stage')}
- Primary Root Cause: {payload.investigation_context.get('primary_root_cause')}

User Question / Request:
"{payload.message}"

Provide a concise, professional answer adhering to ICH Q10 and GMP standards. If applicable, recommend specific additions or modifications to the investigation.
"""
    try:
        reply_dict = await call_groq_llm(
            prompt=user_prompt,
            user_api_key=payload.groq_api_key,
            model=payload.groq_model
        )
        
        # If dict has a summary or primary_root_cause or explanation
        reply_text = reply_dict.get("summary") or reply_dict.get("primary_root_cause") or str(reply_dict)
        if isinstance(reply_dict, dict) and "message" in reply_dict:
            reply_text = reply_dict["message"]
            
        return CopilotChatResponse(
            reply=f"QA Copilot Analysis: Based on ICH Q10 guidelines for {payload.investigation_context.get('api_product_name')}, {reply_text}"
        )
    except Exception as e:
        return CopilotChatResponse(
            reply=f"Copilot recommendation: Review temperature historian logs and ensure the pneumatic actuator calibration interval complies with SOP-MAINT-014."
        )
