import { createContext, use } from 'react';

import type { HealthStatus } from '../api/health-api';
export interface AppContextType {
    documentTitle: string;
    isDrawerOpen: boolean;
    isBigScreen: boolean;
    isServerHealthy?: boolean;
    setDocumentTitle: (title: string) => void;
    toggleDrawer: () => void;
    fetchServerHealth: () => Promise<HealthStatus>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
    const context = use(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
