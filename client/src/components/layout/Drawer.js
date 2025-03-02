import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box
} from '@mui/material';
import {
    Home,
    ShoppingBag,
    ShoppingCart,
    Person,
    Receipt,
    Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SideDrawer = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);

    const menuItems = [
        { text: 'Home', icon: <Home />, path: '/' },
        { text: 'Products', icon: <ShoppingBag />, path: '/products' },
        { text: 'Cart', icon: <ShoppingCart />, path: '/cart' },
    ];

    const authenticatedMenuItems = [
        { text: 'Profile', icon: <Person />, path: '/profile' },
        { text: 'Orders', icon: <Receipt />, path: '/orders' },
    ];

    const adminMenuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 250 }} role="presentation">
                <List>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.text}
                            onClick={() => handleNavigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                {userInfo && (
                    <>
                        <Divider />
                        <List>
                            {authenticatedMenuItems.map((item) => (
                                <ListItem 
                                    button 
                                    key={item.text}
                                    onClick={() => handleNavigate(item.path)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
                {userInfo?.isAdmin && (
                    <>
                        <Divider />
                        <List>
                            {adminMenuItems.map((item) => (
                                <ListItem 
                                    button 
                                    key={item.text}
                                    onClick={() => handleNavigate(item.path)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default SideDrawer; 