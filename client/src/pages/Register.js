import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link
} from '@mui/material';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Message from '../components/shared/Message';
import { setCredentials, setLoading, setError } from '../slices/authSlice';
import { authAPI } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            dispatch(setError('Passwords do not match'));
            return;
        }

        try {
            dispatch(setLoading(true));
            const { data } = await authAPI.register(formData);
            dispatch(setCredentials(data));
            navigate('/');
        } catch (err) {
            dispatch(setError(err.response?.data?.message || 'An error occurred'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>

                {error && <Message severity="error">{error}</Message>}
                {loading && <LoadingSpinner />}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        Register
                    </Button>
                    <Typography align="center">
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login">
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register; 