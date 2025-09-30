import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Paper,
    Typography,
    Grid,
    Button,
    Box,
    Alert,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Tooltip,
    Zoom,
    CircularProgress
} from '@mui/material';
import { paymentAPI } from '../../services/api';
import { updateOrderStatus } from '../../slices/orderSlice';
import {
    Payment as PaymentIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon,
    Phone as PhoneIcon,
    Speed as SpeedIcon,
    LocalShipping as ShippingIcon
} from '@mui/icons-material';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const order = useSelector(state => state.order.order);
    
    const [selectedMethod, setSelectedMethod] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [transactionId, setTransactionId] = useState(null);

    const paymentMethods = [
        {
            name: 'FastLipa Pay',
            value: 'fastlipa',
            logo: '/images/payments/halo-logo.png', // Using default logo, should be updated with FastLipa logo
            color: '#1976D2',
            icon: <PaymentIcon />,
            description: 'Fast and secure payment via FastLipa'
        },
        {
            name: 'M-PESA',
            value: 'mpesa',
            logo: '/images/payments/mpesa-logo.png',
            color: '#00AE8D',
            icon: <PhoneIcon />,
            description: 'Pay directly with M-PESA mobile money'
        },
        {
            name: 'Tigo Pesa',
            value: 'tigopesa',
            logo: '/images/payments/tigo-logo.png',
            color: '#0066B1',
            icon: <PhoneIcon />,
            description: 'Quick payment via Tigo Pesa'
        },
        {
            name: 'Airtel Money',
            value: 'airtel',
            logo: '/images/payments/airtel-logo.png',
            color: '#FF0000',
            icon: <PhoneIcon />,
            description: 'Secure payment with Airtel Money'
        },
        {
            name: 'Cash on Delivery',
            value: 'cod',
            logo: '/images/payments/cod-icon.png',
            color: '#4CAF50',
            icon: <ShippingIcon />,
            description: 'Pay when you receive your order'
        }
    ];

    useEffect(() => {
        let statusCheckInterval;
        if (transactionId) {
            // Check status immediately
            checkPaymentStatus();
            // Then check every 5 seconds
            statusCheckInterval = setInterval(checkPaymentStatus, 5000);
        }
        return () => {
            if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
            }
        };
    }, [transactionId]);

    const checkPaymentStatus = async () => {
        try {
            const response = await paymentAPI.getFastLipaStatus(transactionId);
            const status = response.data.status;
            setPaymentStatus(status);
            
            if (status === 'COMPLETED') {
                dispatch(updateOrderStatus({ id: order._id, status: 'paid' }));
                clearInterval(statusCheckInterval);
                navigate('/orders/' + order._id);
            } else if (status === 'FAILED') {
                setError('Payment failed. Please try again.');
                setLoading(false);
                clearInterval(statusCheckInterval);
            }
        } catch (err) {
            console.error('Error checking payment status:', err);
            setError('Error checking payment status. Please contact support.');
            setLoading(false);
        }
    };

    const handleMethodSelect = async (method) => {
        setSelectedMethod(method);
        localStorage.setItem('paymentMethod', method);

        if (method === 'fastlipa') {
            try {
                setLoading(true);
                setError('');
                
                // Initiate FastLipa payment
                const response = await paymentAPI.createFastLipaOrder(order._id);
                setTransactionId(response.data.transactionId);
                setPaymentStatus('PENDING');
                
                // Open payment URL if provided
                if (response.data.paymentUrl) {
                    window.open(response.data.paymentUrl, '_blank');
                }
            } catch (err) {
                console.error('Error initiating payment:', err);
                setError('Error initiating payment. Please try again.');
                setLoading(false);
            }
        } else {
            navigate('/checkout/review');
        }
    };

    const features = [
        {
            icon: <SecurityIcon fontSize="large" color="primary" />,
            title: 'Secure Payments',
            description: 'All transactions are encrypted and secure'
        },
        {
            icon: <SpeedIcon fontSize="large" color="primary" />,
            title: 'Instant Processing',
            description: 'Quick and real-time payment confirmation'
        },
        {
            icon: <CheckCircleIcon fontSize="large" color="primary" />,
            title: 'Verified by FastLipa',
            description: 'Trusted payment partner for secure transactions'
        }
    ];

    return (
        <Box sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, margin: 'auto' }}>
                {/* Header Section */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Select Payment Method
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Choose your preferred payment option
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {paymentStatus && (
                    <Alert 
                        severity={paymentStatus === 'COMPLETED' ? 'success' : 'info'} 
                        sx={{ mb: 3 }}
                    >
                        {paymentStatus === 'COMPLETED' 
                            ? 'Payment completed successfully!' 
                            : `Payment status: ${paymentStatus}. Please complete the payment in the opened window.`}
                    </Alert>
                )}

                {/* Payment Methods Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {paymentMethods.map((method) => (
                        <Grid item xs={12} sm={6} md={3} key={method.value}>
                            <Tooltip 
                                title={method.description}
                                TransitionComponent={Zoom}
                                arrow
                            >
                                <Card 
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4
                                        },
                                        border: selectedMethod === method.value ? 
                                            `2px solid ${method.color}` : 'none'
                                    }}
                                    onClick={() => handleMethodSelect(method.value)}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            height: 140,
                                            objectFit: 'contain',
                                            p: 2,
                                            bgcolor: 'grey.50'
                                        }}
                                        image={method.logo}
                                        alt={method.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                        <Typography variant="h6" gutterBottom>
                                            {method.name}
                                        </Typography>
                                        <Box 
                                            sx={{ 
                                                color: method.color,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            {method.icon}
                                            <Typography variant="body2">
                                                Pay Now
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Features Section */}
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Box sx={{ 
                                textAlign: 'center',
                                p: 2,
                                height: '100%',
                                bgcolor: 'grey.50',
                                borderRadius: 1
                            }}>
                                <Box sx={{ mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Security Notice */}
                <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography 
                        variant="subtitle2" 
                        gutterBottom 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <SecurityIcon color="primary" />
                        Secure Payment Processing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your payment information is securely processed through FastLipa's 
                        encrypted payment gateway. We never store your payment details.
                    </Typography>
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/checkout/shipping')}
                    >
                        Back to Shipping
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<PaymentIcon />}
                        disabled={!selectedMethod}
                        onClick={() => navigate('/checkout/review')}
                    >
                        Continue to Review
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentMethod; 