import { Box, Button, Container, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import { NORMS, SUSTAINABILITY_CRITERIA, type CertificateRegisterData } from "../../api/certificate-api";
import type { RegisterFormField, ValueType } from "../../components/RegisterForm";
import RegisterForm from "../../components/RegisterForm";
import { useApp } from "../../hooks/useApp";
import { useCertificateContext } from "../../hooks/useCertificate";
import { useCertifierContext } from "../../hooks/useCertifier";
import { useProducerContext } from "../../hooks/useProducer";
import { useProductContext } from "../../hooks/useProduct";

const exampleCertificates: CertificateRegisterData[] = [
    {
        version: "1.0",
        product_id: "",
        producer_id: "",
        certifier_id: "",
        norms_complied: ["ISO 14001", "FSC"],
        sustainability_criteria: ["Organic", "Complete Traceability"],
        notes: "Certificado para produção orgânica dos produto com rastreabilidade completa.",
    },
    {
        version: "1.1",
        product_id: "",
        producer_id: "",
        certifier_id: "",
        norms_complied: ["Rainforest Alliance", "LEED"],
        sustainability_criteria: ["Legal Origin", "Biodiversity Maintenance"],
        notes: "Certificado para produtos extrativos com manutenção da biodiversidade e origem legal comprovada.",
    },
    {
        version: "1.0",
        product_id: "",
        producer_id: "",
        certifier_id: "",
        norms_complied: ["IDB.org", "Other"],
        sustainability_criteria: ["Exploitation Limits", "Other"],
        notes: "Certificado para produtos com limites de exploração definidos.",
    },
    {
        version: "1.2",
        product_id: "",
        producer_id: "",
        certifier_id: "",
        norms_complied: ["FSC", "Other"],
        sustainability_criteria: ["Exploitation Limits", "Valid Environmental License"],
        notes: "Certificado para produtos que respeitam os limites de exploração e possuem licença ambiental válida.",
    },
    {
        version: "1.0",
        product_id: "",
        producer_id: "",
        certifier_id: "",
        norms_complied: ["Rainforest Alliance", "LEED"],
        sustainability_criteria: ["Organic", "Other"],
        notes: "Certificado para produtos orgânicos certificados por normas internacionais.",
    }
]

const PreCertificateRegister: React.FC = () => {
    const [preCertificateData, setPreCertificateData] = React.useState<CertificateRegisterData>({
        version: "",
        product_id: "",
        producer_id: "",
        certifier_id: "",
        norms_complied: [],
        sustainability_criteria: [],
        notes: "",
    });
    const { setDocumentTitle } = useApp();
    const { registerNewPreCertificate, fetchAllPreCertificates, isLoading, certificates } = useCertificateContext();
    const { products, isLoading: isLoadingProducts, fetchAllProducts } = useProductContext();
    const { producers, isLoading: isLoadingProducers, fetchAllProducers } = useProducerContext();
    const { certifiers, isLoading: isLoadingCertifiers, fetchAllCertifiers } = useCertifierContext();

    const certificateFields: RegisterFormField<CertificateRegisterData>[] = [
        {
            label: 'Versão do Certificado',
            field: 'version',
            placeholder: '1.0',
            type: 'text',
            required: true,
            icon: '📄',
        },
        {
            label: 'Produto',
            field: 'product_id',
            type: 'select',
            items: products ? products.map((product) => ({ label: product.name, value: product.id })) : [],
            required: true,
            icon: '🍌',
        },
        {
            label: 'Produtor',
            field: 'producer_id',
            type: 'select',
            items: producers ? producers.map((producer) => ({ label: producer.name, value: producer.id })) : [],
            required: true,
            icon: '👩‍🌾',
        },
        {
            label: 'Certificadora',
            field: 'certifier_id',
            type: 'select',
            items: certifiers ? certifiers.map((certifier) => ({ label: certifier.name, value: certifier.id })) : [],
            required: true,
            icon: '🏤',
        },
        {
            label: 'Normas Cumpridas',
            field: 'norms_complied',
            type: 'select',
            multiple: true,
            items: NORMS.map((norm) => ({ label: norm, value: norm })),
            required: true,
            icon: '✅',
        },
        {
            label: 'Critérios de Sustentabilidade',
            field: 'sustainability_criteria',
            type: 'select',
            multiple: true,
            items: SUSTAINABILITY_CRITERIA.map((criterion) => ({ label: criterion, value: criterion })),
            required: true,
            icon: '🌱',
        },
        {
            label: 'Notas Adicionais',
            field: 'notes',
            placeholder: 'Este certificado atesta que...',
            type: 'textarea',
            required: false,
            icon: '📝',
        },
    ];

    const handleFieldChange = (field: keyof CertificateRegisterData, value: ValueType) => {
        const updatedData = { ...preCertificateData, [field]: value };
        setPreCertificateData(updatedData);
    }

    const handleSubmit = async () => {
        try {
            const registeredPreCertificate = await registerNewPreCertificate(preCertificateData);
            console.log('Pré-certificado registrado com sucesso:', registeredPreCertificate);
        } catch (error) {
            console.error('Erro ao registrar pré-certificado:', error);
        }
    }

    const handleFillExample = () => {
        const index = certificates ? certificates.length % exampleCertificates.length : 99;
        if (index >= exampleCertificates.length) {
            alert('Não há exemplos suficientes para preencher o formulário.');
            return;
        }

        let example = exampleCertificates[index];

        const selectedProduct = products ? products[index % products.length] : null;
        const selectedProducer = producers ? producers[index % producers.length] : null;
        const selectedCertifier = certifiers ? certifiers[index % certifiers.length] : null;

        if (selectedProduct) {
            example.product_id = selectedProduct.id;
        }

        if (selectedProducer) {
            example.producer_id = selectedProducer.id;
        }

        if (selectedCertifier) {
            example.certifier_id = selectedCertifier.id;
        }

        example = {
            ...example,
            product_id: selectedProduct ? selectedProduct.id : "",
            producer_id: selectedProducer ? selectedProducer.id : "",
            certifier_id: selectedCertifier ? selectedCertifier.id : "",
        }


        setPreCertificateData(example);
    }

    React.useEffect(() => {
        setDocumentTitle('Registrar Pré-Certificado');
    }, [setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllProducts();
        void fetchAllProducers();
        void fetchAllCertifiers();
        void fetchAllPreCertificates();
    }, [fetchAllProducts, fetchAllProducers, fetchAllCertifiers, fetchAllPreCertificates]);

    if (isLoading || isLoadingProducts || isLoadingProducers || isLoadingCertifiers || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={12} textAlign={'center'}>
                        <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                            🌿 Pre-registrar Novo Certificado
                        </Typography>
                        <Divider />
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            Preencha o formulário abaixo para pre-registrar um novo certificado na plataforma.
                        </Typography>
                    </Grid>
                    <Grid size={12} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Dados do Certificado
                            </Typography>
                            <RegisterForm<CertificateRegisterData>
                                target={preCertificateData}
                                fields={certificateFields as RegisterFormField<CertificateRegisterData>[]}
                                onChange={handleFieldChange}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Divider sx={{ marginY: 4 }} />
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Box sx={{ marginLeft: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleFillExample}
                            sx={{ marginLeft: 2 }}
                            startIcon={<Icon>auto_fix_high</Icon>}
                            disabled={(certificates?.length ?? 99) >= exampleCertificates.length}
                        >
                            Preencher Exemplo
                            {certificates && certificates.length < exampleCertificates.length ? ` (${certificates.length + 1}/${exampleCertificates.length})` : ''}
                        </Button>
                    </Box>
                    <Box sx={{ marginRight: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ marginX: "auto" }}
                            startIcon={<Icon>send</Icon>}
                        >
                            Pre-Registrar Certificado
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default PreCertificateRegister;
