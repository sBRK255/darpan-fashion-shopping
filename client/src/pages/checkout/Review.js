import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Paper,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    Button,
    Box,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { formatPrice } from '../../utils/formatPrice';
import { clearCart } from '../../slices/cartSlice';
import { orderAPI } from '../../services/api';
import { paymentAPI } from '../../services/api';

const Review = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { items, totalAmount } = useSelector(state => state.cart);
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    const paymentMethod = localStorage.getItem('paymentMethod');

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const orderData = {
                orderItems: items.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.images[0],
                    size: item.size
                })),
                shippingAddress,
                paymentMethod,
                totalPrice: totalAmount
            };

            const { data } = await orderAPI.createOrder(orderData);
            
            // Clear cart after successful order creation
            dispatch(clearCart());
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('paymentMethod');

            if (paymentMethod === 'zenopay') {
                try {
                    const { data } = await paymentAPI.createZenoPayOrder(data._id);
                    window.location.href = data.paymentUrl;
                    return;
                } catch (err) {
                    setError('Payment processing failed. Please try again.');
                    return;
                }
            }

            // Navigate to order details for COD
            navigate(`/order/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Alert severity="warning">
                Your cart is empty. <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            </Alert>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Order Summary
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <List>
                        {items.map((item) => (
                            <ListItem key={item.product._id}>
                                <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.name}
                                    style={{ width: 50, height: 50, marginRight: 16, objectFit: 'cover' }}
                                />
                                <ListItemText
                                    primary={item.product.name}
                                    secondary={`Size: ${item.size} | Quantity: ${item.quantity}`}
                                />
                                <Typography variant="body1">
                                    {formatPrice(item.product.price * item.quantity)}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Details
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Shipping Address:</Typography>
                            <Typography variant="body2">
                                {shippingAddress.address}<br />
                                {shippingAddress.city}, {shippingAddress.postalCode}<br />
                                {shippingAddress.country}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Payment Method:</Typography>
                            <Typography variant="body2">
                                {paymentMethod}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Total Amount:</Typography>
                            <Typography variant="h6">
                                {formatPrice(totalAmount)}
                            </Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Place Order'
                            )}
                        </Button>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Review; 