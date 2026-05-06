import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Footer from "../pages/Footer";
import Navbar from "../components/Navbar";

import { getLatestProducts } from "../services/productServices";
import { addToCart} from "../services/userServices";

const LatestProducts = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    /*
    ===========================================
    FETCH LATEST
    ===========================================
    */
    useEffect(() => {
        fetchLatest();
    }, []);

    const fetchLatest = async () => {
        try {
            const data = await getLatestProducts();
            setProducts(data.products || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    /*
    ===========================================
    HELPERS
    ===========================================
    */
    const getImage = (img) => {
        if (!img) return "/no-image.png";
        return `https://e-commerce-backend-e2mm.onrender.com${img}`;
    };

    /*
    ===========================================
    ADD TO CART
    ===========================================
    */
    const handleAddToCart = async (id) => {
        try {
            await addToCart(id, 1);
            alert("Added to cart 🛒");
        } catch (error) {
            alert("Failed to add");
        }
    };

    /*
    ===========================================
    ADD TO WISHLIST
    ===========================================
    */
   

    /*
    ===========================================
    UI
    ===========================================
    */
    if (loading) {
        return <p className="p-6">Loading latest products...</p>;
    }

    return (
        <div>
            <Navbar />

            <div className="p-6 max-w-7xl mx-auto">

                <h1 className="text-2xl font-bold mb-6">
                    Latest Collection 🔥
                </h1>

                {products.length === 0 ? (
                    <p>No latest products found</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                        {products.map((p) => (
                            <div
                                key={p._id}
                                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                            >
                                {/* IMAGE */}
                                <img
                                    src={getImage(p.image)}
                                    alt={p.name}
                                    className="h-40 w-full object-cover cursor-pointer"
                                    onClick={() =>
                                        navigate(`/product/${p._id}`)
                                    }
                                />

                                {/* DETAILS */}
                                <div className="p-3">

                                    <h2
                                        className="font-semibold cursor-pointer"
                                        onClick={() =>
                                            navigate(`/product/${p._id}`)
                                        }
                                    >
                                        {p.name}
                                    </h2>

                                    <p className="text-gray-500 text-sm">
                                        {p.category}
                                    </p>

                                    <p className="font-bold mt-1">
                                        ₹{p.price}
                                    </p>

                                    {/* STOCK STATUS */}
                                    {p.stock < 1 ? (
                                        <p className="text-red-500 text-sm mt-1">
                                            Stock Unavailable
                                        </p>
                                    ) : null}

                                    {/* ACTIONS */}
                                    <div className="flex gap-2 mt-3">

                                        {/* ADD TO CART */}
                                        <button
                                            disabled={p.stock < 1}
                                            onClick={() =>
                                                handleAddToCart(p._id)
                                            }
                                            className={`flex-1 py-1 rounded ${
                                                p.stock < 1
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-black text-white"
                                            }`}
                                        >
                                            Add to Cart
                                        </button>

                                        {/* VIEW PRODUCT */}
                                        <button
                                            onClick={() =>
                                                navigate(`/product/${p._id}`)
                                            }
                                            className="px-2 bg-blue-600 text-white rounded"
                                        >
                                            View
                                        </button>

                                        {/* WISHLIST */}
                                      

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default LatestProducts;