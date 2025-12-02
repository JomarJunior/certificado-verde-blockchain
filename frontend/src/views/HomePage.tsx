import { Box, Button, Container, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useApp } from '../hooks/useApp';
import defaultTheme from '../themes/default';

const HomePage: React.FC = () => {
    const { setDocumentTitle } = useApp();
    const navigate = useNavigate();

    React.useEffect(() => {
        setDocumentTitle("Home");
    }, [setDocumentTitle]);

    const handleNavigation = (to: string) => {
        void navigate(to);
    }

    const homeNavigationItems = [
        {
            label: "🍌 Produtos",
            buttons: [
                {
                    label: "Listar",
                    icon: "list",
                    to: "/products",
                },
            ]
        },
        {
            label: "👨‍🌾 Produtores",
            buttons: [
                {
                    label: "Listar",
                    icon: "list",
                    to: "/producers",
                },
            ]
        },
        {
            label: "👮 Auditores",
            buttons: [
                {
                    label: "Listar",
                    icon: "list",
                    to: "/auditors",
                },
            ]
        },
        {
            label: "🏤 Certificadoras",
            buttons: [
                {
                    label: "Listar",
                    icon: "list",
                    to: "/certifiers",
                },
            ]
        },
        {
            label: "🌿 Certificados Verdes",
            buttons: [
                {
                    label: "Listar Pre-Certificados",
                    icon: "list",
                    to: "/certificates/pre-issued",
                },
                {
                    label: "Verificar",
                    icon: "verified",
                    to: "/certificates/verify",
                },
            ]
        }
    ];

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Grid container spacing={3}>
                    <Grid size={12} textAlign={'center'}>
                        <Typography
                            fontFamily={'bungee'}
                            fontSize={'72pt'}
                            variant="h2"
                            component="h1"
                            gutterBottom
                        >
                            Bem Vindo (a)
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid size={3} justifyContent={'center'} alignContent={'end'}>
                        <Typography
                            fontFamily={'bungee'}
                            fontSize={'128pt'}
                            variant="h1"
                            component="h1"
                            gutterBottom
                        >
                            🌱
                        </Typography>
                    </Grid>
                    <Grid size={9}>
                        <Typography
                            fontFamily={'bungee'}
                            fontSize={'72pt'}
                            variant="h4"
                            component="h1"
                            gutterBottom
                        >
                            Certificado <span style={{ color: defaultTheme.palette.success.main }}>Verde</span> Blockchain
                        </Typography>
                    </Grid>
                    <Typography className={"fira-mono-regular"} variant="body1">
                        Aqui você pode gerenciar seus certificados verdes de forma segura e transparente utilizando a tecnologia blockchain. Navegue pelo menu para explorar as funcionalidades disponíveis.
                    </Typography>
                </Grid>
                <Grid container spacing={3} justifyContent={'center'} alignItems={'start'} textAlign={'center'}>
                    {homeNavigationItems.map((section) => (
                        <Grid
                            key={section.label}
                            size={3}
                            sx={{ mt: 4 }}
                            flexGrow={1}
                        >
                            <Typography
                                fontFamily={'bungee'}
                                fontSize={'18pt'}
                                variant="h5"
                                component="h2"
                                gutterBottom
                            >
                                {section.label}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                                {section.buttons.map((button) => (
                                    <Button
                                        key={button.label}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<span className="material-icons">{button.icon}</span>}
                                        onClick={() => handleNavigation(button.to)}
                                    >
                                        {button.label}
                                    </Button>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    )
}

export default HomePage
