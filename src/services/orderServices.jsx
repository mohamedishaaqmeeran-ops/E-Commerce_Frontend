import protectedInstance from "../instances/protectedInstance";

/*
===========================================
Place Order
===========================================
*/
export const placeOrder = async (data) => {
    const res = await protectedInstance.post(
        "/orders",   // IMPORTANT: matches backend route
        data
    );
    return res.data;
};

/*
===========================================
Get Orders
===========================================
*/
export const getMyOrders = async () => {
    const res = await protectedInstance.get("/orders/my-orders");
    return res.data;
};

/*
===========================================
Get Single Order
===========================================
*/
export const getOrderById = async (id) => {
    const res = await protectedInstance.get(`/orders/${id}`);
    return res.data;
};