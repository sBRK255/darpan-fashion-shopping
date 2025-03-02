import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    People as PeopleIcon,
    ShoppingCart as CartIcon,
    Inventory as InventoryIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
    });
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/admin/stats', config);
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [userInfo.token]);

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PeopleIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Users
                                    </Typography>
                                    <Typography variant="h5">
                                        {stats.totalUsers}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CartIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Orders
                                    </Typography>
                                    <Typography variant="h5">
                                        {stats.totalOrders}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <InventoryIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Products
                                    </Typography>
                                    <Typography variant="h5">
                                        {stats.totalProducts}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MoneyIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Revenue
                                    </Typography>
                                    <Typography variant="h5">
                                        TZS {stats.totalRevenue.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 