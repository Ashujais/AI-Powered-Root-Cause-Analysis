import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

os.makedirs("sample_documents", exist_ok=True)

# 1. Generate realistic PDF deviation report
pdf_path = "sample_documents/Deviation_DEV-2026-0412_Atorvastatin_PSD_OOS.pdf"
doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
styles = getSampleStyleSheet()

title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=16, leading=20, textColor=colors.HexColor('#0b3f6d'))
sec_style = ParagraphStyle('SecStyle', parent=styles['Heading2'], fontSize=11, leading=15, textColor=colors.HexColor('#0259a0'), spaceBefore=8, spaceAfter=4)
body_style = ParagraphStyle('BodyStyle', parent=styles['Normal'], fontSize=9, leading=13, textColor=colors.HexColor('#1e293b'))

story = []
story.append(Paragraph("AIVOA PHARMACEUTICALS - ACTIVE PHARMACEUTICAL INGREDIENTS DIVISION", ParagraphStyle('H', parent=styles['Normal'], fontSize=8, textColor=colors.gray)))
story.append(Paragraph("FORMAL MANUFACTURING DEVIATION & INCIDENT INTAKE REPORT", title_style))
story.append(Spacer(1, 10))

table_data = [
    [Paragraph("<b>Deviation Number:</b> DEV-2026-0412", body_style), Paragraph("<b>Date:</b> March 14, 2026", body_style)],
    [Paragraph("<b>API Product:</b> Atorvastatin Calcium Trihydrate API", body_style), Paragraph("<b>Batch / Lot:</b> 26ATC-089", body_style)],
    [Paragraph("<b>Manufacturing Unit:</b> Unit 3 Synthesis Bay", body_style), Paragraph("<b>Stage:</b> Stage 4 - Crystallization & Centrifugation", body_style)],
    [Paragraph("<b>Criticality / Classification:</b> Major Deviation", body_style), Paragraph("<b>Reported By:</b> QA Shift Investigator", body_style)],
]
t = Table(table_data, colWidths=[260, 260])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
    ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor('#cbd5e1')),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(t)
story.append(Spacer(1, 12))

story.append(Paragraph("1. Incident Narrative & Analytical Non-Conformance", sec_style))
story.append(Paragraph(
    "During routine QC release testing of finished API Batch 26ATC-089, particle size distribution (PSD) analysis on the Malvern Mastersizer 3000 yielded an Out-of-Specification (OOS) result. "
    "The measured d90 value was <b>78.4 µm</b> against the registered regulatory release specification limit of <b>d90 ≤ 45.0 µm</b> (d50: 15.0 - 25.0 µm, observed: 34.2 µm). "
    "Microscopic examination revealed dense crystalline macro-agglomerates with non-uniform polyhedral habit.", body_style
))
story.append(Spacer(1, 8))

story.append(Paragraph("2. Process Data & Distributed Control System (DCS) Historian Review", sec_style))
story.append(Paragraph(
    "Investigation into DCS historian records (Tag: CR-301-TT-04) for Crystallizer Reactor CR-301 revealed a critical cooling rate excursion during the nucleation window. "
    "The validated batch recipe requires linear cooling from 65.0°C to 35.0°C at 0.8°C/min over 37.5 minutes. "
    "However, at 03:12 AM, chilled water modulating control valve CV-301 failed open to 85% stroke, causing an unconstrained cooling plunge at <b>2.4°C/min</b> (300% faster than validated limit). "
    "Physical inspection IR-2026-104 revealed the valve pneumatic actuator diaphragm suffered elastomeric fatigue with air leakage.", body_style
))
story.append(Spacer(1, 8))

story.append(Paragraph("3. Maintenance & Equipment Calibration History", sec_style))
story.append(Paragraph(
    "SAP Plant Maintenance records indicated that work order PM-ACT-08 for pneumatic actuator diaphragm replacement and loop calibration had been due on January 28, 2026. "
    "The task was deferred 45 days by the maintenance planner due to commercial production scheduling pressure. "
    "No formal Quality risk assessment or engineering deviation was initiated to evaluate the deferral.", body_style
))
story.append(Spacer(1, 8))

story.append(Paragraph("4. Immediate Containment & Batch Quarantine", sec_style))
story.append(Paragraph(
    "1. Batch 26ATC-089 (420 kg wet cake) was immediately tagged with physical yellow quarantine signage and locked in SAP warehouse status BLOCKED.<br/>"
    "2. Crystallizer CR-301 was placed under Lock-Out/Tag-Out (LOTO) for pneumatic actuator rebuild.<br/>"
    "3. Subsequent synthesis lot 26ATC-090 held at crude intermediate stage.", body_style
))

