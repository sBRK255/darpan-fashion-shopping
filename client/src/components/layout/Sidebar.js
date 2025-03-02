import React, { useState } from 'react';
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    IconButton,
    Divider
} from '@mui/material';
import {
    Home,
    Category,
    ShoppingCart,
    Person,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Home', icon: <Home />, path: '/' },
        { text: 'Products', icon: <Category />, path: '/products' },
        { text: 'Cart', icon: <ShoppingCart />, path: '/cart' },
        { text: 'Profile', icon: <Person />, path: '/profile' }
    ];

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    return (
        <>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ position: 'fixed', left: 16, top: 16, zIndex: 1100 }}
            >
                <MenuIcon />
            </IconButton>

            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
            >
                <List sx={{ width: 250 }}>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.text}
                            onClick={() => {
                                navigate(item.path);
                                setOpen(false);
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Drawer>
        </>
    );
};

export default Sidebar; 