import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartSlice.jsx'; // Import the cart reducer

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});