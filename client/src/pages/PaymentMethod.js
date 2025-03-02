import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Box,
    Divider,
    Alert
} from '@mui/material';
import {
    Payment as PaymentIcon,
    Phone as PhoneIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');

    const mobileMoneyProviders = [
        {
            name: 'M-PESA',
            value: 'mpesa',
            logo: '/images/payments/mpesa-logo.png',
            color: '#00A0D1'
        },
        {
            name: 'Tigo Pesa',
            value: 'tigopesa',
            logo: '/images/payments/tigo-logo.png',
            color: '#0066B1'
        },
        {
            name: 'Airtel Money',
            value: 'airtel',
            logo: '/images/payments/airtel-logo.png',
            color: '#FF0000'
        },
        {
            name: 'Halo Pesa',
            value: 'halopesa',
            logo: '/images/payments/halo-logo.png',
            color: '#FFA500'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            setError('Please select a payment method');
            return;
        }
        // Save payment method to local storage or state management
        localStorage.setItem('paymentMethod', paymentMethod);
        navigate('/checkout/review');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Select Payment Method
                </Typography>

                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                        All payments are secure and encrypted through PesaPal
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <Grid container spacing={3}>
                            {mobileMoneyProviders.map((provider) => (
                                <Grid item xs={12} sm={6} key={provider.value}>
                                    <Paper
                                        elevation={paymentMethod === provider.value ? 8 : 1}
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            border: paymentMethod === provider.value ? 
                                                `2px solid ${provider.color}` : '1px solid #ddd',
                                            '&:hover': {
                                                borderColor: provider.color,
                                                transform: 'translateY(-2px)',
                                                transition: 'all 0.3s ease'
                                            }
                                        }}
                                        onClick={() => setPaymentMethod(provider.value)}
                                    >
                                        <FormControlLabel
                                            value={provider.value}
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src={provider.logo}
                                                        alt={provider.name}
                                                        style={{ 
                                                            height: 40, 
                                                            marginRight: 10,
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                    <Typography variant="subtitle1">
                                                        {provider.name}
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ margin: 0 }}
                                        />
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </RadioGroup>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/checkout/shipping')}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            endIcon={<PaymentIcon />}
                            disabled={!paymentMethod}
                        >
                            Continue
                        </Button>
                    </Box>
                </form>

                <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        How it works:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        1. Select your preferred mobile money provider<br />
                        2. You'll be redirected to PesaPal's secure payment page<br />
                        3. Enter your mobile number to receive payment prompt<br />
                        4. Confirm payment on your phone<br />
                        5. Wait for confirmation and receipt
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default PaymentMethod; 