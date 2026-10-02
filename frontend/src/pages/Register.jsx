import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    registerUser,
    verifyOTP,
    resendOTP,
} from "../services/authService";

import { useAuth } from "../context/AuthContext";

function Register() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        mobile: "",
        password: "",
        confirm_password: "",
    });

    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(45);
    const [resendingOTP, setResendingOTP] = useState(false);

    // =========================================
    // INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    useEffect(() => {
    if (step !== 2 || resendTimer <= 0) {
        return;
    }

    const timer = setInterval(() => {
        setResendTimer((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                return 0;
            }

            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);

}, [step, resendTimer]);

    // =========================================
    // REGISTER
    // =========================================

    const handleRegister = async (e) => {

        e.preventDefault();

        if (!formData.full_name.trim()) {
            toast.error("Please enter your full name.");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        if (!formData.mobile.trim()) {
            toast.error("Please enter your mobile number.");
            return;
        }

        if (!formData.password) {
            toast.error("Please enter a password.");
            return;
        }

        if (
            formData.password !==
            formData.confirm_password
        ) {
            toast.error("Passwords do not match.");
            return;
        }


        try {

            setLoading(true);

            const response =
                await registerUser(formData);


            if (response.success) {

                toast.success(
                    "OTP sent to your email."
                );

                setStep(2);

            } else {

                toast.error(
                    response.message ||
                    "Registration failed."
                );

            }

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
                        : String(firstError)
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    "Registration failed."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    // =========================================
    // VERIFY OTP
    // =========================================

    const handleVerifyOTP = async (e) => {

        e.preventDefault();


        if (otp.length !== 6) {

            toast.error(
                "Please enter the 6-digit OTP."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await verifyOTP({
                    email: formData.email,
                    otp: otp,
                });


            if (response.success) {

                // JWT automatically save
                login(response);

                toast.success(
                    "Registration successful!"
                );

                // New user directly application
                setTimeout(() => {

                    navigate("/application");

                }, 500);

            } else {

                toast.error(
                    response.message ||
                    "OTP verification failed."
                );

            }

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
                        : String(firstError)
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    "Invalid OTP."
                );

            }

        } finally {

            setLoading(false);

        }
    };

    const handleResendOTP = async () => {

    if (resendTimer > 0 || resendingOTP) {
        return;
    }

    try {

        setResendingOTP(true);

        const response = await resendOTP({
            email: formData.email,
        });

        if (response.success) {

            toast.success(
                "A new OTP has been sent to your email."
            );

            setOtp("");

            setResendTimer(
                response.data?.retry_after || 45
            );

        } else {

            toast.error(
                response.message ||
                "Unable to resend OTP."
            );

        }

    } catch (error) {

        console.error(
            "RESEND OTP ERROR:",
            error
        );

        const retryAfter =
            error.response?.data?.retry_after;

        if (retryAfter) {

            setResendTimer(
                Number(retryAfter)
            );

        }

        toast.error(
            error.response?.data?.message ||
            "Unable to resend OTP."
        );

    } finally {

        setResendingOTP(false);

    }
};

    // =========================================
    // UI
    // =========================================

    return (

        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-28">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full"></div>

                <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 blur-[130px] rounded-full"></div>

            </div>


            <div className="relative w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">


                {/* ================================= */}
                {/* LEFT SIDE */}
                {/* ================================= */}

                <div className="hidden md:flex bg-gradient-to-br from-blue-700/80 via-blue-800/70 to-purple-800/70 p-12 text-white flex-col justify-center">

                    <p className="text-cyan-300 font-semibold tracking-widest uppercase text-sm">
                        Student Registration
                    </p>

                    <h1 className="text-4xl font-black mt-4 leading-tight">
                        Begin Your
                        <br />
                        Pratibha Khoj Journey
                    </h1>

                    <p className="text-blue-100 mt-6 leading-8">
                        Create your student account and
                        register for Ghazipur Pratibha Khoj.
                    </p>


                    <div className="mt-10 space-y-5">

                        <div className="flex gap-4">

                            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-bold">
                                1
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Create Account
                                </h3>

                                <p className="text-sm text-blue-100 mt-1">
                                    Enter your basic details.
                                </p>
                            </div>

                        </div>


                        <div className="flex gap-4">

                            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-bold">
                                2
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Verify Email
                                </h3>

                                <p className="text-sm text-blue-100 mt-1">
                                    Verify your email with OTP.
                                </p>
                            </div>

                        </div>


                        <div className="flex gap-4">

                            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-bold">
                                3
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Fill Application
                                </h3>

                                <p className="text-sm text-blue-100 mt-1">
                                    Complete your examination form.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <div className="p-7 sm:p-10 md:p-12">

                    <div className="max-w-md mx-auto">


                        {/* ================================= */}
                        {/* STEP 1 */}
                        {/* ================================= */}

                        {step === 1 && (

                            <>

                                <p className="text-sm font-semibold text-cyan-400">
                                    Create Account
                                </p>

                                <h2 className="text-3xl font-black text-white mt-2">
                                    Register Now
                                </h2>

                                <p className="text-gray-400 mt-2 mb-7">
                                    Create your account to continue.
                                </p>


                                {/* LOGIN / REGISTER SWITCH */}

                                <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex mb-7">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/login")
                                        }
                                        className="flex-1 py-2.5 rounded-lg text-gray-400 hover:text-white transition"
                                    >
                                        Login
                                    </button>

                                    <button
                                        type="button"
                                        className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold"
                                    >
                                        Create Account
                                    </button>

                                </div>


                                <form
                                    onSubmit={handleRegister}
                                    className="space-y-4"
                                >

                                    {/* FULL NAME */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        />

                                    </div>


                                    {/* MOBILE */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Mobile Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            maxLength="10"
                                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        />

                                    </div>


                                    {/* PASSWORD */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password"
                                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            8+ characters • Uppercase • Lowercase • Number • Special character • No spaces
                                        </p>

                                    </div>


                                    {/* CONFIRM PASSWORD */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={formData.confirm_password}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                        />

                                    </div>


                                    {/* SUBMIT */}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/30 disabled:opacity-60"
                                    >

                                        {loading
                                            ? "Sending OTP..."
                                            : "Create Account"
                                        }

                                    </button>

                                </form>


                                <p className="text-center text-sm text-gray-500 mt-6">

                                    Already have an account?

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/login")
                                        }
                                        className="ml-1 text-cyan-400 font-semibold hover:underline"
                                    >
                                        Login
                                    </button>

                                </p>

                            </>

                        )}


                        {/* ================================= */}
                        {/* STEP 2 — OTP */}
                        {/* ================================= */}

                        {step === 2 && (

                            <>

                                <p className="text-sm font-semibold text-cyan-400">
                                    Email Verification
                                </p>

                                <h2 className="text-3xl font-black text-white mt-2">
                                    Verify Your Email
                                </h2>

                                <p className="text-gray-400 mt-3 leading-7">
                                    We've sent a 6-digit OTP to
                                    <br />

                                    <span className="text-white font-semibold">
                                        {formData.email}
                                    </span>
                                </p>


                                <form
                                    onSubmit={handleVerifyOTP}
                                    className="mt-8"
                                >

                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Enter OTP
                                    </label>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="000000"
                                        className="w-full h-14 px-4 text-center tracking-[0.5em] text-2xl font-bold bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                                    />


                                    <button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            otp.length !== 6
                                        }
                                        className="w-full h-12 mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition disabled:opacity-50"
                                    >

                                        {loading
                                            ? "Verifying..."
                                            : "Verify & Continue"
                                        }

                                    </button>

                                </form>

                                <div className="mt-5 text-center">

    <p className="text-sm text-gray-500">
        Didn't receive the OTP?
    </p>

    {resendTimer > 0 ? (

        <p className="mt-1 text-sm text-gray-400">
            Resend OTP in{" "}
            <span className="font-semibold text-cyan-400">
                {resendTimer}s
            </span>
        </p>

    ) : (

        <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendingOTP}
            className="
                mt-1
                text-sm
                font-semibold
                text-cyan-400
                hover:text-cyan-300
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
            "
        >
            {resendingOTP
                ? "Sending OTP..."
                : "Resend OTP"
            }
        </button>

    )}

</div>        

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setOtp("");
                                    }}
                                    className="w-full mt-4 text-sm text-gray-400 hover:text-white transition"
                                >
                                    ← Change registration details
                                </button>

                            </>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Register;