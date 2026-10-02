import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    CreditCard,
    FileCheck,
    LogOut,
    Home,
    RefreshCw,
    ShieldCheck,
    Ticket,
    MapPin,
    MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            if (!token) {
                toast.error("Admin session expired. Please login again.");
                navigate("/admin/login");
                return;
            }

            const response = await api.get(
                "/exams/admin/applications/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("ADMIN APPLICATION RESPONSE:", response.data);

            const apiData = response.data;

            let applicationList = [];

            if (Array.isArray(apiData)) {
                applicationList = apiData;
            } else if (Array.isArray(apiData?.data)) {
                applicationList = apiData.data;
            } else if (Array.isArray(apiData?.results)) {
                applicationList = apiData.results;
            }

            setApplications(applicationList);

        } catch (error) {
            console.error("ADMIN APPLICATION ERROR:", error);

            if (error.response?.status === 401) {
                toast.error("Admin session expired. Please login again.");

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                navigate("/admin/login");
                return;
            }

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                error.message ||
                "Unable to load applications.";

            toast.error(errorMessage);

            setApplications([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const paidApplications = applications.filter(
        (item) => item.payment_status === "paid"
    );


    const admitCards = applications.filter(
        (item) => item.admit_card_created
    );

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white">

            {/* ================= HEADER ================= */}

            <header className="border-b border-white/10 bg-white/[0.03] backdrop-blur-xl">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">

                            <ShieldCheck
                                className="text-cyan-300"
                                size={24}
                            />

                        </div>

                        <div>
                            <h1 className="font-bold text-lg">
                                GPK Admin
                            </h1>

                            <p className="text-xs text-gray-500">
                                Ghazipur Pratibha Khoj 2026
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => navigate("/")}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
                        >
                            <Home size={16} />
                            Home
                        </button>

                        <button
                            onClick={() => navigate("/admin/admit-cards")}
                            className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-2.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-400/10"
                        >
                            <Ticket size={17} />
                            Admit Cards
                        </button>

                        <button
                            onClick={() => navigate("/admin/centers")}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
                        >
                            <MapPin size={17} />
                            Exam Centers
                        </button>

                        <button
                            onClick={() => navigate("/admin/payments")}
                            className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/[0.04] px-4 py-2.5 text-sm font-medium text-green-400 transition hover:bg-green-400/10"
                        >
                            <CreditCard size={17} />
                            Payments
                        </button>

                        <button
                            onClick={() => navigate("/admin/messages")}
                            className="flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/[0.04] px-4 py-2.5 text-sm font-medium text-purple-300 transition hover:bg-purple-400/10"
                        >
                            <MessageSquare size={17} />
                            Messages
                        </button>

                        <button
                            onClick={() => navigate("/admin/students")}
                            className="flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/[0.04] px-4 py-2.5 text-sm font-medium text-purple-300 transition hover:bg-purple-400/10"
                        >
                            <Users size={17} />
                            Students
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-400/20 text-red-300 hover:bg-red-400/10 transition text-sm"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                    </div>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* Welcome */}

                <div className="mb-8">

                    <p className="text-cyan-300 text-sm mb-1">
                        Welcome back
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Admin Dashboard
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Manage applications and admit cards.
                    </p>

                </div>


                {/* ================= STATS ================= */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    {/* Total */}

                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Submitted Applications
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {applications.length}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
                                <Users
                                    size={24}
                                    className="text-blue-300"
                                />
                            </div>

                        </div>

                    </div>


                    {/* Paid */}

                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Paid Applications
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {paidApplications.length}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center">
                                <CreditCard
                                    size={24}
                                    className="text-green-300"
                                />
                            </div>

                        </div>

                    </div>


                    {/* Admit Cards */}

                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Admit Cards Created
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {admitCards.length}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                                <FileCheck
                                    size={24}
                                    className="text-cyan-300"
                                />
                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= APPLICATIONS ================= */}

                <section className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">

                    <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        <div>
                            <h3 className="text-xl font-semibold">
                                Student Applications
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Submitted applications
                            </p>
                        </div>

                        <button
                            onClick={fetchApplications}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh
                        </button>

                    </div>


                    {/* Loading */}

                    {loading ? (

                        <div className="py-20 text-center text-gray-400">
                            Loading applications...
                        </div>

                    ) : applications.length === 0 ? (

                        <div className="py-20 text-center">

                            <Users
                                size={42}
                                className="mx-auto text-gray-600 mb-3"
                            />

                            <p className="text-gray-400">
                                No submitted applications found.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead>

                                    <tr className="border-b border-white/10 text-gray-400">

                                        <th className="text-left px-5 py-4">
                                            Application No.
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Student
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Class
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Center
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Payment
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Admit Card
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {applications.map(
                                        (application) => (

                                            <tr
                                                key={application.id}
                                                className="border-b border-white/5 hover:bg-white/[0.03] transition"
                                            >

                                                <td className="px-5 py-4 font-medium text-cyan-300">
                                                    {application.application_number}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {application.student_full_name}
                                                </td>

                                                <td className="px-5 py-4 text-gray-400">
                                                    {application.student_class}
                                                </td>

                                                <td className="px-5 py-4 text-gray-400">
                                                    {application.exam_center_name || "Not Assigned"}
                                                </td>

                                                <td className="px-5 py-4">

                                                    {application.payment_status ===
                                                        "paid" ? (

                                                        <span className="px-3 py-1 rounded-full text-xs bg-green-400/10 text-green-300 border border-green-400/20">
                                                            Paid
                                                        </span>

                                                    ) : (

                                                        <span className="px-3 py-1 rounded-full text-xs bg-red-400/10 text-red-300 border border-red-400/20">
                                                            Unpaid
                                                        </span>

                                                    )}

                                                </td>

                                                <td className="px-5 py-4">

                                                    {application.admit_card_created ? (

                                                        <span className="px-3 py-1 rounded-full text-xs bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                                                            Created
                                                        </span>

                                                    ) : (

                                                        <span className="px-3 py-1 rounded-full text-xs bg-yellow-400/10 text-yellow-300 border border-yellow-400/20">
                                                            Pending
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;