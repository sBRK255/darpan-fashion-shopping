import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Language
} from '@mui/icons-material';
import { logout } from '../../slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import SideDrawer from './Drawer';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { mode, toggleTheme } = useTheme();
  const { userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [languageMenu, setLanguageMenu] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setLanguageMenu(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            DARPAN FASHION
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Language Selector */}
            <IconButton
              color="inherit"
              onClick={(e) => setLanguageMenu(e.currentTarget)}
            >
              <Language />
            </IconButton>
            <Menu
              anchorEl={languageMenu}
              open={Boolean(languageMenu)}
              onClose={() => setLanguageMenu(null)}
            >
              <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
              <MenuItem onClick={() => changeLanguage('sw')}>Kiswahili</MenuItem>
            </Menu>

            {/* Theme Toggle */}
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton
              component={RouterLink}
              to="/cart"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={items.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {userInfo ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/orders"
                  sx={{ mr: 1 }}
                >
                  {t('common.orders')}
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                  sx={{ mr: 1 }}
                >
                  {t('common.profile')}
                </Button>
                {userInfo.isAdmin && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin"
                    sx={{ mr: 1 }}
                  >
                    {t('common.admin')}
                  </Button>
                )}
                <Button color="inherit" onClick={handleLogout}>
                  {t('common.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ mr: 1 }}
                >
                  {t('common.login')}
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  {t('common.register')}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <SideDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
    </>
  );
};

export default Header; 