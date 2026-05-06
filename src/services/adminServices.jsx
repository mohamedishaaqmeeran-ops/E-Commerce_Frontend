// src/services/adminServices.js

import protectedInstance from "../instances/protectedInstance";

/*
=====================================================
Shop Management
=====================================================
*/

export const getAllShops = async () => {
    const response = await protectedInstance.get("/admin/shops");
    return response.data;
};

export const getShopById = async (id) => {
    const response = await protectedInstance.get(`/admin/shops/${id}`);
    return response.data;
};

export const createShop = async (formData) => {
    const response = await protectedInstance.post(
        "/admin/shops",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const updateShop = async (id, formData) => {
    const { data } = await protectedInstance.put(
        `/admin/shops/${id}`,
        formData
    );
    return data;
};

export const deleteShop = async (id) => {
    const response = await protectedInstance.delete(
        `/admin/shops/${id}`
    );
    return response.data;
};

/*
=====================================================
Vendor Management
=====================================================
*/

export const createVendor = async (vendorData) => {
    const response = await protectedInstance.post(
        "/admin/vendors",
        vendorData
    );
    return response.data;
};

export const getAllVendors = async () => {
    const response = await protectedInstance.get(
        "/admin/vendors"
    );
    return response.data;
};

export const updateVendor = async (id, vendorData) => {
    const response = await protectedInstance.put(
        `/admin/vendors/${id}`,
        vendorData
    );
    return response.data;
};

export const deleteVendor = async (id) => {
    const response = await protectedInstance.delete(
        `/admin/vendors/${id}`
    );
    return response.data;
};