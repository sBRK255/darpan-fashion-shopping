import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Rating,
    Snackbar,
    Alert
} from '@mui/material';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Message from '../components/shared/Message';
import { setProduct, setLoading, setError } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { productAPI, cartAPI } from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.product);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                dispatch(setLoading(true));
                const { data } = await productAPI.getProduct(id);
                dispatch(setProduct(data));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || 'Failed to fetch product'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProduct();
    }, [dispatch, id]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setNotification({
                open: true,
                message: 'Please select a size',
                severity: 'error'
            });
            return;
        }

        try {
            const { data } = await cartAPI.addToCart({
                productId: product._id,
                quantity,
                size: selectedSize
            });
            dispatch(addToCart(data));
            setNotification({
                open: true,
                message: 'Product added to cart successfully',
                severity: 'success'
            });
        } catch (err) {
            setNotification({
                open: true,
                message: err.response?.data?.message || 'Failed to add to cart',
                severity: 'error'
            });
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Message severity="error">{error}</Message>;
    if (!product) return <Message severity="info">Product not found</Message>;

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={30}
                            slidesPerView={1}
                        >
                            {product.images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <Box
                                        component="img"
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: 2
                                        }}
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {formatPrice(product.price)}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {product.description}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Size</InputLabel>
                                <Select
                                    value={selectedSize}
                                    label="Size"
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    {product.sizes.map((size) => (
                                        <MenuItem key={size} value={size}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Quantity</InputLabel>
                                <Select
                                    value={quantity}
                                    label="Quantity"
                                    onChange={(e) => setQuantity(e.target.value)}
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                        >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductDetails; 