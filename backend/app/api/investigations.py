import io
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.investigation import Investigation
from app.schemas.investigation import (
    InvestigationCreate,
    InvestigationUpdate,
    InvestigationResponse
)
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

router = APIRouter(prefix="/investigations", tags=["Investigations Database"])

@router.get("", response_model=List[InvestigationResponse])
def list_investigations(
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve saved RCA investigations from database."""
    query = db.query(Investigation)
    if status_filter:
        query = query.filter(Investigation.status == status_filter)
    investigations = query.order_by(Investigation.updated_at.desc()).offset(skip).limit(limit).all()
    return investigations

@router.get("/{investigation_id}", response_model=InvestigationResponse)
def get_investigation(investigation_id: str, db: Session = Depends(get_db)):
    """Retrieve a single investigation by ID."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation record not found.")
    return inv

@router.post("", response_model=InvestigationResponse, status_code=status.HTTP_201_CREATED)
def create_investigation(payload: InvestigationCreate, db: Session = Depends(get_db)):
    """Save a reviewed and edited RCA investigation to the database."""
    # Convert Pydantic models to dicts for JSON columns
    data = payload.dict()
    data["five_whys_data"] = [item if isinstance(item, dict) else item.dict() for item in payload.five_whys_data]
    data["fishbone_data"] = payload.fishbone_data.dict() if hasattr(payload.fishbone_data, "dict") else payload.fishbone_data
    data["contributing_factors"] = [item if isinstance(item, dict) else item.dict() for item in payload.contributing_factors]
    data["missing_evidence"] = [item if isinstance(item, dict) else item.dict() for item in payload.missing_evidence]
    data["capa_actions"] = [item if isinstance(item, dict) else item.dict() for item in payload.capa_actions]
    
    new_inv = Investigation(**data)
    db.add(new_inv)
    db.commit()
    db.refresh(new_inv)
    return new_inv

@router.put("/{investigation_id}", response_model=InvestigationResponse)
def update_investigation(
    investigation_id: str,
    payload: InvestigationUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing RCA investigation record."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation record not found.")
        
    update_data = payload.dict(exclude_unset=True)
    
    # Handle nested JSON serialization
    if "five_whys_data" in update_data and update_data["five_whys_data"] is not None:
        update_data["five_whys_data"] = [
            item if isinstance(item, dict) else item.dict() for item in update_data["five_whys_data"]
        ]
    if "fishbone_data" in update_data and update_data["fishbone_data"] is not None:
        fb = update_data["fishbone_data"]
        update_data["fishbone_data"] = fb.dict() if hasattr(fb, "dict") else fb
    if "contributing_factors" in update_data and update_data["contributing_factors"] is not None:
        update_data["contributing_factors"] = [
            item if isinstance(item, dict) else item.dict() for item in update_data["contributing_factors"]
        ]
    if "missing_evidence" in update_data and update_data["missing_evidence"] is not None:
        update_data["missing_evidence"] = [
            item if isinstance(item, dict) else item.dict() for item in update_data["missing_evidence"]
        ]
    if "capa_actions" in update_data and update_data["capa_actions"] is not None:
        update_data["capa_actions"] = [
            item if isinstance(item, dict) else item.dict() for item in update_data["capa_actions"]
        ]
        
    for key, value in update_data.items():
        setattr(inv, key, value)
        
    inv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(inv)
    return inv

