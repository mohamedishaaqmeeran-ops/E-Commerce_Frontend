import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../pages/Footer";
import { getCart } from "../services/userServices";
import { createRazorpayOrder, verifyPayment } from "../services/paymentServices";
import { placeOrder } from "../services/orderServices";

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await getCart();
            setCart(data.cart?.items || []);
        } catch (err) {
            console.error(err);
        }
    };

    const total = cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert("Razorpay failed");
            setLoading(false);
            return;
        }

        try {
            // ✅ STEP 1: CREATE ORDER (IMPORTANT FIX HERE)
            const orderRes = await placeOrder({
                shippingAddress: "Chennai, Tamil Nadu",
                paymentMethod: "ONLINE",
            });

            const orderId = orderRes.order._id;

            // ✅ STEP 2: CREATE RAZORPAY ORDER
            const razorRes = await createRazorpayOrder(orderId);

            const options = {
                key: razorRes.key,
                amount: razorRes.order.amount,
                currency: "INR",
                name: "E-Commerce",
                order_id: razorRes.order.id,

                handler: async function (response) {
                    await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    alert("Payment Success ✅");
                    window.location.href = "/orders";
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err.response?.data || err);
            alert(err.response?.data?.message || "Order failed");
        }

        setLoading(false);
    };

    return (
        <div>
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>

                {cart.length === 0 ? (
                    <p>No items in cart</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div key={item.product._id} className="border p-3 mb-2">
                                <p>{item.product.name}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>₹{item.product.price}</p>
                            </div>
                        ))}

                        <div className="mt-4 border p-4">
                            <h2 className="text-xl font-bold">
                                Total: ₹{total}
                            </h2>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 mt-3"
                            >
                                {loading ? "Processing..." : "Pay Now"}
                            </button>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;