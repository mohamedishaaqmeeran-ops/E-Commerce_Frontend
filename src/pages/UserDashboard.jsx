import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../pages/Footer";
import {
    getUserSummary,
    getMyOrders,
} from "../services/userServices";

import { getLatestProducts } from "../services/productServices";

import { FaShoppingCart, FaHeart } from "react-icons/fa";
import protectedInstance from "../instances/protectedInstance";

const UserDashboard = () => {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({});
    const [orders, setOrders] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("latest");

    // ==============================
    // FETCH DATA
    // ==============================
    const fetchData = useCallback(async () => {
        try {
            const [summaryData, orderData, latestData] =
                await Promise.all([
                    getUserSummary(),
                    getMyOrders(),
                    getLatestProducts()
                ]);

            setSummary(summaryData || {});
            setOrders(orderData?.orders || []);
            setLatestProducts(latestData?.products || []);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchData]);

    const getImage = (img) => {
        if (!img) return "/no-image.png";
        return `https://e-commerce-backend-e2mm.onrender.com${img}`;
    };

    // ==============================
    // LOADING
    // ==============================
    if (loading) {
        return (
            <div>
                <Navbar />
                <p className="p-5">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black-950 via-blue to-blue-900">
            <Navbar />

            <div className="p-6 max-w-7xl mx-auto">

                {/* HEADER */}
                <h1 className="text-2xl font-bold mb-2">
                    User Dashboard
                </h1>

                {/* CART + WISHLIST ICONS */}
                <div className="flex justify-end gap-6 mb-4">

                    {/* WISHLIST */}
                   

                    {/* CART */}
                    <div
                        className="relative cursor-pointer"
                        onClick={() => navigate("/cart")}
                    >
                        <FaShoppingCart size={20} />

                        {summary?.cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1 rounded-full">
                                {summary.cartCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* MENU */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setActiveTab("latest")}
                        className={`px-4 py-2 border rounded ${
                            activeTab === "latest"
                                ? "bg-black text-white"
                                : ""
                        }`}
                    >
                        Latest Collection
                    </button>

                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-4 py-2 border rounded ${
                            activeTab === "orders"
                                ? "bg-black text-white"
                                : ""
                        }`}
                    >
                        My Orders
                    </button>
                </div>

                {/* =========================
                    LATEST PRODUCTS
                ========================= */}
                {activeTab === "latest" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
                        {latestProducts.map((p) => (
                            <div key={p._id} className="border p-3 rounded shadow bg-white">

                                <img
                                    src={getImage(p.image)}
                                    className="h-32 w-full object-cover"
                                />

                                <p className="font-semibold mt-2">
                                    {p.name}
                                </p>

                                <p className="text-gray-500 text-sm">
                                    {p.category}
                                </p>

                                <p className="font-bold">
                                    ₹{p.price}
                                </p>

                                {/* VIEW BUTTON */}
                                <button
                                    onClick={() =>
                                        navigate(`/product/${p._id}`)
                                    }
                                    className="bg-black text-white w-full mt-2 py-1 rounded"
                                >
                                    View Product
                                </button>

                                {/* ❤️ WISHLIST BUTTON */}
    

                            </div>
                        ))}
                    </div>
                )}

                {/* =========================
                    MY ORDERS
                ========================= */}
                {activeTab === "orders" && (
                    <div className="space-y-4">

                        {orders.length === 0 ? (
                            <p>No orders yet</p>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="border rounded p-4 shadow bg-white"
                                >
                                    <p className="font-semibold">
                                        Order ID: {order._id}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>

                                    {/* ITEMS */}
                                    {order.items.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex gap-4 border-b py-2"
                                        >
                                            <img
                                                src={getImage(item.product.image)}
                                                className="h-16 w-16 object-cover"
                                            />

                                            <div>
                                                <p className="font-semibold">
                                                    {item.product.name}
                                                </p>
                                                <p>Qty: {item.quantity}</p>
                                                <p>₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-between mt-3">
                                        <p className="font-bold">
                                            Total: ₹{order.totalAmount}
                                        </p>

                                        <span className="bg-blue-200 px-3 py-1 rounded">
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UserDashboard;