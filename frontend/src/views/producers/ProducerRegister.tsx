import { Box, Button, Container, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import { type Coordinates, DOCUMENT_TYPES, type ProducerAddress, type ProducerContact, type ProducerDocument, type ProducerRegisterData } from "../../api/producer-api";
import type { RegisterFormField, ValueType } from "../../components/RegisterForm";
import RegisterForm from "../../components/RegisterForm";
import { useApp } from "../../hooks/useApp";
import { useProducerContext } from "../../hooks/useProducer";

const exampleProducers: ProducerRegisterData[] = [
    {
        "name": "Fazenda Verde Ltda.",
        "document": {
            "document_type": "CNPJ",
            "number": "98.765.432/0001-10"
        },
        "address": {
            "country": "Brasil",
            "state": "São Paulo",
            "city": "São Paulo",
            "coordinates": {
                "latitude": -23.5505,
                "longitude": -46.6333
            }
        },
        "car_code": "9876543210987",
        "contact": {
            "phone": "+55 11 98765-4321",
            "email": "info@verdefazenda.com",
            "website": "https://www.verdefazenda.com"
        },
        "metadata": {
            "foundation_year": 2000,
            "certifications": [
                "Organic Certification",
                "Fair Trade"
            ]
        }
    },
    {
        "name": "Agro Sustentável S.A.",
        "document": {
            "document_type": "CNPJ",
            "number": "11.222.333/0001-44"
        },
        "address": {
            "country": "Brasil",
            "state": "Minas Gerais",
            "city": "Belo Horizonte",
            "coordinates": {
                "latitude": -19.9191,
                "longitude": -43.9386
            }
        },
        "car_code": "1122334455667",
        "contact": {
            "phone": "+55 31 99887-6655",
            "email": "contact@agrosustentavel.com",
            "website": "https://www.agrosustentavel.com"
        },
        "metadata": {
            "foundation_year": 2010,
            "certifications": [
                "UTZ Certified",
                "Biodynamic"
            ]
        }
    },
    {
        "name": "EcoFazenda Brasil",
        "document": {
            "document_type": "CNPJ",
            "number": "55.666.777/0001-88"
        },
        "address": {
            "country": "Brasil",
            "state": "Rio de Janeiro",
            "city": "Rio de Janeiro",
            "coordinates": {
                "latitude": -22.9068,
                "longitude": -43.1729
            }
        },
        "car_code": "5566778899001",
        "contact": {
            "phone": "+55 21 98777-8899",
            "email": "hello@ecofazenda.com",
            "website": "https://www.ecofazenda.com"
        },
        "metadata": {
            "foundation_year": 1998,
            "certifications": [
                "Rainforest Alliance",
                "ISO 22000"
            ]
        }
    },
    {
        "name": "Terra Viva Produtores",
        "document": {
            "document_type": "CNPJ",
            "number": "77.888.999/0001-22"
        },
        "address": {
            "country": "Brasil",
            "state": "Bahia",
            "city": "Salvador",
            "coordinates": {
                "latitude": -12.9714,
                "longitude": -38.5014
            }
        },
        "car_code": "7788990011223",
        "contact": {
            "phone": "+55 71 99666-5544",
            "email": "support@terraviva.com",
            "website": "https://www.terraviva.com"
        },
        "metadata": {
            "foundation_year": 2005,
            "certifications": [
                "4C Association",
                "Organic"
            ]
        }
    },
    {
        "name": "Produtores do Cerrado Ltda.",
        "document": {
            "document_type": "CNPJ",
            "number": "33.444.555/0001-66"
        },
        "address": {
            "country": "Brasil",
            "state": "Goiás",
            "city": "Goiânia",
            "coordinates": {
                "latitude": -16.6869,
                "longitude": -49.2648
            }
        },
        "car_code": "3344556677889",
        "contact": {
            "phone": "+55 62 99555-4433",
            "email": "info@cerradoprodutores.com",
            "website": "https://www.cerradoprodutores.com"
        },
        "metadata": {
            "foundation_year": 2015,
            "certifications": [
                "Sustainable Palm Oil",
                "Fairtrade"
            ]
        }
    }
];

const ProducerRegister: React.FC = () => {
    const [producerDocumentData, setProducerDocumentData] = React.useState<ProducerDocument>({
        document_type: 'CNPJ',
        number: ''
    });
    const [producerContactData, setProducerContactData] = React.useState<ProducerContact>({
        email: '',
        phone: '',
        website: ''
    });
    const [producerAddressCoordinatesData, setProducerAddressCoordinatesData] = React.useState<Coordinates>({
        latitude: 0,
        longitude: 0
    });
    const [producerAddressData, setProducerAddressData] = React.useState<ProducerAddress>({
        country: '',
        state: '',
        city: '',
        coordinates: producerAddressCoordinatesData
    });
    const [producerData, setProducerData] = React.useState<ProducerRegisterData>({
        name: '',
        document: producerDocumentData,
        address: producerAddressData,
        contact: producerContactData,
        car_code: '',
        metadata: {}
    });
    const { setDocumentTitle } = useApp();
    const { registerNewProducer, fetchAllProducers, isLoading, producers } = useProducerContext();

    const documentFields: RegisterFormField<ProducerDocument>[] = [
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
            placeholder: '72.366.190/0001-05',
            type: 'text',
            required: true,
            icon: '🔢',
        }
    ];

    const contactFields: RegisterFormField<ProducerContact>[] = [
        {
            label: 'Email',
            field: 'email',
            type: 'text',
            placeholder: 'acai.belem@gmail.com',
            required: false,
            icon: '📧',
        },
        {
            label: 'Telefone',
            field: 'phone',
            type: 'text',
            placeholder: '+55 91 91234-5678',
            required: false,
            icon: '📞',
        },
        {
            label: 'Website',
            field: 'website',
            placeholder: 'https://www.acaitropical.com',
            type: 'text',
            required: false,
            icon: '🌐',
        }
    ];

    const addressCoordinatesFields: RegisterFormField<Coordinates>[] = [
        {
            label: 'Latitude',
            field: 'latitude',
            type: 'number',
            required: true,
            icon: '📍',
        },
        {
            label: 'Longitude',
            field: 'longitude',
            type: 'number',
            required: true,
            icon: '📍',
        }
    ];

    const addressFields: RegisterFormField<ProducerAddress>[] = [
        {
            label: 'País',
            field: 'country',
            type: 'text',
            placeholder: 'Brasil',
            required: true,
            icon: '🌍',
        },
        {
            label: 'Estado',
            field: 'state',
            type: 'text',
            placeholder: 'Pará',
            required: false,
            icon: '🏞️',
        },
        {
            label: 'Cidade',
            field: 'city',
            type: 'text',
            placeholder: 'Belém',
            required: false,
            icon: '🏙️',
        },
    ];

    const producerFields: RegisterFormField<ProducerRegisterData>[] = [
        {
            label: 'Nome do Produtor',
            field: 'name',
            type: 'text',
            placeholder: 'Fazenda Exemplo Ltda.',
            required: true,
            icon: '👨‍🌾',
        },
        {
            label: 'CAR Code',
            field: 'car_code',
            type: 'text',
            placeholder: 'PA-1235487-JASDVASCODAGAMAHLNAUJABAI',
            required: false,
            icon: '🌳',
        },
    ];

    const handleDocumentFieldChange = (field: keyof ProducerDocument, value: ValueType) => {
        const updatedDocumentData = {
            ...producerDocumentData,
            [field]: value,
        };
        setProducerDocumentData(updatedDocumentData);
        setProducerData({
            ...producerData,
            document: updatedDocumentData,
        });
    }

    const handleContactFieldChange = (field: keyof ProducerContact, value: ValueType) => {
        const updatedContactData = {
            ...producerContactData,
            [field]: value,
        };
        setProducerContactData(updatedContactData);
        setProducerData({
            ...producerData,
            contact: updatedContactData,
        });
    }

    const handleAddressCoordinatesFieldChange = (field: keyof Coordinates, value: ValueType) => {
        const updatedCoordinatesData = {
            ...producerAddressCoordinatesData,
            [field]: value,
        };
        setProducerAddressCoordinatesData(updatedCoordinatesData);
        const updatedAddressData = {
            ...producerAddressData,
            coordinates: updatedCoordinatesData,
        };
        setProducerAddressData(updatedAddressData);
        setProducerData({
            ...producerData,
            address: updatedAddressData,
        });
    }

    const handleAddressFieldChange = (field: keyof ProducerAddress, value: ValueType) => {
        const updatedAddressData = {
            ...producerAddressData,
            [field]: value,
        };
        setProducerAddressData(updatedAddressData);
        setProducerData({
            ...producerData,
            address: updatedAddressData,
        });
    }

    const handleProducerFieldChange = (field: keyof ProducerRegisterData, value: ValueType) => {
        const updatedProducerData = {
            ...producerData,
            [field]: value,
        };
        setProducerData(updatedProducerData);
    }

    const handleSubmit = async () => {
        try {
            const registeredProducer = await registerNewProducer(producerData);
            console.log('Produtor cadastrado com sucesso:', registeredProducer);
        } catch (error) {
            console.error('Erro ao cadastrar produtor:', error);
        }
    }

    const handleFillExample = () => {
        const index = producers?.length ?? 99;
        if (index >= exampleProducers.length) {
            alert('Todos os exemplos de produtores já foram preenchidos.');
            return;
        }

        const example = exampleProducers[index];
        setProducerDocumentData(example.document);
        setProducerContactData(example.contact);
        setProducerAddressCoordinatesData(example.address.coordinates);
        setProducerAddressData(example.address);
        setProducerData(example);
    }

    React.useEffect(() => {
        setDocumentTitle("Cadastro de Produtor");
    }, [setDocumentTitle]);

    React.useEffect(() => {
        void fetchAllProducers();
    }, [fetchAllProducers]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={12} textAlign={'center'}>
                        <Typography variant="h4" component="h1" gutterBottom fontFamily={'bungee'}>
                            👨‍🌾 Registrar Novo Produtor
                        </Typography>
                        <Divider />
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            Preencha o formulário abaixo para registrar um novo produtor na plataforma.
                        </Typography>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Dados do Produtor
                            </Typography>
                            <RegisterForm<ProducerRegisterData>
                                target={producerData}
                                fields={producerFields as RegisterFormField<ProducerRegisterData>[]}
                                onChange={handleProducerFieldChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={6} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Documento do Produtor
                            </Typography>
                            <RegisterForm<ProducerDocument>
                                target={producerDocumentData}
                                fields={documentFields as RegisterFormField<ProducerDocument>[]}
                                onChange={handleDocumentFieldChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={4} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Endereço do Produto
                            </Typography>
                            <RegisterForm<ProducerAddress>
                                target={producerAddressData}
                                fields={addressFields as RegisterFormField<ProducerAddress>[]}
                                onChange={handleAddressFieldChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={3} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Coordenadas da Propriedade
                            </Typography>
                            <RegisterForm<Coordinates>
                                target={producerAddressCoordinatesData}
                                fields={addressCoordinatesFields as RegisterFormField<Coordinates>[]}
                                onChange={handleAddressCoordinatesFieldChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size={5} textAlign={'start'}>
                        <Box fontSize={24} fontWeight="bold" mb={2}>
                            <Typography fontFamily={'bungee'}>
                                Contato do Produtor
                            </Typography>
                            <RegisterForm<ProducerContact>
                                target={producerContactData}
                                fields={contactFields as RegisterFormField<ProducerContact>[]}
                                onChange={handleContactFieldChange}
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
                            disabled={(producers?.length ?? 99) >= exampleProducers.length}
                        >
                            Preencher Exemplo
                            {(producers?.length ?? 99) < exampleProducers.length ? ` (${(producers?.length ?? 99) + 1}/${exampleProducers.length})` : ''}
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
                            Registrar Produtor
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default ProducerRegister;
