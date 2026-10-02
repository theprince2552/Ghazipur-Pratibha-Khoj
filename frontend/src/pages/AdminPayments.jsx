import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CreditCard,
    Users,
    CheckCircle,
    Clock,
    RefreshCw,
    Search,
    ArrowLeft,
    IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";

const AdminPayments = () => {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [search, setSearch] = useState("");

    // =====================================================
    // FETCH PAYMENTS
    // =====================================================

    const fetchPayments = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("access_token");

            if (!token) {
                toast.error(
                    "Admin session expired. Please login again."
                );

                navigate("/admin/login");
                return;
            }

            const response = await api.get(
                "/payments/admin/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const apiData = response.data;

            let paymentList = [];

            if (Array.isArray(apiData)) {
                paymentList = apiData;
            } else if (Array.isArray(apiData?.data)) {
                paymentList = apiData.data;
            } else if (
                Array.isArray(apiData?.results)
            ) {
                paymentList = apiData.results;
            }

            setPayments(paymentList);

        } catch (error) {
            console.error(
                "ADMIN PAYMENT ERROR:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem(
                    "access_token"
                );
                localStorage.removeItem(
                    "refresh_token"
                );

                toast.error(
                    "Admin session expired. Please login again."
                );

                navigate("/admin/login");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Unable to load payments."
            );

            setPayments([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // =====================================================
    // MARK AS PAID
    // =====================================================

    const handleMarkPaid = async (payment) => {

        const confirmed = window.confirm(
            `Mark payment as PAID for ${payment.student_name}?`
        );

        if (!confirmed) return;

        try {
            setProcessingId(payment.user_id);

            const token =
                localStorage.getItem("access_token");

            await api.post(
                `/payments/admin/${payment.user_id}/mark-paid/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Payment marked as paid successfully."
            );

            await fetchPayments();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to update payment."
            );

        } finally {
            setProcessingId(null);
        }
    };

    // =====================================================
    // FILTER
    // =====================================================

    const filteredPayments = payments.filter(
        (payment) => {

            const query =
                search.toLowerCase().trim();

            if (!query) return true;

            return (
                payment.student_name
                    ?.toLowerCase()
                    .includes(query) ||

                payment.email
                    ?.toLowerCase()
                    .includes(query) ||

                payment.mobile
                    ?.toString()
                    .includes(query) ||

                payment.application_number
                    ?.toLowerCase()
                    .includes(query)
            );
        }
    );

    // =====================================================
    // STATS
    // =====================================================

    const paidPayments = payments.filter(
        (payment) => payment.status === "paid"
    );

    const unpaidPayments = payments.filter(
        (payment) => payment.status !== "paid"
    );

    const totalCollected = paidPayments.reduce(
        (total, payment) =>
            total + Number(payment.amount || 0),
        0
    );

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

                <div className="flex items-center gap-3 text-cyan-400">

                    <RefreshCw
                        size={20}
                        className="animate-spin"
                    />

                    <span>
                        Loading payments...
                    </span>

                </div>

            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-[#050816] text-white">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="border-b border-white/10 bg-white/[0.03] backdrop-blur-xl">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                            <button
                                onClick={() =>
                                    navigate(
                                        "/admin/dashboard"
                                    )
                                }
                                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <div className="w-11 h-11 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">

                                <CreditCard
                                    className="text-green-300"
                                    size={23}
                                />

                            </div>

                            <div>

                                <h1 className="font-bold text-lg">
                                    Payment Management
                                </h1>

                                <p className="text-xs text-gray-500">
                                    Manage student payments
                                </p>

                            </div>

                        </div>

                        <button
                            onClick={fetchPayments}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm"
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            <span className="hidden sm:inline">
                                Refresh
                            </span>

                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* TITLE */}

                <div className="mb-8">

                    <p className="text-green-300 text-sm mb-1">
                        Finance
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Student Payments
                    </h2>

                    <p className="text-gray-400 mt-2">
                        View and manage payment status for all students.
                    </p>

                </div>


                {/* =================================================
                    STATS
                ================================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    {/* TOTAL */}

                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-400 text-sm">
                                    Total Payments
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {payments.length}
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


                    {/* PAID */}

                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-400 text-sm">
                                    Paid
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {paidPayments.length}
                                </p>

                            </div>

                            <div className="w-12 h-12 rounded-xl bg-green-400/10 flex items-center justify-center">

                                <CheckCircle
                                    size={24}
                                    className="text-green-300"
                                />

                            </div>

                        </div>

                    </div>


                    {/* COLLECTED */}

                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-400 text-sm">
                                    Total Collected
                                </p>

                                <p className="text-3xl font-bold mt-2 flex items-center gap-1">

                                    <IndianRupee
                                        size={23}
                                    />

                                    {totalCollected}

                                </p>

                            </div>

                            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">

                                <CreditCard
                                    size={24}
                                    className="text-cyan-300"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="mb-5">

                    <div className="relative max-w-xl">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search by name, application number, email or mobile..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 outline-none focus:border-cyan-400 transition text-sm"
                        />

                    </div>

                </div>


                {/* =================================================
                    PAYMENT TABLE
                ================================================= */}

                <section className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">

                    <div className="p-5 border-b border-white/10">

                        <h3 className="text-xl font-semibold">
                            Payment Records
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {filteredPayments.length} record
                            {filteredPayments.length !== 1
                                ? "s"
                                : ""}{" "}
                            found
                        </p>

                    </div>


                    {filteredPayments.length === 0 ? (

                        <div className="py-20 text-center">

                            <CreditCard
                                size={42}
                                className="mx-auto text-gray-600 mb-3"
                            />

                            <p className="text-gray-400">
                                No payment records found.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead>

                                    <tr className="border-b border-white/10 text-gray-400">

                                        <th className="text-left px-5 py-4">
                                            Student
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Application
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Amount
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Status
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Method
                                        </th>

                                        <th className="text-left px-5 py-4">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredPayments.map(
                                        (payment) => (

                                            <tr
                                                key={payment.id}
                                                className="border-b border-white/5 hover:bg-white/[0.03] transition"
                                            >

                                                {/* STUDENT */}

                                                <td className="px-5 py-4">

                                                    <div className="font-medium">
                                                        {payment.student_name ||
                                                            "Unknown"}
                                                    </div>

                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {payment.email}
                                                    </div>

                                                    <div className="text-xs text-gray-500">
                                                        {payment.mobile}
                                                    </div>

                                                </td>


                                                {/* APPLICATION */}

                                                <td className="px-5 py-4 text-cyan-300 font-medium">

                                                    {payment.application_number ||
                                                        "Not created"}

                                                </td>


                                                {/* AMOUNT */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-1 font-semibold">

                                                        <IndianRupee
                                                            size={15}
                                                        />

                                                        {payment.amount}

                                                    </div>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    {payment.status ===
                                                    "paid" ? (

                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-400/10 text-green-300 border border-green-400/20">

                                                            <CheckCircle
                                                                size={12}
                                                            />

                                                            Paid

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-400/10 text-yellow-300 border border-yellow-400/20">

                                                            <Clock
                                                                size={12}
                                                            />

                                                            {payment.status
                                                                ? payment.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                  payment.status.slice(
                                                                      1
                                                                  )
                                                                : "Pending"}

                                                        </span>

                                                    )}

                                                </td>


                                                {/* METHOD */}

                                                <td className="px-5 py-4">

                                                    {payment.payment_method ===
                                                    "manual" ? (

                                                        <span className="px-3 py-1 rounded-full text-xs bg-purple-400/10 text-purple-300 border border-purple-400/20">
                                                            Manual
                                                        </span>

                                                    ) : (

                                                        <span className="px-3 py-1 rounded-full text-xs bg-blue-400/10 text-blue-300 border border-blue-400/20">
                                                            Razorpay
                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACTION */}

                                                <td className="px-5 py-4">

                                                    {payment.status ===
                                                    "paid" ? (

                                                        <span className="text-xs text-green-400">
                                                            Payment complete
                                                        </span>

                                                    ) : (

                                                        <button
                                                            onClick={() =>
                                                                handleMarkPaid(
                                                                    payment
                                                                )
                                                            }
                                                            disabled={
                                                                processingId ===
                                                                payment.user_id
                                                            }
                                                            className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-400/20 text-green-300 transition text-xs font-medium disabled:opacity-50"
                                                        >

                                                            {processingId ===
                                                            payment.user_id
                                                                ? "Updating..."
                                                                : "Mark as Paid"}

                                                        </button>

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

export default AdminPayments;