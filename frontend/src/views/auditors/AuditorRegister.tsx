import { Box, Button, Container, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import { DOCUMENT_TYPES, type AuditorDocument, type AuditorRegisterData } from "../../api/auditor-api";
import type { RegisterFormField, ValueType } from "../../components/RegisterForm";
import RegisterForm from "../../components/RegisterForm";
import { useApp } from "../../hooks/useApp";
import { useAuditorContext } from "../../hooks/useAuditor";

const exampleAuditors: AuditorRegisterData[] = [
    {
        name: "Dr. Amazonino Silva Santos",
        document: {
            document_type: "CREA",
            number: "PA-123456789"
        }
    },
    {
        name: "Dra. Floresta Verde Oliveira",
        document: {
            document_type: "CRBIO",
            number: "AM-987654321"
        }
    },
    {
        name: "Eng. Manoel Ribeiro da Amazônia",
        document: {
            document_type: "INMETRO",
            number: "AC-112233445"
        }
    },
    {
        name: "Bióloga Ana Floresta Santos",
        document: {
            document_type: "CRBIO",
            number: "RO-556677889"
        }
    },
    {
        name: "Eng. Agr. Pedro Amazonas Lima",
        document: {
            document_type: "CREA",
            number: "AM-667788990"
        }
    }
]

const AuditorRegister: React.FC = () => {
    const [auditorDocumentData, setAuditorDocumentData] = React.useState<AuditorDocument>({
        document_type: "CREA",
        number: "",
    });
    const [auditorData, setAuditorData] = React.useState<AuditorRegisterData>({
        name: "",
        document: auditorDocumentData,
    });
    const { setDocumentTitle } = useApp();
    const { registerNewAuditor, fetchAllAuditors, isLoading, auditors } = useAuditorContext();

    const documentFields: RegisterFormField<AuditorDocument>[] = [
        {
            label: 'Tipo de Documento',
            field: 'document_type',
            type: 'select',
            items: DOCUMENT_TYPES.map((type) => ({ label: String(type), value: String(type) })),
            required: true,
            defaultValue: 'CREA',
            icon: '🪪',
        },
        {
            label: 'Número do Documento',
            field: 'number',
            placeholder: '9421437712',
            type: 'text',
            required: true,
            icon: '🔢',
        }
    ];

    const auditorFields: RegisterFormField<AuditorRegisterData>[] = [
        {
            label: 'Nome do Auditor',
            field: 'name',
            placeholder: 'João da Silva',
            type: 'text',
            required: true,
            icon: '👮',
        },
    ];

    const handleDocumentFieldChange = (field: keyof AuditorDocument, value: ValueType) => {
        const updatedDocumentData = { ...auditorDocumentData, [field]: value };
        setAuditorDocumentData(updatedDocumentData);
        setAuditorData({ ...auditorData, document: updatedDocumentData });
    }

    const handleAuditorChange = (field: keyof AuditorRegisterData, value: ValueType) => {
        setAuditorData({ ...auditorData, [field]: value });
    }

    const handleSubmit = async () => {
        try {
            const registeredAuditor = await registerNewAuditor(auditorData);
            console.log('Auditor registrado com sucesso:', registeredAuditor);
        } catch (error) {
            console.error('Erro ao registrar auditor:', error);
        }
    }

    const handleFillExample = () => {
        const index = auditors ? auditors.length % exampleAuditors.length : 99;
        if (index >= exampleAuditors.length) {
            alert('Todos os exemplos já foram preenchidos.');
            return;
        }
        const example = exampleAuditors[index];
        setAuditorData(example);
        setAuditorDocumentData(example.document);
    }

    React.useEffect(() => {
        setDocumentTitle("Registrar Novo Auditor");
    }, [setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllAuditors();
    }, [fetchAllAuditors]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={12} textAlign={'center'}>
                        <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                            👮 Registrar Novo Auditor
                        </Typography>
                        <Divider />
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            Preencha o formulário abaixo para registrar um novo auditor na plataforma.
                        </Typography>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Dados do Auditor
                            </Typography>
                            <RegisterForm<AuditorRegisterData>
                                target={auditorData}
                                fields={auditorFields as RegisterFormField<AuditorRegisterData>[]}
                                onChange={handleAuditorChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Documento do Auditor
                            </Typography>
                            <RegisterForm<AuditorDocument>
                                target={auditorDocumentData}
                                fields={documentFields as RegisterFormField<AuditorDocument>[]}
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
                        disabled={(auditors?.length ?? 99) >= exampleAuditors.length}
                    >
                        Preencher Exemplo
                        {auditors && auditors.length < exampleAuditors.length ? ` (${auditors.length + 1}/${exampleAuditors.length})` : ''}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        startIcon={<Icon>send</Icon>}
                    >
                        Registrar Auditor
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default AuditorRegister;
