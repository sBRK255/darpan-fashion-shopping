import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
    IconButton,
    Divider,
    TextField
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Message from '../components/shared/Message';
import { removeFromCart, clearCart, setItems, setLoading, setError, setCartItems } from '../slices/cartSlice';
import { cartAPI } from '../services/api';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, loading, error } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    // Fetch cart on component mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                dispatch(setLoading(true));
                const { data } = await cartAPI.getCart();
                dispatch(setCartItems(data));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || 'Failed to fetch cart'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        if (userInfo) {
            fetchCart();
        }
    }, [dispatch, userInfo]);

    const handleQuantityChange = async (itemId, quantity) => {
        try {
            dispatch(setLoading(true));
            await cartAPI.updateCartItem(itemId, quantity);
            // Refresh cart after update
            const { data } = await cartAPI.getCart();
            dispatch(setCartItems(data));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || 'Failed to update quantity'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            dispatch(setLoading(true));
            const { data } = await cartAPI.removeFromCart(itemId);
            dispatch(setCartItems(data));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || 'Failed to remove item'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleCheckout = () => {
        if (!userInfo) {
            navigate('/login?redirect=/checkout/shipping');
            return;
        }
        navigate('/checkout/shipping');
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Message severity="error">{error}</Message>;

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>

            {items.length === 0 ? (
                <Message severity="info">Your cart is empty</Message>
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        {items.map((item) => (
                            <Card key={item._id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={3}>
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    maxHeight: '100px',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        {item.product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Size: {item.size}
                                                    </Typography>
                                                    <Typography variant="body1" color="primary" gutterBottom>
                                                        {formatPrice(item.product.price)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                                        InputProps={{ inputProps: { min: 1, max: 10 } }}
                                                        sx={{ width: 80, mr: 2 }}
                                                    />
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleRemoveItem(item._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                                                Subtotal: {formatPrice(item.product.price * item.quantity)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Order Summary
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography>Total Items:</Typography>
                                    <Typography>{items.length}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Total Amount:</Typography>
                                    <Typography variant="h6">
                                        {formatPrice(totalAmount)}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCheckout}
                                    disabled={items.length === 0}
                                >
                                    Proceed to Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Cart; 