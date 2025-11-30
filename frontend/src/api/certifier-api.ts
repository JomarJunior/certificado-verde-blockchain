import type { Auditor } from "./auditor-api";
import { httpClient } from "./http-client";

const BASE_PATH = '/certifiers';

export interface CertifierDocument {
    document_type: string;
    number: string;
}

export interface Certifier {
    id: string;
    name: string;
    document: CertifierDocument;
    auditors: Auditor[];
}

export const certifierApi = {
    fetchCertifiers: async (): Promise<Certifier[]> => {
        const response = await httpClient.get<Certifier[]>(`${BASE_PATH}/`);
        return response.data;
    },
    fetchCertifierById: async (id: string): Promise<Certifier> => {
        const response = await httpClient.get<Certifier>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerCertifier: async (certifierData: Omit<Certifier, 'id'>): Promise<Certifier> => {
        const response = await httpClient.post<Certifier>(`${BASE_PATH}/`, certifierData);
        return response.data;
    }
};
