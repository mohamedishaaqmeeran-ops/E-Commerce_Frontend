import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getCart,
    updateCartItem,
    clearCart,
    removeFromCart,
} from "../services/userServices";
import Footer from "../pages/Footer";
import { placeOrder } from "../services/orderServices";
import {
    createRazorpayOrder,
    verifyPayment,
} from "../services/paymentServices";
import { Link, useLoaderData } from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState([]);

    const data = useLoaderData();
    const user = data?.user;

    /*
    ============================
    FETCH CART
    ============================
    */
    const fetchCart = async () => {
        try {
            const data = await getCart();
            setCart(data.cart?.items || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    /*
    ============================
    OPTIMISTIC QUANTITY UPDATE
    ============================
    */
  const handleQty = async (item, qty) => {
    if (qty < 1) return;

    if (qty > item.product.stock) {
        alert("Stock limit reached");
        return;
    }

    // optimistic UI
    setCart((prev) =>
        prev.map((c) =>
            c.product._id === item.product._id
                ? { ...c, quantity: qty }
                : c
        )
    );

    try {
        await updateCartItem(item.product._id, qty); // ✔ correct now
    } catch (err) {
        console.error(
            err.response?.data || err.message
        );
        fetchCart(); // rollback
    }
};

    /*
    ============================
    REMOVE ITEM (OPTIMISTIC)
    ============================
    */
    const handleRemove = async (id) => {
        setCart((prev) =>
            prev.filter((item) => item.product._id !== id)
        );

        try {
            await removeFromCart(id);
        } catch (err) {
            console.error(err);
            fetchCart();
        }
    };

    /*
    ============================
    CLEAR CART
    ============================
    */
    const handleClear = async () => {
        setCart([]);

        try {
            await clearCart();
        } catch (err) {
            console.error(err);
            fetchCart();
        }
    };

    /*
    ============================
    BUY NOW
    ============================
    */
    const handleBuy = async () => {
        try {
            for (let item of cart) {
                if (item.quantity > item.product.stock) {
                    alert(
                        `${item.product.name} has only ${item.product.stock} items left`
                    );
                    return;
                }
            }

            const orderRes = await placeOrder();
            const orderId = orderRes.order._id;

            const razorRes = await createRazorpayOrder(orderId);

            const options = {
                key: razorRes.key,
                amount: razorRes.order.amount,
                currency: "INR",
                name: "My Store",
                description: "Order Payment",
                order_id: razorRes.order.id,

                handler: async function (response) {
                    await verifyPayment(response);
                    alert("Payment Successful ✅");
                    fetchCart();
                },

                prefill: {
                    name: "User",
                    email: "user@gmail.com",
                },

                theme: {
                    color: "#000000",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Payment Failed");
        }
    };

    const total = cart.reduce(
        (acc, item) =>
            acc + item.product.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-black-950 via-blue to-blue-900">
            <Navbar />

            <div className="p-6 max-w-5xl mx-auto min-h-screen">
                <h1 className="text-2xl font-bold mb-4">
                    My Cart
                </h1>

                {cart.length === 0 ? (
                    <p>Cart is empty</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div
                                key={item.product._id}
                                className="border p-4 mb-3 flex justify-between bg-white items-center"
                            >
                                <div>
                                    <p className="font-bold">
                                        {item.product.name}
                                    </p>

                                    <p>₹{item.product.price}</p>

                                    <p className="text-sm text-gray-500">
                                        Stock: {item.product.stock}
                                    </p>

                                    {/* QUANTITY CONTROLS */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() =>
                                                handleQty(
                                                    item,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="px-2 bg-gray-200"
                                        >
                                            -
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                handleQty(
                                                    item,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="px-2 bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        handleRemove(item.product._id)
                                    }
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        {/* TOTAL */}
                        <div className="mt-4 border p-4">
                            <h2 className="text-lg font-bold">
                                Total: ₹{total}
                            </h2>

                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={handleBuy}
                                    className="bg-green-600 text-white px-4 py-2"
                                >
                                    Buy Now
                                </button>

                                <button
                                    onClick={handleClear}
                                    className="bg-red-500 text-white px-4 py-2"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* BACK LINK */}
            <div className="mt-6 text-center">
                <Link
                    to={user?.role === "vendor" ? "/vendor/dashboard" : "/dashboard"}
                    className="text-sm italic font-bold text-white underline"
                >
                    Back to Dashboard
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;