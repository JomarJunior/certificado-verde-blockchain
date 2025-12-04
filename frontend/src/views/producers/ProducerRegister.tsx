import { Box, Button, Container, Divider, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import { type Coordinates, DOCUMENT_TYPES, type ProducerAddress, type ProducerContact, type ProducerDocument, type ProducerRegisterData } from "../../api/producer-api";
import type { RegisterFormField, ValueType } from "../../components/RegisterForm";
import RegisterForm from "../../components/RegisterForm";
import { useApp } from "../../hooks/useApp";
import { useProducerContext } from "../../hooks/useProducer";

const exampleProducers: ProducerRegisterData[] = [
    {
        "name": "Cooperativa Açaí da Amazônia",
        "document": {
            "document_type": "CNPJ",
            "number": "12.345.678/0001-90"
        },
        "address": {
            "country": "Brasil",
            "state": "Pará",
            "city": "Belém",
            "coordinates": {
                "latitude": -1.4558,
                "longitude": -48.5044
            }
        },
        "car_code": "PA-1234567890123",
        "contact": {
            "phone": "+55 91 98765-4321",
            "email": "contato@acaiamazonia.com",
            "website": "https://www.acaiamazonia.com"
        },
        "metadata": {
            "foundation_year": 2005,
            "certifications": [
                "Orgânico Brasil",
                "Rainforest Alliance"
            ]
        }
    },
    {
        "name": "Castanha do Brasil Sustentável",
        "document": {
            "document_type": "CNPJ",
            "number": "23.456.789/0001-11"
        },
        "address": {
            "country": "Brasil",
            "state": "Amazonas",
            "city": "Manaus",
            "coordinates": {
                "latitude": -3.1190,
                "longitude": -60.0217
            }
        },
        "car_code": "AM-2345678901234",
        "contact": {
            "phone": "+55 92 99876-5432",
            "email": "info@castanhaamazonica.com",
            "website": "https://www.castanhaamazonica.com"
        },
        "metadata": {
            "foundation_year": 2008,
            "certifications": [
                "FSC",
                "Fair Trade"
            ]
        }
    },
    {
        "name": "Produtores de Guaraná Nativo",
        "document": {
            "document_type": "CNPJ",
            "number": "34.567.890/0001-22"
        },
        "address": {
            "country": "Brasil",
            "state": "Amazonas",
            "city": "Maués",
            "coordinates": {
                "latitude": -3.4150,
                "longitude": -57.7183
            }
        },
        "car_code": "AM-3456789012345",
        "contact": {
            "phone": "+55 92 99765-4321",
            "email": "contato@guarananativo.com",
            "website": "https://www.guarananativo.com"
        },
        "metadata": {
            "foundation_year": 2010,
            "certifications": [
                "Denominação de Origem",
                "Orgânico"
            ]
        }
    },
    {
        "name": "Associação Extrativista da Floresta",
        "document": {
            "document_type": "CNPJ",
            "number": "45.678.901/0001-33"
        },
        "address": {
            "country": "Brasil",
            "state": "Acre",
            "city": "Rio Branco",
            "coordinates": {
                "latitude": -9.9747,
                "longitude": -67.8100
            }
        },
        "car_code": "AC-4567890123456",
        "contact": {
            "phone": "+55 68 99654-3210",
            "email": "associacao@extrativistafloresta.com",
            "website": "https://www.extrativistafloresta.com"
        },
        "metadata": {
            "foundation_year": 2012,
            "certifications": [
                "Manejo Florestal Sustentável",
                "FSC"
            ]
        }
    },
    {
        "name": "Cooperativa Frutas da Amazônia",
        "document": {
            "document_type": "CNPJ",
            "number": "56.789.012/0001-44"
        },
        "address": {
            "country": "Brasil",
            "state": "Rondônia",
            "city": "Porto Velho",
            "coordinates": {
                "latitude": -8.7612,
                "longitude": -63.9004
            }
        },
        "car_code": "RO-5678901234567",
        "contact": {
            "phone": "+55 69 99543-2109",
            "email": "frutas@amazoniaverde.com",
            "website": "https://www.frutasdaamazonia.com"
        },
        "metadata": {
            "foundation_year": 2015,
            "certifications": [
                "Agricultura Familiar",
                "Rainforest Alliance"
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
                        disabled={(producers?.length ?? 99) >= exampleProducers.length}
                    >
                        Preencher Exemplo
                        {(producers?.length ?? 99) < exampleProducers.length ? ` (${(producers?.length ?? 99) + 1}/${exampleProducers.length})` : ''}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        startIcon={<Icon>send</Icon>}
                    >
                        Registrar Produtor
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default ProducerRegister;
