import { httpClient } from "./http-client";

const BASE_PATH = '/certificates';

export interface AuthenticityProof {
    serial_code: string;
    qr_code_url?: string;
    certifier_signature: string;
    certifier_address: string;
    pdf_hash?: string;
}

export type Norm = "ISO 14001" | "Rainforest Alliance" | "FSC" | "LEED" | "IDB.org" | "Other";
export const NORMS: Norm[] = ["ISO 14001", "Rainforest Alliance", "FSC", "LEED", "IDB.org", "Other"];

export type SustainabilityCriterion = "Organic" | "Legal Origin" | "Forest Management Plan" | "Biodiversity Maintenance" | "Complete Traceability" | "Exploitation Limits" | "Working Conditions" | "Valid Environmental License" | "Other";
export const SUSTAINABILITY_CRITERIA: SustainabilityCriterion[] = ["Organic", "Legal Origin", "Forest Management Plan", "Biodiversity Maintenance", "Complete Traceability", "Exploitation Limits", "Working Conditions", "Valid Environmental License", "Other"];

export interface Certificate {
    id: string;
    // Pre certificate fields
    version: string;
    product_id: string;
    producer_id: string;
    certifier_id: string;
    norms_complied: Norm[];
    sustainability_criteria: SustainabilityCriterion[];
    notes?: string;
    // Below fields are set only after issuance
    issued_at?: string;
    valid_until?: string;
    last_audited_at?: string;
    authenticity_proof: AuthenticityProof;
    canonical_hash?: string;
    blockchain_id?: number;
    pre_issued_hash?: string;
};

export type CertificateRegisterData = Omit<Certificate, 'id' | 'issued_at' | 'valid_until' | 'last_audited_at' | 'authenticity_proof' | 'canonical_hash' | 'blockchain_id' | 'pre_issued_hash'>;

export interface ListPreCertificatesResponse {
    pre_certificates: Certificate[];
}

export interface RegisterPreCertificateResponse {
    pre_certificate: Certificate;
}

export interface IssueCertificateResponse {
    certificate: Certificate;
}

export interface IssueCertificateRequest {
    certifier_address: string;
    certifier_signature: string;
}

export interface RegisterPDFHashRequest {
    pdf_file: string; // base64 encoded
}

export interface RegisterPDFHashResponse {
    certificate_id: string;
    pdf_hash: string;
}

export interface ValidateCertificateResponse {
    is_valid: boolean;
    certificate: Certificate;
}

export interface ValidatePDFFileRequest {
    pdf_file: string; // base64 encoded
}

export interface ValidatePDFFileResponse {
    certificate_id: string;
    pdf_hash: string;
    is_valid: boolean;
}

export const certificateApi = {
    fetchPreCertificates: async (): Promise<Certificate[]> => {
        const response = await httpClient.get<ListPreCertificatesResponse>(`${BASE_PATH}/pre/`);
        return response.data.pre_certificates;
    },
    fetchCertificateById: async (id: string): Promise<Certificate> => {
        const response = await httpClient.get<Certificate>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerPreCertificate: async (certificateData: CertificateRegisterData): Promise<Certificate> => {
        const response = await httpClient.post<RegisterPreCertificateResponse>(`${BASE_PATH}/pre/`, certificateData);
        return response.data.pre_certificate;
    },
    issueCertificate: async (id: string, issueCertificateRequest: IssueCertificateRequest): Promise<Certificate> => {
        const response = await httpClient.post<IssueCertificateResponse>(`${BASE_PATH}/${id}`, issueCertificateRequest);
        return response.data.certificate;
    },
    registerPDFHash: async (id: string, registerPDFHashRequest: RegisterPDFHashRequest): Promise<string> => {
        const response = await httpClient.post<RegisterPDFHashResponse>(`${BASE_PATH}/${id}/pdf_hash`, registerPDFHashRequest);
        return response.data.pdf_hash;
    },
    validateCertificate: async (certificateHash: string): Promise<ValidateCertificateResponse> => {
        const response = await httpClient.get<ValidateCertificateResponse>(`${BASE_PATH}/validate/${certificateHash}`);
        return response.data;
    },
    validatePDFFile: async (validatePDFFileRequest: ValidatePDFFileRequest): Promise<ValidatePDFFileResponse> => {
        const response = await httpClient.post<ValidatePDFFileResponse>(`${BASE_PATH}/validate/pdf`, validatePDFFileRequest);
        return response.data;
    }
};
