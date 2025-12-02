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
      label: "Image Scroller",
      icon: "image",
      to: "/scroller",
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
