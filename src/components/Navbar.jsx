import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearUser, setUser } from "../redux/authSlice";
import { logoutUser } from "../services/authServices";
import { useRef, useState, useEffect } from "react";
import logo from "../assets/hero.png";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            dispatch(clearUser());

            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        } catch (error) {
            dispatch(clearUser());
            navigate("/login", { replace: true });
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePicture", file);

        try {
            const response = await fetch(
                "http://localhost:3001/api/v1/auth/upload/profile-picture",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            dispatch(setUser(data.user));

            toast.success("Profile picture updated successfully");

            setDropdownOpen(false);
            e.target.value = "";
        } catch (error) {
            toast.error(error.message || "Upload failed");
        }
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setDropdownOpen(false);
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const getProfileImage = () => {
        if (!user?.profilePicture) return null;

        const path = user.profilePicture;

        if (path.startsWith("http")) return path;

        return `http://localhost:3001/${path.replace(/^\/+/, "").replace(/\\/g, "/")}`;
    };

    const profileImage = getProfileImage();

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2">
                        <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
                        <span className="hidden sm:block text-xl font-bold text-white">
                            Aura Shops
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center space-x-6">

                        <Link to="/" className="text-white font-medium hover:text-cyan-300">
                            Home
                        </Link>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-white hover:text-cyan-300">
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="relative" onClick={(e) => e.stopPropagation()}>

                                {/* Profile Section */}
                                <div
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-900/20"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-cyan-600 flex items-center justify-center text-white">

                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-bold">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        )}

                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-300">
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Dropdown */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 overflow-hidden">

                                        <Link
                                            to={
                                                user?.role === "admin"
                                                    ? "/admin/dashboard"
                                                    : user?.role === "vendor"
                                                        ? "/vendor/dashboard"
                                                        : "/dashboard"
                                            }
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-3 hover:bg-slate-800"
                                        >
                                            Dashboard
                                        </Link>

                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-800"
                                        >
                                            Update Profile Picture
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20"
                                        >
                                            Logout
                                        </button>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleUpload}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="sm:hidden text-3xl text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="sm:hidden bg-slate-900 text-white px-4 py-4 space-y-4">

                    <Link to="/" onClick={() => setMenuOpen(false)} className="block">
                        Home
                    </Link>

                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="block">
                                Login
                            </Link>

                            <Link to="/register" onClick={() => setMenuOpen(false)} className="block">
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={
                                    user?.role === "admin"
                                        ? "/admin/dashboard"
                                        : user?.role === "vendor"
                                            ? "/vendor/dashboard"
                                            : "/dashboard"
                                }
                                onClick={() => setMenuOpen(false)}
                                className="block"
                            >
                                Dashboard
                            </Link>

                            <button onClick={handleLogout} className="block text-red-400">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;