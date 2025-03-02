import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    CircularProgress
} from '@mui/material';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Message from '../components/shared/Message';
import { setOrder, setLoading, setError } from '../slices/orderSlice';
import { orderAPI, paymentAPI } from '../services/api';

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch(setLoading(true));
                const { data } = await orderAPI.getOrder(id);
                dispatch(setOrder(data));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || 'Failed to fetch order'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchOrder();
    }, [dispatch, id]);

    const handlePesapalPayment = async () => {
        try {
            setIsProcessing(true);
            const { data } = await paymentAPI.createPesapalOrder(order._id);
            window.location.href = data.redirect_url;
        } catch (error) {
            console.error('Payment failed:', error);
            // Show error message to user
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Message severity="error">{error}</Message>;
    if (!order) return <Message severity="info">Order not found</Message>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Order Details
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Information
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography>
                                <strong>Name:</strong> {order.user.name}
                            </Typography>
                            <Typography>
                                <strong>Address:</strong> {order.shippingAddress.address},
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode},
                                {order.shippingAddress.country}
                            </Typography>
                            <Typography>
                                <strong>Status:</strong>{' '}
                                <Chip
                                    label={order.status}
                                    color={order.isDelivered ? 'success' : 'warning'}
                                    size="small"
                                />
                            </Typography>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Items
                        </Typography>
                        <List>
                            {order.orderItems.map((item) => (
                                <React.Fragment key={item._id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar src={item.image} variant="square" />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={`Size: ${item.size} | Quantity: ${item.quantity}`}
                                        />
                                        <Typography variant="body1">
                                            ₹{item.price * item.quantity}
                                        </Typography>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Items Total:</Typography>
                                <Typography>₹{order.totalPrice}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Payment Method:</Typography>
                                <Typography>{order.paymentMethod}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Payment Status:</Typography>
                                <Chip
                                    label={order.isPaid ? 'Paid' : 'Not Paid'}
                                    color={order.isPaid ? 'success' : 'error'}
                                    size="small"
                                />
                            </Box>
                            {order.isPaid && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    Paid on: {new Date(order.paidAt).toLocaleString()}
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {!order.isPaid && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePesapalPayment}
                    fullWidth
                    disabled={isProcessing}
                    sx={{ mt: 2 }}
                >
                    {isProcessing ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Pay with PesaPal'
                    )}
                </Button>
            )}
        </Container>
    );
};

export default OrderDetails; 