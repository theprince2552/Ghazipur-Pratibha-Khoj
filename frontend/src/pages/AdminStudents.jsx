import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  CreditCard,
  TicketCheck,
  Eye,
  Plus,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "../api/axios";


// ============================================================
// HELPER COMPONENTS
// ============================================================

const StatCard = ({ title, value, icon, iconClass }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h2 className="text-3xl font-bold mt-2 text-white">
            {value}
          </h2>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};


const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-cyan-400 mb-2">
        {icon}

        <span className="text-xs uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>

      <p className="text-sm text-slate-200 break-words">
        {value || "—"}
      </p>
    </div>
  );
};


const StatusBadge = ({ children, type = "default" }) => {
  const styles = {
    success:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

    warning:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",

    danger:
      "bg-red-500/10 text-red-400 border-red-500/20",

    info:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",

    default:
      "bg-slate-500/10 text-slate-300 border-slate-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium ${styles[type]}`}
    >
      {children}
    </span>
  );
};


// ============================================================
// MAIN COMPONENT
// ============================================================

const AdminStudents = () => {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // STUDENTS
  // ----------------------------------------------------------

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");


  // ----------------------------------------------------------
  // DETAILS MODAL
  // ----------------------------------------------------------

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);


  // ----------------------------------------------------------
  // ADD STUDENT
  // ----------------------------------------------------------

  const [showAddStudent, setShowAddStudent] = useState(false);

  const [creatingStudent, setCreatingStudent] = useState(false);

  const [createError, setCreateError] = useState("");

  const [createSuccess, setCreateSuccess] = useState("");

  const [studentForm, setStudentForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });


  // ============================================================
  // FETCH STUDENTS
  // ============================================================

  const fetchStudents = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/users/admin/student-management/"
      );

      if (response.data?.success) {
        setStudents(response.data.data || []);
      } else {
        setError(
          response.data?.message ||
            "Unable to fetch students."
        );
      }
    } catch (err) {
      console.error("Student fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchStudents();
  }, []);


  // ============================================================
  // SEARCH
  // ============================================================

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const name =
        student.full_name?.toLowerCase() || "";

      const email =
        student.email?.toLowerCase() || "";

      const mobile =
        student.mobile?.toLowerCase() || "";

      const applicationNumber =
        student.application?.application_number
          ?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        mobile.includes(query) ||
        applicationNumber.includes(query)
      );
    });
  }, [students, search]);


  // ============================================================
  // STATS
  // ============================================================

  const totalStudents = students.length;

  const verifiedStudents = students.filter(
    (student) => student.is_verified
  ).length;

  const paidStudents = students.filter(
    (student) =>
      student.payment?.status === "paid"
  ).length;

  const admitCards = students.filter(
    (student) => student.admit_card_created
  ).length;


  // ============================================================
  // VIEW DETAILS
  // ============================================================

  const handleViewDetails = async (studentId) => {
    try {
      setDetailsLoading(true);

      const response = await api.get(
        `/users/admin/students/${studentId}/complete/`
      );

      if (response.data?.success) {
        setSelectedStudent(response.data.data);
      } else {
        alert(
          response.data?.message ||
            "Unable to fetch student details."
        );
      }
    } catch (err) {
      console.error(
        "Student details error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to fetch student details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };


  // ============================================================
  // ADD STUDENT FORM
  // ============================================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setStudentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ============================================================
  // CREATE STUDENT
  // ============================================================

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    setCreateError("");
    setCreateSuccess("");

    const fullName =
      studentForm.full_name.trim();

    const email =
      studentForm.email.trim();

    const mobile =
      studentForm.mobile.trim();

    const password =
      studentForm.password;

    const confirmPassword =
      studentForm.confirm_password;


    // Required fields

    if (
      !fullName ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ) {
      setCreateError(
        "Please fill all required fields."
      );

      return;
    }


    // Mobile validation

    if (
      mobile.length !== 10 ||
      !/^\d{10}$/.test(mobile)
    ) {
      setCreateError(
        "Mobile number must be exactly 10 digits."
      );

      return;
    }


    // Email validation

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setCreateError(
        "Please enter a valid email address."
      );

      return;
    }


    // Password match

    if (password !== confirmPassword) {
      setCreateError(
        "Passwords do not match."
      );

      return;
    }


    // Password length

    if (password.length < 8) {
      setCreateError(
        "Password must be at least 8 characters."
      );

      return;
    }


    try {
      setCreatingStudent(true);

      const response = await api.post(
        "/users/admin/students/",
        {
          full_name: fullName,
          email,
          mobile,
          password,
        }
      );


      if (response.data?.success) {
        setCreateSuccess(
          "Student created successfully."
        );


        // Clear form

        setStudentForm({
          full_name: "",
          email: "",
          mobile: "",
          password: "",
          confirm_password: "",
        });


        // Refresh list

        await fetchStudents(true);


        // Close modal

        setTimeout(() => {
          setShowAddStudent(false);
          setCreateSuccess("");
        }, 1200);
      } else {
        setCreateError(
          response.data?.message ||
            "Unable to create student."
        );
      }
    } catch (err) {
      console.error(
        "Create student error:",
        err
      );

      const errors =
        err.response?.data?.errors;


      if (errors) {
        const firstError =
          Object.values(errors)[0];

        if (Array.isArray(firstError)) {
          setCreateError(
            firstError[0]
          );
        } else {
          setCreateError(
            String(firstError)
          );
        }
      } else {
        setCreateError(
          err.response?.data?.message ||
            "Unable to create student."
        );
      }
    } finally {
      setCreatingStudent(false);
    }
  };


  // ============================================================
  // CLOSE ADD MODAL
  // ============================================================

  const closeAddModal = () => {
    if (creatingStudent) return;

    setShowAddStudent(false);

    setCreateError("");

    setCreateSuccess("");

    setStudentForm({
      full_name: "",
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
    });
  };


  // ============================================================
  // APPLICATION STATUS
  // ============================================================

  const getApplicationStatus = (
    student
  ) => {
    if (!student.application) {
      return {
        label: "Not Started",
        type: "default",
      };
    }


    if (
      student.application.status ===
      "submitted"
    ) {
      return {
        label: "Submitted",
        type: "success",
      };
    }


    return {
      label: "Draft",
      type: "warning",
    };
  };


  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-400">
            Loading students...
          </p>

        </div>
      </div>
    );
  }


  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-[-200px] left-[-150px] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px]" />

        <div className="absolute bottom-[-200px] right-[-150px] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px]" />

      </div>


      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="relative z-10 border-b border-white/10 bg-[#070b1a]/80 backdrop-blur-xl">

        <div className="max-w-[1500px] mx-auto px-5 sm:px-8 py-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* LEFT */}

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  navigate(
                    "/admin/dashboard"
                  )
                }
                className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition"
              >
                <ArrowLeft size={19} />
              </button>


              <div>

                <div className="flex items-center gap-2">

                  <GraduationCap
                    size={22}
                    className="text-cyan-400"
                  />

                  <h1 className="text-xl sm:text-2xl font-bold">
                    Student Management
                  </h1>

                </div>


                <p className="text-sm text-slate-400 mt-1">
                  Manage registered students
                  and their complete records
                </p>

              </div>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  fetchStudents(true)
                }
                disabled={refreshing}
                className="h-11 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-2 text-sm font-medium transition disabled:opacity-50"
              >

                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>


              <button
                onClick={() => {
                  setCreateError("");
                  setCreateSuccess("");
                  setShowAddStudent(true);
                }}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 flex items-center gap-2 text-sm font-semibold shadow-lg shadow-cyan-500/10 transition"
              >

                <Plus size={18} />

                Add Student

              </button>

            </div>

          </div>

        </div>

      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-8 py-8">


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300 flex items-center gap-3">

            <AlertCircle size={19} />

            <span>{error}</span>

          </div>
        )}


        {/* ====================================================
            STATS
        ==================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={<Users size={23} />}
            iconClass="bg-cyan-500/10 text-cyan-400"
          />

          <StatCard
            title="Verified Students"
            value={verifiedStudents}
            icon={<UserCheck size={23} />}
            iconClass="bg-emerald-500/10 text-emerald-400"
          />

          <StatCard
            title="Paid Students"
            value={paidStudents}
            icon={<CreditCard size={23} />}
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <StatCard
            title="Admit Cards"
            value={admitCards}
            icon={<TicketCheck size={23} />}
            iconClass="bg-violet-500/10 text-violet-400"
          />

        </div>


        {/* ====================================================
            SEARCH
        ==================================================== */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-4 mb-6">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email, mobile or application number..."
              className="w-full h-12 rounded-xl border border-white/10 bg-black/20 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/40 transition"
            />

          </div>

        </div>


        {/* ====================================================
            STUDENTS TABLE
        ==================================================== */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl overflow-hidden">

          {/* TABLE HEADER */}

          <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-lg">
                Students
              </h2>

              <p className="text-sm text-slate-500 mt-1">

                Showing{" "}

                <span className="text-slate-300">
                  {filteredStudents.length}
                </span>

                {" "}of{" "}

                <span className="text-slate-300">
                  {totalStudents}
                </span>

                {" "}students

              </p>

            </div>

          </div>


          {/* EMPTY */}

          {filteredStudents.length === 0 ? (

            <div className="py-20 text-center">

              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">

                <Users
                  size={28}
                  className="text-slate-500"
                />

              </div>


              <h3 className="font-semibold text-lg">
                No students found
              </h3>


              <p className="text-sm text-slate-500 mt-2">
                {search
                  ? "Try changing your search."
                  : "No students have been registered yet."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead>

                  <tr className="border-b border-white/10 text-left">

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Student
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Application
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Class / School
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-medium">
                      Admit Card
                    </th>

                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500 font-medium text-right">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredStudents.map(
                    (student) => {

                      const appStatus =
                        getApplicationStatus(
                          student
                        );


                      return (
                        <tr
                          key={student.id}
                          className="border-b border-white/[0.06] hover:bg-white/[0.025] transition"
                        >

                          {/* STUDENT */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/10 flex items-center justify-center text-cyan-300 font-semibold">

                                {student.full_name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "S"}

                              </div>


                              <div>

                                <p className="font-medium text-white">
                                  {student.full_name ||
                                    "Unnamed Student"}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {student.mobile ||
                                    "No mobile"}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* APPLICATION */}

                          <td className="px-5 py-5">

                            {student.application ? (

                              <div>

                                <p className="text-sm font-medium text-cyan-300">

                                  {
                                    student.application
                                      .application_number
                                  }

                                </p>


                                <p className="text-xs text-slate-500 mt-1">

                                  {
                                    student.application
                                      .exam_center ||
                                    "Center not selected"
                                  }

                                </p>

                              </div>

                            ) : (

                              <span className="text-sm text-slate-500">
                                No application
                              </span>

                            )}

                          </td>


                          {/* CLASS / SCHOOL */}

                          <td className="px-5 py-5">

                            {student.application ? (

                              <div>

                                <p className="text-sm text-slate-300">

                                  {
                                    student.application
                                      .student_class
                                  }

                                </p>


                                <p className="text-xs text-slate-500 mt-1 max-w-[220px] truncate">

                                  {
                                    student.application
                                      .school_name
                                  }

                                </p>

                              </div>

                            ) : (

                              <span className="text-slate-600">
                                —
                              </span>

                            )}

                          </td>


                          {/* APPLICATION STATUS */}

                          <td className="px-5 py-5">

                            <StatusBadge
                              type={
                                appStatus.type
                              }
                            >
                              {appStatus.label}
                            </StatusBadge>

                          </td>


                          {/* PAYMENT */}

                          <td className="px-5 py-5">

                            {student.payment ? (

                              <div>

                                <StatusBadge
                                  type={
                                    student.payment
                                      .status ===
                                    "paid"
                                      ? "success"
                                      : "warning"
                                  }
                                >

                                  {student.payment
                                    .status ===
                                  "paid"
                                    ? "Paid"
                                    : "Unpaid"}

                                </StatusBadge>


                                <p className="text-xs text-slate-500 mt-1">
                                  ₹
                                  {
                                    student.payment
                                      .amount
                                  }
                                </p>

                              </div>

                            ) : (

                              <span className="text-xs text-slate-500">
                                No payment
                              </span>

                            )}

                          </td>


                          {/* ADMIT CARD */}

                          <td className="px-5 py-5">

                            {student.admit_card_created ? (

                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">

                                <ShieldCheck
                                  size={15}
                                />

                                Created

                              </span>

                            ) : (

                              <span className="text-xs text-slate-500">
                                Not Created
                              </span>

                            )}

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-5 text-right">

                            <button
                              onClick={() =>
                                handleViewDetails(
                                  student.id
                                )
                              }
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-cyan-500/10 hover:border-cyan-400/20 text-sm text-slate-300 hover:text-cyan-300 transition"
                            >

                              <Eye size={16} />

                              View

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>


      {/* ======================================================
          DETAILS LOADING
      ====================================================== */}

      {detailsLoading && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-300">
              Loading student details...
            </p>

          </div>

        </div>
      )}


      {/* ======================================================
          DETAILS MODAL
      ====================================================== */}

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedStudent(null);
            }
          }}
        >

          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a1022] shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 px-6 py-5 border-b border-white/10 bg-[#0a1022]/95 backdrop-blur-xl flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Student Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Complete student record
                </p>

              </div>


              <button
                onClick={() =>
                  setSelectedStudent(null)
                }
                className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center hover:bg-white/[0.1] transition"
              >
                <X size={19} />
              </button>

            </div>


            {/* BODY */}

            <div className="p-6 space-y-8">


              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <section>

                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
                  Basic Information
                </h3>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  <DetailItem
                    icon={<Users size={16} />}
                    label="Full Name"
                    value={
                      selectedStudent.student
                        ?.full_name
                    }
                  />

                  <DetailItem
                    icon={<Mail size={16} />}
                    label="Email"
                    value={
                      selectedStudent.student
                        ?.email
                    }
                  />

                  <DetailItem
                    icon={<Phone size={16} />}
                    label="Mobile"
                    value={
                      selectedStudent.student
                        ?.mobile
                    }
                  />

                  <DetailItem
                    icon={
                      <ShieldCheck size={16} />
                    }
                    label="Verification"
                    value={
                      selectedStudent.student
                        ?.is_verified
                        ? "Verified"
                        : "Not Verified"
                    }
                  />

                  <DetailItem
                    icon={<UserCheck size={16} />}
                    label="Account"
                    value={
                      selectedStudent.student
                        ?.is_active
                        ? "Active"
                        : "Inactive"
                    }
                  />

                  <DetailItem
                    icon={<GraduationCap size={16} />}
                    label="Role"
                    value={
                      selectedStudent.student
                        ?.role
                    }
                  />

                </div>

              </section>


              {/* =================================================
                  APPLICATION
              ================================================= */}

              <section>

                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
                  Application Information
                </h3>


                {selectedStudent.application ? (

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <DetailItem
                      label="Application Number"
                      value={
                        selectedStudent.application
                          ?.application_number
                      }
                    />

                    <DetailItem
                      label="Student Name"
                      value={
                        selectedStudent.application
                          ?.student_full_name
                      }
                    />

                    <DetailItem
                      label="Father Name"
                      value={
                        selectedStudent.application
                          ?.father_name
                      }
                    />

                    <DetailItem
                      label="Mother Name"
                      value={
                        selectedStudent.application
                          ?.mother_name
                      }
                    />

                    <DetailItem
                      label="Gender"
                      value={
                        selectedStudent.application
                          ?.gender
                      }
                    />

                    <DetailItem
                      label="Aadhar Number"
                      value={
                        selectedStudent.application
                          ?.aadhar_number
                      }
                    />

                    <DetailItem
                      label="Class"
                      value={
                        selectedStudent.application
                          ?.student_class
                      }
                    />

                    <DetailItem
                      label="School"
                      value={
                        selectedStudent.application
                          ?.school_name
                      }
                    />

                    <DetailItem
                      label="Board"
                      value={
                        selectedStudent.application
                          ?.board
                      }
                    />

                    <DetailItem
                      label="Village"
                      value={
                        selectedStudent.application
                          ?.village
                      }
                    />

                    <DetailItem
                      label="Post"
                      value={
                        selectedStudent.application
                          ?.post
                      }
                    />

                    <DetailItem
                      label="PIN Code"
                      value={
                        selectedStudent.application
                          ?.pin_code
                      }
                    />

                    <DetailItem
                      label="District"
                      value={
                        selectedStudent.application
                          ?.district
                      }
                    />

                    <DetailItem
                      label="State"
                      value={
                        selectedStudent.application
                          ?.state
                      }
                    />

                    <DetailItem
                      icon={<MapPin size={16} />}
                      label="Exam Center"
                      value={
                        selectedStudent.application
                          ?.exam_center?.name ||
                        selectedStudent.application
                          ?.exam_center ||
                        "Not selected"
                      }
                    />

                    <DetailItem
                      label="Application Status"
                      value={
                        selectedStudent.application
                          ?.status
                      }
                    />

                  </div>

                ) : (

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">

                    <p className="text-slate-400">
                      This student has not created an application yet.
                    </p>

                  </div>

                )}

              </section>


              {/* =================================================
                  PAYMENT
              ================================================= */}

              <section>

                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
                  Payment Information
                </h3>


                {selectedStudent.payment ? (

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <DetailItem
                      label="Amount"
                      value={`₹${
                        selectedStudent.payment
                          ?.amount || 0
                      }`}
                    />

                    <DetailItem
                      label="Status"
                      value={
                        selectedStudent.payment
                          ?.status
                      }
                    />

                    <DetailItem
                      label="Payment Method"
                      value={
                        selectedStudent.payment
                          ?.payment_method
                      }
                    />

                    <DetailItem
                      label="Payment ID"
                      value={
                        selectedStudent.payment
                          ?.razorpay_payment_id ||
                        "—"
                      }
                    />

                    <DetailItem
                      label="Order ID"
                      value={
                        selectedStudent.payment
                          ?.razorpay_order_id
                      }
                    />

                  </div>

                ) : (

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">

                    <p className="text-slate-400">
                      No payment record found.
                    </p>

                  </div>

                )}

              </section>


              {/* =================================================
                  ADMIT CARD
              ================================================= */}

              <section>

                <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
                  Admit Card
                </h3>


                {selectedStudent.admit_card ? (

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <DetailItem
                      label="Exam Center"
                      value={
                        selectedStudent.admit_card
                          ?.exam_center?.name ||
                        selectedStudent.admit_card
                          ?.exam_center
                      }
                    />

                    <DetailItem
                      label="Exam Venue"
                      value={
                        selectedStudent.admit_card
                          ?.exam_venue
                      }
                    />

                    <DetailItem
                      label="Exam Date"
                      value={
                        selectedStudent.admit_card
                          ?.exam_date
                      }
                    />

                    <DetailItem
                      label="Exam Time"
                      value={
                        selectedStudent.admit_card
                          ?.exam_time
                      }
                    />

                    <DetailItem
                      label="Reporting Time"
                      value={
                        selectedStudent.admit_card
                          ?.reporting_time
                      }
                    />

                  </div>

                ) : (

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">

                    <p className="text-slate-400">
                      Admit card has not been created yet.
                    </p>

                  </div>

                )}

              </section>


            </div>

          </div>

        </div>
      )}


      {/* ======================================================
          ADD STUDENT MODAL
      ====================================================== */}

      {showAddStudent && (
        <div
          className="fixed inset-0 z-[55] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !creatingStudent
            ) {
              closeAddModal();
            }
          }}
        >

          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a1022] shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 px-6 py-5 border-b border-white/10 bg-[#0a1022]/95 backdrop-blur-xl flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Plus size={18} />
                  </div>

                  <h2 className="text-xl font-bold">
                    Add Student
                  </h2>

                </div>


                <p className="text-sm text-slate-500 mt-2">
                  Create a new student account
                </p>

              </div>


              <button
                onClick={closeAddModal}
                disabled={creatingStudent}
                className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center hover:bg-white/[0.1] transition disabled:opacity-50"
              >
                <X size={19} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleCreateStudent}
              className="p-6 space-y-5"
            >

              {/* SUCCESS */}

              {createSuccess && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-400 flex items-center gap-3">

                  <CheckCircle2 size={18} />

                  <span className="text-sm">
                    {createSuccess}
                  </span>

                </div>
              )}


              {/* ERROR */}

              {createError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300 flex items-center gap-3">

                  <AlertCircle size={18} />

                  <span className="text-sm">
                    {createError}
                  </span>

                </div>
              )}


              {/* FULL NAME */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={
                    studentForm.full_name
                  }
                  onChange={handleFormChange}
                  placeholder="Enter student's full name"
                  disabled={creatingStudent}
                  className="w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/40 transition disabled:opacity-50"
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    studentForm.email
                  }
                  onChange={handleFormChange}
                  placeholder="student@example.com"
                  disabled={creatingStudent}
                  className="w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/40 transition disabled:opacity-50"
                />

              </div>


              {/* MOBILE */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mobile Number
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={
                    studentForm.mobile
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    if (value.length <= 10) {
                      setStudentForm(
                        (prev) => ({
                          ...prev,
                          mobile: value,
                        })
                      );
                    }
                  }}
                  placeholder="10 digit mobile number"
                  disabled={creatingStudent}
                  className="w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/40 transition disabled:opacity-50"
                />

              </div>


              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <input
                  type="password"
                  name="password"
                  value={
                    studentForm.password
                  }
                  onChange={handleFormChange}
                  placeholder="Minimum 8 characters"
                  disabled={creatingStudent}
                  className="w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/40 transition disabled:opacity-50"
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                  <span className="text-red-400 ml-1">
                    *
                  </span>
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  value={
                    studentForm.confirm_password
                  }
                  onChange={handleFormChange}
                  placeholder="Re-enter password"
                  disabled={creatingStudent}
                  className="w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/40 transition disabled:opacity-50"
                />

              </div>


              {/* SECURITY NOTE */}

              <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={19}
                    className="text-cyan-400 shrink-0 mt-0.5"
                  />

                  <p className="text-xs leading-5 text-slate-400">
                    The password is securely stored by
                    the backend and will never be displayed
                    in student management records.
                  </p>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={creatingStudent}
                  className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-sm font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={creatingStudent}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >

                  {creatingStudent ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      Creating...

                    </>
                  ) : (
                    <>
                      <Plus size={18} />

                      Create Student
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminStudents;