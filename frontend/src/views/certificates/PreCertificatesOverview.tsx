import { Box, Button, Container, Icon, Paper, Typography } from '@mui/material';
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from '@mui/x-data-grid';
import React from "react";
import { useNavigate } from 'react-router-dom';
import ViewModal from '../../components/ViewModal';
import { useApp } from "../../hooks/useApp";
import { useCertificateContext } from "../../hooks/useCertificate";
import { useCertifierContext } from "../../hooks/useCertifier";
import { useProducerContext } from "../../hooks/useProducer";
import { useProductContext } from "../../hooks/useProduct";
import PreCertificateRegister from './PreCertificateRegister';

const PreCertificatesOverview: React.FC = () => {
    const { certificates, isLoading, fetchAllPreCertificates } = useCertificateContext();
    const { products, isLoading: isLoadingProducts, fetchAllProducts } = useProductContext();
    const { producers, isLoading: isLoadingProducers, fetchAllProducers } = useProducerContext();
    const { certifiers, isLoading: isLoadingCertifiers, fetchAllCertifiers } = useCertifierContext();
    const { setDocumentTitle } = useApp();
    const [showRegisterModal, setShowRegisterModal] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Pré-Certificados");
        setShowRegisterModal(false);
    }, [setDocumentTitle, certificates]);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Pré-Certificados");
    }, [showRegisterModal, setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllPreCertificates();
        void fetchAllProducts();
        void fetchAllProducers();
        void fetchAllCertifiers();
    }, [fetchAllPreCertificates, fetchAllProducts, fetchAllProducers, fetchAllCertifiers]);

    if (isLoading || isLoadingProducts || isLoadingProducers || isLoadingCertifiers) {
        return <div>Loading...</div>;
    }

    const handleOpenRegisterModal = () => {
        setShowRegisterModal(true);
    }

    const handleCloseRegisterModal = () => {
        setShowRegisterModal(false);
    }

    const getProductName = (productId: string) => {
        if (!products) return 'Desconhecido';

        const product = products.find(p => p.id === productId);
        return product ? product.name : 'Desconhecido';
    }

    const getProducerName = (producerId: string) => {
        if (!producers) return 'Desconhecido';

        const producer = producers.find(p => p.id === producerId);
        return producer ? producer.name : 'Desconhecido';
    }

    const getCertifierName = (certifierId: string) => {
        if (!certifiers) return 'Desconhecido';
        const certifier = certifiers.find(c => c.id === certifierId);
        return certifier ? certifier.name : 'Desconhecido';
    }

    const handleEmitCertificate = (preCertificateId: string) => {
        void navigate(`/certificates/issue/${preCertificateId}`);
    }

    const columns: GridColDef[] = [
        { field: 'product_id', headerName: 'Produto', width: 150, valueGetter: (_value, row) => getProductName(row.product_id) },
        { field: 'producer_id', headerName: 'Produtor', width: 200, valueGetter: (_value, row) => getProducerName(row.producer_id) },
        { field: 'certifier_id', headerName: 'Certificadora', width: 200, valueGetter: (_value, row) => getCertifierName(row.certifier_id) },
        { field: 'norms_complied', headerName: 'Normas Cumpridas', width: 200, valueGetter: (_value, row) => row.norms_complied ? row.norms_complied.join(', ') : '' },
        { field: 'sustainability_criteria', headerName: 'Critérios de Sustentabilidade', width: 300, valueGetter: (_value, row) => row.sustainability_criteria ? row.sustainability_criteria.join(', ') : '' },
        { field: 'notes', headerName: 'Notas', width: 250 },
        {
            field: 'actions', headerName: 'Ações', width: 150, renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Icon>send</Icon>}
                    onClick={() => handleEmitCertificate(params.row.id)}
                >
                    Emitir
                </Button>
            )
        },
    ];

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                    🌿 Visão Geral dos Pre-Certificados
                </Typography>
                <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'} alignItems={{ xs: 'stretch', sm: 'center' }} gap={2}>
                    <Typography variant="body1">
                        Total de pre-certificados cadastrados: {certificates ? certificates.length : 0}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={(
                            <Icon>add</Icon>
                        )}
                        onClick={handleOpenRegisterModal}
                    >
                        Cadastrar Novo Pre-Certificado
                    </Button>
                </Box>
                <Box sx={{ width: '100%', overflowX: 'auto', marginTop: 5 }}>
                    <DataGrid
                        sx={{ minWidth: 800 }}
                        rows={certificates || []}
                        columns={columns}
                        autoHeight
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                    />
                </Box>
            </Paper>
            <ViewModal
                open={showRegisterModal}
                onClose={handleCloseRegisterModal}
            >
                <PreCertificateRegister />
            </ViewModal>
        </Container >
    );
}

export default PreCertificatesOverview;
