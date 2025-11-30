from enum import Enum


class Norm(str, Enum):
    ISO_14001 = "ISO 14001"
    RAINFOREST_ALLIANCE = "Rainforest Alliance"
    FSC = "FSC"
    LEED = "LEED"
    IDB_ORG = "IDB.org"
    OTHER = "Other"

    def __str__(self) -> str:
        return self.value
