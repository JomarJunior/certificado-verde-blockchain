import { Box, Button, Container, Icon, Paper, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import ViewModal from '../../components/ViewModal';
import { useApp } from '../../hooks/useApp';
import { useProductContext } from '../../hooks/useProduct';
import ProductRegister from './ProductRegister';

const ProductsOverview: React.FC = () => {
    const { products, isLoading, fetchAllProducts } = useProductContext();
    const { setDocumentTitle } = useApp();
    const [showRegisterModal, setShowRegisterModal] = React.useState(false);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Produtos");
        setShowRegisterModal(false);
    }, [setDocumentTitle, products]);

    React.useEffect(() => {
        setDocumentTitle("Visão Geral dos Produtos");
    }, [showRegisterModal, setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllProducts();
    }, [fetchAllProducts]);

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
        { field: 'category', headerName: 'Categoria', width: 150 },
        { field: 'quantity', headerName: 'Quantidade', width: 150, valueGetter: (_value, row) => `${row.quantity.value} ${row.quantity.unit}` },
        { field: 'origin', headerName: 'Origem', width: 250, valueGetter: (_value, row) => `${row.origin.city || ''}, ${row.origin.state || ''}. ${row.origin.country}`.trim() },
        { field: 'lot_number', headerName: 'Número do Lote', width: 150 },
        { field: 'carbon_emission', headerName: 'Emissões de Carbono (kg CO2e)', width: 280 },
        { field: 'tags', headerName: 'Tags', valueGetter: (_value, row) => row.tags ? row.tags.join(', ') : '', width: 250 },
    ];

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                    🍌 Visão Geral dos Produtos
                </Typography>
                <Box display={'flex'} flexWrap={'wrap'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1">
                        Total de produtos cadastrados: {products ? products.length : 0}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        startIcon={(
                            <Icon>add</Icon>
                        )}
                        onClick={handleOpenRegisterModal}
                    >
                        Cadastrar Novo Produto
                    </Button>
                </Box>
                <DataGrid
                    sx={{ marginTop: 5 }}
                    rows={products || []}
                    columns={columns}
                />
            </Paper>
            <ViewModal
                open={showRegisterModal}
                onClose={handleCloseRegisterModal}
            >
                <ProductRegister />
            </ViewModal>
        </Container >
    );
};

export default ProductsOverview;
