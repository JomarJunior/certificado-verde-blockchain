import { createContext, use } from "react";
import type { Certificate, CertificateRegisterData, IssueCertificateRequest, RegisterPDFHashRequest, ValidateCertificateResponse, ValidatePDFFileRequest, ValidatePDFFileResponse } from "../api/certificate-api";

export interface CertificateContextProps {
    // State
    certificates: Certificate[] | null;
    isLoading: boolean;
    // Actions
    fetchAllPreCertificates: () => Promise<Certificate[]>;
    fetchOneCertificateById: (id: string) => Promise<Certificate>;
    registerNewPreCertificate: (certificateData: CertificateRegisterData) => Promise<Certificate>;
    issuePreCertificate: (id: string, issueCertificateRequest: IssueCertificateRequest) => Promise<Certificate>;
    registerPDFHash: (id: string, registerPDFHashRequest: RegisterPDFHashRequest) => Promise<string>;
    validateCertificate: (certificateHash: string) => Promise<ValidateCertificateResponse>;
    validatePDFFile: (validatePDFFileRequest: ValidatePDFFileRequest) => Promise<ValidatePDFFileResponse>;
}

export const defaultCertificateContextProps: CertificateContextProps = {
    certificates: null,
    isLoading: false,
    fetchAllPreCertificates: async () => { throw new Error('fetchAllPreCertificates not implemented'); },
    fetchOneCertificateById: async () => { throw new Error('fetchOneCertificateById not implemented'); },
    registerNewPreCertificate: async () => { throw new Error('registerNewPreCertificate not implemented'); },
    issuePreCertificate: async () => { throw new Error('issuePreCertificate not implemented'); },
    registerPDFHash: async () => { throw new Error('registerPDFHash not implemented'); },
    validateCertificate: async () => { throw new Error('validateCertificate not implemented'); },
    validatePDFFile: async () => { throw new Error('validatePDFFile not implemented'); },
};

export const CertificateContext = createContext<CertificateContextProps>(defaultCertificateContextProps);

export const useCertificateContext = () => use(CertificateContext);
