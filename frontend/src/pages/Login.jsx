import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // ==========================================
    // LOGIN
    // ==========================================

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
        toast.error("Please enter your email.");
        return;
    }

    if (!formData.password) {
        toast.error("Please enter your password.");
        return;
    }

    try {
        setLoading(true);

        // =========================
        // LOGIN
        // =========================

        const response = await loginUser(formData);

        if (!response.success) {
            toast.error(response.message || "Login failed.");
            return;
        }

        // Save token + user
        login(response);

        toast.success("Login successful!");

        // =========================
        // CHECK USER ROLE
        // =========================

        const loggedInUser =
            response?.data?.user ||
            response?.user;

        // ADMIN
        // =========================

        if (loggedInUser?.role === "admin") {
            navigate("/admin/dashboard");
            return;
        }

        // =========================
        // STUDENT
        // =========================

        await new Promise((resolve) =>
            setTimeout(resolve, 100)
        );

        const token =
            localStorage.getItem("access_token");

        const applicationResponse = await api.get(
            "/exams/application/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const application =
            applicationResponse.data?.data;

        console.log(
            "APPLICATION DATA:",
            application
        );

        // No application
        if (!application) {
            navigate("/application");
            return;
        }

        // Submitted application
        if (application.status === "submitted") {
            navigate("/dashboard");
            return;
        }

        // Draft application
        navigate("/application");

    } catch (error) {
        console.error(
            "LOGIN/APPLICATION ERROR:",
            error
        );

        // Application not found / unauthorized
        if (
            error.response?.status === 401 ||
            error.response?.status === 404
        ) {
            navigate("/application");
            return;
        }

        const message =
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Invalid email or password.";

        toast.error(message);

    } finally {
        setLoading(false);
    }
};
    return (

        <div className="
            min-h-screen
            bg-[#020617]
            text-white
            relative
            overflow-hidden
            flex
            items-center
            justify-center
            px-4
            py-10
        ">


            {/* ================================= */}
            {/* BACKGROUND GLOW */}
            {/* ================================= */}

            <div className="
                absolute
                -top-40
                -left-40
                w-96
                h-96
                bg-cyan-500/15
                blur-[140px]
                rounded-full
            " />

            <div className="
                absolute
                -bottom-40
                -right-40
                w-96
                h-96
                bg-purple-500/15
                blur-[140px]
                rounded-full
            " />

            <div className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[500px]
                h-[500px]
                bg-blue-500/5
                blur-[150px]
                rounded-full
            " />


            {/* ================================= */}
            {/* MAIN CARD */}
            {/* ================================= */}

            <div className="
                relative
                w-full
                max-w-5xl
                grid
                md:grid-cols-2
                overflow-hidden
                rounded-[30px]
                border
                border-white/10
                bg-white/[0.04]
                backdrop-blur-2xl
                shadow-[0_25px_80px_rgba(0,0,0,0.5)]
            ">


                {/* ================================= */}
                {/* LEFT SIDE */}
                {/* ================================= */}

                <div className="
                    hidden
                    md:flex
                    relative
                    flex-col
                    justify-between
                    p-10
                    lg:p-14
                    overflow-hidden
                    border-r
                    border-white/10
                ">

                    {/* Glow */}

                    <div className="
                        absolute
                        top-10
                        -left-20
                        w-72
                        h-72
                        bg-cyan-500/10
                        blur-[100px]
                        rounded-full
                    " />

                    <div className="
                        absolute
                        bottom-0
                        right-0
                        w-72
                        h-72
                        bg-blue-600/10
                        blur-[100px]
                        rounded-full
                    " />


                    <div className="relative z-10">

                        {/* LOGO */}

                        <div className="
                            w-16
                            h-16
                            rounded-2xl
                            border
                            border-cyan-400/30
                            bg-cyan-400/10
                            flex
                            items-center
                            justify-center
                            mb-7
                            shadow-[0_0_35px_rgba(34,211,238,0.12)]
                        ">

                            <span className="
                                text-2xl
                                font-black
                                text-cyan-300
                            ">

                                G

                            </span>

                        </div>


                        {/* TITLE */}

                        <p className="
                            text-cyan-400
                            font-semibold
                            tracking-wide
                            text-sm
                            mb-3
                        ">

                            GHAZIPUR PRATIBHA KHOJ

                        </p>


                        <h1 className="
                            text-4xl
                            lg:text-5xl
                            font-black
                            leading-tight
                        ">

                            Welcome
                            <br />

                            <span className="
                                bg-gradient-to-r
                                from-cyan-300
                                via-blue-400
                                to-purple-400
                                bg-clip-text
                                text-transparent
                            ">

                                Back, Student.

                            </span>

                        </h1>


                        <p className="
                            mt-6
                            text-gray-400
                            leading-relaxed
                            max-w-md
                        ">

                            Login to your student portal and
                            continue your examination
                            registration journey.

                        </p>

                    </div>


                    {/* FEATURES */}

                    <div className="
                        relative
                        z-10
                        mt-10
                        space-y-4
                    ">

                        <Feature
                            icon="✓"
                            text="Secure student account"
                        />

                        <Feature
                            icon="✓"
                            text="Save your application as draft"
                        />

                        <Feature
                            icon="✓"
                            text="Choose your preferred exam center"
                        />

                    </div>

                </div>


                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <div className="
                    p-7
                    sm:p-10
                    lg:p-14
                    flex
                    items-center
                ">

                    <div className="
                        w-full
                        max-w-md
                        mx-auto
                    ">


                        {/* MOBILE BRAND */}

                        <div className="
                            md:hidden
                            text-center
                            mb-8
                        ">

                            <div className="
                                mx-auto
                                w-14
                                h-14
                                rounded-2xl
                                bg-cyan-400/10
                                border
                                border-cyan-400/30
                                flex
                                items-center
                                justify-center
                                text-xl
                                font-black
                                text-cyan-300
                            ">

                                G

                            </div>

                            <p className="
                                mt-3
                                text-cyan-400
                                text-sm
                                font-semibold
                            ">

                                GHAZIPUR PRATIBHA KHOJ

                            </p>

                        </div>


                        {/* HEADING */}

                        <p className="
                            text-sm
                            font-semibold
                            text-cyan-400
                            mb-2
                        ">

                            Student Portal

                        </p>


                        <h2 className="
                            text-3xl
                            sm:text-4xl
                            font-black
                        ">

                            Welcome Back

                        </h2>


                        <p className="
                            text-gray-400
                            mt-2
                            mb-8
                        ">

                            Login to continue your application.

                        </p>


                        {/* ================================= */}
                        {/* ACCOUNT SWITCH */}
                        {/* ================================= */}

                        <div className="
                            bg-white/5
                            border
                            border-white/10
                            rounded-2xl
                            p-1
                            flex
                            mb-8
                        ">

                            <button
                                type="button"
                                className="
                                    flex-1
                                    py-3
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-cyan-500/20
                                    to-blue-500/20
                                    border
                                    border-cyan-400/20
                                    text-cyan-300
                                    font-semibold
                                    shadow-lg
                                "
                            >

                                Login

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="
                                    flex-1
                                    py-3
                                    rounded-xl
                                    text-gray-400
                                    font-medium
                                    hover:text-cyan-300
                                    hover:bg-white/5
                                    transition
                                "
                            >

                                Create Account

                            </button>

                        </div>


                        {/* ================================= */}
                        {/* FORM */}
                        {/* ================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >


                            {/* EMAIL */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-300
                                    mb-2
                                ">

                                    Email Address

                                </label>


                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your registered email"
                                    autoComplete="email"
                                    className="
                                        w-full
                                        h-13
                                        px-4
                                        bg-white/5
                                        border
                                        border-white/10
                                        text-white
                                        placeholder-gray-600
                                        rounded-xl
                                        outline-none
                                        transition
                                        focus:border-cyan-400/60
                                        focus:bg-cyan-400/5
                                        focus:ring-4
                                        focus:ring-cyan-400/10
                                    "
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <div className="
                                    flex
                                    justify-between
                                    items-center
                                    mb-2
                                ">

                                    <label className="
                                        text-sm
                                        font-semibold
                                        text-gray-300
                                    ">

                                        Password

                                    </label>


                                    <button
                                        type="button"
                                        onClick={() => navigate("/forgot-password")}
                                        className="
                                            text-sm
                                            text-cyan-400
                                            hover:text-cyan-300
                                            transition
                                        "
                                    >

                                        Forgot Password?

                                    </button>

                                </div>


                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="
                                            w-full
                                            h-13
                                            px-4
                                            pr-16
                                            bg-white/5
                                            border
                                            border-white/10
                                            text-white
                                            placeholder-gray-600
                                            rounded-xl
                                            outline-none
                                            transition
                                            focus:border-cyan-400/60
                                            focus:bg-cyan-400/5
                                            focus:ring-4
                                            focus:ring-cyan-400/10
                                        "
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-sm
                                            font-semibold
                                            text-gray-500
                                            hover:text-cyan-300
                                            transition
                                        "
                                    >

                                        {showPassword
                                            ? "Hide"
                                            : "Show"}

                                    </button>

                                </div>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    h-13
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-cyan-500
                                    via-blue-500
                                    to-purple-500
                                    text-white
                                    font-bold
                                    tracking-wide
                                    shadow-[0_10px_35px_rgba(6,182,212,0.2)]
                                    hover:scale-[1.01]
                                    hover:shadow-[0_10px_45px_rgba(6,182,212,0.3)]
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    disabled:hover:scale-100
                                "
                            >

                                {loading
                                    ? "Logging in..."
                                    : "Login to Continue"
                                }

                            </button>

                        </form>


                        {/* CREATE ACCOUNT */}

                        <p className="
                            text-center
                            text-sm
                            text-gray-500
                            mt-7
                        ">

                            Don't have an account?

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="
                                    ml-1
                                    text-cyan-400
                                    font-semibold
                                    hover:text-cyan-300
                                    hover:underline
                                "
                            >

                                Create Account

                            </button>

                        </p>


                    </div>

                </div>

            </div>

        </div>

    );
}


// ==========================================
// FEATURE COMPONENT
// ==========================================

function Feature({
    icon,
    text,
}) {

    return (

        <div className="
            flex
            items-center
            gap-3
            text-gray-300
        ">

            <span className="
                w-7
                h-7
                rounded-full
                bg-cyan-400/10
                border
                border-cyan-400/20
                flex
                items-center
                justify-center
                text-cyan-400
                text-sm
                font-bold
            ">

                {icon}

            </span>

            <span className="text-sm">

                {text}

            </span>

        </div>

    );

}


export default Login;