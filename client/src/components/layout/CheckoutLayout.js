import React from 'react';
import { Box, Container, Stepper, Step, StepLabel } from '@mui/material';
import { useLocation, Outlet } from 'react-router-dom';

const steps = [
    { label: 'Shipping', path: 'shipping' },
    { label: 'Payment', path: 'payment' },
    { label: 'Review', path: 'review' }
];

const CheckoutLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();
    const activeStep = steps.findIndex(step => step.path === currentPath);

    return (
        <Container maxWidth="lg">
            <Box sx={{ width: '100%', mb: 4 }}>
                <Stepper activeStep={Math.max(0, activeStep)} alternativeLabel>
                    {steps.map((step) => (
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            
            {/* This is where the child routes will be rendered */}
            <Outlet />
        </Container>
    );
};

export default CheckoutLayout; 