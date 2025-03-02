import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setOrder: (state, action) => {
            state.order = action.payload;
        },
        addOrder: (state, action) => {
            state.orders = [action.payload, ...state.orders];
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            state.orders = state.orders.map(order =>
                order._id === id ? { ...order, status } : order
            );
            if (state.order && state.order._id === id) {
                state.order.status = status;
            }
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
    setOrders, 
    setOrder, 
    addOrder, 
    updateOrderStatus, 
    setLoading, 
    setError 
} = orderSlice.actions;
export default orderSlice.reducer; 