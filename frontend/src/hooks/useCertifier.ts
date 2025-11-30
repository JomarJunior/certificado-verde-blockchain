import { createContext, use } from "react";
import type { Certifier } from "../api/certifier-api";

export interface CertifierContextProps {
    // State
    certifiers: Certifier[] | null;
    isLoading: boolean;
    // Actions
    fetchAllCertifiers: () => Promise<Certifier[]>;
    fetchOneCertifierById: (id: string) => Promise<Certifier>;
    registerNewCertifier: (certifierData: Omit<Certifier, 'id'>) => Promise<Certifier>;
}

export const defaultCertifierContextProps: CertifierContextProps = {
    certifiers: null,
    isLoading: false,
    fetchAllCertifiers: async () => { throw new Error('fetchAllCertifiers not implemented'); },
    fetchOneCertifierById: async () => { throw new Error('fetchOneCertifierById not implemented'); },
    registerNewCertifier: async () => { throw new Error('registerNewCertifier not implemented'); },
};

export const CertifierContext = createContext<CertifierContextProps>(defaultCertifierContextProps);

export const useCertifierContext = () => use(CertifierContext);
