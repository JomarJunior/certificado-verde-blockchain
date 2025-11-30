import { createContext, use } from "react";
import type { Certificate, IssuanceRequest } from "../api/certificate-api";

export interface CertificateContextProps {
    // State
    certificates: Certificate[] | null;
    isLoading: boolean;
    // Actions
    fetchAllPreCertificates: () => Promise<Certificate[]>;
    fetchOneCertificateById: (id: string) => Promise<Certificate>;
    registerNewPreCertificate: (certificateData: Omit<Certificate, 'id' | 'issued_at' | 'valid_until' | 'last_audited_at' | 'authenticity_proof' | 'canonical_hash' | 'blockchain_id' | 'pre_issued_hash'>) => Promise<Certificate>;
    issuePreCertificate: (id: string, issuanceRequest: IssuanceRequest) => Promise<Certificate>;
}

export const defaultCertificateContextProps: CertificateContextProps = {
    certificates: null,
    isLoading: false,
    fetchAllPreCertificates: async () => { throw new Error('fetchAllPreCertificates not implemented'); },
    fetchOneCertificateById: async () => { throw new Error('fetchOneCertificateById not implemented'); },
    registerNewPreCertificate: async () => { throw new Error('registerNewPreCertificate not implemented'); },
    issuePreCertificate: async () => { throw new Error('issuePreCertificate not implemented'); },
};

export const CertificateContext = createContext<CertificateContextProps>(defaultCertificateContextProps);

export const useCertificateContext = () => use(CertificateContext);
