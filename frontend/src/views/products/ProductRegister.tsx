import { Box, Button, Container, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import type { Coordinates, ProductCategory, ProductOrigin, ProductQuantity, ProductRegisterData } from "../../api/product-api";
import { PRODUCT_CATEGORIES, QUANTITY_UNITS } from "../../api/product-api";
import type { RegisterFormField, ValueType } from "../../components/RegisterForm";
import RegisterForm from "../../components/RegisterForm";
import { useApp } from "../../hooks/useApp";
import { useProductContext } from "../../hooks/useProduct";

const validateName = (value: ValueType): string | null => {
    if (typeof value !== 'string') {
        return 'O nome do produto deve ser uma palavra ou texto.'
    }
    if (value.length > 100) {
        return 'O nome do produto não pode exceder 100 caracteres.';
    }
    return null;
}

const validateDescription = (value: ValueType): string | null => {
    if (typeof value !== 'string') {
        return 'A descrição do produto deve ser uma palavra ou texto.'
    }
    if (value.length > 500) {
        return 'A descrição do produto não pode exceder 500 caracteres.';
    }
    return null;
}

const validateCategory = (value: ValueType): string | null => {
    if (typeof value !== 'string') {
        return 'A categoria do produto deve ser uma palavra ou texto.'
    }

    if (!PRODUCT_CATEGORIES.includes(value as ProductCategory)) {
        return `A categoria do produto deve ser uma das seguintes: ${PRODUCT_CATEGORIES.join(', ')}.`;
    }
    return null;
}

const validateQuantityValue = (value: ValueType): string | null => {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'O valor da quantidade deve ser um número.';
    }

    if (value <= 0) {
        return 'O valor da quantidade não pode ser menor ou igual a zero.'
    }
    return null;
}

const validateQuantityUnit = (value: ValueType): string | null => {
    if (typeof value !== 'string') {
        return 'A unidade da quantidade deve ser uma palavra ou texto.'
    }

    if (!QUANTITY_UNITS.includes(value as typeof QUANTITY_UNITS[number])) {
        return `A unidade da quantidade deve ser uma das seguintes: ${QUANTITY_UNITS.join(', ')}.`;
    }
    return null;
}

const example_products: ProductRegisterData[] = [
    {
        name: 'Banana Orgânica',
        description: 'Banana orgânica cultivada sem pesticidas.',
        category: 'FRUIT',
        quantity: { value: 100, unit: 'KG' },
        origin: { country: 'Brasil', coordinates: { latitude: -1.4558, longitude: -48.5044 } },
        lot_number: 'L12345',
        carbon_emission: 12.5,
        tags: ['orgânico', 'comércio justo'],
        metadata: {},
    },
    {
        name: 'Café Arábica',
        description: 'Café arábica de alta qualidade, torrado recentemente.',
        category: 'GRAIN',
        quantity: { value: 50, unit: 'KG' },
        origin: { country: 'Colômbia', coordinates: { latitude: 4.5709, longitude: -74.2973 } },
        lot_number: 'C67890',
        carbon_emission: 8.3,
        tags: ['premium', 'sustentável'],
        metadata: {},
    },
    {
        name: 'Arroz Integral',
        description: 'Arroz integral cultivado em fazendas locais.',
        category: 'GRAIN',
        quantity: { value: 200, unit: 'KG' },
        origin: { country: 'Índia', coordinates: { latitude: 20.5937, longitude: 78.9629 } },
        lot_number: 'R11111',
        carbon_emission: 15.2,
        tags: ['integral', 'local'],
        metadata: {},
    },
    {
        name: 'Mel de Abelha',
        description: 'Mel puro extraído de colmeias orgânicas.',
        category: 'RESOURCE',
        quantity: { value: 20, unit: 'LITERS' },
        origin: { country: 'Argentina', coordinates: { latitude: -38.4161, longitude: -63.6167 } },
        lot_number: 'M22222',
        carbon_emission: 5.7,
        tags: ['orgânico', 'natural'],
        metadata: {},
    },
    {
        name: 'Tomate Cereja',
        description: 'Tomates cereja frescos e suculentos.',
        category: 'FRUIT',
        quantity: { value: 30, unit: 'KG' },
        origin: { country: 'Espanha', coordinates: { latitude: 40.4637, longitude: -3.7492 } },
        lot_number: 'T33333',
        carbon_emission: 9.1,
        tags: ['fresco', 'sazonal'],
        metadata: {},
    }
];

