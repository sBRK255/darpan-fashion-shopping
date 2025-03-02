import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Box,
    Avatar,
    Divider
} from '@mui/material';
import { setCredentials } from '../slices/authSlice';
import { authAPI } from '../services/api';
import Message from '../components/shared/Message';

const Profile = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        phone: userInfo?.phone || '',
        address: userInfo?.address || '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const { data } = await authAPI.updateProfile({
                ...formData,
                // Only include password if it's been changed
                password: formData.password || undefined
            });
            dispatch(setCredentials(data));
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                sx={{ width: 100, height: 100, mb: 2 }}
                                src={userInfo?.profilePicture}
                            />
                            <Typography variant="h6" gutterBottom>
                                {userInfo?.name}
                            </Typography>
                            <Typography color="textSecondary">
                                {userInfo?.isAdmin ? 'Administrator' : 'Customer'}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>
                            Profile Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {error && <Message severity="error">{error}</Message>}
                        {success && <Message severity="success">Profile updated successfully</Message>}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                        Change Password
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                    >
                                        Update Profile
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Profile; 