import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Box,
    Button
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Message from '../components/shared/Message';
import { setOrders, setLoading, setError } from '../slices/orderSlice';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/formatPrice';

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending':
            return 'warning';
        case 'Processing':
            return 'info';
        case 'Shipped':
            return 'primary';
        case 'Delivered':
            return 'success';
        case 'Cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                dispatch(setLoading(true));
                const { data } = await orderAPI.getMyOrders();
                dispatch(setOrders(data));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || 'Failed to fetch orders'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        if (userInfo) {
            fetchOrders();
        }
    }, [dispatch, userInfo]);

    if (!userInfo) {
        return (
            <Container>
                <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Please login to view your orders
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login?redirect=orders')}
                    >
                        Login
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <Message severity="error">{error}</Message>;

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        You haven't placed any orders yet
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>
                                        {order._id.substring(0, 10)}...
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {formatPrice(order.totalPrice)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.isPaid ? 'Paid' : 'Not Paid'}
                                            color={order.isPaid ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/order/${order._id}`)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default Orders; 