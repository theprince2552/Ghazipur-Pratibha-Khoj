import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    logoutUser,
} from "../services/authService";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadUser = async () => {

            const token = localStorage.getItem(
                "access_token"
            );

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response =
                    await getCurrentUser();

                setUser(
                    response.data || response.user
                );

            } catch (error) {

                logoutUser();
                setUser(null);

            } finally {

                setLoading(false);

            }
        };


        loadUser();

    }, []);


    const login = (loginResponse) => {

        const {
            access,
            refresh,
            user,
        } = loginResponse.data;

        localStorage.setItem(
            "access_token",
            access
        );

        localStorage.setItem(
            "refresh_token",
            refresh
        );

        setUser(user);
    };


    const logout = () => {

        logoutUser();
        setUser(null);

    };


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                loading,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const context = useContext(
        AuthContext
    );

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};