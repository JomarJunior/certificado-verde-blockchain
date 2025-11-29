from enum import Enum


class DocumentType(str, Enum):
    CPF = "CPF"
    CNPJ = "CNPJ"
    CRBIO = "CRBIO"
    INMETRO = "INMETRO"
    CREA = "CREA"
    OTHER = "OTHER"

    def __str__(self) -> str:
        return self.value
