import { createContext, use } from "react";
import type { Auditor } from "../api/auditor-api";

export interface AuditorContextProps {
    // State
    auditors: Auditor[] | null;
    isLoading: boolean;
    // Actions
    fetchAllAuditors: () => Promise<Auditor[]>;
    fetchOneAuditorById: (id: string) => Promise<Auditor>;
    registerNewAuditor: (auditorData: Omit<Auditor, 'id'>) => Promise<Auditor>;
};

export const defaultAuditorContextProps: AuditorContextProps = {
    auditors: null,
    isLoading: false,
    fetchAllAuditors: async () => { throw new Error('fetchAllAuditors not implemented'); },
    fetchOneAuditorById: async () => { throw new Error('fetchOneAuditorById not implemented'); },
    registerNewAuditor: async () => { throw new Error('registerNewAuditor not implemented'); },
};

export const AuditorContext = createContext<AuditorContextProps>(defaultAuditorContextProps);

export const useAuditorContext = () => use(AuditorContext);
