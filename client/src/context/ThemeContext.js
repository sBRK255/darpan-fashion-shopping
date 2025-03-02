import React, { createContext, useState, useContext } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    const theme = createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    primary: {
                        main: '#1976d2',
                        light: '#42a5f5',
                        dark: '#1565c0',
                    },
                    secondary: {
                        main: '#9c27b0',
                        light: '#ba68c8',
                        dark: '#7b1fa2',
                    },
                    background: {
                        default: '#f5f5f5',
                        paper: '#ffffff',
                    },
                }
                : {
                    primary: {
                        main: '#90caf9',
                        light: '#e3f2fd',
                        dark: '#42a5f5',
                    },
                    secondary: {
                        main: '#ce93d8',
                        light: '#f3e5f5',
                        dark: '#ab47bc',
                    },
                    background: {
                        default: '#121212',
                        paper: '#1e1e1e',
                    },
                }),
        },
    });

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 