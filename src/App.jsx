import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./redux/store";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

// 🔥 NEW PAGES
import Products from "./pages/Products";
import LatestProducts from "./pages/LatestProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import VendorDashboard from "./pages/VendorDashboard";
import { vendorLoader } from "./loaders/roleLoaders";
// Loaders
import { adminLoader, userLoader } from "./loaders/roleLoaders";

// Loader UI
const LoaderUI = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

// ROUTER
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  /*
  ========================================
  USER ROUTES
  ========================================
  */
  {
    path: "/dashboard",
    element: <UserDashboard />,
    loader: userLoader,
    hydrateFallbackElement: <LoaderUI />,
  },

  {
    path: "/products",
    element: <Products />,
    loader: userLoader,
    hydrateFallbackElement: <LoaderUI />,
  },

  {
    path: "/latest",
    element: <LatestProducts />,
    loader: userLoader,
    hydrateFallbackElement: <LoaderUI />,
  },

  {
    path: "/product/:id",
    element: <ProductDetails />,
    loader: userLoader,
    hydrateFallbackElement: <LoaderUI />,
  },

  {
    path: "/cart",
    element: <Cart />,
    loader: userLoader,
    hydrateFallbackElement: <LoaderUI />,

  },

  {
    path:"/checkout",
    element: <h1>Checkout Page - Coming Soon</h1>,
    loader: userLoader,
    hydrateFallbackElement: <LoaderUI />,
  },

  /*
  ========================================
  ADMIN ROUTES
  ========================================
  */
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    loader: adminLoader,
    hydrateFallbackElement: <LoaderUI />,
  },
  {
  path: "/vendor/dashboard",
  element: <VendorDashboard />,
  loader: vendorLoader,
},
]);

// APP
const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </Provider>
  );
};

export default App;