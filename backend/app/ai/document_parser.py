import io
import re
from typing import Dict, Any
from pypdf import PdfReader

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract clean text from PDF bytes using pypdf."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted_text = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                extracted_text.append(f"--- Page {i+1} ---\n" + page_text.strip())
        return "\n\n".join(extracted_text)
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")

def parse_incident_input(raw_text: str, input_type: str = "Pasted Text") -> Dict[str, Any]:
    """
    Parses and standardizes the incident input text or email.
    Detects email headers (Subject, From, Date) if present.
    """
    cleaned = raw_text.strip()
    metadata = {
        "input_type": input_type,
        "char_count": len(cleaned),
        "word_count": len(cleaned.split()),
        "has_email_headers": False,
        "email_subject": None,
        "detected_date": None
    }
    
    # Check for email format
    subject_match = re.search(r"Subject:\s*(.+)", cleaned, re.IGNORECASE)
    from_match = re.search(r"From:\s*(.+)", cleaned, re.IGNORECASE)
    date_match = re.search(r"Date:\s*(.+)", cleaned, re.IGNORECASE)
    
    if subject_match or from_match:
        metadata["has_email_headers"] = True
        if subject_match:
            metadata["email_subject"] = subject_match.group(1).strip()
        if date_match:
            metadata["detected_date"] = date_match.group(1).strip()
            
    return {
        "text": cleaned,
        "metadata": metadata
    }
