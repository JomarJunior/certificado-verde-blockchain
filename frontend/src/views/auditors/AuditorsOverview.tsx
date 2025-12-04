import { Box, Button, Container, Icon, Paper, Typography } from '@mui/material';
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from '@mui/x-data-grid';
import React from "react";
import ViewModal from '../../components/ViewModal';
import { useApp } from "../../hooks/useApp";
import { useAuditorContext } from "../../hooks/useAuditor";
import AuditorRegister from "./AuditorRegister";

const AuditorsOverview: React.FC = () => {
    const { auditors, isLoading, fetchAllAuditors } = useAuditorContext();
    const { setDocumentTitle } = useApp();
    const [showRegisterModal, setShowRegisterModal] = React.useState(false);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Auditores");
        setShowRegisterModal(false);
    }, [setDocumentTitle, auditors]);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Auditores");
    }, [showRegisterModal, setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllAuditors();
    }, [fetchAllAuditors]);

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
    ];

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                    👮 Visão Geral dos Auditores
                </Typography>
                <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'} alignItems={{ xs: 'stretch', sm: 'center' }} gap={2}>
                    <Typography variant="body1">
                        Total de auditores cadastrados: {auditors ? auditors.length : 0}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={(
                            <Icon>add</Icon>
                        )}
                        onClick={handleOpenRegisterModal}
                    >
                        Cadastrar Novo Auditor
                    </Button>
                </Box>
                <Box sx={{ width: '100%', overflowX: 'auto', marginTop: 5 }}>
                    <DataGrid
                        sx={{ minWidth: 400 }}
                        rows={auditors || []}
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
                <AuditorRegister />
            </ViewModal>
        </Container >
    );
}

export default AuditorsOverview;
