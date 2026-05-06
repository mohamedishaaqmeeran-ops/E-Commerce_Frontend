import { redirect } from 'react-router';
import { clearUser, setUser } from '../redux/authSlice';
import store from '../redux/store';
import { getMe } from '../services/authServices';

const authLoader = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return redirect('/login');
    }

    try {
        const response = await getMe();
        store.dispatch(setUser(response.user));
        return response;
    } catch (error) {
        console.error('Auth loader error:', error);
        store.dispatch(clearUser());
        return redirect('/login');
    }
};

export default authLoader;