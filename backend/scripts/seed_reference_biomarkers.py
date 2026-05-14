from db.client import SessionLocal

from models.reference_biomarker import (
    ReferenceBiomarker
)


db = SessionLocal()


reference_biomarkers = [

    {
        "name": "Hemoglobin",
        "aliases": "Hb,HGB",
        "category": "Blood",
        "unit": "g/dL",
        "min_value": 13.0,
        "max_value": 17.0,
        "description": (
            "Measures oxygen carrying "
            "protein in blood"
        )
    },

    {
        "name": "Glucose",
        "aliases": "Blood Sugar",
        "category": "Diabetes",
        "unit": "mg/dL",
        "min_value": 70,
        "max_value": 140,
        "description": (
            "Measures blood glucose level"
        )
    },

    {
        "name": "Creatinine",
        "aliases": "Cr",
        "category": "Kidney",
        "unit": "mg/dL",
        "min_value": 0.7,
        "max_value": 1.3,
        "description": (
            "Measures kidney function"
        )
    },

    {
        "name": "WBC",
        "aliases": (
            "White Blood Cells,"
            "Leukocytes"
        ),
        "category": "Blood",
        "unit": "10^3/uL",
        "min_value": 4,
        "max_value": 11,
        "description": (
            "White blood cell count"
        )
    },

    {
        "name": "Platelets",
        "aliases": "PLT",
        "category": "Blood",
        "unit": "10^3/uL",
        "min_value": 150,
        "max_value": 450,
        "description": (
            "Platelet count"
        )
    }
]


for biomarker_data in reference_biomarkers:

    existing = (
        db.query(ReferenceBiomarker)
        .filter(
            ReferenceBiomarker.name ==
            biomarker_data["name"]
        )
        .first()
    )

    if existing:
        continue

    biomarker = ReferenceBiomarker(
        **biomarker_data
    )

    db.add(biomarker)


db.commit()

db.close()

print(
    "Reference biomarkers seeded successfully"
)