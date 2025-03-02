import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Box
} from '@mui/material';
import {
    SportsBasketball, // For jerseys
    Checkroom,    // For t-shirts
    Hiking,       // For shoes
    BeachAccess  // For sandals
} from '@mui/icons-material';

const Home = () => {
    const navigate = useNavigate();

    const categories = [
        { 
            name: 'Jerseys', 
            icon: <SportsBasketball sx={{ fontSize: 40 }} />,
            image: '/images/categories/jerseys.jpg',
            description: 'High-quality sports jerseys for all teams',
            path: '/products?category=jerseys',
            color: '#1976d2'
        },
        { 
            name: 'T-Shirts', 
            icon: <Checkroom sx={{ fontSize: 40 }} />,
            image: '/images/categories/t-shirts.jpg',
            description: 'Comfortable and stylish t-shirts',
            path: '/products?category=t-shirts',
            color: '#2196f3'
        },
        { 
            name: 'Shoes', 
            icon: <Hiking sx={{ fontSize: 40 }} />,
            image: '/images/categories/shoes.jpg',
            description: 'Trendy and comfortable footwear',
            path: '/products?category=shoes',
            color: '#0d47a1'
        },
        { 
            name: 'Sandals', 
            icon: <BeachAccess sx={{ fontSize: 40 }} />,
            image: '/images/categories/sandals.jpg',
            description: 'Casual and comfortable sandals',
            path: '/products?category=sandals',
            color: '#1565c0'
        }
    ];

    const handleCategoryClick = (category) => {
        navigate(`/products?category=${category.toLowerCase()}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Welcome to Darpan Fashion
            </Typography>
            <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                Discover our collection
            </Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={3} key={category.name}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3,
                                    '& .category-icon': {
                                        transform: 'scale(1.1)',
                                    }
                                },
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            <Box 
                                sx={{ 
                                    position: 'relative',
                                    paddingTop: '75%',
                                    bgcolor: category.color,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box 
                                        className="category-icon"
                                        sx={{ 
                                            color: 'white',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    >
                                        {category.icon}
                                    </Box>
                                </Box>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {category.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {category.description}
                                </Typography>
                                <Button 
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleCategoryClick(category.name)}
                                    sx={{
                                        bgcolor: category.color,
                                        '&:hover': {
                                            bgcolor: category.color,
                                            filter: 'brightness(90%)'
                                        }
                                    }}
                                >
                                    Shop Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home; 