@router.delete("/{investigation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_investigation(investigation_id: str, db: Session = Depends(get_db)):
    """Delete an investigation record."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation record not found.")
    db.delete(inv)
    db.commit()
    return None

@router.get("/{investigation_id}/export-pdf")
def export_investigation_pdf(investigation_id: str, db: Session = Depends(get_db)):
    """Generate a formal Pharmaceutical GMP Root Cause Analysis Investigation Report in PDF."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation record not found.")
        
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0b3f6d'),
        alignment=1,
        spaceAfter=15
    )
    section_style = ParagraphStyle(
        'DocSection',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0259a0'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1e293b')
    )
    
    story = []
    
    # Title Header
    story.append(Paragraph("AIVOA PHARMACEUTICAL QUALITY SYSTEMS", ParagraphStyle('SubHeader', parent=styles['Normal'], fontSize=9, alignment=1, textColor=colors.gray)))
    story.append(Paragraph("FORMAL ROOT CAUSE ANALYSIS & CAPA INVESTIGATION REPORT", title_style))
    story.append(Spacer(1, 10))
    
    # Metadata Table
    meta_data = [
        [Paragraph("<b>Deviation Number:</b>", body_style), Paragraph(inv.deviation_number, body_style),
         Paragraph("<b>Date of Incident:</b>", body_style), Paragraph(inv.date_of_occurrence, body_style)],
        [Paragraph("<b>API Product Name:</b>", body_style), Paragraph(inv.api_product_name, body_style),
         Paragraph("<b>Batch / Lot:</b>", body_style), Paragraph(inv.batch_lot_number, body_style)],
        [Paragraph("<b>Manufacturing Stage:</b>", body_style), Paragraph(inv.manufacturing_stage, body_style),
         Paragraph("<b>Criticality / Severity:</b>", body_style), Paragraph(inv.severity, body_style)],
        [Paragraph("<b>Investigation Status:</b>", body_style), Paragraph(inv.status, body_style),
         Paragraph("<b>QA Review Status:</b>", body_style), Paragraph(inv.ai_review_status, body_style)],
    ]
    t_meta = Table(meta_data, colWidths=[120, 150, 120, 150])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))
    
    # Root Cause Section
    story.append(Paragraph("1. Primary Root Cause Identification", section_style))
    story.append(Paragraph(f"<b>Category:</b> {inv.root_cause_category}", body_style))
    story.append(Paragraph(f"<b>Root Cause Statement:</b> {inv.primary_root_cause or 'Not documented.'}", body_style))
    story.append(Spacer(1, 10))
    
    # 5 Whys Section
    story.append(Paragraph("2. 5 Whys Causal Hierarchy", section_style))
    if inv.five_whys_data:
        fw_rows = [[Paragraph("<b>Level</b>", body_style), Paragraph("<b>Why Question & Answer</b>", body_style), Paragraph("<b>Supporting Evidence</b>", body_style)]]
        for step in inv.five_whys_data:
            q_a = f"<b>Q:</b> {step.get('why_question', '')}<br/><b>A:</b> {step.get('answer', '')}"
            ev = step.get('evidence', '') or 'None noted'
            fw_rows.append([Paragraph(f"Why {step.get('step', '')}", body_style), Paragraph(q_a, body_style), Paragraph(ev, body_style)])
        t_fw = Table(fw_rows, colWidths=[50, 310, 180])
        t_fw.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0effe')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_fw)
    story.append(Spacer(1, 10))
    
    # CAPA Section
    story.append(Paragraph("3. Corrective and Preventive Actions (CAPA)", section_style))
    if inv.capa_actions:
        capa_rows = [[Paragraph("<b>ID</b>", body_style), Paragraph("<b>Type</b>", body_style), Paragraph("<b>Action Description & Rationale</b>", body_style), Paragraph("<b>Owner / Dept</b>", body_style), Paragraph("<b>Due Date</b>", body_style)]]
        for c in inv.capa_actions:
            desc = f"<b>{c.get('description', '')}</b><br/><i>Rationale:</i> {c.get('rationale', '')}"
            owner = f"{c.get('owner', '')} ({c.get('department', '')})"
            capa_rows.append([
                Paragraph(c.get('id', ''), body_style),
                Paragraph(c.get('action_type', ''), body_style),
                Paragraph(desc, body_style),
                Paragraph(owner, body_style),
                Paragraph(c.get('due_date', ''), body_style)
            ])
        t_capa = Table(capa_rows, colWidths=[50, 65, 255, 110, 60])
        t_capa.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0effe')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t_capa)
    story.append(Spacer(1, 15))
    
    # Sign-off Box
    story.append(Paragraph("4. Signatures & Regulatory Approvals", section_style))
    sig_data = [
        [Paragraph(f"<b>Lead Investigator:</b> {inv.investigator_name}", body_style), Paragraph("<b>Signature:</b> ____________________", body_style), Paragraph("<b>Date:</b> ____________", body_style)],
        [Paragraph(f"<b>QA Reviewer:</b> {inv.qa_reviewer_name}", body_style), Paragraph("<b>Signature:</b> ____________________", body_style), Paragraph("<b>Date:</b> ____________", body_style)]
    ]
    t_sig = Table(sig_data, colWidths=[200, 220, 120])
    t_sig.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sig)
    
    doc.build(story)
    buffer.seek(0)
    pdf_bytes = buffer.getvalue()
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=RCA_Report_{inv.deviation_number}.pdf"}
    )
