import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import { useTheme } from './context/ThemeContext';
import './i18n';

// Layouts
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import CheckoutLayout from './components/layout/CheckoutLayout';

// Route Protection
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';

// Protected Pages
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

// Checkout Pages
import Shipping from './pages/checkout/Shipping';
import PaymentMethod from './pages/checkout/PaymentMethod';
import Review from './pages/checkout/Review';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import Users from './pages/admin/Users';

// Other
import NotFound from './pages/NotFound';

function App() {
    const { theme } = useTheme();

    return (
        <MUIThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <Container sx={{ flex: 1, py: 4 }}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/product/:id" element={<ProductDetails />} />

                        {/* Protected Routes */}
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/orders" element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        } />
                        <Route path="/order/:id" element={
                            <ProtectedRoute>
                                <OrderDetails />
                            </ProtectedRoute>
                        } />

                        {/* Checkout Routes */}
                        <Route path="/checkout" element={
                            <ProtectedRoute>
                                <CheckoutLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Navigate to="shipping" />} />
                            <Route path="shipping" element={<Shipping />} />
                            <Route path="payment" element={<PaymentMethod />} />
                            <Route path="review" element={<Review />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={
                            <AdminRoute>
                                <AdminLayout>
                                    <Dashboard />
                                </AdminLayout>
                            </AdminRoute>
                        } />
                        <Route path="/admin/products" element={
                            <AdminRoute>
                                <AdminLayout>
                                    <AdminProducts />
                                </AdminLayout>
                            </AdminRoute>
                        } />
                        <Route path="/admin/orders" element={
                            <AdminRoute>
                                <AdminLayout>
                                    <AdminOrders />
                                </AdminLayout>
                            </AdminRoute>
                        } />
                        <Route path="/admin/users" element={
                            <AdminRoute>
                                <AdminLayout>
                                    <Users />
                                </AdminLayout>
                            </AdminRoute>
                        } />

                        {/* Not Found Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
                <Footer />
            </Box>
        </MUIThemeProvider>
    );
}

export default App; 