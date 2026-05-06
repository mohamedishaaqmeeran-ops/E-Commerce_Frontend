import { redirect } from "react-router";
import store from "../redux/store";
import { clearUser, setUser } from "../redux/authSlice";
import { getMe } from "../services/authServices";


const loadUser = async () => {
    const response = await getMe();

    if (!response || !response.user) {
        throw new Error("User not found");
    }

    const user = response.user;

   
    store.dispatch(setUser(user));

    return user;
};


export const userLoader = async () => {
    try {
        const user = await loadUser();

        
        if (user.role === "admin") {
            return redirect("/admin/dashboard");
        }

        if (user.role === "journalist") {
            return redirect("/journalist/dashboard");
        }

        return { user };
    } catch (error) {
        console.error("User loader error:", error);
        store.dispatch(clearUser());
        return redirect("/login");
    }
};


export const adminLoader = async () => {
    try {
        const user = await loadUser();

        if (user.role !== "admin") {
            if (user.role === "user") {
                return redirect("/dashboard");
            }

            if (user.role === "vendor") {
                return redirect("/vendor/dashboard");
            }

            return redirect("/login");
        }

        return { user };
    } catch (error) {
        console.error("Admin loader error:", error);
        store.dispatch(clearUser());
        return redirect("/login");
    }
};


export const vendorLoader = async () => {
    try {
        const user = await loadUser();

        if (user.role !== "vendor") {
            if (user.role === "user") {
                return redirect("/dashboard");
            }

            if (user.role === "admin") {
                return redirect("/admin/dashboard");
            }

            return redirect("/login");
        }

        return { user };
    } catch (error) {
        console.error("Vendor loader error:", error);
        store.dispatch(clearUser());
        return redirect("/login");
    }
};