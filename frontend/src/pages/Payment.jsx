import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";


function Payment() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);


    // ==========================================
    // LOAD RAZORPAY CHECKOUT SCRIPT
    // ==========================================

    useEffect(() => {

        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(script);


        return () => {

            document.body.removeChild(script);

        };

    }, []);


    // ==========================================
    // START PAYMENT
    // ==========================================

    const handlePayment = async () => {

        try {

            setLoading(true);


            // ----------------------------------
            // CREATE RAZORPAY ORDER
            // ----------------------------------

            const response = await api.post(
                "/payments/create-order/"
            );


            if (!response.data?.success) {

                toast.error(
                    response.data?.message ||
                    "Unable to create payment order."
                );

                return;
            }


            const paymentData =
                response.data.data;


            // ----------------------------------
            // RAZORPAY OPTIONS
            // ----------------------------------

            const options = {

                key: paymentData.razorpay_key,

                amount:
                    paymentData.amount * 100,

                currency:
                    paymentData.currency,

                name:
                    "Ghazipur Pratibha Khoj",

                description:
                    "Registration Fee",

                order_id:
                    paymentData.order_id,


                handler: async function (
                    razorpayResponse
                ) {

                    try {

                        setLoading(true);


                        // -------------------------
                        // VERIFY PAYMENT
                        // -------------------------

                        const verifyResponse =
                            await api.post(
                                "/payments/verify/",
                                {
                                    razorpay_order_id:
                                        razorpayResponse
                                            .razorpay_order_id,

                                    razorpay_payment_id:
                                        razorpayResponse
                                            .razorpay_payment_id,

                                    razorpay_signature:
                                        razorpayResponse
                                            .razorpay_signature,
                                }
                            );


                        if (
                            verifyResponse.data
                                ?.success
                        ) {

                            toast.success(
                                "Payment successful!"
                            );


                            // Dashboard only
                            // after verification
                            navigate(
                                "/dashboard"
                            );

                        } else {

                            toast.error(
                                verifyResponse.data
                                    ?.message ||
                                "Payment verification failed."
                            );

                        }

                    } catch (error) {

                        console.error(error);

                        toast.error(
                            error.response?.data
                                ?.message ||
                            "Payment verification failed."
                        );

                    } finally {

                        setLoading(false);

                    }

                },


                modal: {

                    ondismiss: function () {

                        setLoading(false);

                        toast.error(
                            "Payment cancelled."
                        );

                    },

                },


                theme: {

                    color: "#2563eb",

                },

            };


            // ----------------------------------
            // OPEN RAZORPAY
            // ----------------------------------

            if (
                !window.Razorpay
            ) {

                toast.error(
                    "Razorpay is still loading. Please try again."
                );

                return;

            }


            const razorpay =
                new window.Razorpay(
                    options
                );


            razorpay.open();


        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data
                    ?.message ||
                "Unable to start payment."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="
            min-h-screen
            bg-[#020617]
            flex
            items-center
            justify-center
            px-6
        ">

            <div className="
                w-full
                max-w-lg
                rounded-[32px]
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-10
                text-center
                shadow-2xl
            ">

                {/* ICON */}

                <div className="
                    mx-auto
                    w-20
                    h-20
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    flex
                    items-center
                    justify-center
                    text-white
                    text-3xl
                    shadow-xl
                ">

                    ₹

                </div>


                {/* TITLE */}

                <h1 className="
                    mt-7
                    text-3xl
                    font-black
                    text-white
                ">

                    Registration Fee

                </h1>


                <p className="
                    mt-4
                    text-gray-400
                    leading-7
                ">

                    Your application has been
                    submitted successfully.

                    Complete the registration payment
                    to continue to your dashboard.

                </p>


                {/* AMOUNT */}

                <div className="
                    mt-8
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-cyan-500/10
                    p-6
                ">

                    <p className="
                        text-gray-400
                    ">

                        Registration Fee

                    </p>

                    <p className="
                        mt-2
                        text-5xl
                        font-black
                        text-white
                    ">

                        ₹100

                    </p>

                </div>


                {/* PAY BUTTON */}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="
                        mt-8
                        w-full
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-600
                        px-8
                        py-4
                        text-white
                        font-bold
                        text-lg
                        shadow-xl
                        transition
                        hover:scale-[1.02]
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >

                    {loading
                        ? "Processing..."
                        : "Pay Now"
                    }

                </button>


                <p className="
                    mt-5
                    text-xs
                    text-gray-500
                ">

                    Secure payment powered by Razorpay

                </p>

            </div>

        </div>

    );

}


export default Payment;