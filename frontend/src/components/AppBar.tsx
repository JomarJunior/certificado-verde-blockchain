import * as MuiMaterial from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';

const appBarHeight = import.meta.env.VITE_APPBAR_HEIGHT as string ?? '64px';

export default function AppBar({
    title = 'Certificado Verde Blockchain',
    icon = 'park',
}) {
    const { toggleDrawer } = useApp();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        toggleDrawer();
    };

    const handleGoHome = () => {
        void navigate('/');
    }

    return (
        <MuiMaterial.AppBar
            sx={{
                height: appBarHeight,
                justifyContent: 'center',
                position: 'fixed',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <MuiMaterial.Toolbar>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MuiMaterial.IconButton
                            size="large"
                            edge="start"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleDrawerToggle}
                        >
                            <MuiMaterial.Icon>menu</MuiMaterial.Icon>
                        </MuiMaterial.IconButton>
                        <MuiMaterial.Typography
                            variant="h4"
                            sx={{
                                flexGrow: 1,
                                fontWeight: 'bold',
                                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <MuiMaterial.Link onClick={handleGoHome} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <MuiMaterial.Icon sx={{ mr: { xs: 1, sm: 2 }, fontSize: 'inherit', verticalAlign: 'middle' }}>{icon}</MuiMaterial.Icon>
                                <span style={{ display: 'inline-block' }}>{title}</span>
                            </MuiMaterial.Link>
                        </MuiMaterial.Typography>
                    </div>
                </div>

            </MuiMaterial.Toolbar>
        </MuiMaterial.AppBar>
    );
}
