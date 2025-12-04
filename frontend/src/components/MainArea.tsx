import { styled } from '@mui/material/styles';
import React from 'react';
import { useApp } from '../hooks/useApp';
import { getAvailableSpace } from '../utils/layout-utils';

const drawerWidth = import.meta.env.VITE_DRAWER_WIDTH as string ?? '300px';

interface MainAreaProps {
    children: React.ReactNode;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isBigScreen' })<{
    open?: boolean;
    isBigScreen?: boolean;
}>(({ theme, open, isBigScreen }) => ({
    flexGrow: 1,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
        duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
    }),
    minHeight: getAvailableSpace().height,
    padding: 0,
    // On mobile, always full width (temporary drawer overlays)
    [theme.breakpoints.down('sm')]: {
        marginTop: import.meta.env.VITE_APPBAR_HEIGHT as string ?? '64px',
        marginLeft: 0,
        width: '100%',
    },
    // On big screens with persistent drawer
    [theme.breakpoints.up('sm')]: {
        marginLeft: open && isBigScreen ? `${drawerWidth}` : 0,
        width: open && isBigScreen ? `calc(100% - ${drawerWidth})` : '100%',
    },
}));

const MainArea: React.FC<MainAreaProps> = ({
    children
}) => {
    const { isDrawerOpen, isBigScreen } = useApp();

    const marginTop = () => {
        if (isBigScreen) {
            const appBarHeight = import.meta.env.VITE_APPBAR_HEIGHT as string ?? '64px';
            return appBarHeight;
        }
        return 0;
    };

    const marginBottom = () => {
        if (isBigScreen) {
            return 0;
        }

        const appBarHeight = import.meta.env.VITE_APPBAR_HEIGHT as string ?? '64px';
        return appBarHeight;
    };

    return (
        <Main
            open={isDrawerOpen}
            isBigScreen={isBigScreen}
            sx={{
                marginTop: marginTop(),
                paddingBottom: marginBottom(),
            }}
        >
            <br />
            {children}
        </Main>
    );
};

export default MainArea;
