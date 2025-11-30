import { httpClient } from "./http-client";

const BASE_PATH = '/auditors';

export interface AuditorDocument {
    document_type: string;
    number: string;
}

export interface Auditor {
    id: string;
    name: string;
    document: AuditorDocument;
}

export const auditorApi = {
    fetchAuditors: async (): Promise<Auditor[]> => {
        const response = await httpClient.get<Auditor[]>(`${BASE_PATH}/`);
        return response.data;
    },
    fetchAuditorById: async (id: string): Promise<Auditor> => {
        const response = await httpClient.get<Auditor>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerAuditor: async (auditorData: Omit<Auditor, 'id'>): Promise<Auditor> => {
        const response = await httpClient.post<Auditor>(`${BASE_PATH}/`, auditorData);
        return response.data;
    }
};
