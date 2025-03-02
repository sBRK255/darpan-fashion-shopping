import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Message from '../components/shared/Message';
import { setProducts, setLoading, setError } from '../slices/productSlice';
import { productAPI } from '../services/api';
import { formatPrice } from '../utils/formatPrice';

const Products = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { products, loading, error } = useSelector((state) => state.product);
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
    }, [location]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                dispatch(setLoading(true));
                const { data } = await productAPI.getProducts();
                dispatch(setProducts(data));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || 'Failed to fetch products'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, [dispatch]);

    const filteredProducts = products.filter(product => {
        const matchesCategory = category ? product.category === category : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Our Products
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                <MenuItem value="jerseys">Jerseys</MenuItem>
                                <MenuItem value="t-shirts">T-Shirts</MenuItem>
                                <MenuItem value="shoes">Shoes</MenuItem>
                                <MenuItem value="sandals">Sandals</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Search Products"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Message severity="error">{error}</Message>
            ) : (
                <Grid container spacing={4}>
                    {filteredProducts.map((product) => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3
                                    },
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="260"
                                    image={product.images[0]}
                                    alt={product.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="h2">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {formatPrice(product.price)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Available Sizes: {product.sizes.join(', ')}
                                    </Typography>
                                    <Button 
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        component={RouterLink}
                                        to={`/product/${product._id}`}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Products; 