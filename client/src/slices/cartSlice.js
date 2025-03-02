import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItems: (state, action) => {
            state.items = action.payload.items;
            state.totalAmount = action.payload.totalAmount;
        },
        addToCart: (state, action) => {
            state.items = action.payload.items;
            state.totalAmount = action.payload.totalAmount;
        },
        removeFromCart: (state, action) => {
            state.items = action.payload.items;
            state.totalAmount = action.payload.totalAmount;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { 
    setCartItems, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    setLoading, 
    setError 
} = cartSlice.actions;
export default cartSlice.reducer; 