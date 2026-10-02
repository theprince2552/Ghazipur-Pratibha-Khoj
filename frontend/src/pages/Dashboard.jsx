import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaSchool,
  FaMapMarkerAlt,
  FaCreditCard,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaSignOutAlt,
  FaTicketAlt,
} from "react-icons/fa";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";


function Dashboard() {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [unreadMessages, setUnreadMessages] = useState(0);


  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const response =
          await api.get(
            "/dashboard/"
          );

        if (
          response.data?.success
        ) {

          setDashboard(
            response.data.data
          );

        } else {

          toast.error(
            "Unable to load dashboard."
          );

        }

      } catch (error) {

        console.error(error);

        toast.error(
          error.response?.data?.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, []);

  // ==========================================
  // FETCH UNREAD MESSAGES
  // ==========================================

  useEffect(() => {

    const fetchUnreadMessages = async () => {

      try {

        const response =
          await api.get("/messages/student/");

        if (response.data?.success) {

          const unread =
            (response.data.data || []).filter(
              (message) => !message.is_read
            ).length;

          setUnreadMessages(unread);

        }

      } catch (error) {

        console.error(
          "UNREAD MESSAGES ERROR:",
          error
        );

      }

    };

    fetchUnreadMessages();

  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    logout();

    toast.success(
      "Logged out successfully."
    );

    navigate("/");

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="
                min-h-screen
                bg-[#020617]
                flex
                items-center
                justify-center
                text-white
            ">

        <div className="text-center">

          <div className="
                        w-12
                        h-12
                        border-4
                        border-cyan-400/30
                        border-t-cyan-400
                        rounded-full
                        animate-spin
                        mx-auto
                    " />

          <p className="
                        mt-5
                        text-gray-400
                    ">

            Loading dashboard...

          </p>

        </div>

      </div>

    );

  }


  const application =
    dashboard?.application;

  const payment =
    dashboard?.payment;


  return (

    <div className="
            min-h-screen
            bg-[#020617]
            text-white
            px-4
            sm:px-6
            lg:px-8
            py-8
        ">

      <div className="
                max-w-7xl
                mx-auto
            ">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-5
                    mb-8
                ">

          <div>

            <p className="
                            text-cyan-400
                            font-semibold
                        ">

              Student Dashboard

            </p>

            <h1 className="
                            mt-2
                            text-3xl
                            md:text-4xl
                            font-black
                        ">

              Welcome,{" "}

              <span className="
                                bg-gradient-to-r
                                from-cyan-300
                                via-sky-400
                                to-blue-500
                                bg-clip-text
                                text-transparent
                            ">

                {dashboard?.user?.full_name ||
                  user?.full_name ||
                  "Student"}

              </span>

              👋

            </h1>

          </div>


          <div className="
    flex
    items-center
    gap-3
    self-start
    md:self-auto
">

            {/* MESSAGES BUTTON */}
            <button
              onClick={() => navigate("/messages")}
              className="
    relative
    flex
    items-center
    gap-2
    px-6
    py-3
    rounded-full
    border
    border-purple-400/30
    bg-purple-500/10
    text-purple-300
    hover:bg-purple-500/20
    transition
  "
            >
              <FaEnvelope />

              Messages

              {unreadMessages > 0 && (
                <span
                  className="
        absolute
        -right-1
        -top-1
        flex
        h-[22px]
        min-w-[22px]
        items-center
        justify-center
        rounded-full
        bg-red-500
        px-1.5
        text-[11px]
        font-bold
        text-white
        shadow-lg
        shadow-red-500/30
      "
                >
                  {unreadMessages > 99
                    ? "99+"
                    : unreadMessages}
                </span>
              )}

            </button>

            {/* HOME BUTTON */}
            <button
              onClick={() => navigate("/")}
              className="
            flex
            items-center
            gap-2
            px-6
            py-3
            rounded-full
            border
            border-cyan-400/30
            bg-cyan-500/10
            text-cyan-300
            hover:bg-cyan-500/20
            transition
        "
            >
              🏠
              Home
            </button>


            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="
            flex
            items-center
            gap-2
            px-6
            py-3
            rounded-full
            border
            border-red-400/30
            bg-red-500/10
            text-red-300
            hover:bg-red-500/20
            transition
        "
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        </div>


        {/* ================================= */}
        {/* TOP STATUS CARDS */}
        {/* ================================= */}

        <div className="
                    grid
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                ">


          {/* APPLICATION */}

          <div className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-6
                    ">

            <div className="
                            flex
                            items-center
                            justify-between
                        ">

              <div className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-cyan-500/10
                                flex
                                items-center
                                justify-center
                                text-cyan-400
                            ">

                <FaFileAlt />

              </div>


              {application?.status ===
                "submitted" ? (

                <span className="
                                    flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-green-500/10
                                    text-green-400
                                    text-sm
                                    font-semibold
                                ">

                  <FaCheckCircle />

                  Submitted

                </span>

              ) : (

                <span className="
                                    flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-yellow-500/10
                                    text-yellow-400
                                    text-sm
                                    font-semibold
                                ">

                  <FaClock />

                  Draft

                </span>

              )}

            </div>


            <h2 className="
                            mt-6
                            text-xl
                            font-bold
                        ">

              Application

            </h2>


            <p className="
                            mt-2
                            text-gray-400
                        ">

              Application status

            </p>

          </div>


          {/* PAYMENT */}

          <div className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-6
                    ">

            <div className="
                            flex
                            items-center
                            justify-between
                        ">

              <div className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-blue-500/10
                                flex
                                items-center
                                justify-center
                                text-blue-400
                            ">

                <FaCreditCard />

              </div>


              {payment?.status ===
                "paid" ? (

                <span className="
                                    flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-green-500/10
                                    text-green-400
                                    text-sm
                                    font-semibold
                                ">

                  <FaCheckCircle />

                  Paid

                </span>

              ) : (

                <span className="
                                    flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-yellow-500/10
                                    text-yellow-400
                                    text-sm
                                    font-semibold
                                ">

                  <FaClock />

                  Pending

                </span>

              )}

            </div>


            <h2 className="
                            mt-6
                            text-xl
                            font-bold
                        ">

              Registration Fee

            </h2>


            <p className="
                            mt-2
                            text-3xl
                            font-black
                        ">

              ₹{payment?.amount || 100}

            </p>

          </div>


          {/* EXAM CENTER */}

          <div className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-6
                    ">

            <div className="
                            w-12
                            h-12
                            rounded-2xl
                            bg-purple-500/10
                            flex
                            items-center
                            justify-center
                            text-purple-400
                        ">

              <FaMapMarkerAlt />

            </div>


            <h2 className="
                            mt-6
                            text-xl
                            font-bold
                        ">

              Exam Center

            </h2>


            <p className="
                            mt-2
                            text-gray-400
                        ">

              {application?.exam_center ||
                "Not selected"}

            </p>

          </div>

        </div>


        {/* ================================= */}
        {/* PROFILE + APPLICATION */}
        {/* ================================= */}

        <div className="
                    grid
                    lg:grid-cols-2
                    gap-6
                    mt-6
                ">


          {/* PROFILE */}

          <div className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-7
                    ">

            <h2 className="
                            text-2xl
                            font-black
                        ">

              Student Profile

            </h2>


            <div className="
                            mt-7
                            space-y-5
                        ">


              <div className="
                                flex
                                items-center
                                gap-4
                            ">

                <FaUser className="
                                    text-cyan-400
                                " />

                <div>

                  <p className="
                                        text-xs
                                        text-gray-500
                                    ">

                    Full Name

                  </p>

                  <p className="
                                        font-semibold
                                    ">

                    {dashboard?.user
                      ?.full_name ||
                      "-"}

                  </p>

                </div>

              </div>


              <div className="
                                flex
                                items-center
                                gap-4
                            ">

                <FaEnvelope className="
                                    text-cyan-400
                                " />

                <div>

                  <p className="
                                        text-xs
                                        text-gray-500
                                    ">

                    Email

                  </p>

                  <p className="
                                        font-semibold
                                        break-all
                                    ">

                    {dashboard?.user
                      ?.email ||
                      "-"}

                  </p>

                </div>

              </div>


              <div className="
                                flex
                                items-center
                                gap-4
                            ">

                <FaPhone className="
                                    text-cyan-400
                                " />

                <div>

                  <p className="
                                        text-xs
                                        text-gray-500
                                    ">

                    Mobile

                  </p>

                  <p className="
                                        font-semibold
                                    ">

                    {dashboard?.user
                      ?.mobile ||
                      "-"}

                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* APPLICATION DETAILS */}

          <div className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-7
                    ">

            <h2 className="
                            text-2xl
                            font-black
                        ">

              Application Details

            </h2>


            {application ? (

              <div className="
                                mt-7
                                grid
                                sm:grid-cols-2
                                gap-5
                            ">


                <Info
                  icon={<FaUser />}
                  label="Student Name"
                  value={
                    application
                      .student_full_name
                  }
                />


                <Info
                  icon={
                    <FaGraduationCap />
                  }
                  label="Class"
                  value={
                    application
                      .student_class
                  }
                />


                <Info
                  icon={
                    <FaSchool />
                  }
                  label="Board"
                  value={
                    application.board
                  }
                />


                <Info
                  icon={
                    <FaMapMarkerAlt />
                  }
                  label="Exam Center"
                  value={
                    application
                      .exam_center
                  }
                />

              </div>

            ) : (

              <p className="
                                mt-6
                                text-gray-400
                            ">

                No application found.

              </p>

            )}

          </div>

        </div>


        {/* ================================= */}
        {/* PAYMENT DETAILS */}
        {/* ================================= */}

        {payment && (

          <div className="
                        mt-6
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-7
                    ">

            <h2 className="
                            text-2xl
                            font-black
                        ">

              Payment Details

            </h2>


            <div className="
                            mt-7
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-4
                            gap-5
                        ">

              <Info
                icon={
                  <FaCreditCard />
                }
                label="Amount"
                value={`₹${payment.amount}`}
              />


              <Info
                icon={
                  <FaCheckCircle />
                }
                label="Status"
                value={
                  payment.status
                    .toUpperCase()
                }
              />


              <Info
                icon={
                  <FaFileAlt />
                }
                label="Payment ID"
                value={
                  payment
                    .razorpay_payment_id ||
                  "-"
                }
              />


              <Info
                icon={
                  <FaFileAlt />
                }
                label="Order ID"
                value={
                  payment
                    .razorpay_order_id ||
                  "-"
                }
              />

            </div>

          </div>

        )}


        {/* ================================= */}
        {/* ADMIT CARD */}
        {/* ================================= */}

        <div
          className="
    mt-6
    rounded-3xl
    border
    border-cyan-400/20
    bg-gradient-to-r
    from-cyan-500/10
    to-blue-500/10
    p-7
  "
        >
          <div
            className="
      flex
      flex-col
      md:flex-row
      md:items-center
      md:justify-between
      gap-5
    "
          >

            <div>

              <div className="flex items-center gap-3">

                <div
                  className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-cyan-400/10
            text-cyan-400
          "
                >
                  <FaTicketAlt size={20} />
                </div>

                <div>

                  <h2 className="text-2xl font-black">
                    Admit Card
                  </h2>

                  {dashboard?.admit_card ? (

                    <p className="mt-1 text-sm text-green-400">
                      ✓ Your admit card is available
                    </p>

                  ) : (

                    <p className="mt-1 text-sm text-gray-400">
                      Your admit card has not been generated yet.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* BUTTON */}

            {dashboard?.admit_card ? (

              <button
                onClick={() => navigate("/admit-card")}
                className="
          flex
          items-center
          justify-center
          gap-2
          rounded-full
          bg-cyan-400
          px-7
          py-3
          font-bold
          text-[#041018]
          transition
          hover:bg-cyan-300
          hover:scale-[1.02]
        "
              >
                <FaTicketAlt />

                View Admit Card

              </button>

            ) : (

              <button
                disabled
                className="
          rounded-full
          bg-white/10
          px-7
          py-3
          text-gray-500
          cursor-not-allowed
        "
              >
                Not Available
              </button>

            )}

          </div>
        </div>

      </div>
    </div>

  );

}


// ==========================================
// INFO COMPONENT
// ==========================================

function Info({
  icon,
  label,
  value,
}) {

  return (

    <div className="
            rounded-2xl
            bg-white/5
            border
            border-white/5
            p-4
        ">

      <div className="
                flex
                items-center
                gap-3
                text-cyan-400
            ">

        {icon}

        <span className="
                    text-xs
                    text-gray-500
                ">

          {label}

        </span>

      </div>


      <p className="
                mt-2
                font-semibold
                break-all
            ">

        {value || "-"}

      </p>

    </div>

  );

}


export default Dashboard;