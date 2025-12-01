import { httpClient } from "./http-client";

const BASE_PATH = '/auditors';

export type DocumentType = 'CREA' | 'CRBIO' | 'INMETRO' | 'OTHER';
export const DOCUMENT_TYPES: DocumentType[] = ['CREA', 'CRBIO', 'INMETRO', 'OTHER'];

export interface AuditorDocument {
    document_type: DocumentType;
    number: string;
}

export interface Auditor {
    id: string;
    name: string;
    document: AuditorDocument;
}

export type AuditorRegisterData = Omit<Auditor, 'id'>;

export interface ListAllAuditorsResponse {
    auditors: Auditor[];
}

export interface RegisterAuditorResponse {
    auditor: Auditor;
}

export const auditorApi = {
    fetchAuditors: async (): Promise<Auditor[]> => {
        const response = await httpClient.get<ListAllAuditorsResponse>(`${BASE_PATH}/`);
        return response.data.auditors;
    },
    fetchAuditorById: async (id: string): Promise<Auditor> => {
        const response = await httpClient.get<Auditor>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerAuditor: async (auditorData: AuditorRegisterData): Promise<Auditor> => {
        const response = await httpClient.post<RegisterAuditorResponse>(`${BASE_PATH}/`, auditorData);
        return response.data.auditor;
    }
};
