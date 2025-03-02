import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import {
    Dashboard,
    People,
    Inventory,
    ShoppingCart,
    ExitToApp,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
        { text: 'Users', icon: <People />, path: '/admin/users' },
        { text: 'Products', icon: <Inventory />, path: '/admin/products' },
        { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Admin Panel
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Darpan Fashion Admin
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout; 