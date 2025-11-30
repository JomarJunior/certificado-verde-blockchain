from enum import Enum


class SustainabilityCriteria(str, Enum):
    ORGANIC = "Organic"
    LEGAL_ORIGIN = "Legal Origin"
    FOREST_MANAGEMENT_PLAN = "Forest Management Plan"
    BIODIVERSITY_MAINTENANCE = "Biodiversity Maintenance"
    COMPLETE_TRACEABILITY = "Complete Traceability"
    EXPLOITATION_LIMITS = "Exploitation Limits"
    WORKING_CONDITIONS = "Working Conditions"
    VALID_ENVIRONMENTAL_LICENSE = "Valid Environmental License"
    OTHER = "Other"

    def __str__(self) -> str:
        return self.value
