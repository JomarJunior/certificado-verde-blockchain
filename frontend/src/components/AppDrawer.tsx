import { Box, Divider, Drawer, Icon, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../hooks/useApp";

const drawerWidth = import.meta.env.VITE_DRAWER_WIDTH as string ?? '300px';
const appBarHeight = import.meta.env.VITE_APPBAR_HEIGHT as string ?? '64px';

interface AppDrawerItem {
    label: string;
    icon: string;
    to?: string;
    children?: AppDrawerItem[];
};

interface AppDrawerProps {
    items?: AppDrawerItem[];
}

export default function AppDrawer({
    items
}: AppDrawerProps) {
    const { isDrawerOpen, toggleDrawer, isBigScreen } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (to: string) => {
        void navigate(to);
        // Close drawer on mobile after navigation
        if (!isBigScreen) {
            toggleDrawer();
        }
    }

    const renderDrawerItems = (items: AppDrawerItem[]) => {
        return items.map((item, index) => {

            const itemPath = item.to?.replaceAll('.', '') ?? '';

            if (item.children && item.children.length > 0) {
                return (
                    // eslint-disable-next-line react-x/no-array-index-key
                    <React.Fragment key={index}>
                        <ListItem sx={{ pl: 2 }} disablePadding divider>
                            {item.to ? (
                                <ListItemButton
                                    selected={location.pathname === itemPath}
                                    onClick={() => handleNavigation(item.to!)}
                                >
                                    <ListItemAvatar>
                                        <Icon>{item.icon}</Icon>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'default', py: 1 }}>
                                    <ListItemAvatar>
                                        <Icon>{item.icon}</Icon>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.label} />
                                </Box>
                            )}
                        </ListItem>
                        <Box sx={{ pl: 4 }}>
                            {renderDrawerItems(item.children)}
                        </Box>
                    </React.Fragment>
                );
            }

            return (
                // eslint-disable-next-line react-x/no-array-index-key
                <ListItem key={index} disablePadding>
                    <ListItemButton
                        selected={itemPath ? location.pathname === itemPath : false}
                        onClick={() => item.to && handleNavigation(item.to)}
                    >
                        <ListItemAvatar>
                            <Icon>{item.icon}</Icon>
                        </ListItemAvatar>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                </ListItem>
            );
        });
    };

    return (
        <>
            <Drawer
                anchor="left"
                variant={isBigScreen ? "persistent" : "temporary"}
                open={isDrawerOpen}
                onClose={toggleDrawer}
                sx={{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    }
                }}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
            >
                <Box
                    sx={{
                        width: drawerWidth,
                        marginTop: appBarHeight,
                    }}
                >
                    <Divider />
                    <List>
                        {items && renderDrawerItems(items)}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
