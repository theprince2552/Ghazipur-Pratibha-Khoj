import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Payment from "../pages/Payment";
import Dashboard from "../pages/Dashboard";
import ApplicationForm from "../pages/ApplicationForm";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminAdmitCards from "../pages/AdminAdmitCards";
import AdminCenters from "../pages/AdminCenters";
import AdminPayments from "../pages/AdminPayments";
import AdminStudents from "../pages/AdminStudents";
import AdmitCard from "../pages/AdmitCard";
import AdminMessages from "../pages/AdminMessages";
import StudentMessages from "../pages/StudentMessages";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ================= HOME ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ================= AUTH ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/centers"
                    element={<AdminCenters />}
                />

                <Route
                    path="/admin/payments"
                    element={<AdminPayments />}
                />

                <Route
                    path="/admin/messages"
                    element={<AdminMessages />}
                />

                <Route
                    path="/admin/admit-cards"
                    element={<AdminAdmitCards />}
                />

                <Route
                    path="/admin/students"
                    element={<AdminStudents />}
                />

                {/* ================= PROTECTED ================= */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/messages"
                        element={<StudentMessages />}
                    />

                    <Route
                        path="/admit-card"
                        element={<AdmitCard />}
                    />

                    <Route
                        path="/application"
                        element={<ApplicationForm />}
                    />

                    <Route path="/payment" element={<Payment />} />

                </Route>


            </Routes>

        </BrowserRouter>

    );
}