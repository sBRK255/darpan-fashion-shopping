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
    Avatar,
    Chip,
    Box
} from '@mui/material';
import {
    Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Users = () => {
    const [users, setUsers] = useState([]);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                await axios.delete(`/api/users/${userId}`, config);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1">
                    User Management
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Avatar src={user.profilePicture}>
                                        {user.name.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.isAdmin ? 'Admin' : 'Customer'}
                                        color={user.isAdmin ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => handleDeleteUser(user._id)}
                                        disabled={user._id === userInfo._id}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Users; 