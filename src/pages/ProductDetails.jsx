import { useEffect, useState } from "react";
import { useParams, useLoaderData } from "react-router";
import Navbar from "../components/Navbar";
import { getProductById } from "../services/productServices";
import { addToCart } from "../services/userServices";
import { Link } from "react-router-dom";
import Footer from "../pages/Footer";
const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
const data = useLoaderData();
    const user = data?.user; 
    useEffect(() => {
        fetchProduct();
    }, []);
const handleAddToCart = async () => {
    try {
        await addToCart(product._id, 1);
        alert("Added to cart");
    } catch (err) {
        console.error(err.response?.data);

        alert(err.response?.data?.message || "Error adding to cart");
    }
};
    const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data.product);
        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 FIXED IMAGE FUNCTION
    const getImage = (img) => {
        if (!img) return "/no-image.png";
        return `https://e-commerce-backend-e2mm.onrender.com/${img.replace(/^\/+/, "")}`;
    };

    if (!product) return <p className="p-6">Loading...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-black-950 via-blue to-blue-900">
            <Navbar />

            <div className="p-6 max-w-4xl mx-auto">

                <img
                    src={getImage(product.image)}
                    alt={product.name}
                    className="h-64 w-full object-cover mb-4"
                />

                <h1 className="text-2xl font-bold">
                    {product.name}
                </h1>

                <p className="text-gray-600 mt-2">
                    {product.description}
                </p>

                <p className="text-xl font-bold mt-3">
                    ₹{product.price}
                </p>

                {/* STOCK */}
                {product.stock < 1 ? (
                    <p className="text-red-500 mt-2">
                        Stock Unavailable
                    </p>
                ) : (
                    <p className="text-green-600 mt-2">
                        In Stock ({product.stock})
                    </p>
                )}

               <button
    onClick={handleAddToCart}
    className="bg-black text-white px-4 py-2 mt-4"
>
    Add to Cart
</button>
            </div>
            <div className="mt-6 text-center">
                     <Link
  to={user?.role === "vendor" ? "/vendor/dashboard" : "/dashboard"}
  className="text-sm italic font-bold text-white underline"
>
  Back to Dashboard
</Link>
                    </div>
                    <Footer/>
        </div>
    );
};

export default ProductDetails;