import React, { useCallback, useMemo, useState } from 'react';
import type { Auditor } from '../api/auditor-api';
import { auditorApi } from '../api/auditor-api';
import { AuditorContext, defaultAuditorContextProps, type AuditorContextProps } from '../hooks/useAuditor';

export function AuditorProvider({ children }: { children: React.ReactNode }) {
    const [auditors, setAuditors] = useState<Auditor[] | null>(defaultAuditorContextProps.auditors);
    const [isLoading, setIsLoading] = useState<boolean>(defaultAuditorContextProps.isLoading);

    // Fetch all auditors
    const fetchAllAuditors = useCallback(
        async ({ force }: { force?: boolean } = { force: false }): Promise<Auditor[]> => {
            if (auditors && !force) {
                return Promise.resolve(auditors);
            }
            setIsLoading(true);
            try {
                const fetchedAuditors = await auditorApi.fetchAuditors();
                setAuditors(fetchedAuditors);
                return fetchedAuditors;
            } finally {
                setIsLoading(false);
            }
        }, [auditors]);

    // Fetch one auditor by ID
    const fetchOneAuditorById = useCallback(
        async (id: string): Promise<Auditor> => {
            setIsLoading(true);
            try {
                const auditor = await auditorApi.fetchAuditorById(id);
                return auditor;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Register a new auditor
    const registerNewAuditor = useCallback(
        async (auditorData: Omit<Auditor, 'id'>): Promise<Auditor> => {
            setIsLoading(true);
            try {
                const newAuditor = await auditorApi.registerAuditor(auditorData);
                setAuditors((prevAuditors) => (prevAuditors ? [...prevAuditors, newAuditor] : [newAuditor]));
                return newAuditor;
            } finally {
                setIsLoading(false);
            }
        }, []);

    const contextValue: AuditorContextProps = useMemo(() => ({
        auditors,
        isLoading,
        fetchAllAuditors,
        fetchOneAuditorById,
        registerNewAuditor
    }), [auditors, isLoading, fetchAllAuditors, fetchOneAuditorById, registerNewAuditor]);

    return (
        <AuditorContext value={contextValue}>
            {children}
        </AuditorContext>
    );
};
