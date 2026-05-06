// src/services/vendorServices.js

import protectedInstance from "../instances/protectedInstance";

/*
=====================================================
PRODUCT MANAGEMENT
=====================================================
*/

// Create product
export const createProduct = async (formData) => {
    const response = await protectedInstance.post(
        "/products/create",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

// Get vendor products
export const getVendorProducts = async () => {
    const response = await protectedInstance.get(
        "/products/vendor/my-products"
    );
    return response.data;
};

// Update product
export const updateProduct = async (id, formData) => {
    const response = await protectedInstance.put(
        `/products/update/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
    const response = await protectedInstance.delete(
        `/products/delete/${id}`
    );
    return response.data;
};

/*
=====================================================
ORDER MANAGEMENT
=====================================================
*/

// Get vendor orders
export const getVendorOrders = async () => {
    const response = await protectedInstance.get("/vendor/orders");
    return response.data;
};

// Get single order
export const getVendorOrderById = async (id) => {
    const response = await protectedInstance.get(
        `/vendor/orders/${id}`
    );
    return response.data;
};

// Update order status
export const updateOrderStatus = async (id, orderStatus) => {
    const response = await protectedInstance.put(
        `/vendor/orders/${id}/status`,
        { orderStatus }
    );
    return response.data;
};