import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Users,
    MessageSquare,
    Send,
    CheckSquare,
    Square,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";

const AdminMessages = () => {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // =========================
    // FETCH STUDENTS
    // =========================

    const fetchStudents = async (searchValue = "") => {
        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            if (!token) {
                toast.error("Admin session expired.");
                navigate("/admin/login");
                return;
            }

            const response = await api.get(
                `/messages/admin/students/?search=${encodeURIComponent(
                    searchValue
                )}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;

            if (Array.isArray(data?.data)) {
                setStudents(data.data);
            } else {
                setStudents([]);
            }

        } catch (error) {
            console.error(
                "ADMIN MESSAGE STUDENTS ERROR:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                toast.error("Admin session expired.");
                navigate("/admin/login");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to load students."
            );

            setStudents([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // =========================
    // SEARCH
    // =========================

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        fetchStudents(value);
    };

    // =========================
    // SELECT STUDENT
    // =========================

    const toggleStudent = (studentId) => {
        setSelectedStudents((previous) => {
            if (previous.includes(studentId)) {
                return previous.filter(
                    (id) => id !== studentId
                );
            }

            return [...previous, studentId];
        });
    };

    // =========================
    // SELECT ALL
    // =========================

    const allSelected =
        students.length > 0 &&
        students.every((student) =>
            selectedStudents.includes(student.id)
        );

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedStudents([]);
            return;
        }

        setSelectedStudents(
            students.map((student) => student.id)
        );
    };

    // =========================
    // SEND MESSAGE
    // =========================

    const handleSendMessage = async () => {
        if (selectedStudents.length === 0) {
            toast.error(
                "Please select at least one student."
            );
            return;
        }

        if (!message.trim()) {
            toast.error(
                "Please enter a message."
            );
            return;
        }

        try {
            setSending(true);

            const token =
                localStorage.getItem("access_token");

            const response = await api.post(
                "/messages/admin/send/",
                {
                    recipient_ids: selectedStudents,
                    message: message.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                response.data?.message ||
                "Message sent successfully."
            );

            setMessage("");
            setSelectedStudents([]);

        } catch (error) {
            console.error(
                "SEND MESSAGE ERROR:",
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
                    "Admin session expired."
                );

                navigate("/admin/login");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to send message."
            );

        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white">

            {/* ================= HEADER ================= */}

            <header className="border-b border-white/10 bg-[#0b0f1d]/90 backdrop-blur-xl">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/dashboard"
                                )
                            }
                            className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <h1 className="text-xl font-bold">
                                Admin Messages
                            </h1>

                            <p className="text-sm text-gray-500">
                                Send messages to registered students
                            </p>
                        </div>

                    </div>

                </div>

            </header>

            {/* ================= MAIN ================= */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ================= STUDENT PANEL ================= */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">

                        <div className="p-5 border-b border-white/10">

                            <div className="flex items-center justify-between mb-4">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">

                                        <Users
                                            size={20}
                                            className="text-purple-300"
                                        />

                                    </div>

                                    <div>
                                        <h2 className="font-semibold">
                                            Select Students
                                        </h2>

                                        <p className="text-xs text-gray-500">
                                            {selectedStudents.length} selected
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* SEARCH */}

                            <div className="relative">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Search by name, email or mobile..."
                                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-600 focus:border-purple-400/40"
                                />

                            </div>

                        </div>

                        {/* SELECT ALL */}

                        <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02]">

                            <button
                                onClick={toggleSelectAll}
                                className="flex items-center gap-3 text-sm font-medium text-gray-200 hover:text-white"
                            >
                                {allSelected ? (
                                    <CheckSquare
                                        size={19}
                                        className="text-purple-400"
                                    />
                                ) : (
                                    <Square
                                        size={19}
                                        className="text-gray-500"
                                    />
                                )}

                                Select All
                            </button>

                        </div>

                        {/* STUDENTS */}

                        <div className="max-h-[520px] overflow-y-auto">

                            {loading ? (

                                <div className="flex items-center justify-center py-16 text-gray-500">

                                    <Loader2
                                        size={24}
                                        className="animate-spin mr-2"
                                    />

                                    Loading students...

                                </div>

                            ) : students.length === 0 ? (

                                <div className="py-16 text-center text-gray-500">

                                    No students found.

                                </div>

                            ) : (

                                students.map((student) => {

                                    const selected =
                                        selectedStudents.includes(
                                            student.id
                                        );

                                    return (
                                        <button
                                            key={student.id}
                                            onClick={() =>
                                                toggleStudent(
                                                    student.id
                                                )
                                            }
                                            className={`w-full flex items-center gap-3 px-5 py-4 text-left border-b border-white/5 transition ${
                                                selected
                                                    ? "bg-purple-400/[0.08]"
                                                    : "hover:bg-white/[0.04]"
                                            }`}
                                        >

                                            {selected ? (
                                                <CheckSquare
                                                    size={19}
                                                    className="text-purple-400 shrink-0"
                                                />
                                            ) : (
                                                <Square
                                                    size={19}
                                                    className="text-gray-600 shrink-0"
                                                />
                                            )}

                                            <div className="min-w-0">

                                                <p className="font-medium truncate">
                                                    {student.full_name}
                                                </p>

                                                <p className="text-xs text-gray-500 truncate">
                                                    {student.email}
                                                </p>

                                                <p className="text-xs text-gray-600">
                                                    {student.mobile}
                                                </p>

                                            </div>

                                        </button>
                                    );
                                })

                            )}

                        </div>

                    </div>

                    {/* ================= MESSAGE PANEL ================= */}

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

                        <div className="flex items-center gap-3 mb-6">

                            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">

                                <MessageSquare
                                    size={20}
                                    className="text-cyan-300"
                                />

                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Compose Message
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Send a message to selected students
                                </p>
                            </div>

                        </div>

                        {/* SELECTED COUNT */}

                        <div className="rounded-xl border border-purple-400/20 bg-purple-400/[0.05] px-4 py-3 mb-5">

                            <p className="text-sm text-purple-200">

                                {selectedStudents.length === 0
                                    ? "No students selected"
                                    : `${selectedStudents.length} student${
                                          selectedStudents.length > 1
                                              ? "s"
                                              : ""
                                      } selected`
                                }

                            </p>

                        </div>

                        {/* TEXTAREA */}

                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            maxLength={5000}
                            rows={12}
                            placeholder="Type your message here..."
                            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                        />

                        <div className="flex items-center justify-between mt-2 mb-6">

                            <p className="text-xs text-gray-600">
                                Maximum 5000 characters
                            </p>

                            <p className="text-xs text-gray-500">
                                {message.length}/5000
                            </p>

                        </div>

                        {/* SEND */}

                        <button
                            onClick={handleSendMessage}
                            disabled={
                                sending ||
                                selectedStudents.length === 0 ||
                                !message.trim()
                            }
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >

                            {sending ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />

                                    Send Message
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AdminMessages;