const ProductRegister: React.FC = () => {
    const [productQuantityData, setProductQuantityData] = React.useState<ProductQuantity>({ value: 0, unit: 'KG' });
    const [productOriginCoordinatesData, setProductOriginCoordinatesData] = React.useState<Coordinates>({ latitude: 0, longitude: 0 });
    const [productOriginData, setProductOriginData] = React.useState<ProductOrigin>({ country: '', coordinates: productOriginCoordinatesData });
    const [productData, setProductData] = React.useState<ProductRegisterData>({
        name: '',
        description: '',
        category: 'FRUIT',
        quantity: productQuantityData,
        origin: productOriginData,
        lot_number: '',
        carbon_emission: 0,
        tags: [],
        metadata: {},
    });
    const { setDocumentTitle } = useApp();
    const { registerNewProduct, fetchAllProducts, isLoading } = useProductContext();
    const [productsCount, setProductsCount] = React.useState<number>(0);

    const quantityFields = [
        {
            label: "Quantidade",
            field: "value",
            type: "number",
            required: true,
            defaultValue: 0,
            validation: validateQuantityValue,
            icon: "⚖️",
        },
        {
            label: "Unidade",
            field: "unit",
            type: "select",
            required: true,
            defaultValue: 'KG',
            items: QUANTITY_UNITS.map(unit => ({ label: unit, value: unit })),
            validation: validateQuantityUnit,
            icon: "📏",
        },
    ];

    const originCoordinatesFields = [
        {
            label: "Latitude",
            field: "latitude",
            type: "number",
            required: true,
            icon: "📍",
        },
        {
            label: "Longitude",
            field: "longitude",
            type: "number",
            required: true,
            icon: "📍",
        },
    ];

    const originFields = [
        {
            label: "Country",
            field: "country",
            type: "text",
            required: true,
            placeholder: "Brasil",
            icon: "🌍",
        },
        {
            label: "State",
            field: "state",
            type: "text",
            required: false,
            placeholder: "Belém",
            icon: "🏞️",
        },
        {
            label: "City",
            field: "city",
            type: "text",
            required: false,
            placeholder: "Pará",
            icon: "🏙️",
        },
    ];

    const productFields = [
        {
            label: "Nome do Produto",
            field: "name",
            type: "text",
            required: true,
            placeholder: "Banana Orgânica",
            icon: "🍌",
            validation: validateName,
        },
        {
            label: "Descrição",
            field: "description",
            type: "text",
            required: false,
            placeholder: "Banana orgânica cultivada sem pesticidas.",
            icon: "📝",
            validation: validateDescription,
        },
        {
            label: "Categoria",
            field: "category",
            type: "select",
            required: true,
            defaultValue: 'FRUIT',
            items: PRODUCT_CATEGORIES.map(category => ({ label: category, value: category })),
            icon: "📂",
            validation: validateCategory,
        },
        {
            label: "Número do Lote",
            field: "lot_number",
            type: "text",
            required: false,
            placeholder: "L12345",
            icon: "🔢",
        },
        {
            label: "Emissões de Carbono (kg CO2e)",
            field: "carbon_emission",
            type: "number",
            required: false,
            placeholder: "12.5",
            icon: "🌿"
        },
        {
            label: "Tags",
            field: "tags",
            type: "text",
            required: false,
            placeholder: "orgânico, comércio justo, local",
            icon: "🏷️",
        },
    ];

    const handleQuantityFieldChange = (field: keyof ProductQuantity, value: ValueType) => {
        const updatedQuantity = { ...productQuantityData, [field]: value };
        setProductQuantityData(updatedQuantity);
        setProductData({ ...productData, quantity: updatedQuantity });
    }

    const handleOriginCoordinatesFieldChange = (field: keyof Coordinates, value: ValueType) => {
        const updatedCoordinates = { ...productOriginCoordinatesData, [field]: value };
        setProductOriginCoordinatesData(updatedCoordinates);
        const updatedOrigin = { ...productOriginData, coordinates: updatedCoordinates };
        setProductOriginData(updatedOrigin);
        setProductData({ ...productData, origin: updatedOrigin });
    }

    const handleOriginFieldChange = (field: keyof ProductOrigin, value: ValueType) => {
        const updatedOrigin = { ...productOriginData, [field]: value };
        setProductOriginData(updatedOrigin);
        setProductData({ ...productData, origin: updatedOrigin });
    }

    const handleFieldChange = (field: keyof ProductRegisterData, value: ValueType) => {
        setProductData({ ...productData, [field]: field === 'tags' && typeof value === 'string' ? value.split(',').map(tag => tag.trim()) : value });
    }

    const handleSubmit = async () => {
        try {
            const registeredProduct = await registerNewProduct(productData);
            console.log("Produto registrado com sucesso:", registeredProduct);
        } catch (error) {
            console.error("Erro ao registrar o produto:", error);
        }
    }

    const handleFillExample = () => {
        const index = productsCount;
        if (index >= example_products.length) {
            alert("Todos os exemplos de produtos já foram preenchidos.");
            return;
        }
        const example = example_products[index];
        setProductData(example);
        setProductQuantityData(example.quantity);
        setProductOriginData(example.origin);
        setProductOriginCoordinatesData(example.origin.coordinates);
    }

    React.useEffect(() => {
        setDocumentTitle("Registrar Produto");
    }, [setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllProducts().then(products => {
            setProductsCount(products.length);
        });
    }, [fetchAllProducts]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={12} textAlign={'center'}>
                        <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                            🍌 Registrar Novo Produto
                        </Typography>
                        <Divider />
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            Preencha o formulário abaixo para registrar um novo produto na plataforma.
                        </Typography>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Dados do Produto
                            </Typography>
                            <RegisterForm<ProductRegisterData>
                                target={productData}
                                fields={productFields as RegisterFormField<ProductRegisterData>[]}
                                onChange={handleFieldChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Quantidade do Produto
                            </Typography>
                            <RegisterForm<ProductQuantity>
                                target={productQuantityData}
                                fields={quantityFields as RegisterFormField<ProductQuantity>[]}
                                onChange={handleQuantityFieldChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Origem do Produto
                            </Typography>
                            <RegisterForm<ProductOrigin>
                                target={productOriginData}
                                fields={originFields as RegisterFormField<ProductOrigin>[]}
                                onChange={handleOriginFieldChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Coordenadas da Origem
                            </Typography>
                            <RegisterForm<Coordinates>
                                target={productOriginCoordinatesData}
                                fields={originCoordinatesFields as RegisterFormField<Coordinates>[]}
                                onChange={handleOriginCoordinatesFieldChange}
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
                            disabled={productsCount >= example_products.length}
                        >
                            Preencher Exemplo
                            {productsCount < example_products.length ? ` (${productsCount + 1}/${example_products.length})` : ''}
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
                            Registrar Produto
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProductRegister;
