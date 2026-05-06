// src/services/userServices.js

import protectedInstance from "../instances/protectedInstance";

/*
=====================================================
User Summary
=====================================================
*/

// Get dashboard summary (your /users/summary route)
export const getUserSummary = async () => {
    const response = await protectedInstance.get("/user/summary");
    return response.data;
};

/*
=====================================================
Orders
=====================================================
*/

// Get logged-in user orders
export const getMyOrders = async () => {
    const response = await protectedInstance.get("/orders/my-orders");
    return response.data;
};

// Get single order
export const getOrderById = async (id) => {
    const response = await protectedInstance.get(`/orders/${id}`);
    return response.data;
};

// Cancel order
export const cancelOrder = async (id) => {
    const response = await protectedInstance.put(`/orders/${id}/cancel`);
    return response.data;
};

/*
=====================================================
Cart
=====================================================
*/

// Get cart
export const getCart = async () => {
    const response = await protectedInstance.get("/cart");
    return response.data;
};

// Add to cart
export const addToCart = async (productId, quantity = 1) => {
    const response = await protectedInstance.post("/cart/add", {
        productId,
        quantity,
    });
    return response.data;
};

// Update cart item
export const updateCartItem = async (productId, quantity) => {
    const res = await protectedInstance.put(
        `/cart/update/${productId}`,
        {
            quantity: Number(quantity)
        }
    );

    return res.data;
};

// Remove from cart
export const removeFromCart = async (productId) => {
    const response = await protectedInstance.delete(
        `/cart/remove/${productId}`
    );
    return response.data;
};

// Clear cart
export const clearCart = async () => {
    const response = await protectedInstance.delete("/cart/clear");
    return response.data;
};

/*
=====================================================
Wishlist
=====================================================
*/

// Get wishlist
