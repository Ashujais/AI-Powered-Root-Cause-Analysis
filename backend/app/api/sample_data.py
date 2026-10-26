from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/samples", tags=["Sample Pharma Incidents"])

SAMPLE_INCIDENTS = [
    {
        "id": "sample-1",
        "title": "Out-of-Specification (OOS) Particle Size in Atorvastatin Calcium Batch 26ATC-089",
        "product": "Atorvastatin Calcium Trihydrate API",
        "type": "Deviation Report (PDF)",
        "summary": "Crystallization cooling rate excursion caused by chilled water modulating valve CV-301 failure, leading to coarse agglomerated crystals exceeding d90 specification.",
        "text": """PHARMACEUTICAL MANUFACTURING DEVIATION REPORT
Document ID: DEV-2026-0412
Date: March 14, 2026
Facility: Unit 3 Active Pharmaceutical Ingredient Synthesis Plant
Product: Atorvastatin Calcium Trihydrate API
Batch / Lot Number: 26ATC-089
Process Stage: Stage 4 - Controlled Crystallization & Centrifugation
Severity: Major

INCIDENT DESCRIPTION:
During final analytical release testing, Quality Control laboratory reported an Out-of-Specification (OOS) result for Particle Size Distribution (PSD) on Batch 26ATC-089.
- Analysis Result: d90 = 78.4 µm (Specification Limit: d90 ≤ 45.0 µm, d50: 15.0 - 25.0 µm, d10: 2.0 - 8.0 µm).
- Observed d50 was 34.2 µm and d10 was 11.8 µm. The crystal morphology exhibited significant macro-agglomeration under polarising light microscopy.

PROCESS LOGS & HISTORIAN DATA:
Review of the Distributed Control System (DCS) temperature historian (Tag: CR-301-TT-04) for Crystallizer CR-301 revealed a significant cooling rate anomaly during the controlled cooling crystallization phase:
- Target Recipe Profile: Linear cooling from 65.0°C to 35.0°C at a rate of 0.8°C/min over 37.5 minutes.
- Actual Excursion: Between 03:12 AM and 03:24 AM, the jacket temperature plummeted from 64.8°C down to 36.1°C at a rapid rate of 2.4°C/min (300% faster than validated limit).
- Inspection of the chilled water modulating control valve CV-301 showed that the valve stem was physically stuck at 85% open despite the DCS output commanding 20% opening.
- Maintenance instrumentation check IR-2026-104 indicated that the pneumatic actuator diaphragm exhibited micro-perforations and low control air pressure.

MAINTENANCE HISTORY CHECK:
Work order records in SAP PM showed that preventive maintenance task PM-ACT-08 (Actuator Diaphragm Replacement and Stroke Calibration) was scheduled for January 28, 2026, but had been deferred by 45 days due to continuous production scheduling backlog. No formal Engineering Change or Deviation was raised to justify the maintenance deferral.

IMMEDIATE CONTAINMENT ACTIONS:
1. Batch 26ATC-089 (420 kg wet cake) was placed on physical and SAP Quality Quarantine (Status: BLOCKED) in Warehouse Bay Q-4.
2. Crystallizer CR-301 tagged out (LOTO) pending valve actuator replacement and cooling profile loop tuning.
3. Subsequent scheduled synthesis batch 26ATC-090 placed on hold at reaction crude stage."""
    },
    {
        "id": "sample-2",
        "title": "Critical Impurity B Thermal Excursion in Paracetamol Synthesis Batch PCM-2026-441",
        "product": "Paracetamol (Acetaminophen) API",
        "type": "Quality Investigation Memo",
        "summary": "Exothermic acetylation runaway occurred when acetic anhydride was charged at triple the validated rate due to unauthorized operator override of pump VFD.",
        "text": """INTERNAL QUALITY INVESTIGATION MEMORANDUM
Incident Reference: DEV-2026-0589
Date: March 18, 2026
Department: QA & Process Chemistry
API Name: Paracetamol (Acetaminophen) API
Batch Number: PCM-2026-441
Stage: Acetylation Reaction (Reactor R-102)
Severity: Critical

BACKGROUND & DEVIATION:
During in-process HPLC testing of Batch PCM-2026-441, the concentration of Impurity B (4-aminophenol / related substance dimer) was found to be 0.28%, exceeding the finished product specification limit of ≤ 0.15%.

CHRONOLOGY & DCS DATA:
At 02:15 AM during shift 2, operator initiated the charging of Acetic Anhydride into Reactor R-102 containing p-aminophenol aqueous slurry.
- The standard batch manufacturing record (BMR Step 5.3) dictates metering acetic anhydride at a controlled rate of 6.0 Liters/min over 60 minutes, maintaining temperature between 88°C - 95°C (Upper critical threshold: 98.0°C).
- The DCS and mass flow meter FM-102 recorded an actual charging rate of 18.5 Liters/min.
- The rapid addition resulted in an immediate exothermic runaway. Reaction mass temperature spiked to 107.8°C and remained above 100°C for 42 minutes before emergency cooling jacket water managed to suppress the exotherm.
- The elevated temperature in the presence of excess acetic anhydride accelerated side-reaction kinetics, converting starting material into the unwanted Impurity B dimer.

ROOT CAUSE INVESTIGATION FINDINGS:
- Audit trail on Variable Frequency Drive VFD-P-102 revealed a manual speed override was activated from the local HMI terminal at 02:14 AM.
- When interviewed, the shift operator admitted to increasing pump speed to complete reagent addition before shift handover.
- System audit revealed the HMI software lacked password-protected role restrictions for dosing speed parameters.

CONTAINMENT:
Batch PCM-2026-441 (1,250 kg) isolated in quarantine vessel T-204. Reactor R-102 locked out."""
    },
    {
        "id": "sample-3",
        "title": "OOS Residual Solvent (Acetone) in Metformin HCl Vacuum Drying Batch MET-2026-102",
        "product": "Metformin Hydrochloride API",
        "type": "Production Notification Email",
        "summary": "Loss of vacuum depth during vacuum tray drying due to heat exchanger fouling in utility loop, leading to residual acetone exceeding ICH Q3C limit.",
        "text": """From: production.lead@pharma-apisynthesis.com
To: quality.investigations@pharma-apisynthesis.com
Date: March 22, 2026 09:14 AM
Subject: URGENT: Quality Incident - Residual Solvent Excursion in Metformin API Batch MET-2026-102

Hi Quality Team,

We have an urgent deviation to report for Metformin HCl API Batch MET-2026-102 (Stage: Vacuum Tray Drying, Dryer VTD-04).

Analytical QC has reported that Batch MET-2026-102 failed residual solvent testing by GC-Headspace:
- Residual Acetone Result: 5,820 ppm (ICH Q3C Class 3 Limit: ≤ 5,000 ppm)
- Water Content (KF): 0.22% (Within spec ≤ 0.5%)

Investigation details:
1. Dryer VTD-04 ran for the standard 18-hour cycle at 70°C shelf temperature.
2. Review of the vacuum recorder chart indicates that vacuum levels were normal (15-20 mbar) for the first 12 hours. However, between 12h and 18h, the vacuum degraded significantly, rising to 120-140 mbar.
3. Because vacuum was compromised, the vapor pressure of acetone was insufficient to desorb from the crystalline matrix.
4. Maintenance inspected the liquid ring vacuum pump P-401 and discovered that the seal water cooling heat exchanger HE-401 was heavily fouled with mineral scale, causing the seal water temperature to rise to 48°C (normally 18°C), causing pump cavitation and loss of deep vacuum.
5. Secondary cooling water log books revealed that chemical descaling had not been performed for 8 months.

The 850 kg API lot is currently held under physical quarantine in Cleanroom Suite 4. Please initiate formal RCA and CAPA workflow.

Regards,
Priya Sharma
Production Superintendent, Unit 2"""
    }
]

@router.get("", response_model=List[Dict[str, Any]])
def get_sample_incidents():
    """Retrieve list of pre-configured pharmaceutical API deviation incident samples."""
    return SAMPLE_INCIDENTS
