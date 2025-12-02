import React, { useCallback, useMemo, useState } from 'react';
import type { Certificate, CertificateRegisterData, IssueCertificateRequest, RegisterPDFHashRequest, ValidateCertificateResponse, ValidatePDFFileRequest, ValidatePDFFileResponse } from '../api/certificate-api';
import { certificateApi } from '../api/certificate-api';
import { CertificateContext, defaultCertificateContextProps, type CertificateContextProps } from '../hooks/useCertificate';

export function CertificateProvider({ children }: { children: React.ReactNode }) {
    const [certificates, setCertificates] = useState<Certificate[] | null>(defaultCertificateContextProps.certificates);
    const [isLoading, setIsLoading] = useState<boolean>(defaultCertificateContextProps.isLoading);

    // Fetch all pre certificates
    const fetchAllPreCertificates = useCallback(
        async ({ force }: { force?: boolean } = { force: false }): Promise<Certificate[]> => {
            if (certificates && !force) {
                return Promise.resolve(certificates);
            }
            setIsLoading(true);
            try {
                const fetchedCertificates = await certificateApi.fetchPreCertificates();
                setCertificates(fetchedCertificates);
                return fetchedCertificates;
            } finally {
                setIsLoading(false);
            }
        }, [certificates]);

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
        async (certificateData: CertificateRegisterData): Promise<Certificate> => {
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
        async (id: string, issueCertificateRequest: IssueCertificateRequest): Promise<Certificate> => {
            const issuedCertificate = await certificateApi.issueCertificate(id, issueCertificateRequest);
            // Update the certificate in the state
            setCertificates((prevCertificates) => {
                if (!prevCertificates) return null;
                return prevCertificates.filter(cert => cert.id !== id); // When issued, the pre-certificate is removed from the list
            });
            return issuedCertificate;

        }, []);

    // Register PDF Hash
    const registerPDFHash = useCallback(
        async (id: string, registerPDFHashRequest: RegisterPDFHashRequest): Promise<string> => {
            const pdfHash = await certificateApi.registerPDFHash(id, registerPDFHashRequest);

            setCertificates((prevCertificates) => {
                if (!prevCertificates) return null;
                return prevCertificates.map(cert => cert.id === id ? { ...cert, authenticity_proof: { ...cert.authenticity_proof, pdf_hash: pdfHash } } : cert);
            });

            return pdfHash;
        }, []);

    // Validate Certificate
    const validateCertificate = useCallback(
        async (certificateHash: string): Promise<ValidateCertificateResponse> => {
            setIsLoading(true);
            try {
                const isValid = await certificateApi.validateCertificate(certificateHash);
                return isValid;
            } finally {
                setIsLoading(false);
            }
        }, []);

    // Validate PDF File
    const validatePDFFile = useCallback(
        async (validatePDFFileRequest: ValidatePDFFileRequest): Promise<ValidatePDFFileResponse> => {
            setIsLoading(true);
            try {
                const isValid = await certificateApi.validatePDFFile(validatePDFFileRequest);
                return isValid;
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
        issuePreCertificate,
        registerPDFHash,
        validateCertificate,
        validatePDFFile,
    }), [certificates, isLoading, fetchAllPreCertificates, fetchOneCertificateById, registerNewPreCertificate, issuePreCertificate, registerPDFHash, validateCertificate, validatePDFFile]);

    return (
        <CertificateContext value={contextValue}>
            {children}
        </CertificateContext>
    );
};
