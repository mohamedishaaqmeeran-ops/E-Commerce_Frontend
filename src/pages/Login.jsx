import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { loginUser } from "../services/authServices";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(formData);
            dispatch(setUser(response.user));
            toast.success(response.message);

            if (response.user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (response.user.role === "vendor") {
                navigate("/vendor/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Login failed";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-800 px-4">

            {/* CARD */}
            <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">

                {/* LOGO */}
                <div className="text-center">
                    <Link to="/" className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">
                                ANC
                            </span>
                        </div>
                    </Link>

                    <h2 className="text-3xl font-extrabold text-white">
                        Welcome Back 👋
                    </h2>

                    <p className="mt-2 text-sm text-gray-300">
                        Login to your ANC Shops account
                    </p>
                </div>

                {/* FORM */}
                <form className="mt-8 space-y-5" onSubmit={handleLogin}>

                    {/* EMAIL */}
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* FORGOT PASSWORD */}
                    <div className="flex justify-end">
                        <Link
                            to=""
                            className="text-sm text-sky-400 hover:text-sky-300"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition duration-300 shadow-lg"
                    >
                        Sign In
                    </button>
                </form>

                {/* REGISTER */}
                <div className="mt-6 text-center text-sm text-gray-300">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-sky-400 hover:text-sky-300 font-medium"
                    >
                        Register
                    </Link>
                </div>

                {/* BACK */}
                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;