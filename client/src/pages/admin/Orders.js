import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { orderAPI } from '../../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await orderAPI.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleStatusUpdate = async () => {
        try {
            await orderAPI.updateOrderStatus(selectedOrder._id, newStatus);
            fetchOrders();
            setOpenStatusDialog(false);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Processing': return 'info';
            case 'Shipped': return 'primary';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Orders Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id.substring(0, 8)}...</TableCell>
                                <TableCell>{order.user.name}</TableCell>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>₹{order.totalPrice}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.isPaid ? 'Paid' : 'Pending'}
                                        color={order.isPaid ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewDetails(order)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => {
                                        setSelectedOrder(order);
                                        setNewStatus(order.status);
                                        setOpenStatusDialog(true);
                                    }}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Order Details Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Shipping Information
                            </Typography>
                            <Typography>
                                Address: {selectedOrder.shippingAddress.address},
                                {selectedOrder.shippingAddress.city},
                                {selectedOrder.shippingAddress.postalCode}
                            </Typography>
                            
                            <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                                Order Items
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.orderItems.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.size}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>₹{item.price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Status Update Dialog */}
            <Dialog 
                open={openStatusDialog} 
                onClose={() => setOpenStatusDialog(false)}
            >
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
                    <Button onClick={handleStatusUpdate} variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Orders; 