import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert
} from '@mui/material';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { setCredentials, setLoading, setError } from '../slices/authSlice';
import { authAPI } from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useSelector((state) => state.auth);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const { data } = await authAPI.login(formData);
            dispatch(setCredentials(data));
            navigate(redirect);
        } catch (err) {
            dispatch(setError(
                err.response?.data?.message || 
                'Failed to login. Please check your credentials.'
            ));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email or Phone Number"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        margin="normal"
                        required
                        autoFocus
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>

                    <Typography align="center">
                        Don't have an account?{' '}
                        <Link component={RouterLink} to={
                            redirect ? `/register?redirect=${redirect}` : '/register'
                        }>
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
            {loading && <LoadingSpinner />}
        </Container>
    );
};

export default Login; 