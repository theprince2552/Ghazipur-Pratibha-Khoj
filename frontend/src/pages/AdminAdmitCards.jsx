import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    MapPin,
    RefreshCw,
    ShieldCheck,
    Ticket,
    Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../api/axios";

const AdminAdmitCards = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [centers, setCenters] = useState([]);

    const [selectedStudents, setSelectedStudents] = useState([]);

    const [examCenter, setExamCenter] = useState("");
    const [examVenue, setExamVenue] = useState("");
    const [examDate, setExamDate] = useState("");
    const [examHour, setExamHour] = useState("");
    const [examMinute, setExamMinute] = useState("");
    const [examPeriod, setExamPeriod] = useState("AM");

    const [reportingHour, setReportingHour] = useState("");
    const [reportingMinute, setReportingMinute] = useState("");
    const [reportingPeriod, setReportingPeriod] = useState("AM");

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    /* =========================
       FETCH APPLICATIONS + CENTERS
    ========================= */

    const fetchData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");

            if (!token) {
                toast.error("Admin session expired.");
                navigate("/admin/login");
                return;
            }

            const [
                applicationsResponse,
                centersResponse,
            ] = await Promise.all([
                api.get("/exams/admin/applications/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),

                api.get("/exams/centers/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            /* APPLICATIONS */

            const applicationData =
                applicationsResponse.data;

            let applicationList = [];

            if (Array.isArray(applicationData)) {
                applicationList = applicationData;
            } else if (
                Array.isArray(applicationData?.data)
            ) {
                applicationList = applicationData.data;
            } else if (
                Array.isArray(applicationData?.results)
            ) {
                applicationList = applicationData.results;
            }

            /* CENTERS */

            const centerData = centersResponse.data;

            let centerList = [];

            if (Array.isArray(centerData)) {
                centerList = centerData;
            } else if (
                Array.isArray(centerData?.data)
            ) {
                centerList = centerData.data;
            } else if (
                Array.isArray(centerData?.results)
            ) {
                centerList = centerData.results;
            }

            setApplications(applicationList);
            setCenters(centerList);

        } catch (error) {
            console.error(
                "ADMIT CARD DATA ERROR:",
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
                "Unable to load admit card data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* =========================
       PAID STUDENTS
    ========================= */

    const paidStudents = useMemo(() => {
        return applications.filter(
            (application) =>
                application.payment_status ===
                "paid" &&
                !application.admit_card_created
        );
    }, [applications]);

    /* =========================
       CURRENT CENTER STUDENTS
    ========================= */

    const currentCenterStudents = useMemo(() => {
        if (!examCenter) {
            return paidStudents;
        }

        return paidStudents.filter(
            (student) =>
                String(student.exam_center) ===
                String(examCenter)
        );
    }, [paidStudents, examCenter]);

    /* =========================
       SELECTED STUDENT OBJECTS
    ========================= */

    const selectedStudentObjects = useMemo(() => {
        return paidStudents.filter((student) =>
            selectedStudents.includes(student.id)
        );
    }, [paidStudents, selectedStudents]);

    /* =========================
       CENTER CHANGE
    ========================= */

    const handleCenterChange = (event) => {
        const newCenter =
            event.target.value;

        setExamCenter(newCenter);

        /*
         * Important:
         * Center change karte hi purane
         * selected students clear honge.
         */
        setSelectedStudents([]);

        /*
         * Venue ko bhi clear kar rahe hain,
         * kyunki naya center choose hua hai.
         */
        setExamVenue("");
    };

    /* =========================
       STUDENT SELECTION
    ========================= */

    const toggleStudent = (student) => {
        /*
         * Agar student ka center current
         * selected center se match nahi karta,
         * to select nahi hone denge.
         */

        if (
            examCenter &&
            String(student.exam_center) !==
            String(examCenter)
        ) {
            toast.error(
                "This student belongs to another exam center."
            );

            return;
        }

        const id = student.id;

        setSelectedStudents((previous) => {
            if (previous.includes(id)) {
                return previous.filter(
                    (studentId) =>
                        studentId !== id
                );
            }

            /*
             * Agar center empty hai,
             * student ka center automatically select.
             */
            if (!examCenter && student.exam_center) {
                setExamCenter(
                    String(student.exam_center)
                );
            }

            return [...previous, id];
        });
    };

    /* =========================
       SELECT ALL CURRENT CENTER
    ========================= */

    const toggleAllStudents = () => {
        if (currentCenterStudents.length === 0) {
            toast.error(
                "No eligible students for this center."
            );

            return;
        }

        const allSelected =
            currentCenterStudents.every(
                (student) =>
                    selectedStudents.includes(
                        student.id
                    )
            );

        if (allSelected) {
            setSelectedStudents([]);
            return;
        }

        setSelectedStudents(
            currentCenterStudents.map(
                (student) => student.id
            )
        );

        /*
         * Agar center manually selected nahi tha,
         * first student's center set kar do.
         */
        if (
            !examCenter &&
            currentCenterStudents[0]?.exam_center
        ) {
            setExamCenter(
                String(
                    currentCenterStudents[0]
                        .exam_center
                )
            );
        }
    };

    const allCurrentCenterSelected =
        currentCenterStudents.length > 0 &&
        currentCenterStudents.every(
            (student) =>
                selectedStudents.includes(
                    student.id
                )
        );

    /* =========================
       GENERATE ADMIT CARDS
    ========================= */

    const generateAdmitCards = async () => {
        if (selectedStudents.length === 0) {
            toast.error(
                "Please select at least one student."
            );

            return;
        }

        if (!examCenter) {
            toast.error(
                "Please select an exam center."
            );

            return;
        }

        /*
         * Safety check:
         * Kisi bhi selected student ka center
         * different nahi hona chahiye.
         */
        const invalidStudent =
            selectedStudentObjects.find(
                (student) =>
                    String(student.exam_center) !==
                    String(examCenter)
            );

        if (invalidStudent) {
            toast.error(
                "Selected students must belong to the selected exam center."
            );

            return;
        }

        if (!examVenue.trim()) {
            toast.error(
                "Please enter the exam venue / school address."
            );

            return;
        }

        if (!examDate) {
            toast.error(
                "Please select exam date."
            );

            return;
        }

        if (!examHour || !examMinute) {
            toast.error("Please enter exam time.");
            return;
        }

        if (
            Number(examHour) < 1 ||
            Number(examHour) > 12
        ) {
            toast.error("Exam hour must be between 1 and 12.");
            return;
        }

        if (
            Number(examMinute) < 0 ||
            Number(examMinute) > 59
        ) {
            toast.error("Exam minute must be between 00 and 59.");
            return;
        }

        if (!reportingHour || !reportingMinute) {
            toast.error("Please enter reporting time.");
            return;
        }

        if (
            Number(reportingHour) < 1 ||
            Number(reportingHour) > 12
        ) {
            toast.error("Reporting hour must be between 1 and 12.");
            return;
        }

        if (
            Number(reportingMinute) < 0 ||
            Number(reportingMinute) > 59
        ) {
            toast.error("Reporting minute must be between 00 and 59.");
            return;
        }

        try {
            setGenerating(true);

            const convertTo24Hour = (hour, minute, period) => {
                let h = Number(hour);

                if (period === "AM") {
                    if (h === 12) {
                        h = 0;
                    }
                } else {
                    if (h !== 12) {
                        h += 12;
                    }
                }

                return `${String(h).padStart(2, "0")}:${String(
                    minute
                ).padStart(2, "0")}`;
            };

            const finalExamTime = convertTo24Hour(
                examHour,
                examMinute,
                examPeriod
            );

            const finalReportingTime = convertTo24Hour(
                reportingHour,
                reportingMinute,
                reportingPeriod
            );

            const token =
                localStorage.getItem(
                    "access_token"
                );

            const response = await api.post(
                "/exams/admin/admit-cards/bulk-create/",
                {
                    application_ids:
                        selectedStudents,

                    exam_center:
                        Number(examCenter),

                    exam_venue:
                        examVenue.trim(),

                    exam_date:
                        examDate,

                    exam_time: finalExamTime,
                    reporting_time: finalReportingTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result =
                response.data;

            toast.success(
                `${result.created_count || 0
                } admit card(s) generated successfully.`
            );

            setSelectedStudents([]);

            setExamVenue("");

            await fetchData();

        } catch (error) {
            console.error(
                "ADMIT CARD GENERATION ERROR:",
                error
            );

            if (
                error.response?.status === 401
            ) {
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
                "Unable to generate admit cards."
            );
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white">

            {/* =========================
                HEADER
            ========================= */}

            <header className="border-b border-white/10 bg-[#0b0f1d]/90 backdrop-blur-xl">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

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

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">

                                <ShieldCheck
                                    size={23}
                                    className="text-cyan-400"
                                />

                            </div>

                            <div>

                                <h1 className="text-lg font-bold">
                                    GPK Admin
                                </h1>

                                <p className="text-xs text-gray-500">
                                    Ghazipur Pratibha Khoj 2026
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/[0.08]"
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>

            </header>

            {/* =========================
                MAIN
            ========================= */}

            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* TITLE */}

                <div className="mb-8">

                    <div className="mb-2 flex items-center gap-2 text-cyan-400">

                        <Ticket size={18} />

                        <span className="text-sm font-semibold">
                            Admit Card Management
                        </span>

                    </div>

                    <h2 className="text-3xl font-bold tracking-tight">
                        Generate Admit Cards
                    </h2>

                    <p className="mt-2 text-gray-400">
                        Select eligible paid students and assign their examination details.
                    </p>

                </div>

                {/* =========================
                    STATS
                ========================= */}

                <div className="mb-8 grid gap-4 md:grid-cols-3">

                    {/* ELIGIBLE */}

                    <div className="rounded-2xl border border-white/10 bg-[#111522] p-5">

                        <div className="mb-4 flex items-center justify-between">

                            <span className="text-sm text-gray-400">
                                Eligible Students
                            </span>

                            <div className="rounded-xl bg-cyan-400/10 p-3">

                                <Users
                                    size={20}
                                    className="text-cyan-400"
                                />

                            </div>

                        </div>

                        <p className="text-3xl font-bold">
                            {
                                currentCenterStudents.length
                            }
                        </p>

                        <p className="mt-1 text-xs text-gray-500">

                            {examCenter
                                ? "Paid students in selected center"
                                : "Paid & pending admit card"}

                        </p>

                    </div>

                    {/* SELECTED */}

                    <div className="rounded-2xl border border-white/10 bg-[#111522] p-5">

                        <div className="mb-4 flex items-center justify-between">

                            <span className="text-sm text-gray-400">
                                Selected Students
                            </span>

                            <div className="rounded-xl bg-blue-400/10 p-3">

                                <CheckCircle2
                                    size={20}
                                    className="text-blue-400"
                                />

                            </div>

                        </div>

                        <p className="text-3xl font-bold">
                            {
                                selectedStudents.length
                            }
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Ready for generation
                        </p>

                    </div>

                    {/* TOTAL */}

                    <div className="rounded-2xl border border-white/10 bg-[#111522] p-5">

                        <div className="mb-4 flex items-center justify-between">

                            <span className="text-sm text-gray-400">
                                Total Applications
                            </span>

                            <div className="rounded-xl bg-purple-400/10 p-3">

                                <FileText
                                    size={20}
                                    className="text-purple-400"
                                />

                            </div>

                        </div>

                        <p className="text-3xl font-bold">
                            {applications.length}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Submitted applications
                        </p>

                    </div>

                </div>

                {/* =========================
                    CONTENT
                ========================= */}

                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

                    {/* =========================
                        STUDENT LIST
                    ========================= */}

                    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1320]">

                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                            <div>

                                <h3 className="font-semibold">
                                    Eligible Students
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">

                                    {examCenter
                                        ? "Students from selected center are active"
                                        : "Select an exam center to filter students"}

                                </p>

                            </div>

                            <button
                                onClick={
                                    toggleAllStudents
                                }
                                disabled={
                                    currentCenterStudents.length ===
                                    0
                                }
                                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {
                                    allCurrentCenterSelected
                                        ? "Unselect All"
                                        : "Select All"
                                }
                            </button>

                        </div>

                        {loading ? (

                            <div className="flex min-h-[300px] items-center justify-center">

                                <Loader2
                                    size={30}
                                    className="animate-spin text-cyan-400"
                                />

                            </div>

                        ) : paidStudents.length ===
                            0 ? (

                            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                                <div className="mb-4 rounded-2xl bg-white/[0.04] p-4">

                                    <Ticket
                                        size={30}
                                        className="text-gray-500"
                                    />

                                </div>

                                <h4 className="font-semibold text-gray-300">
                                    No eligible students
                                </h4>

                                <p className="mt-2 max-w-sm text-sm text-gray-500">
                                    Paid applications with pending admit cards will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="divide-y divide-white/[0.06]">

                                {paidStudents.map(
                                    (student) => {

                                        const selected =
                                            selectedStudents.includes(
                                                student.id
                                            );

                                        const isActiveCenter =
                                            !examCenter ||
                                            String(
                                                student.exam_center
                                            ) ===
                                            String(
                                                examCenter
                                            );

                                        return (

                                            <div
                                                key={
                                                    student.id
                                                }
                                                onClick={() =>
                                                    isActiveCenter &&
                                                    toggleStudent(
                                                        student
                                                    )
                                                }
                                                className={`flex items-center gap-4 px-6 py-5 transition ${isActiveCenter
                                                    ? `cursor-pointer ${selected
                                                        ? "bg-cyan-400/[0.06]"
                                                        : "hover:bg-white/[0.025]"
                                                    }`
                                                    : "cursor-not-allowed opacity-25 blur-[1.5px]"
                                                    }`}
                                            >

                                                {/* CHECKBOX */}

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selected
                                                    }
                                                    disabled={
                                                        !isActiveCenter
                                                    }
                                                    onChange={() =>
                                                        toggleStudent(
                                                            student
                                                        )
                                                    }
                                                    onClick={(
                                                        event
                                                    ) =>
                                                        event.stopPropagation()
                                                    }
                                                    className="h-4 w-4 accent-cyan-400 disabled:cursor-not-allowed"
                                                />

                                                {/* STUDENT INFO */}

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-center gap-3">

                                                        <span className="font-semibold">

                                                            {
                                                                student.student_full_name
                                                            }

                                                        </span>

                                                        <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[11px] font-medium text-cyan-400">

                                                            {
                                                                student.application_number
                                                            }

                                                        </span>

                                                    </div>

                                                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">

                                                        <span>

                                                            Class:{" "}

                                                            <span className="text-gray-300">

                                                                {
                                                                    student.student_class
                                                                }

                                                            </span>

                                                        </span>

                                                        <span>

                                                            Center:{" "}

                                                            <span className="text-gray-300">

                                                                {
                                                                    student.exam_center_name ||
                                                                    "Not Assigned"
                                                                }

                                                            </span>

                                                        </span>

                                                    </div>

                                                </div>

                                                {/* PAYMENT */}

                                                <div className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400 sm:flex">

                                                    <CheckCircle2
                                                        size={14}
                                                    />

                                                    Paid

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>

                    {/* =========================
                        GENERATION PANEL
                    ========================= */}

                    <section className="h-fit rounded-2xl border border-white/10 bg-[#0f1320]">

                        <div className="border-b border-white/10 px-6 py-5">

                            <h3 className="font-semibold">
                                Examination Details
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Details printed on the admit card
                            </p>

                        </div>

                        <div className="space-y-5 p-6">

                            {/* =========================
                                EXAM CENTER
                            ========================= */}

                            <div>

                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">

                                    <MapPin
                                        size={16}
                                        className="text-cyan-400"
                                    />

                                    Exam Center

                                </label>

                                <select
                                    value={
                                        examCenter
                                    }
                                    onChange={
                                        handleCenterChange
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                                >

                                    <option value="">
                                        Select exam center
                                    </option>

                                    {centers.map(
                                        (center) => (

                                            <option
                                                key={
                                                    center.id
                                                }
                                                value={
                                                    center.id
                                                }
                                                disabled={
                                                    center.available_seats ===
                                                    0
                                                }
                                            >

                                                {
                                                    center.name
                                                }

                                                {center.available_seats !==
                                                    undefined
                                                    ? ` — ${center.available_seats} seats available`
                                                    : ""}

                                            </option>

                                        )
                                    )}

                                </select>

                                {examCenter && (

                                    <p className="mt-2 text-xs text-cyan-400">

                                        ✓ Students filtered for selected center

                                    </p>

                                )}

                            </div>

                            {/* =========================
                                EXAM VENUE
                            ========================= */}

                            <div>

                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">

                                    <MapPin
                                        size={16}
                                        className="text-cyan-400"
                                    />

                                    Exam Venue / School Address

                                </label>

                                <input
                                    type="text"
                                    value={
                                        examVenue
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setExamVenue(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="e.g. Delhi Public School, Mardah, Ghazipur, Uttar Pradesh"
                                    className="w-full rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-cyan-400/50"
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    Enter the exact school/building address where the exam will be conducted.
                                </p>

                            </div>

                            {/* =========================
                                DATE
                            ========================= */}

                            <div>

                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">

                                    <CalendarDays
                                        size={16}
                                        className="text-cyan-400"
                                    />

                                    Exam Date

                                </label>

                                <input
                                    type="date"
                                    value={
                                        examDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setExamDate(
                                            event.target
                                                .value
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                                />

                            </div>

                            {/* =========================
                                EXAM TIME
                            ========================= */}

                            <div>

                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">

                                    <Clock3
                                        size={16}
                                        className="text-cyan-400"
                                    />

                                    Exam Time

                                </label>

                                <div className="flex items-center gap-2">

                                    {/* HOUR */}

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        placeholder="HH"
                                        value={examHour}
                                        onChange={(event) =>
                                            setExamHour(
                                                event.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="w-20 rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-center text-sm text-white outline-none transition focus:border-cyan-400/50"
                                    />

                                    <span className="text-lg font-semibold text-gray-400">
                                        :
                                    </span>

                                    {/* MINUTE */}

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        placeholder="MM"
                                        value={examMinute}
                                        onChange={(event) =>
                                            setExamMinute(
                                                event.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="w-20 rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-center text-sm text-white outline-none transition focus:border-cyan-400/50"
                                    />

                                    {/* AM / PM */}

                                    <select
                                        value={examPeriod}
                                        onChange={(event) =>
                                            setExamPeriod(event.target.value)
                                        }
                                        className="w-24 rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>

                                </div>

                            </div>

                            {/* =========================
                                REPORTING TIME
                            ========================= */}

                            <div>

                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">

                                    <Clock3
                                        size={16}
                                        className="text-cyan-400"
                                    />

                                    Reporting Time

                                </label>

                                <div className="flex items-center gap-2">

                                    {/* HOUR */}

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        placeholder="HH"
                                        value={reportingHour}
                                        onChange={(event) =>
                                            setReportingHour(
                                                event.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="w-20 rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-center text-sm text-white outline-none transition focus:border-cyan-400/50"
                                    />

                                    <span className="text-lg font-semibold text-gray-400">
                                        :
                                    </span>

                                    {/* MINUTE */}

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2}
                                        placeholder="MM"
                                        value={reportingMinute}
                                        onChange={(event) =>
                                            setReportingMinute(
                                                event.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="w-20 rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-center text-sm text-white outline-none transition focus:border-cyan-400/50"
                                    />

                                    {/* AM / PM */}

                                    <select
                                        value={reportingPeriod}
                                        onChange={(event) =>
                                            setReportingPeriod(event.target.value)
                                        }
                                        className="w-24 rounded-xl border border-white/10 bg-[#080b15] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>

                                </div>
                            </div>

                            {/* =========================
                                SUMMARY
                            ========================= */}

                            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">

                                <div className="flex items-center justify-between text-sm">

                                    <span className="text-gray-400">
                                        Students selected
                                    </span>

                                    <span className="font-semibold text-white">
                                        {
                                            selectedStudents.length
                                        }
                                    </span>

                                </div>

                                <div className="mt-2 flex items-center justify-between text-sm">

                                    <span className="text-gray-400">
                                        Selected center
                                    </span>

                                    <span className="font-medium text-cyan-400">

                                        {examCenter
                                            ? centers.find(
                                                (
                                                    center
                                                ) =>
                                                    String(
                                                        center.id
                                                    ) ===
                                                    String(
                                                        examCenter
                                                    )
                                            )
                                                ?.name ||
                                            "Selected"
                                            : "Not selected"}

                                    </span>

                                </div>

                                <div className="mt-2 flex items-center justify-between text-sm">

                                    <span className="text-gray-400">
                                        Status
                                    </span>

                                    <span className="text-cyan-400">
                                        Ready to generate
                                    </span>

                                </div>

                            </div>

                            {/* =========================
                                GENERATE BUTTON
                            ========================= */}

                            <button
                                onClick={
                                    generateAdmitCards
                                }
                                disabled={
                                    generating ||
                                    selectedStudents.length ===
                                    0
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-[#041018] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                                {generating ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Ticket
                                            size={18}
                                        />

                                        Generate Admit Cards
                                    </>
                                )}

                            </button>

                        </div>

                    </section>

                </div>

            </main>

        </div>

    );
};

export default AdminAdmitCards;