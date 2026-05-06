// AdminDashboard.jsx

import { Navigate, useLoaderData } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../pages/Footer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    createShop,
    deleteShop,
    getAllShops,
    updateShop,
    createVendor,
    getAllVendors,
    deleteVendor,
    updateVendor
} from "../services/adminServices";

const AdminDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);

    const [shops, setShops] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [activeTab, setActiveTab] = useState("shops");
    const [loading, setLoading] = useState(false);

    const [viewShop, setViewShop] = useState(null);

    const [showShopForm, setShowShopForm] = useState(false);
    const [editingShop, setEditingShop] = useState(null);

    const [shopData, setShopData] = useState({
        name: "",
        description: "",
        address: "",
        logo: null
    });

    const [showVendorForm, setShowVendorForm] = useState(false);
    const [showEditVendorForm, setShowEditVendorForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);

    const [vendorData, setVendorData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        shopId: ""
    });

    if (user.role !== "admin") {
        toast.error("Unauthorized Access");
        return <Navigate to="/login" replace />;
    }

    const fetchData = async () => {
        try {
            setLoading(true);

            const [shopsRes, vendorsRes] = await Promise.all([
                getAllShops(),
                getAllVendors()
            ]);

            setShops(shopsRes.shops || []);
            setVendors(vendorsRes.vendors || []);
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ============================
       Shop Management
    ============================ */

const handleShopSubmit = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();

        formData.append("name", shopData.name);
        formData.append("description", shopData.description);
        formData.append("address", shopData.address);

        // Only append logo if a new file is selected
        if (shopData.logo && shopData.logo instanceof File) {
            formData.append("logo", shopData.logo);
        }

        if (editingShop) {
            await updateShop(editingShop._id, formData);
            toast.success("Shop updated successfully");
        } else {
            await createShop(formData);
            toast.success("Shop created successfully");
        }

        // Reset form
        setShopData({
            name: "",
            description: "",
            address: "",
            logo: null,
        });

        setEditingShop(null);
        setShowShopForm(false);
        fetchData();

    } catch (error) {
        console.error(
            "Shop Submit Error:",
            error.response?.data || error
        );

        toast.error(
            error.response?.data?.message ||
            "Failed to save shop"
        );
    }
};

    const handleDeleteShop = async (id) => {
        if (!window.confirm("Delete this shop?")) return;

        try {
            await deleteShop(id);
            toast.success("Shop deleted successfully");
            fetchData();
        } catch {
            toast.error("Failed to delete shop");
        }
    };

    /* ============================
       Vendor Management
    ============================ */

    const handleCreateVendor = async (e) => {
        e.preventDefault();

        try {
            await createVendor(vendorData);

            toast.success("Vendor created successfully");

            setShowVendorForm(false);
            setVendorData({
                name: "",
                email: "",
                password: "",
                phone: "",
                shopId: ""
            });

            fetchData();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create vendor"
            );
        }
    };

    const handleUpdateVendor = async (e) => {
    e.preventDefault();

    try {
        const updateData = {
            name: vendorData.name,
            email: vendorData.email,
            phone: vendorData.phone,
            assignedShop: vendorData.shopId
        };

        if (vendorData.password.trim()) {
            updateData.password = vendorData.password;
        }

        await updateVendor(editingVendor._id, updateData);

        toast.success("Vendor updated successfully");

        setShowEditVendorForm(false);
        setEditingVendor(null);

        setVendorData({
            name: "",
            email: "",
            password: "",
            phone: "",
            shopId: ""
        });

        fetchData();
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
            "Failed to update vendor"
        );
    }
};

    const handleDeleteVendor = async (id) => {
        if (!window.confirm("Delete this vendor?")) return;

        try {
            await deleteVendor(id);
            toast.success("Vendor deleted successfully");
            fetchData();
        } catch {
            toast.error("Failed to delete vendor");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black-950 via-blue to-blue-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-500 mb-8">
                    Welcome,
                    <span className="text-blue-950 ml-2">
                        {user.name}
                    </span>
                </h1>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-700 mb-8">
                    <button
                        onClick={() => setActiveTab("shops")}
                        className={`pb-3 ${
                            activeTab === "shops"
                                ? "border-b-2 border-blue-400 text-blue-400"
                                : "text-gray-400"
                        }`}
                    >
                        Shops
                    </button>

                    <button
                        onClick={() => setActiveTab("vendors")}
                        className={`pb-3 ${
                            activeTab === "vendors"
                                ? "border-b-2 border-blue-400 text-blue-400"
                                : "text-gray-400"
                        }`}
                    >
                        Vendors
                    </button>
                </div>

                {/* Shops Section */}
                {activeTab === "shops" && (
                    <div>
                        <button
                            onClick={() =>
                                setShowShopForm(!showShopForm)
                            }
                            className="mb-6 bg-blue-500 hover:bg-yellow-600 text-white px-5 py-2 rounded"
                        >
                            {showShopForm
                                ? "Cancel"
                                : "Add Shop"}
                        </button>

                        {showShopForm && (
                            <form
                                onSubmit={handleShopSubmit}
                                className="bg-white p-6 rounded-lg mb-6 space-y-4"
                            >
                                <input
                                    type="text"
                                    placeholder="Shop Name"
                                    value={shopData.name}
                                    onChange={(e) =>
                                        setShopData({
                                            ...shopData,
                                            name: e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                />

                                <textarea
                                    placeholder="Description"
                                    value={shopData.description}
                                    onChange={(e) =>
                                        setShopData({
                                            ...shopData,
                                            description:
                                                e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={shopData.address}
                                    onChange={(e) =>
                                        setShopData({
                                            ...shopData,
                                            address:
                                                e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                />

                              

                                <button className="bg-green-600 text-white px-5 py-2 rounded">
                                    {editingShop
                                        ? "Update Shop"
                                        : "Create Shop"}
                                </button>
                            </form>
                        )}

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shops.map((shop) => (
                                <div
                                    key={shop._id}
                                    className="bg-white rounded-lg shadow-lg p-5"
                                >
                                    {shop.logo && (
                                        <img
                                            src={`https://e-commerce-backend-e2mm.onrender.com/${shop.logo}`}
                                            alt={shop.name}
                                            className="w-full h-48 object-cover rounded mb-4"
                                        />
                                    )}

                                    <h3 className="text-xl font-bold mb-2">
                                        {shop.name}
                                    </h3>

                                    <p className="text-gray-600 mb-4">
                                        {shop.address}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setViewShop(shop)
                                            }
                                            className="bg-blue-500 text-white px-4 py-1 rounded"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingShop(
                                                    shop
                                                );
                                                setShopData({
                                                    name: shop.name,
                                                    description:
                                                        shop.description,
                                                    address:
                                                        shop.address,
                                                    logo: null
                                                });
                                                setShowShopForm(
                                                    true
                                                );
                                            }}
                                            className="bg-yellow-500 text-white px-4 py-1 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteShop(
                                                    shop._id
                                                )
                                            }
                                            className="bg-red-500 text-white px-4 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vendors Section */}
                {activeTab === "vendors" && (
                    <div>
                        <button
                            onClick={() =>
                                setShowVendorForm(!showVendorForm)
                            }
                            className="mb-6 bg-blue-500 text-white px-5 py-2 rounded"
                        >
                            {showVendorForm
                                ? "Cancel"
                                : "Add Vendor"}
                        </button>

                        {/* Vendor Create Form */}
                        {showVendorForm && (
                            <form
                                onSubmit={handleCreateVendor}
                                className="bg-white p-6 rounded mb-6 space-y-4"
                            >
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={vendorData.name}
                                    onChange={(e) =>
                                        setVendorData({
                                            ...vendorData,
                                            name: e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={vendorData.email}
                                    onChange={(e) =>
                                        setVendorData({
                                            ...vendorData,
                                            email: e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={vendorData.password}
                                    onChange={(e) =>
                                        setVendorData({
                                            ...vendorData,
                                            password:
                                                e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Phone"
                                    value={vendorData.phone}
                                    onChange={(e) =>
                                        setVendorData({
                                            ...vendorData,
                                            phone: e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                />

                                <select
                                    value={vendorData.shopId}
                                    onChange={(e) =>
                                        setVendorData({
                                            ...vendorData,
                                            shopId:
                                                e.target.value
                                        })
                                    }
                                    className="w-full border p-3 rounded"
                                    required
                                >
                                    <option value="">
                                        Select Shop
                                    </option>
                                    {shops.map((shop) => (
                                        <option
                                            key={shop._id}
                                            value={shop._id}
                                        >
                                            {shop.name}
                                        </option>
                                    ))}
                                </select>

                                <button className="bg-green-600 text-white px-5 py-2 rounded">
                                    Create Vendor
                                </button>
                            </form>
                        )}

                        {/* Vendors Table */}
                        <div className="bg-white rounded-lg shadow overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-4 text-left">
                                            Name
                                        </th>
                                        <th className="p-4 text-left">
                                            Email
                                        </th>
                                        <th className="p-4 text-left">
                                            Phone
                                        </th>
                                        <th className="p-4 text-left">
                                            Shop
                                        </th>
                                        <th className="p-4 text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {vendors.map((vendor) => (
                                        <tr
                                            key={vendor._id}
                                            className="border-t"
                                        >
                                            <td className="p-4">
                                                {vendor.name}
                                            </td>
                                            <td className="p-4">
                                                {vendor.email}
                                            </td>
                                            <td className="p-4">
                                                {vendor.phone}
                                            </td>
                                            <td className="p-4">
                                                {vendor.assignedShop
                                                    ?.name ||
                                                    "N/A"}
                                            </td>
                                            <td className="p-4 text-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingVendor(
                                                            vendor
                                                        );
                                                        setVendorData(
                                                            {
                                                                name: vendor.name,
                                                                email: vendor.email,
                                                                password: "",
                                                                phone: vendor.phone,
                                                                shopId:
                                                                    vendor.assignedShop
                                                                        ?._id ||
                                                                    ""
                                                            }
                                                        );
                                                        setShowEditVendorForm(
                                                            true
                                                        );
                                                    }}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteVendor(
                                                            vendor._id
                                                        )
                                                    }
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
{showEditVendorForm && (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
                Edit Vendor
            </h2>

            <form onSubmit={handleUpdateVendor} className="space-y-4">
                <input
                    type="text"
                    value={vendorData.name}
                    onChange={(e) =>
                        setVendorData({
                            ...vendorData,
                            name: e.target.value
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Name"
                    required
                />

                <input
                    type="email"
                    value={vendorData.email}
                    onChange={(e) =>
                        setVendorData({
                            ...vendorData,
                            email: e.target.value
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Email"
                    required
                />

                <input
                    type="text"
                    value={vendorData.phone}
                    onChange={(e) =>
                        setVendorData({
                            ...vendorData,
                            phone: e.target.value
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="Phone"
                    required
                />

                <input
                    type="password"
                    value={vendorData.password}
                    onChange={(e) =>
                        setVendorData({
                            ...vendorData,
                            password: e.target.value
                        })
                    }
                    className="w-full border p-3 rounded"
                    placeholder="New Password (optional)"
                />

                <select
                    value={vendorData.shopId}
                    onChange={(e) =>
                        setVendorData({
                            ...vendorData,
                            shopId: e.target.value
                        })
                    }
                    className="w-full border p-3 rounded"
                    required
                >
                    <option value="">Select Shop</option>
                    {shops.map((shop) => (
                        <option
                            key={shop._id}
                            value={shop._id}
                        >
                            {shop.name}
                        </option>
                    ))}
                </select>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-2 rounded"
                    >
                        Update
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowEditVendorForm(false);
                            setEditingVendor(null);
                        }}
                        className="flex-1 bg-gray-500 text-white py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
)}
                {/* Shop View Modal */}
                {viewShop && (
                    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 w-[450px]">
                            <h2 className="text-2xl font-bold mb-4">
                                Shop Details
                            </h2>

                            {viewShop.logo && (
                                <img
                                    src={`https://e-commerce-backend-e2mm.onrender.com/${viewShop.logo}`}
                                    alt={viewShop.name}
                                    className="w-full h-56 object-cover rounded mb-4"
                                />
                            )}

                            <p>
                                <strong>Name:</strong>{" "}
                                {viewShop.name}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {viewShop.description}
                            </p>

                            <p>
                                <strong>Address:</strong>{" "}
                                {viewShop.address}
                            </p>

                            <button
                                onClick={() =>
                                    setViewShop(null)
                                }
                                className="mt-6 w-full bg-red-500 text-white py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;