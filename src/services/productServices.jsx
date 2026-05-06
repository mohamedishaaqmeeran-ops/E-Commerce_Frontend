import protectedInstance from "../instances/protectedInstance";

/*
=====================================================
Public Products
=====================================================
*/

// Get all products
export const getAllProducts = async () => {
    const response = await protectedInstance.get("/products");
    return response.data;
};

// Get latest products
export const getLatestProducts = async () => {
    const response = await protectedInstance.get("/products/latest");
    return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
    const response = await protectedInstance.get(`/products/${id}`);
    return response.data;
};

// Filter by category (frontend filter)
export const getProductsByCategory = async (category) => {
    const response = await protectedInstance.get("/products");
    const products = response.data.products || [];

    return products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
    );
};