import React, { useCallback, useMemo, useState } from 'react';
import type { Certificate, IssuanceRequest } from '../api/certificate-api';
import { certificateApi } from '../api/certificate-api';
import { CertificateContext, defaultCertificateContextProps, type CertificateContextProps } from '../hooks/useCertificate';

export function CertificateProvider({ children }: { children: React.ReactNode }) {
    const [certificates, setCertificates] = useState<Certificate[] | null>(defaultCertificateContextProps.certificates);
    const [isLoading, setIsLoading] = useState<boolean>(defaultCertificateContextProps.isLoading);

    // Fetch all pre certificates
    const fetchAllPreCertificates = useCallback(
        async (): Promise<Certificate[]> => {
            setIsLoading(true);
            try {
                const fetchedCertificates = await certificateApi.fetchPreCertificates();
                setCertificates(fetchedCertificates);
                return fetchedCertificates;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Fetch one certificate by ID
    const fetchOneCertificateById = useCallback(
        async (id: string): Promise<Certificate> => {
            setIsLoading(true);
            try {
                const certificate = await certificateApi.fetchCertificateById(id);
                return certificate;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Register a new pre certificate
    const registerNewPreCertificate = useCallback(
        async (certificateData: Omit<Certificate, 'id' | 'issued_at' | 'valid_until' | 'last_audited_at' | 'authenticity_proof' | 'canonical_hash' | 'blockchain_id' | 'pre_issued_hash'>): Promise<Certificate> => {
            setIsLoading(true);
            try {
                const newCertificate = await certificateApi.registerPreCertificate(certificateData);
                setCertificates((prevCertificates) => (prevCertificates ? [...prevCertificates, newCertificate] : [newCertificate]));
                return newCertificate;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Issue a pre certificate
    const issuePreCertificate = useCallback(
        async (id: string, issuanceRequest: IssuanceRequest): Promise<Certificate> => {
            setIsLoading(true);
            try {
                const issuedCertificate = await certificateApi.issueCertificate(id, issuanceRequest);
                // Update the certificate in the state
                setCertificates((prevCertificates) => {
                    if (!prevCertificates) return null;
                    return prevCertificates.map(cert => cert.id === issuedCertificate.id ? issuedCertificate : cert);
                });
                return issuedCertificate;
            } finally {
                setIsLoading(false);
            }
        }, []);

    const contextValue: CertificateContextProps = useMemo(() => ({
        certificates,
        isLoading,
        fetchAllPreCertificates,
        fetchOneCertificateById,
        registerNewPreCertificate,
        issuePreCertificate
    }), [certificates, isLoading, fetchAllPreCertificates, fetchOneCertificateById, registerNewPreCertificate, issuePreCertificate]);

    return (
        <CertificateContext value={contextValue}>
            {children}
        </CertificateContext>
    );
};
