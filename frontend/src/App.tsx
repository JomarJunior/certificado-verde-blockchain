import { Alert, Box, Container, Icon } from '@mui/material'
import React from 'react'
import AppBar from './components/AppBar'
import AppDrawer from './components/AppDrawer'
import MainArea from './components/MainArea'
import { useApp } from './hooks/useApp'
import AppRoutes from './routes'


const App: React.FC = () => {
  const { fetchServerHealth, isServerHealthy } = useApp();

  React.useEffect(() => {
    const checkHealth = async () => {
      void fetchServerHealth();
    };

    // Check health every 5 minutes
    const intervalId = setInterval(() => {
      void fetchServerHealth();
      console.log('Checked server health:', isServerHealthy);
    }, 5 * 60 * 1000);

    // Initial health check on mount
    void checkHealth();

    return () => clearInterval(intervalId);
  }, [fetchServerHealth, isServerHealthy]);

  const drawerItems = [
    {
      label: "Home",
      icon: "home",
      to: "/",
    },
    {
      label: "Produtos",
      icon: "inventory_2",
      children: [
        {
          label: "Listar Produtos",
          icon: "list",
          to: "/products",
        },
      ]
    },
    {
      label: "Produtores",
      icon: "agriculture",
      children: [
        {
          label: "Listar Produtores",
          icon: "list",
          to: "/producers",
        },
      ]
    },
    {
      label: "Auditores",
      icon: "verified_user",
      children: [
        {
          label: "Listar Auditores",
          icon: "list",
          to: "/auditors",
        },
      ]
    },
    {
      label: "Certificadoras",
      icon: "business",
      children: [
        {
          label: "Listar Certificadoras",
          icon: "list",
          to: "/certifiers",
        },
      ]
    },
    {
      label: "Certificados Verdes",
      icon: "eco",
      children: [
        {
          label: "Listar Pré-Certificados",
          icon: "list",
          to: "/certificates/pre-issued",
        },
        {
          label: "Verificar Certificado",
          icon: "verified",
          to: "/certificates/verify",
        },
      ]
    },
  ];

  return (
    <div className="App">
      <Box>
        <AppDrawer items={drawerItems} />
      </Box>
      <AppBar title="Certificado Verde Blockchain" icon="grass" />
      <Container maxWidth="xl" disableGutters>
        <MainArea>
          {isServerHealthy === false && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
              icon={(
                <Icon>warning_amber</Icon>
              )}
            >
              O servidor está indisponível no momento. Algumas funcionalidades podem não estar operacionais.
            </Alert>
          )}
          <AppRoutes />
        </MainArea>
      </Container>
    </div >
  )
}

export default App
