import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';

const Shipping = () => {
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!items?.length) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            // Validate all fields are filled
            const missingFields = Object.entries(formData)
                .filter(([_, value]) => !value.trim())
                .map(([key]) => key);
                
            if (missingFields.length > 0) {
                setError(`Please fill in: ${missingFields.join(', ')}`);
                return;
            }

            // Save shipping data
            localStorage.setItem('shippingAddress', JSON.stringify(formData));
            navigate('/checkout/payment');
        } catch (err) {
            setError('Failed to save shipping data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!items?.length) {
        return null; // Will redirect in useEffect
    }

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Shipping Address
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="address"
                            label="Address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            name="city"
                            label="City"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            name="postalCode"
                            label="Postal Code"
                            value={formData.postalCode}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="country"
                            label="Country"
                            value={formData.country}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/cart')}
                        disabled={loading}
                    >
                        Back to Cart
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        endIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                        Continue to Payment
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default Shipping;