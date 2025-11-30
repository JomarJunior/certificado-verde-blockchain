import { httpClient } from "./http-client";

const BASE_PATH = '/certificates';

export interface IssuanceRequest {
    certifier_address: string;
    certifier_signature: string;
}

export interface AuthenticityProof {
    serial_code: string;
    qr_code_url?: string;
    certifier_signature: string;
    certifier_address: string;
}

export interface Certificate {
    id: string;
    version: string;
    product_id: string;
    producer_id: string;
    certifier_id: string;
    norms_complied: string[];
    sustainability_criteria: string[];
    notes?: string;
    issued_at?: string;
    valid_until?: string;
    last_audited_at?: string;
    authenticity_proof: AuthenticityProof;
    canonical_hash?: string;
    blockchain_id?: number;
    pre_issued_hash?: string;
};


export const certificateApi = {
    fetchPreCertificates: async (): Promise<Certificate[]> => {
        const response = await httpClient.get<Certificate[]>(`${BASE_PATH}/pre/`);
        return response.data;
    },
    fetchCertificateById: async (id: string): Promise<Certificate> => {
        const response = await httpClient.get<Certificate>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerPreCertificate: async (certificateData: Omit<Certificate, 'id' | 'issued_at' | 'valid_until' | 'last_audited_at' | 'authenticity_proof' | 'canonical_hash' | 'blockchain_id' | 'pre_issued_hash'>): Promise<Certificate> => {
        const response = await httpClient.post<Certificate>(`${BASE_PATH}/pre/`, certificateData);
        return response.data;
    },
    issueCertificate: async (id: string, issuanceRequest: IssuanceRequest): Promise<Certificate> => {
        const response = await httpClient.post<Certificate>(`${BASE_PATH}/${id}`, issuanceRequest);
        return response.data;
    }
};
