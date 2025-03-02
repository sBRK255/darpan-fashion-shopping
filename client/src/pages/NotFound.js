import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                }}
            >
                <Typography variant="h1" color="primary" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    The page you are looking for doesn't exist or has been moved.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                >
                    Go to Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound; 