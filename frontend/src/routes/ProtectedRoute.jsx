import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {

    const {
        isAuthenticated,
        loading,
    } = useAuth();


    // User information load ho rahi hai
    if (loading) {

        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>

                    <p className="text-gray-400 mt-4">
                        Loading...
                    </p>

                </div>

            </div>
        );
    }


    // Login nahi hai
    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // Login hai
    return <Outlet />;
}


export default ProtectedRoute;