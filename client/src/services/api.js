import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://localhost:5000/api';

// Helper function to get auth config
const getAuthConfig = () => {
    const userInfo = localStorage.getItem('userInfo');
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (userInfo) {
        config.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }

    return config;
};

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            config.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users', userData),
    updateProfile: (userData) => api.put('/users/profile', userData),
};

export const productAPI = {
    getProducts: () => api.get('/products'),
    getProduct: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: async (id, productData) => {
        try {
            // Ensure sizes array is properly formatted
            const formattedData = {
                ...productData,
                sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
            };
            
            return await api.put(`/products/${id}`, formattedData);
        } catch (error) {
            throw error;
        }
    },
    deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (itemData) => api.post('/cart', itemData),
    updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
    removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
};

export const orderAPI = {
    createOrder: (orderData) => api.post('/orders', orderData),
    getOrders: () => api.get('/orders'),
    getOrder: (id) => api.get(`/orders/${id}`),
    getMyOrders: () => api.get('/orders/myorders'),
    updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const paymentAPI = {
    createZenoPayOrder: (orderId) => api.post(`/payments/zenopay/${orderId}`),
    createPesapalOrder: (orderId) => api.post(`/payments/pesapal/${orderId}`),
};

export default api; 