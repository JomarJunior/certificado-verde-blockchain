import React, { useCallback, useMemo, useState } from 'react';
import type { Certifier } from '../api/certifier-api';
import { certifierApi } from '../api/certifier-api';
import { CertifierContext, defaultCertifierContextProps, type CertifierContextProps } from '../hooks/useCertifier';

export function CertifierProvider({ children }: { children: React.ReactNode }) {
    const [certifiers, setCertifiers] = useState<Certifier[] | null>(defaultCertifierContextProps.certifiers);
    const [isLoading, setIsLoading] = useState<boolean>(defaultCertifierContextProps.isLoading);

    // Fetch all certifiers
    const fetchAllCertifiers = useCallback(
        async (): Promise<Certifier[]> => {
            setIsLoading(true);
            try {
                const fetchedCertifiers = await certifierApi.fetchCertifiers();
                setCertifiers(fetchedCertifiers);
                return fetchedCertifiers;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Fetch one certifier by ID
    const fetchOneCertifierById = useCallback(
        async (id: string): Promise<Certifier> => {
            setIsLoading(true);
            try {
                const certifier = await certifierApi.fetchCertifierById(id);
                return certifier;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Register a new certifier
    const registerNewCertifier = useCallback(
        async (certifierData: Omit<Certifier, 'id'>): Promise<Certifier> => {
            setIsLoading(true);
            try {
                const newCertifier = await certifierApi.registerCertifier(certifierData);
                setCertifiers((prevCertifiers) => (prevCertifiers ? [...prevCertifiers, newCertifier] : [newCertifier]));
                return newCertifier;
            } finally {
                setIsLoading(false);
            }
        }, []);

    const contextValue: CertifierContextProps = useMemo(() => ({
        certifiers,
        isLoading,
        fetchAllCertifiers,
        fetchOneCertifierById,
        registerNewCertifier
    }), [certifiers, isLoading, fetchAllCertifiers, fetchOneCertifierById, registerNewCertifier]);

    return (
        <CertifierContext value={contextValue}>
            {children}
        </CertifierContext>
    );
}
