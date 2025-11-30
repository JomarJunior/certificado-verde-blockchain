import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './assets/styles/main.css'
import { AppProvider } from './contexts/AppContext.tsx'
import { AuditorProvider } from './contexts/AuditorContext.tsx'
import { CertificateProvider } from './contexts/CertificateContext.tsx'
import { CertifierProvider } from './contexts/CertifierContext.tsx'
import { ProducerProvider } from './contexts/ProducerContext.tsx'
import { ProductProvider } from './contexts/ProductContext.tsx'
import defaultTheme from './themes/default.ts'

// const keycloakConfig = {
//   url: import.meta.env.VITE_KEYCLOAK_URL as string,
//   realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
//   clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string,
// }

const basename = "certificado-verde-blockchain";

// const initOptions = {
//   onLoad: 'check-sso',
//   silentCheckSsoRedirectUri: `${window.location.origin}${basename}/silent-check-sso.html`,
// } as const;

// const onTokensCallback = ({ token }: { token: string | null }) => {
//   localStorage.setItem('token', token ?? '');

//   setupInterceptors(
//     () => localStorage.getItem('token'),
//     async () => Promise.resolve(false), // Implement token refresh logic if needed
//   );
// }

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename}>
    <StrictMode>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppProvider>
          <ProducerProvider>
            <CertifierProvider>
              <CertificateProvider>
                <AuditorProvider>
                  <ProductProvider>
                    <App />
                  </ProductProvider>
                </AuditorProvider>
              </CertificateProvider>
            </CertifierProvider>
          </ProducerProvider>
        </AppProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
);
