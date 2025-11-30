import React, { useCallback, useMemo, useState } from 'react';
import type { Producer } from '../api/producer-api';
import { producerApi } from '../api/producer-api';
import { defaultProducerContextProps, ProducerContext, type ProducerContextProps } from '../hooks/useProducer';

export function ProducerProvider({ children }: { children: React.ReactNode }) {
    const [producers, setProducers] = useState<Producer[] | null>(defaultProducerContextProps.producers);
    const [isLoading, setIsLoading] = useState<boolean>(defaultProducerContextProps.isLoading);

    // Fetch all producers
    const fetchAllProducers = useCallback(
        async (): Promise<Producer[]> => {
            setIsLoading(true);
            try {
                const fetchedProducers = await producerApi.fetchProducers();
                setProducers(fetchedProducers);
                return fetchedProducers;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Fetch one producer by ID
    const fetchOneProducerById = useCallback(
        async (id: string): Promise<Producer> => {
            setIsLoading(true);
            try {
                const producer = await producerApi.fetchProducerById(id);
                return producer;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Register a new producer
    const registerNewProducer = useCallback(
        async (producerData: Omit<Producer, 'id'>): Promise<Producer> => {
            setIsLoading(true);
            try {
                const newProducer = await producerApi.registerProducer(producerData);
                setProducers((prevProducers) => (prevProducers ? [...prevProducers, newProducer] : [newProducer]));
                return newProducer;
            } finally {
                setIsLoading(false);
            }
        }, []);

    const contextValue: ProducerContextProps = useMemo(() => ({
        producers,
        isLoading,
        fetchAllProducers,
        fetchOneProducerById,
        registerNewProducer
    }), [producers, isLoading, fetchAllProducers, fetchOneProducerById, registerNewProducer]);

    return (
        <ProducerContext value={contextValue}>
            {children}
        </ProducerContext>
    );
};
