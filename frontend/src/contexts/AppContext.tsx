import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import { healthApi, type HealthStatus } from '../api/health-api';
import { AppContext, type AppContextType } from '../hooks/useApp';

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [documentTitle, setDocumentTitle] = useState<string>('');
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => {
        const storedState = localStorage.getItem('isDrawerOpen');
        return storedState !== null ? JSON.parse(storedState) as boolean : false;
    });
    const [isServerHealthy, setIsServerHealthy] = useState<boolean | undefined>(undefined);

    const theme = useTheme();
    const isBigScreen = useMediaQuery(theme.breakpoints.up('sm')); // true if >= 'sm', false on smartphones

    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    // Update document title
    useEffect(() => {
        document.title = documentTitle ? `${documentTitle} — CVB` : 'CVB';
    }, [documentTitle]);

    // Persist drawer state
    useEffect(() => {
        localStorage.setItem('isDrawerOpen', JSON.stringify(isDrawerOpen));
    }, [isDrawerOpen]);

    // Function to fetch server health
    const fetchServerHealth = async (): Promise<HealthStatus> => {
        try {
            const healthStatus = await healthApi.checkHealth();
            setIsServerHealthy(healthStatus.status === 'healthy');
            return healthStatus;
        } catch (error) {
            setIsServerHealthy(false);
            throw error;
        }
    };

    const value = useMemo<AppContextType & { isBigScreen: boolean }>(() => ({
        documentTitle,
        setDocumentTitle,
        isDrawerOpen,
        toggleDrawer,
        isBigScreen,
        fetchServerHealth,
        isServerHealthy,
    }), [documentTitle, isDrawerOpen, isBigScreen, isServerHealthy]);

    return (
        <AppContext value={value}>
            {children}
        </AppContext>
    );
};
