import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { registerUser } from "../services/authServices";
import register from "../assets/hero.png";

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            const response = await registerUser(userData);
            toast.success(response.message);

            navigate("/login");

        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Registration failed. Please try again...";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-800 p-4">

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-[0_0_50px_rgba(14,165,233,0.5)] overflow-hidden">

                {/* LEFT IMAGE */}
                <div className="hidden md:flex items-center justify-center bg-slate-900">
                    <img
                        src={register}
                        alt="Signup"
                        className="max-w-full h-115 object-contain rounded-lg shadow-lg"
                    />
                </div>

                {/* FORM */}
                <div className="p-8">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <Link to="/" className="flex items-center justify-center space-x-2">
                            <div className="w-14 h-12 bg-sky-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">ANC</span>
                            </div>
                        </Link>

                        <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
                            Create Your ANC Shops Account
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Or{" "}
                            <Link
                                to="/login"
                                className="font-medium text-sky-600 hover:text-sky-800"
                            >
                                sign in to your account
                            </Link>
                        </p>
                    </div>

                    {/* FORM */}
                    <form className="space-y-6" onSubmit={handleRegister}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-sky-500 focus:border-sky-500"
                                value={formData.name}
                                onChange={e =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-sky-500 focus:border-sky-500"
                                value={formData.email}
                                onChange={e =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-sky-500 focus:border-sky-500"
                                value={formData.password}
                                onChange={e =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-md text-white bg-sky-600 hover:bg-sky-700 transition cursor-pointer"
                        >
                            Register
                        </button>
                    </form>

                    {/* FOOTER TEXT */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            By signing up, you agree to our Terms and Privacy Policy.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;