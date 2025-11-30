import { createContext, use } from "react";
import type { Producer } from "../api/producer-api";

export interface ProducerContextProps {
    // State
    producers: Producer[] | null;
    isLoading: boolean;
    // Actions
    fetchAllProducers: () => Promise<Producer[]>;
    fetchOneProducerById: (id: string) => Promise<Producer>;
    registerNewProducer: (producerData: Omit<Producer, 'id'>) => Promise<Producer>;
};

export const defaultProducerContextProps: ProducerContextProps = {
    producers: null,
    isLoading: false,
    fetchAllProducers: async () => { throw new Error('fetchAllProducers not implemented'); },
    fetchOneProducerById: async () => { throw new Error('fetchOneProducerById not implemented'); },
    registerNewProducer: async () => { throw new Error('registerNewProducer not implemented'); },
};

export const ProducerContext = createContext<ProducerContextProps>(defaultProducerContextProps);

export const useProducerContext = () => use(ProducerContext);
