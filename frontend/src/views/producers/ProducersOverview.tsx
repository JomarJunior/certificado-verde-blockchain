import { Box, Button, Container, Icon, Paper, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import React from "react";
import ViewModal from '../../components/ViewModal';
import { useApp } from '../../hooks/useApp';
import { useProducerContext } from '../../hooks/useProducer';
import ProducerRegister from "./ProducerRegister";

const ProducersOverview: React.FC = () => {
    const { producers, isLoading, fetchAllProducers } = useProducerContext();
    const { setDocumentTitle } = useApp();
    const [showRegisterModal, setShowRegisterModal] = React.useState(false);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Produtores");
        setShowRegisterModal(false);
    }, [setDocumentTitle, producers]);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Produtores");
    }, [showRegisterModal, setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllProducers();
    }, [fetchAllProducers]);

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
        { field: 'address', headerName: 'Endereço', width: 300, valueGetter: (_value, row) => `${row.address.city || ''}, ${row.address.state || ''}. ${row.address.country}`.trim() },
        { field: 'car_code', headerName: 'Código CAR', width: 200 },
        {
            field: 'contact', headerName: 'Contato', width: 500, valueGetter: (_value, row) => {
                const contacts = [];
                if (row.contact.email) contacts.push(`Email: ${row.contact.email}`);
                if (row.contact.phone) contacts.push(`Telefone: ${row.contact.phone}`);
                if (row.contact.website) contacts.push(`Website: ${row.contact.website}`);
                return contacts.join(' | ');
            }
        },
    ];

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                    👨‍🌾 Visão Geral dos Produtores
                </Typography>
                <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'} alignItems={{ xs: 'stretch', sm: 'center' }} gap={2}>
                    <Typography variant="body1">
                        Total de produtores cadastrados: {producers ? producers.length : 0}
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
                        Cadastrar Novo Produtor
                    </Button>
                </Box>
                <Box sx={{ width: '100%', overflowX: 'auto', marginTop: 5 }}>
                    <DataGrid
                        sx={{ minWidth: 650 }}
                        rows={producers || []}
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
                <ProducerRegister />
            </ViewModal>
        </Container >
    );
}

export default ProducersOverview;
