import { Alert, AlertTitle, Box, Button, Container, FormControl, FormControlLabel, Icon, Paper, styled, Tab, Tabs, TextField, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Certificate } from "../../api/certificate-api";
import { useCertificateContext } from "../../hooks/useCertificate";

const TabPanel: React.FC<{ children?: React.ReactNode; index: number; value: number }> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const VerifyCertificate: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [certificateIdInput, setCertificateIdInput] = React.useState("");
    const [selectedPdfFile, setSelectedPdfFile] = React.useState<File | null>(null);
    const [errors, setErrors] = React.useState<string[] | null>(null);
    const [isValid, setIsValid] = React.useState<boolean | null>(null);
    const [isVerifying, setIsVerifying] = React.useState(false);
    const { fetchOneCertificateById, validateCertificate, validatePDFFile } = useCertificateContext();
    const [certificate, setCertificate] = React.useState<Certificate | null>(null);
    const [tabIndex, setTabIndex] = React.useState(0);
    const navigate = useNavigate();

    const validationMode = searchParams.get("mode"); // 'id' or 'pdf'
    const idFromQuery = searchParams.get("id");

    React.useEffect(() => {
        // Reset state when validation mode changes
        if (!validationMode) {
            setCertificate(null);
            setIsValid(null);
            setErrors(null);
        }
    }, [validationMode]);

    // Auto-verify if 'id' parameter is present in URL
    React.useEffect(() => {
        const autoVerify = async () => {
            if (idFromQuery && !validationMode && !isVerifying) {
                setCertificateIdInput(idFromQuery);
                setErrors(null);
                setIsValid(null);
                setCertificate(null);
                setIsVerifying(true);

                try {
                    // Step 1: Fetch certificate by ID to get canonical_hash
                    const fetchedCertificate = await fetchOneCertificateById(idFromQuery.trim());

                    if (!fetchedCertificate) {
                        setErrors(["Certificado não encontrado."]);
                        setIsValid(false);
                        setSearchParams({ mode: 'id', result: 'invalid', id: idFromQuery });
                        return;
                    }

                    if (!fetchedCertificate.canonical_hash) {
                        setErrors(["Certificado encontrado, mas ainda não foi emitido."]);
                        setIsValid(false);
                        setSearchParams({ mode: 'id', result: 'invalid', id: idFromQuery });
                        return;
                    }

                    // Step 2: Validate the canonical_hash
                    const validationResponse = await validateCertificate(fetchedCertificate.canonical_hash);
                    setIsValid(validationResponse.is_valid);

                    if (validationResponse.is_valid) {
                        setCertificate(validationResponse.certificate);
                        setSearchParams({ mode: 'id', result: 'valid', id: idFromQuery });
                    } else {
                        setCertificate(null);
                        setErrors(["O certificado não é válido ou foi adulterado."]);
                        setSearchParams({ mode: 'id', result: 'invalid', id: idFromQuery });
                    }
                } catch (error) {
                    setErrors([`Erro ao validar certificado: ${(error as Error).message}`]);
                    setIsValid(false);
                    setCertificate(null);
                    setSearchParams({ mode: 'id', result: 'invalid', id: idFromQuery });
                } finally {
                    setIsVerifying(false);
                }
            }
        };

        autoVerify();
    }, [idFromQuery, validationMode, isVerifying, fetchOneCertificateById, validateCertificate, setSearchParams]);

    const handleCertificateIdSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrors(null);
        setIsValid(null);
        setCertificate(null);

        if (!certificateIdInput.trim()) {
            setErrors(["Por favor, insira o ID do certificado."]);
            return;
        }

        setIsVerifying(true);
        try {
            // Step 1: Fetch certificate by ID to get canonical_hash
            const fetchedCertificate = await fetchOneCertificateById(certificateIdInput.trim());

            if (!fetchedCertificate) {
                setErrors(["Certificado não encontrado."]);
                setIsValid(false);
                setSearchParams({ mode: 'id', result: 'invalid' });
                return;
            }

            if (!fetchedCertificate.canonical_hash) {
                setErrors(["Certificado encontrado, mas ainda não foi emitido."]);
                setIsValid(false);
                setSearchParams({ mode: 'id', result: 'invalid' });
                return;
            }

            // Step 2: Validate the canonical_hash
            const validationResponse = await validateCertificate(fetchedCertificate.canonical_hash);
            setIsValid(validationResponse.is_valid);

            if (validationResponse.is_valid) {
                setCertificate(validationResponse.certificate);
                setSearchParams({ mode: 'id', result: 'valid' });
            } else {
                setCertificate(null);
                setErrors(["O certificado não é válido ou foi adulterado."]);
                setSearchParams({ mode: 'id', result: 'invalid' });
            }
        } catch (error) {
            setErrors([`Erro ao validar certificado: ${(error as Error).message}`]);
            setIsValid(false);
            setCertificate(null);
            setSearchParams({ mode: 'id', result: 'invalid' });
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePdfFileSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrors(null);
        setIsValid(null);
        setCertificate(null);

        if (!selectedPdfFile) {
            setErrors(["Por favor, selecione um arquivo PDF."]);
            return;
        }

        setIsVerifying(true);
        try {
            // Convert PDF file to base64
            const arrayBuffer = await selectedPdfFile.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Convert to base64 in chunks to avoid call stack overflow
            let binaryString = '';
            const chunkSize = 8192;
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
                const chunk = uint8Array.subarray(i, i + chunkSize);
                binaryString += String.fromCharCode.apply(null, Array.from(chunk));
            }
            const pdfBase64 = btoa(binaryString);

            // Validate PDF file
            const validationResponse = await validatePDFFile({ pdf_file: pdfBase64 });
            setIsValid(validationResponse.is_valid);

            if (validationResponse.is_valid) {
                // Fetch the full certificate details
                const fetchedCertificate = await fetchOneCertificateById(validationResponse.certificate_id);
                setCertificate(fetchedCertificate);
                setSearchParams({ mode: 'pdf', result: 'valid' });
            } else {
                setCertificate(null);
                setErrors(["O arquivo PDF não corresponde a nenhum certificado válido ou foi adulterado."]);
                setSearchParams({ mode: 'pdf', result: 'invalid' });
            }
        } catch (error) {
            setErrors([`Erro ao validar arquivo PDF: ${(error as Error).message}`]);
            setIsValid(false);
            setCertificate(null);
            setSearchParams({ mode: 'pdf', result: 'invalid' });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClear = () => {
        setSearchParams({});
        setErrors(null);
        setCertificateIdInput("");
        setSelectedPdfFile(null);
        setIsValid(null);
        setCertificate(null);
    };

    const handleDisplayCertificate = () => {
        if (certificate) {
            navigate(`/certificates/issue/${certificate.id}`);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrors(null);
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setErrors(["Por favor, selecione um arquivo PDF válido."]);
                setSelectedPdfFile(null);
                return;
            }
            setSelectedPdfFile(file);
        }
    };

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Verificar Certificado
                </Typography>

                <Typography variant="body1">
                    Verifique a autenticidade de um certificado através do ID ou do arquivo PDF.
                </Typography>

                {!validationMode ? (
                    <>
                        <Tabs value={tabIndex} sx={{ mt: 3 }}>
                            <Tab label="Verificação por ID do Certificado" onClick={() => setTabIndex(0)} />
                            <Tab label="Verificação por Arquivo PDF" onClick={() => setTabIndex(1)} />
                        </Tabs>
                        <TabPanel value={tabIndex} index={0}>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Insira o ID do certificado encontrado no documento logo abaixo do título "Certificado Verde Blockchain".
                                Ele é composto por 5 grupos de caracteres separados por hífens totalizando 36 caracteres.
                                (ex: cf0d7366-ca44-fd28-1a91-1b2001eb234c).
                            </Typography>
                            <FormControl fullWidth component="form" onSubmit={handleCertificateIdSubmit}>
                                <FormControlLabel
                                    control={
                                        <TextField
                                            name="certificateId"
                                            value={certificateIdInput}
                                            placeholder="cf0d7366-ca44-fd28-1a91-1b2001eb234c"
                                            fullWidth
                                            onChange={(e) => setCertificateIdInput(e.target.value)}
                                            disabled={isVerifying}
                                        />
                                    }
                                    label="🧬 ID do Certificado"
                                    labelPlacement="top"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, alignSelf: "flex-start" }}
                                    disabled={!certificateIdInput.trim() || isVerifying}
                                    startIcon={<Icon>{isVerifying ? 'hourglass_empty' : 'search'}</Icon>}
                                >
                                    {isVerifying ? 'Verificando...' : 'Verificar'}
                                </Button>
                            </FormControl>
                            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" sx={{ mt: 4 }}>
                                <Typography variant="caption" color="textSecondary">
                                    Exemplo de localização do ID do Certificado:
                                </Typography>
                                <img
                                    src={`${window.location.origin}/certificado-verde-blockchain/imgs/id_example.png`}
                                    alt="Exemplo de localização do ID do Certificado"
                                    style={{ marginTop: '16px', maxWidth: '100%', border: '1px solid #e0e0e0', borderRadius: 4 }}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Faça o upload do arquivo PDF do certificado para verificar sua autenticidade e integridade.
                            </Typography>
                            <FormControl fullWidth component="form" onSubmit={handlePdfFileSubmit}>
                                <FormControlLabel
                                    control={
                                        <Box>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                tabIndex={-1}
                                                startIcon={<Icon>upload_file</Icon>}
                                                disabled={isVerifying}
                                            >
                                                Selecionar arquivo PDF
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={handleFileChange}
                                                />
                                            </Button>
                                            {selectedPdfFile && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    Arquivo selecionado: {selectedPdfFile.name}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                    label="📄 Arquivo PDF do Certificado"
                                    labelPlacement="top"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, alignSelf: "flex-start" }}
                                    disabled={!selectedPdfFile || isVerifying}
                                    startIcon={<Icon>{isVerifying ? 'hourglass_empty' : 'verified'}</Icon>}
                                >
                                    {isVerifying ? 'Verificando...' : 'Verificar PDF'}
                                </Button>
                            </FormControl>
                        </TabPanel>
                    </>
                ) : (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Resultado da Verificação
                            {validationMode === 'id' && ' (por ID)'}
                            {validationMode === 'pdf' && ' (por Arquivo PDF)'}:
                        </Typography>

                        {isVerifying ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                <AlertTitle>Verificando</AlertTitle>
                                Aguarde enquanto validamos o certificado...
                            </Alert>
                        ) : isValid ? (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                <AlertTitle>✓ Certificado Válido</AlertTitle>
                                O certificado é autêntico e não foi adulterado.
                            </Alert>
                        ) : (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                <AlertTitle>✗ Certificado Inválido</AlertTitle>
                                {errors && errors.length > 0 ? errors[0] : 'O certificado não é válido ou foi adulterado.'}
                            </Alert>
                        )}

                        {certificate && isValid && (
                            <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">Informações do Certificado:</Typography>
                                <Typography variant="body2">ID: {certificate.id}</Typography>
                                <Typography variant="body2">Versão: {certificate.version}</Typography>
                                {certificate.issued_at && (
                                    <Typography variant="body2">Emitido em: {new Date(certificate.issued_at).toLocaleDateString()}</Typography>
                                )}
                            </Box>
                        )}

                        <Box display="flex" flexDirection="row" gap={2} sx={{ mt: 3 }}>
                            {isValid && certificate && (
                                <Button
                                    variant="contained"
                                    onClick={handleDisplayCertificate}
                                    startIcon={<Icon>visibility</Icon>}
                                >
                                    Visualizar Certificado Completo
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                onClick={handleClear}
                                startIcon={<Icon>refresh</Icon>}
                            >
                                Nova Verificação
                            </Button>
                        </Box>
                    </Box>
                )}

                {errors && errors.length > 0 && !validationMode && (
                    <Box sx={{ mt: 2 }}>
                        {errors.map((error, index) => (
                            <Alert severity="error" key={index} sx={{ mb: 1 }}>
                                <AlertTitle>Erro</AlertTitle>
                                {error}
                            </Alert>
                        ))}
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default VerifyCertificate;
