import { Box, Container } from '@mui/material'
import React from 'react'
import AppBar from './components/AppBar'
import AppDrawer from './components/AppDrawer'
import MainArea from './components/MainArea'
import AppRoutes from './routes'


const App: React.FC = () => {
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
          <AppRoutes />
        </MainArea>
      </Container>
    </div >
  )
}

export default App
