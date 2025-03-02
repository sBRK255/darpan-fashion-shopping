import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid
} from '@mui/material';

const Shipping = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save shipping data
        localStorage.setItem('shippingAddress', JSON.stringify(formData));
        navigate('/checkout/payment');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Shipping Address
            </Typography>
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
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Continue to Payment
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default Shipping; 