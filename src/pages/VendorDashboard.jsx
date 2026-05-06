import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getVendorProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    getVendorOrders,
    updateOrderStatus,
} from "../services/vendorServices";
import Footer from "../pages/Footer";
const VendorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
        isLatest: false, // ✅ added
    });

    /*
    =============================
    FETCH DATA
    =============================
    */
    const fetchData = async () => {
        try {
            const productData = await getVendorProducts();
            const orderData = await getVendorOrders();

            setProducts(productData.products || []);
            setOrders(orderData.orders || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /*
    =============================
    RESET FORM
    =============================
    */
    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            image: null,
            isLatest: false,
        });
        setEditId(null);
        setShowForm(false);
    };

    /*
    =============================
    CREATE / UPDATE PRODUCT
    =============================
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        formData.append("category", form.category);
        formData.append("isLatest", form.isLatest); // ✅ important

        if (form.image) {
            formData.append("productImage", form.image); // ✅ correct field
        }

        try {
            if (editId) {
                await updateProduct(editId, formData);
                alert("Product updated");
            } else {
                await createProduct(formData);
                alert("Product created");
            }

            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        }
    };

    /*
    =============================
    EDIT PRODUCT
    =============================
    */
    const handleEdit = (product) => {
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: null,
            isLatest: product.isLatest || false,
        });

        setEditId(product._id);
        setShowForm(true);
    };

    /*
    =============================
    DELETE PRODUCT
    =============================
    */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        await deleteProduct(id);
        fetchData();
    };

    /*
    =============================
    ORDER STATUS UPDATE
    =============================
    */
    const handleStatus = async (id, status) => {
        if (!status) return;

        await updateOrderStatus(id, status);
        fetchData();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black-950 via-blue to-blue-900">
            <Navbar />

            <div className="p-6 max-w-7xl mx-auto ">
                <h1 className="text-2xl font-bold mb-6">
                    Vendor Dashboard
                </h1>

                {/* ADD PRODUCT BUTTON */}
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 mb-4 rounded"
                >
                    + Add Product
                </button>

                {/* FORM */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-8 space-y-3 border p-4 rounded bg-gray-50"
                    >
                        <input
                            value={form.name}
                            placeholder="Name"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            className="border p-2 w-full"
                            required
                        />

                        <input
                            value={form.description}
                            placeholder="Description"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className="border p-2 w-full"
                            required
                        />

                        <input
                            value={form.price}
                            type="number"
                            placeholder="Price"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price: e.target.value,
                                })
                            }
                            className="border p-2 w-full"
                            required
                        />

                        <input
                            value={form.stock}
                            type="number"
                            placeholder="Stock"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    stock: e.target.value,
                                })
                            }
                            className="border p-2 w-full"
                            required
                        />

                        <input
                            value={form.category}
                            placeholder="Category"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value,
                                })
                            }
                            className="border p-2 w-full"
                            required
                        />

                        {/* IMAGE */}
                        <input
                            type="file"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    image: e.target.files[0],
                                })
                            }
                        />

                        {/* ✅ LATEST CHECKBOX */}
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.isLatest}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isLatest: e.target.checked,
                                    })
                                }
                            />
                            Mark as Latest Product
                        </label>

                        <div className="flex gap-2">
                            <button className="bg-black text-white px-4 py-2 rounded">
                                {editId ? "Update" : "Create"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-400 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* PRODUCTS */}
                <h2 className="text-xl mb-3">My Products</h2>

                {products.length === 0 && <p>No products found</p>}

                {products.map((p) => (
                    <div
                        key={p._id}
                        className="border p-4 mb-3 rounded shadow-sm"
                    >
                        <div className="flex justify-between">
                            <p className="font-bold text-lg">
                                {p.name}
                            </p>

                            {/* ✅ LATEST BADGE */}
                            {p.isLatest && (
                                <span className="bg-green-500 text-white px-2 py-1 text-xs rounded">
                                    Latest
                                </span>
                            )}
                        </div>

                        <p>{p.description}</p>
                        <p>Category: {p.category}</p>
                        <p>Price: ₹{p.price}</p>

                        <p>
                            Stock:{" "}
                            {p.stock < 1 ? (
                                <span className="text-red-500 font-bold">
                                    Out of Stock
                                </span>
                            ) : (
                                p.stock
                            )}
                        </p>

                        {/* IMAGE */}
                        {p.image && (
                            <img
                                src={`https://e-commerce-backend-e2mm.onrender.com${p.image}`}
                                className="w-24 h-24 object-cover mt-2"
                                alt="product"
                            />
                        )}

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => handleEdit(p)}
                                className="bg-yellow-500 px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(p._id)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* ORDERS */}
                <h2 className="text-xl mt-8 mb-3">Orders</h2>

                {orders.length === 0 && <p>No orders yet</p>}

                {orders.map((o) => (
                    <div
                        key={o._id}
                        className="border p-4 mb-3 rounded shadow-sm"
                    >
                        <p><b>Order ID:</b> {o._id}</p>
                        <p><b>Status:</b> {o.orderStatus}</p>
                        <p><b>Total:</b> ₹{o.totalAmount}</p>

                        <div className="mt-2">
                            <b>Items:</b>
                            {o.items?.map((item) => (
                                <div key={item._id} className="ml-4">
                                    <p>{item.product?.name}</p>
                                    <p>Qty: {item.quantity}</p>
                                </div>
                            ))}
                        </div>
<select
    value={o.orderStatus}
    onChange={(e) =>
        handleStatus(o._id, e.target.value)
    }
>
    <option value="">Update Status</option>

    <option value="Confirmed">Confirmed</option>
    <option value="Processing">Processing</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
</select>
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default VendorDashboard;