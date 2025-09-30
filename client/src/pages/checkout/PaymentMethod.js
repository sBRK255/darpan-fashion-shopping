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
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { paymentAPI, orderAPI } from '../../services/api';
import { setOrder } from '../../slices/orderSlice';
import { clearCart } from '../../slices/cartSlice';
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
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const order = useSelector(state => state.order.order);
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));

    // Redirect if prerequisites not met
    useEffect(() => {
        if (!items?.length) {
            navigate('/cart');
        }
        if (!shippingAddress) {
            navigate('/checkout/shipping');
        }
    }, [items, shippingAddress, navigate]);
    
    const [selectedMethod, setSelectedMethod] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPhoneDialog, setShowPhoneDialog] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    const paymentMethods = [
        {
            name: 'M-PESA',
            value: 'mpesa',
            logo: '/images/payments/mpesa-logo.png',
            color: '#00AE8D',
            icon: <PhoneIcon />,
            description: 'Pay with M-PESA mobile money via FastLipa',
            network: 'MPESA'
        },
        {
            name: 'Tigo Pesa',
            value: 'tigopesa',
            logo: '/images/payments/tigo-logo.png',
            color: '#0066B1',
            icon: <PhoneIcon />,
            description: 'Pay with Tigo Pesa via FastLipa',
            network: 'TIGO'
        },
        {
            name: 'Airtel Money',
            value: 'airtel',
            logo: '/images/payments/airtel-logo.png',
            color: '#FF0000',
            icon: <PhoneIcon />,
            description: 'Pay with Airtel Money via FastLipa',
            network: 'AIRTEL'
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
        let statusCheckTimeout;

        const checkPaymentStatus = async () => {
            if (!transactionId || !order) return;
            
            try {
                const response = await paymentAPI.getFastLipaStatus(transactionId);
                const status = response.data?.status;
                
                setPaymentStatus(status);

                if (status === 'COMPLETED') {
                    setLoading(false);
                    dispatch(updateOrderStatus({ id: order._id, status: 'paid' }));
                    navigate('/orders/' + order._id);
                } else if (status === 'FAILED') {
                    setLoading(false);
                    setError('Payment failed. Please try again.');
                    setShowPhoneDialog(true);
                } else if (status === 'PENDING' && transactionId) {
                    // Continue checking after 5 seconds if still the same transaction
                    statusCheckTimeout = setTimeout(checkPaymentStatus, 5000);
                }
            } catch (err) {
                console.error('Status Check Error:', err);
                setError('Error checking payment status. Please contact support if payment was deducted.');
                setLoading(false);
            }
        };

        if (transactionId && order) {
            checkPaymentStatus();
        }

        return () => {
            if (statusCheckTimeout) {
                clearTimeout(statusCheckTimeout);
            }
        };
    }, [transactionId, order, dispatch, navigate]);



    const validatePhoneNumber = (number) => {
        // Remove any spaces or special characters
        const cleanNumber = number.replace(/\s+/g, '');
        
        // Check if it starts with 07 (should be 10 digits)
        if (cleanNumber.startsWith('07')) {
            return cleanNumber.length === 10;
        }
        
        // Check if it starts with 255 (should be 12 digits)
        if (cleanNumber.startsWith('255')) {
            return cleanNumber.length === 12;
        }
        
        return false;
    };

    const handlePhoneSubmit = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError('Please enter a valid phone number (07XXXXXXXX or 255XXXXXXXXX)');
            return;
        }

        if (!order) {
            setError('No active order found. Please try again.');
            setLoading(false);
            return;
        }

        setShowPhoneDialog(false);
        setPhoneError('');
        setLoading(true);
        setError('');
        
        try {
            // Clean and format phone number to international format
            const cleanNumber = phoneNumber.replace(/\s+/g, '');
            const formattedPhone = cleanNumber.startsWith('0') 
                ? '255' + cleanNumber.slice(1) 
                : cleanNumber;
            
            const selectedPayment = paymentMethods.find(m => m.value === selectedMethod);
            
            // Initiate FastLipa payment with phone number and network
            const response = await paymentAPI.createFastLipaOrder(order._id, {
                phoneNumber: formattedPhone,
                network: selectedPayment?.network
            });
            
            if (response.data?.transactionId) {
                setTransactionId(response.data.transactionId);
                setPaymentStatus('PENDING');
                // Status check will be handled by the useEffect
            } else {
                throw new Error('No transaction ID received');
            }
            
        } catch (err) {
            console.error('Payment Error:', err);
            setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
            setLoading(false);
            setShowPhoneDialog(true); // Show dialog again on error
        }
    };



    const handleMethodSelect = async (method) => {
        try {
            setLoading(true);
            setError('');

            if (!items?.length || !shippingAddress || !userInfo) {
                setError('Missing cart items or shipping information');
                navigate('/cart');
                return;
            }

            setSelectedMethod(method);
            localStorage.setItem('paymentMethod', method);

            const selectedPayment = paymentMethods.find(m => m.value === method);
            
            if (selectedPayment?.network) {
                // For mobile money payments, show phone dialog first
                setShowPhoneDialog(true);
            } else if (method === 'cod') {
                // For cash on delivery, create order directly
                const orderData = {
                    orderItems: items.map(item => ({
                        product: item.product._id,
                        quantity: item.quantity,
                        size: item.size,
                        name: item.product.name,
                        price: item.product.price,
                        image: item.product.image
                    })),
                    shippingAddress,
                    paymentMethod: method,
                    totalPrice: totalAmount,
                    user: userInfo._id,
                    isPaid: false
                };

                const response = await orderAPI.createOrder(orderData);
                dispatch(setOrder(response.data));
                dispatch(clearCart());
                navigate('/checkout/review');
            }
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process payment method');
            setSelectedMethod('');
        } finally {
            setLoading(false);
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
                        disabled={loading}
                    >
                        Back to Shipping
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<PaymentIcon />}
                        disabled={!selectedMethod || loading || (paymentStatus === 'pending')}
                        onClick={() => {
                            if (selectedMethod === 'cod') {
                                handleMethodSelect('cod');
                            } else {
                                setError('Please complete the payment process first');
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : paymentStatus === 'pending' ? (
                            'Payment Processing...'
                        ) : (
                            'Continue to Review'
                        )}
                    </Button>
                </Box>
            </Paper>

            {/* Phone Number Input Dialog */}
            <Dialog open={showPhoneDialog} onClose={() => setShowPhoneDialog(false)}>
                <DialogTitle>Enter Phone Number</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please enter the phone number you want to use for payment with {
                            paymentMethods.find(m => m.value === selectedMethod)?.name
                        }
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Enter your phone number in one of these formats:
                            <br/>• Starting with 07 (10 digits total): 0712345678
                            <br/>• Starting with 255 (12 digits total): 255712345678
                        </Typography>
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={phoneNumber}
                        onChange={(e) => {
                            // Only allow digits
                            const cleaned = e.target.value.replace(/[^\d]/g, '');
                            setPhoneNumber(cleaned);
                        }}
                        error={!!phoneError}
                        helperText={phoneError}
                        placeholder="e.g., 0712345678"
                        InputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*'
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowPhoneDialog(false);
                        setSelectedMethod('');
                    }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handlePhoneSubmit} 
                        variant="contained"
                        disabled={!phoneNumber}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentMethod; 