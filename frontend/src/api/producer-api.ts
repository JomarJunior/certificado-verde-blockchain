import { httpClient } from "./http-client";

const BASE_PATH = '/producers';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface ProducerAddress {
    country: string;
    state?: string;
    city?: string;
    coordinates: Coordinates;
}

export interface ProducerDocument {
    document_type: string;
    number: string;
}

export interface ProducerContact {
    email?: string;
    phone?: string;
    website?: string;
}

export interface Producer {
    id: string;
    name: string;
    document: ProducerDocument;
    address: ProducerAddress;
    car_code?: string;
    contact: ProducerContact;
    metadata?: Record<string, unknown>;
}

export const producerApi = {
    fetchProducers: async (): Promise<Producer[]> => {
        const response = await httpClient.get<Producer[]>(`${BASE_PATH}/`);
        return response.data;
    },
    fetchProducerById: async (id: string): Promise<Producer> => {
        const response = await httpClient.get<Producer>(`${BASE_PATH}/${id}`);
        return response.data;
    },
    registerProducer: async (producerData: Omit<Producer, 'id'>): Promise<Producer> => {
        const response = await httpClient.post<Producer>(`${BASE_PATH}/`, producerData);
        return response.data;
    }
};
