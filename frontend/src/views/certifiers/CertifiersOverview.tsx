import { Box, Button, Container, Icon, Paper, Typography } from '@mui/material';
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from '@mui/x-data-grid';
import React from "react";
import type { Auditor } from '../../api/auditor-api';
import ViewModal from '../../components/ViewModal';
import { useApp } from "../../hooks/useApp";
import { useCertifierContext } from "../../hooks/useCertifier";
import CertifierRegister from "./CertifierRegister";

const CertifiersOverview: React.FC = () => {
    const { certifiers, isLoading, fetchAllCertifiers } = useCertifierContext();
    const { setDocumentTitle } = useApp();
    const [showRegisterModal, setShowRegisterModal] = React.useState(false);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Certificadores");
        setShowRegisterModal(false);
    }, [setDocumentTitle, certifiers]);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Certificadores");
    }, [showRegisterModal, setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllCertifiers();
    }, [fetchAllCertifiers]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleOpenRegisterModal = () => {
        setShowRegisterModal(true);
    }

    const handleCloseRegisterModal = () => {
        setShowRegisterModal(false);
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nome', width: 200 },
        { field: 'document', headerName: 'Documento', width: 200, valueGetter: (_value, row) => `${row.document.document_type}: ${row.document.number}` },
        { field: 'auditors', headerName: 'Auditores Associados', width: 700, valueGetter: (_value, row) => row.auditors ? row.auditors.map((auditor: Auditor) => `${auditor.name}/${auditor.document.document_type}: ${auditor.document.number}`).join(', ') : '' },
    ];

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                    🏤 Visão Geral das Certificadoras
                </Typography>
                <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'} alignItems={{ xs: 'stretch', sm: 'center' }} gap={2}>
                    <Typography variant="body1">
                        Total de certificadoras cadastrados: {certifiers ? certifiers.length : 0}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={(
                            <Icon>add</Icon>
                        )}
                        onClick={handleOpenRegisterModal}
                        fullWidth={{ xs: true, sm: false }}
                    >
                        Cadastrar Nova Certificadora
                    </Button>
                </Box>
                <Box sx={{ width: '100%', overflowX: 'auto', marginTop: 5 }}>
                    <DataGrid
                        sx={{ minWidth: 650 }}
                        rows={certifiers || []}
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
                <CertifierRegister />
            </ViewModal>
        </Container >
    );
}

export default CertifiersOverview;
