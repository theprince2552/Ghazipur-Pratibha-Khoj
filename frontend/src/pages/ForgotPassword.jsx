import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
} from "../services/authService";


function ForgotPassword() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");

    const [otp, setOtp] = useState("");

    const [resetToken, setResetToken] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // SEND OTP
    // ==========================================

    const handleSendOTP = async (e) => {

        e.preventDefault();

        if (!email.trim()) {

            toast.error(
                "Please enter your email."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await forgotPassword({
                    email: email.trim(),
                });


            if (response.success) {

                toast.success(
                    "OTP sent to your email."
                );

                setStep(2);

            } else {

                toast.error(
                    response.message ||
                    "Unable to send OTP."
                );

            }

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to send OTP."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // VERIFY OTP
    // ==========================================

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
                await verifyForgotPasswordOTP({
                    email,
                    otp,
                });


            if (response.success) {

                setResetToken(
                    response.reset_token
                );

                toast.success(
                    "OTP verified successfully."
                );

                setStep(3);

            } else {

                toast.error(
                    response.message ||
                    "Invalid OTP."
                );

            }

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Invalid OTP."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        if (newPassword.length < 8) {

            toast.error(
                "Password must be at least 8 characters."
            );

            return;
        }

        if (
            newPassword !== confirmPassword
        ) {

            toast.error(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await resetPassword({

                    reset_token:
                        resetToken,

                    new_password:
                        newPassword,

                    confirm_password:
                        confirmPassword,

                });


            if (response.success) {

                toast.success(
                    "Password reset successfully!"
                );

                setTimeout(() => {

                    navigate("/login");

                }, 800);

            } else {

                toast.error(
                    response.message ||
                    "Unable to reset password."
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
                    "Unable to reset password."
                );

            }

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
            {/* BACKGROUND GLOWS */}
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


            {/* ================================= */}
            {/* CARD */}
            {/* ================================= */}

            <div className="
                relative
                w-full
                max-w-md
                rounded-[30px]
                border
                border-white/10
                bg-white/[0.04]
                backdrop-blur-2xl
                shadow-[0_25px_80px_rgba(0,0,0,0.5)]
                p-7
                sm:p-10
            ">


                {/* LOGO */}

                <div className="
                    mx-auto
                    w-16
                    h-16
                    rounded-2xl
                    border
                    border-cyan-400/30
                    bg-cyan-400/10
                    flex
                    items-center
                    justify-center
                    text-2xl
                    font-black
                    text-cyan-300
                    shadow-[0_0_35px_rgba(34,211,238,0.12)]
                ">

                    G

                </div>


                {/* HEADING */}

                <div className="
                    text-center
                    mt-6
                ">

                    <p className="
                        text-cyan-400
                        text-sm
                        font-semibold
                    ">

                        Student Portal

                    </p>

                    <h1 className="
                        mt-2
                        text-3xl
                        font-black
                    ">

                        {step === 1 &&
                            "Forgot Password?"}

                        {step === 2 &&
                            "Verify OTP"}

                        {step === 3 &&
                            "Create New Password"}

                    </h1>

                    <p className="
                        mt-3
                        text-gray-400
                        text-sm
                        leading-6
                    ">

                        {step === 1 &&
                            "Enter your registered email and we'll send you a verification OTP."}

                        {step === 2 &&
                            `Enter the 6-digit OTP sent to ${email}.`}

                        {step === 3 &&
                            "Create a strong new password for your account."}

                    </p>

                </div>


                {/* ================================= */}
                {/* STEP INDICATOR */}
                {/* ================================= */}

                <div className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    mt-8
                    mb-8
                ">

                    {[1, 2, 3].map(
                        (item) => (

                            <div
                                key={item}
                                className={`
                                    h-2
                                    rounded-full
                                    transition-all
                                    duration-300
                                    ${item <= step
                                        ? "w-12 bg-gradient-to-r from-cyan-400 to-blue-500"
                                        : "w-8 bg-white/10"
                                    }
                                `}
                            />

                        )
                    )}

                </div>


                {/* ================================= */}
                {/* STEP 1 */}
                {/* ================================= */}

                {step === 1 && (

                    <form
                        onSubmit={handleSendOTP}
                        className="space-y-6"
                    >

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-300
                                mb-2
                            ">

                                Registered Email

                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your email"
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
                                    focus:border-cyan-400/60
                                    focus:bg-cyan-400/5
                                    focus:ring-4
                                    focus:ring-cyan-400/10
                                    transition
                                "
                            />

                        </div>


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
                                shadow-xl
                                hover:scale-[1.01]
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "Sending OTP..."
                                : "Send OTP"
                            }

                        </button>

                    </form>

                )}


                {/* ================================= */}
                {/* STEP 2 */}
                {/* ================================= */}

                {step === 2 && (

                    <form
                        onSubmit={handleVerifyOTP}
                        className="space-y-6"
                    >

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-300
                                mb-2
                            ">

                                6-Digit OTP

                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(
                                                /\D/g,
                                                ""
                                            )
                                    )
                                }
                                placeholder="Enter OTP"
                                className="
                                    w-full
                                    h-14
                                    px-4
                                    bg-white/5
                                    border
                                    border-white/10
                                    text-white
                                    text-center
                                    text-2xl
                                    font-bold
                                    tracking-[0.5em]
                                    rounded-xl
                                    outline-none
                                    focus:border-cyan-400/60
                                    focus:bg-cyan-400/5
                                    transition
                                "
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                otp.length !== 6
                            }
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
                                shadow-xl
                                hover:scale-[1.01]
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "Verifying..."
                                : "Verify OTP"
                            }

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setStep(1)
                            }
                            className="
                                w-full
                                text-sm
                                text-gray-500
                                hover:text-cyan-400
                                transition
                            "
                        >

                            ← Change Email

                        </button>

                    </form>

                )}


                {/* ================================= */}
                {/* STEP 3 */}
                {/* ================================= */}

                {step === 3 && (

                    <form
                        onSubmit={
                            handleResetPassword
                        }
                        className="space-y-5"
                    >

                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-300
                                mb-2
                            ">

                                New Password

                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Minimum 8 characters"
                                    autoComplete="new-password"
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
                                        focus:border-cyan-400/60
                                        focus:bg-cyan-400/5
                                        transition
                                    "
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    8+ characters • Uppercase • Lowercase • Number • Special character • No spaces
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="
         absolute
            right-4
            top-0
            h-13
            flex
            items-center
            text-sm
            font-medium
            text-gray-500
            hover:text-cyan-300
            transition
    "
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-300
                                mb-2
                            ">

                                Confirm Password

                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm your password"
                                autoComplete="new-password"
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
                                    focus:border-cyan-400/60
                                    focus:bg-cyan-400/5
                                    transition
                                "
                            />

                        </div>


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
                                shadow-xl
                                hover:scale-[1.01]
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "Resetting..."
                                : "Reset Password"
                            }

                        </button>

                    </form>

                )}


                {/* LOGIN LINK */}

                <div className="
                    text-center
                    mt-8
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        className="
                            text-sm
                            text-gray-500
                            hover:text-cyan-400
                            transition
                        "
                    >

                        ← Back to Login

                    </button>

                </div>


            </div>

        </div>

    );

}


export default ForgotPassword;