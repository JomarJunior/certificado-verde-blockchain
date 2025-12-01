import type { Auditor } from "./auditor-api";
import { httpClient } from "./http-client";

const BASE_PATH = '/certifiers';

export type DocumentType = 'CNPJ';
export const DOCUMENT_TYPES: DocumentType[] = ['CNPJ'];

export interface CertifierDocument {
    document_type: DocumentType;
    number: string;
}

export interface Certifier {
    id: string;
    name: string;
    document: CertifierDocument;
    auditors: Auditor[];
}

export type CertifierRegisterData = Omit<Certifier, 'id'>;

export interface ListAllCertifiersResponse {
    certifiers: Certifier[];
}

export interface RegisterCertifierResponse {
    certifier: Certifier;
}

export const certifierApi = {
    fetchCertifiers: async (): Promise<Certifier[]> => {
        const response = await httpClient.get<ListAllCertifiersResponse>(`${BASE_PATH}/`);
        return response.data.certifiers;
    },
    fetchCertifierById: async (id: string): Promise<Certifier> => {
        const response = await httpClient.get<Certifier>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerCertifier: async (certifierData: Omit<Certifier, 'id'>): Promise<Certifier> => {
        const response = await httpClient.post<RegisterCertifierResponse>(`${BASE_PATH}/`, certifierData);
        return response.data.certifier;
    }
};
