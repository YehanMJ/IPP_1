import { createSlice } from '@reduxjs/toolkit';

// Helper functions for localStorage
const getCartKey = (userID) => `cart_${userID}`;

const loadCart = (userID) => {
    if (!userID) return [];
    try {
        const data = localStorage.getItem(getCartKey(userID));
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveCart = (userID, cart) => {
    if (!userID) return;
    localStorage.setItem(getCartKey(userID), JSON.stringify(cart));
};

const initialState = {
    items: [],
    userID: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setUserID: (state, action) => {
            state.userID = action.payload;
            state.items = loadCart(action.payload);
        },
        addToCart: (state, action) => {
            const { ID, quantity = 1 } = action.payload;
            const existingProduct = state.items.find((item) => item.ID === ID);
            if (existingProduct) {
                existingProduct.quantity += quantity; // Add the specified quantity
            } else {
                state.items.push({ ...action.payload, quantity }); // Use the specified quantity
            }
            saveCart(state.userID, state.items);
        },
        removeFromCart: (state, action) => {
            const existingProduct = state.items.find((item) => item.ID === action.payload.ID);
            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1;
                } else {
                    state.items = state.items.filter((item) => item.ID !== action.payload.ID);
                }
                saveCart(state.userID, state.items);
            }
        },
        clearCart: (state) => {
            state.items = [];
            saveCart(state.userID, []);
        },
    },
});

export const { setUserID, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;