doc.build(story)
print("Generated sample PDF:", pdf_path)

# 2. Generate text sample
with open("sample_documents/Deviation_DEV-2026-0589_Paracetamol_Impurity_Excursion.txt", "w", encoding="utf-8") as f:
    f.write("""PHARMACEUTICAL MANUFACTURING DEVIATION INVESTIGATION
Reference Number: DEV-2026-0589
Facility: Unit 1 API Chemical Synthesis Facility
API Product: Paracetamol (Acetaminophen) API
Batch Number: PCM-2026-441
Manufacturing Stage: Exothermic Acetylation Reaction (Reactor R-102)
Date of Occurrence: March 18, 2026
Severity Classification: Critical

SUMMARY OF DEVIATION:
During in-process HPLC testing of Batch PCM-2026-441, the concentration of Impurity B (4-aminophenol / related substance dimer) was reported at 0.28%, exceeding the finished product specification limit of <= 0.15%.

DCS & PROCESS DATA AUDIT:
At 02:15 AM during shift 2, operator initiated charging of Acetic Anhydride into Reactor R-102 containing p-aminophenol aqueous slurry.
- The standard batch manufacturing record (BMR Step 5.3) dictates metering acetic anhydride at a controlled rate of 6.0 Liters/min over 60 minutes, maintaining temperature between 88°C - 95°C (Upper critical threshold: 98.0°C).
- The DCS and mass flow meter FM-102 recorded an actual charging rate of 18.5 Liters/min.
- The rapid addition resulted in an immediate exothermic runaway. Reaction mass temperature spiked to 107.8°C and remained above 100°C for 42 minutes before emergency cooling jacket water managed to suppress the exotherm.
- The elevated temperature in the presence of excess acetic anhydride accelerated side-reaction kinetics, converting starting material into the unwanted Impurity B dimer.

ROOT CAUSE INVESTIGATION FINDINGS:
- Audit trail on Variable Frequency Drive VFD-P-102 revealed a manual speed override was activated from the local HMI terminal at 02:14 AM.
- When interviewed, the shift operator admitted to increasing pump speed to complete reagent addition before shift handover.
- System audit revealed the HMI software lacked password-protected role restrictions for dosing speed parameters.

CONTAINMENT ACTIONS:
Batch PCM-2026-441 (1,250 kg) isolated in quarantine vessel T-204. Reactor R-102 locked out.""")

# 3. Generate email sample
with open("sample_documents/Quality_Email_Incident_Metformin_Residual_Solvent.txt", "w", encoding="utf-8") as f:
    f.write("""From: priya.sharma@pharma-apisynthesis.com
To: quality.investigations@pharma-apisynthesis.com
Date: March 22, 2026 09:14 AM
Subject: URGENT: Quality Incident - Residual Solvent Excursion in Metformin API Batch MET-2026-102

Hi Quality Team,

We have an urgent deviation to report for Metformin HCl API Batch MET-2026-102 (Stage: Vacuum Tray Drying, Dryer VTD-04).

Analytical QC has reported that Batch MET-2026-102 failed residual solvent testing by GC-Headspace:
- Residual Acetone Result: 5,820 ppm (ICH Q3C Class 3 Limit: <= 5,000 ppm)
- Water Content (KF): 0.22% (Within spec <= 0.5%)

Investigation details:
1. Dryer VTD-04 ran for the standard 18-hour cycle at 70°C shelf temperature.
2. Review of the vacuum recorder chart indicates that vacuum levels were normal (15-20 mbar) for the first 12 hours. However, between 12h and 18h, the vacuum degraded significantly, rising to 120-140 mbar.
3. Because vacuum was compromised, the vapor pressure of acetone was insufficient to desorb from the crystalline matrix.
4. Maintenance inspected the liquid ring vacuum pump P-401 and discovered that the seal water cooling heat exchanger HE-401 was heavily fouled with mineral scale, causing the seal water temperature to rise to 48°C (normally 18°C), causing pump cavitation and loss of deep vacuum.
5. Secondary cooling water log books revealed that chemical descaling had not been performed for 8 months.

The 850 kg API lot is currently held under physical quarantine in Cleanroom Suite 4. Please initiate formal RCA and CAPA workflow.

Regards,
Priya Sharma
Production Superintendent, Unit 2""")
print("Generated sample text and email files.")
