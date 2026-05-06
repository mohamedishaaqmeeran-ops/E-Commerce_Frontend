import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllProducts } from "../services/productServices";
import { addToCart } from "../services/userServices";
import Footer from "../pages/Footer";
const Products = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data.products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Dynamic categories
    const categories = [
        "all",
        ...new Set(products.map((p) => p.category))
    ];

    const filteredProducts =
        category === "all"
            ? products
            : products.filter((p) => p.category === category);

    const handleAddToCart = async (id) => {
        try {
            await addToCart(id, 1);
            alert("Added to cart");
        } catch (err) {
            alert("Error adding to cart");
        }
    };

    const getImage = (img) => {
        if (!img) return "/no-image.png";
        return `https://e-commerce-backend-e2mm.onrender.com/${img.replace(/^\/+/, "")}`;
    };

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div>
            <Navbar />

            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">
                    All Products
                </h1>

                {/* CATEGORY FILTER */}
                <select
                    onChange={(e) => setCategory(e.target.value)}
                    className="mb-4 border p-2"
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c.toUpperCase()}
                        </option>
                    ))}
                </select>

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredProducts.map((p) => {
                        const stock = Number(p.stock);

                        return (
                            <div
                                key={p._id}
                                className="border p-3 rounded shadow hover:shadow-lg transition"
                            >
                                <img
                                    src={getImage(p.image)}
                                    alt={p.name}
                                    className="h-32 w-full object-cover mb-2"
                                />

                                <h2 className="font-semibold">
                                    {p.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {p.category}
                                </p>

                                <p className="font-bold">
                                    ₹{p.price}
                                </p>

                                {/* 🔥 STOCK STATUS */}
                                {stock < 0 ? (
                                    <p className="text-red-600 text-sm font-semibold">
                                        Stock Unavailable
                                    </p>
                                ) : (
                                    <>
                                        {/* LOW STOCK WARNING */}
                                        {stock > 0 && stock <= 5 && (
                                            <p className="text-orange-500 text-xs">
                                                Only few items left!
                                            </p>
                                        )}

                                        <button
                                            disabled={stock === 0}
                                            onClick={() =>
                                                handleAddToCart(p._id)
                                            }
                                            className={`px-2 py-1 mt-2 w-full ${
                                                stock === 0
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-black text-white"
                                            }`}
                                        >
                                            {stock === 0
                                                ? "Out of Stock"
                                                : "Add to Cart"}
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Products;