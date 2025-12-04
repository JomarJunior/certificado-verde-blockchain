import { Box, Button, Container, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import { DOCUMENT_TYPES, type CertifierDocument, type CertifierRegisterData } from "../../api/certifier-api";
import RegisterForm, { type RegisterFormField, type ValueType } from "../../components/RegisterForm";
import { useApp } from "../../hooks/useApp";
import { useAuditorContext } from "../../hooks/useAuditor";
import { useCertifierContext } from "../../hooks/useCertifier";

const exampleCertifiers: CertifierRegisterData[] = [
    {
        name: "Instituto Amazônia Sustentável",
        document: {
            document_type: "CNPJ",
            number: "12.345.678/0001-90"
        },
        auditors: []
    },
    {
        name: "Certificadora Floresta Viva Brasil",
        document: {
            document_type: "CNPJ",
            number: "23.456.789/0001-11"
        },
        auditors: []
    },
    {
        name: "Verde Amazônia Certificações",
        document: {
            document_type: "CNPJ",
            number: "34.567.890/0001-22"
        },
        auditors: []
    },
    {
        name: "Instituto de Manejo Florestal da Amazônia",
        document: {
            document_type: "CNPJ",
            number: "45.678.901/0001-33"
        },
        auditors: []
    },
    {
        name: "Certificadora Rainforest Amazônia",
        document: {
            document_type: "CNPJ",
            number: "56.789.012/0001-44"
        },
        auditors: []
    }
];

const CertifierRegister: React.FC = () => {
    const [certifierDocumentData, setCertifierDocumentData] = React.useState<CertifierDocument>({
        document_type: "CNPJ",
        number: "",
    });
    const [certifierData, setCertifierData] = React.useState<CertifierRegisterData>({
        name: "",
        document: certifierDocumentData,
        auditors: [],
    });
    const { setDocumentTitle } = useApp();
    const { registerNewCertifier, fetchAllCertifiers, isLoading, certifiers } = useCertifierContext();
    const { auditors, fetchAllAuditors, isLoading: isLoadingAuditors } = useAuditorContext();

    const documentFields: RegisterFormField<CertifierDocument>[] = [
        {
            label: 'Tipo de Documento',
            field: 'document_type',
            type: 'select',
            items: DOCUMENT_TYPES.map((type) => ({ label: String(type), value: String(type) })),
            required: true,
            defaultValue: 'CNPJ',
            icon: '🪪',
        },
        {
            label: 'Número do Documento',
            field: 'number',
            type: 'text',
            placeholder: '12.345.678/0001-99',
            required: true,
            icon: '🔢',
        }
    ];

    const certifierFields: RegisterFormField<CertifierRegisterData>[] = [
        {
            label: 'Nome da Certificadora',
            field: 'name',
            type: 'text',
            placeholder: 'Instituto de Certificação Sustentável',
            required: true,
            icon: '🏢',
        },
        {
            label: 'Auditores Associados',
            field: 'auditors',
            type: 'select',
            items: auditors?.map((auditor) => ({ label: auditor.name, value: auditor.id })),
            required: false,
            multiple: true,
            icon: '👮',
        }
    ];

    const handleDocumentFieldChange = (field: keyof CertifierDocument, value: ValueType) => {
        const updatedDocumentData = { ...certifierDocumentData, [field]: value };
        setCertifierDocumentData(updatedDocumentData);
        setCertifierData({ ...certifierData, document: updatedDocumentData });
    }

    const handleCertifierChange = (field: keyof CertifierRegisterData, value: ValueType) => {
        if (field === 'auditors' && Array.isArray(value)) {
            const selectedAuditors = auditors?.filter((auditor) => value.includes(auditor.id)) || [];
            setCertifierData({ ...certifierData, auditors: selectedAuditors });
        } else if (typeof value === 'string') {
            setCertifierData({ ...certifierData, [field]: value });
        }
    }

    const handleSubmit = async () => {
        try {
            const registeredCertifier = await registerNewCertifier(certifierData);
            console.log("Certificadora cadastrada com sucesso:", registeredCertifier);
        } catch (error) {
            console.error("Erro ao cadastrar certificadora:", error);
        }
    }

    const handleFillExample = () => {
        const index = certifiers ? certifiers.length : 99;
        if (index >= exampleCertifiers.length) {
            alert("Todos os exemplos de certificadoras já foram preenchidos.");
            return;
        }

        const example = exampleCertifiers[index];

        const randomAmountOfAuditors = Math.floor(
            Math.random() * (
                (auditors?.length ?? 0)
            ) + 1
        );

        const shuffledAuditors = auditors ? [...auditors].sort(() => 0.5 - Math.random()) : [];
        const selectedAuditors = shuffledAuditors.slice(0, randomAmountOfAuditors);

        example.auditors = selectedAuditors;

        setCertifierData(example);
        setCertifierDocumentData(example.document);
    }

    React.useEffect(() => {
        setDocumentTitle("Cadastro de Certificadora");
        void fetchAllAuditors();
    }, [setDocumentTitle, fetchAllAuditors]);

    React.useEffect(() => {
        void fetchAllCertifiers();
    }, [fetchAllCertifiers]);

    React.useEffect(() => {
        void fetchAllAuditors();
    }, [fetchAllAuditors]);

    if (isLoading || isLoadingAuditors) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={12} textAlign={'center'}>
                        <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                            🏤 Registrar Nova Certificadora
                        </Typography>
                        <Divider />
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            Preencha o formulário abaixo para registrar uma nova certificadora na plataforma.
                        </Typography>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Dados da Certificadora
                            </Typography>
                            <RegisterForm<CertifierRegisterData>
                                target={certifierData}
                                fields={certifierFields as RegisterFormField<CertifierRegisterData>[]}
                                onChange={handleCertifierChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Documento da Certificadora
                            </Typography>
                            <RegisterForm<CertifierDocument>
                                target={certifierDocumentData}
                                fields={documentFields as RegisterFormField<CertifierDocument>[]}
                                onChange={handleDocumentFieldChange}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Divider sx={{ marginY: 4 }} />
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    gap={2}
                    sx={{ px: { xs: 0, sm: 2 } }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleFillExample}
                        startIcon={<Icon>auto_fix_high</Icon>}
                        disabled={(certifiers?.length ?? 99) >= exampleCertifiers.length}
                    >
                        Preencher Exemplo
                        {certifiers && certifiers.length < exampleCertifiers.length ? ` (${certifiers.length + 1}/${exampleCertifiers.length})` : ''}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        startIcon={<Icon>send</Icon>}
                    >
                        Registrar Certificadora
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default CertifierRegister;
