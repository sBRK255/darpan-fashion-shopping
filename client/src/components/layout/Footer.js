import React from 'react';
import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import { Instagram, WhatsApp } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                py: 3,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Typography variant="body1">
                        © 2024 Darpan Fashion Shopping. All rights reserved.
                    </Typography>
                    
                    <Stack direction="row" spacing={2}>
                        <IconButton 
                            color="inherit"
                            href="https://instagram.com"
                            target="_blank"
                        >
                            <Instagram />
                        </IconButton>
                        <IconButton 
                            color="inherit"
                            href="https://whatsapp.com"
                            target="_blank"
                        >
                            <WhatsApp />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 