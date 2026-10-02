import { useEffect, useState } from "react";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiMapPin,
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiRefreshCw,
    FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../api/axios";

function AdminCenters() {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingCenter, setEditingCenter] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        capacity: "",
        is_active: true,
    });

    // =====================================================
    // FETCH CENTERS
    // =====================================================

    const fetchCenters = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            const response = await api.get(
                "/exams/admin/centers/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCenters(response.data?.data || []);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load exam centers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCenters();
    }, []);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = () => {
        setEditingCenter(null);

        setFormData({
            name: "",
            address: "",
            capacity: "",
            is_active: true,
        });

        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (center) => {
        setEditingCenter(center);

        setFormData({
            name: center.name || "",
            address: center.address || "",
            capacity: center.capacity || "",
            is_active: center.is_active,
        });

        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingCenter(null);
    };

    // =====================================================
    // SAVE CENTER
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Please enter center name.");
            return;
        }

        if (!formData.address.trim()) {
            toast.error("Please enter center address.");
            return;
        }

        if (
            !formData.capacity ||
            Number(formData.capacity) <= 0
        ) {
            toast.error("Please enter a valid capacity.");
            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem("access_token");

            const data = {
                name: formData.name.trim(),
                address: formData.address.trim(),
                capacity: Number(formData.capacity),
                is_active: formData.is_active,
            };

            if (editingCenter) {
                await api.put(
                    `/exams/admin/centers/${editingCenter.id}/`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast.success(
                    "Exam center updated successfully."
                );
            } else {
                await api.post(
                    "/exams/admin/centers/",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast.success(
                    "Exam center added successfully."
                );
            }

            closeModal();
            fetchCenters();

        } catch (error) {
            console.error(error);

            const errors =
                error.response?.data?.errors;

            if (errors) {
                const firstError =
                    Object.values(errors)[0];

                toast.error(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : "Invalid center details."
                );
            } else {
                toast.error(
                    error.response?.data?.message ||
                    "Something went wrong."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DEACTIVATE CENTER
    // =====================================================

    const handleDeactivate = async (center) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${center.name}"?`
        );

        if (!confirmed) return;

        try {
            const token =
                localStorage.getItem("access_token");

            await api.delete(
                `/exams/admin/centers/${center.id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Exam center deactivated successfully."
            );

            fetchCenters();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to deactivate center."
            );
        }
    };

    // =====================================================
    // ACTIVATE CENTER
    // =====================================================

    const handleActivate = async (center) => {
        try {
            const token =
                localStorage.getItem("access_token");

            await api.put(
                `/exams/admin/centers/${center.id}/`,
                {
                    name: center.name,
                    address: center.address,
                    capacity: center.capacity,
                    is_active: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Exam center activated successfully."
            );

            fetchCenters();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to activate center."
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
                <div className="flex items-center gap-3 text-cyan-400">
                    <FiRefreshCw className="animate-spin" />
                    <span>Loading exam centers...</span>
                </div>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-[#050816] text-white px-4 py-6 sm:px-6 lg:px-8">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            Exam Centers
                        </h1>

                        <p className="text-gray-400 mt-1">
                            Manage examination centers and seat capacity.
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={fetchCenters}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>

                        <button
                            onClick={openAddModal}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition shadow-lg shadow-cyan-500/20"
                        >
                            <FiPlus />
                            Add Center
                        </button>

                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Total Centers
                                </p>
                                <h2 className="text-3xl font-bold mt-1">
                                    {centers.length}
                                </h2>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <FiMapPin size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Active Centers
                                </p>
                                <h2 className="text-3xl font-bold mt-1">
                                    {
                                        centers.filter(
                                            (center) =>
                                                center.is_active
                                        ).length
                                    }
                                </h2>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                <FiCheckCircle size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    Total Capacity
                                </p>
                                <h2 className="text-3xl font-bold mt-1">
                                    {
                                        centers.reduce(
                                            (total, center) =>
                                                total +
                                                Number(
                                                    center.capacity || 0
                                                ),
                                            0
                                        )
                                    }
                                </h2>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <FiUsers size={22} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* CENTER LIST */}
                {centers.length === 0 ? (

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center">
                        <FiMapPin
                            size={42}
                            className="mx-auto text-gray-500 mb-4"
                        />

                        <h3 className="text-xl font-semibold">
                            No Exam Centers
                        </h3>

                        <p className="text-gray-400 mt-2 mb-6">
                            Add your first examination center.
                        </p>

                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold"
                        >
                            <FiPlus />
                            Add Center
                        </button>
                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                        {centers.map((center) => {

                            const capacity =
                                Number(center.capacity || 0);

                            const available =
                                Number(
                                    center.available_seats || 0
                                );

                            const booked =
                                Math.max(
                                    capacity - available,
                                    0
                                );

                            const percentage =
                                capacity > 0
                                    ? Math.min(
                                        Math.round(
                                            (booked / capacity) * 100
                                        ),
                                        100
                                    )
                                    : 0;

                            return (
                                <div
                                    key={center.id}
                                    className={`rounded-2xl border p-5 transition ${
                                        center.is_active
                                            ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]"
                                            : "border-red-500/10 bg-red-500/[0.03] opacity-75"
                                    }`}
                                >

                                    {/* CARD TOP */}
                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex items-start gap-3">

                                            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                                                <FiMapPin size={21} />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {center.name}
                                                </h3>

                                                <p className="text-sm text-gray-400 mt-1">
                                                    {center.address ||
                                                        "Address not provided"}
                                                </p>
                                            </div>

                                        </div>

                                        {center.is_active ? (
                                            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                                                <FiCheckCircle size={12} />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                                                <FiXCircle size={12} />
                                                Inactive
                                            </span>
                                        )}

                                    </div>

                                    {/* CAPACITY */}
                                    <div className="mt-6">

                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">
                                                Seat Occupancy
                                            </span>

                                            <span className="font-medium">
                                                {booked} / {capacity}
                                            </span>
                                        </div>

                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                                            <div
                                                className="h-full rounded-full bg-cyan-400 transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />

                                        </div>

                                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                                            <span>
                                                {available} seats available
                                            </span>

                                            <span>
                                                {percentage}% filled
                                            </span>
                                        </div>

                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex gap-2 mt-6">

                                        <button
                                            onClick={() =>
                                                openEditModal(center)
                                            }
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm"
                                        >
                                            <FiEdit2 size={15} />
                                            Edit
                                        </button>

                                        {center.is_active ? (

                                            <button
                                                onClick={() =>
                                                    handleDeactivate(center)
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400 transition text-sm"
                                            >
                                                <FiTrash2 size={15} />
                                                Deactivate
                                            </button>

                                        ) : (

                                            <button
                                                onClick={() =>
                                                    handleActivate(center)
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/5 hover:bg-green-500/10 border border-green-500/10 text-green-400 transition text-sm"
                                            >
                                                <FiCheckCircle size={15} />
                                                Activate
                                            </button>

                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b1120] shadow-2xl">

                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">

                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingCenter
                                        ? "Edit Exam Center"
                                        : "Add Exam Center"}
                                </h2>

                                <p className="text-sm text-gray-400 mt-1">
                                    {editingCenter
                                        ? "Update center information."
                                        : "Create a new examination center."}
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                            >
                                <FiX />
                            </button>

                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-5"
                        >

                            {/* NAME */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Center Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. GPK Examination Center"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition"
                                />
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter complete center address"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition resize-none"
                                />
                            </div>

                            {/* CAPACITY */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Seat Capacity
                                </label>

                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="e.g. 200"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-400 transition"
                                />

                                <p className="text-xs text-gray-500 mt-2">
                                    Maximum number of students allowed at this center.
                                </p>
                            </div>

                            {/* ACTIVE */}
                            <label className="flex items-center gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_active:
                                                e.target.checked,
                                        }))
                                    }
                                    className="w-4 h-4 accent-cyan-400"
                                />

                                <span className="text-sm">
                                    Center is active
                                </span>

                            </label>

                            {/* BUTTONS */}
                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCenter
                                            ? "Update Center"
                                            : "Add Center"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminCenters;