import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Avatar,
    Grid,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    AddPhotoAlternate as AddPhotoIcon
} from '@mui/icons-material';
import { productAPI } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
        sizes: [],
        images: ['']  // Array of image URLs
    });
    const [newSize, setNewSize] = useState('');
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await productAPI.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleOpen = (product = null) => {
        if (product) {
            setEditProduct(product);
            setFormData({
                ...product,
                // Ensure sizes is always an array
                sizes: Array.isArray(product.sizes) ? product.sizes : [],
                // Ensure images is always an array
                images: Array.isArray(product.images) ? product.images : ['']
            });
        } else {
            setEditProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                quantity: '',
                sizes: [],
                images: ['']
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate and format the data
            const productData = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                // Ensure sizes is a valid array and remove any empty strings
                sizes: formData.sizes.filter(size => size.trim() !== ''),
                // Filter out empty image URLs
                images: formData.images.filter(img => img.trim() !== '')
            };

            if (!productData.sizes.length) {
                alert('Please add at least one size');
                return;
            }

            if (editProduct) {
                await productAPI.updateProduct(editProduct._id, productData);
            } else {
                await productAPI.createProduct(productData);
            }
            
            fetchProducts();
            handleClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productAPI.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    // Add new image URL field
    const handleAddImageField = () => {
        setFormData({
            ...formData,
            images: [...formData.images, '']
        });
    };

    // Update image URL
    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({
            ...formData,
            images: newImages
        });
    };

    // Remove image URL field
    const handleRemoveImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages
        });
    };

    // Add size handler
    const handleAddSize = () => {
        if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
            setFormData(prev => ({
                ...prev,
                sizes: [...prev.sizes, newSize.trim()]
            }));
            setNewSize('');
        }
    };

    // Remove size handler
    const handleRemoveSize = (sizeToRemove) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter(size => size !== sizeToRemove)
        }));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Products Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setEditProduct(null);
                        setFormData({
                            name: '',
                            description: '',
                            price: '',
                            category: '',
                            quantity: '',
                            sizes: [],
                            images: ['']
                        });
                        setOpen(true);
                    }}
                >
                    Add Product
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <Avatar
                                        src={product.images[0]}
                                        alt={product.name}
                                        variant="rounded"
                                        sx={{ width: 60, height: 60 }}
                                    />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatPrice(product.price)}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(product)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        {/* Image URL input */}
                        <TextField
                            fullWidth
                            label="Image URL"
                            value={formData.images[0] || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                images: [e.target.value]
                            })}
                            margin="normal"
                        />

                        {/* Preview image */}
                        {formData.images[0] && (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 2
                                }}
                            >
                                <img
                                    src={formData.images[0]}
                                    alt="Product preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                        )}

                        {/* Other fields */}
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            margin="normal"
                            multiline
                            rows={4}
                        />

                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            margin="normal"
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category}
                                label="Category"
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <MenuItem value="jerseys">Jerseys</MenuItem>
                                <MenuItem value="t-shirts">T-Shirts</MenuItem>
                                <MenuItem value="shoes">Shoes</MenuItem>
                                <MenuItem value="sandals">Sandals</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            margin="normal"
                        />

                        {/* Size Management Section - Updated for manual entry */}
                        <Box sx={{ mt: 3, mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Sizes
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={8}>
                                    <TextField
                                        fullWidth
                                        label="Enter Size"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="e.g., 42, XL, 8.5, 26x32"
                                        helperText="Press Enter or click Add Size to add"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSize();
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddSize}
                                        disabled={!newSize.trim()}
                                        fullWidth
                                    >
                                        Add Size
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Display Selected Sizes */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                {formData.sizes.map((size) => (
                                    <Chip
                                        key={size}
                                        label={size}
                                        onDelete={() => handleRemoveSize(size)}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={formData.sizes.length === 0}
                    >
                        {editProduct ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Products; 