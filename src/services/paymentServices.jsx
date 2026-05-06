import protectedInstance from "../instances/protectedInstance";

/*
===========================================
Create Razorpay Order
===========================================
*/
export const createRazorpayOrder = async (orderId) => {
    const res = await protectedInstance.post("/payment/create-order", {
        orderId,
    });
    return res.data;
};

/*
===========================================
Verify Payment
===========================================
*/
export const verifyPayment = async (data) => {
    const res = await protectedInstance.post("/payment/verify", data);
    return res.data;
};