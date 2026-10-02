import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-hot-toast";

import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";


function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();


    const handleLogout = () => {

        logout();

        setMenuOpen(false);

        toast.success("Logged out successfully.");

        navigate("/");
    };


    return (

        <nav className="fixed top-0 left-0 w-full z-50 bg-[#020617]/70 backdrop-blur-xl border-b border-white/10">

            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">


                {/* ================= LOGO ================= */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <img
                        src={logo}
                        alt="Ghazipur Pratibha Khoj Logo"
                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
                    />

                    <div className="leading-tight">

                        <h2 className="text-[20px] font-black text-white whitespace-nowrap tracking-wide">
                            Ghazipur Pratibha Khoj
                        </h2>

                        <p className="mt-1 text-[13px] font-extrabold uppercase tracking-[0.08em] bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                            & Nishchay Academy Association
                        </p>

                    </div>

                </Link>


                {/* ================= DESKTOP MENU ================= */}

                <div className="hidden lg:flex gap-8 text-white">

                    <a
                        href="/#home"
                        className="hover:text-yellow-400 duration-300"
                    >
                        Home
                    </a>

                    <a
                        href="/#about"
                        className="hover:text-yellow-400 duration-300"
                    >
                        About
                    </a>

                    <a
                        href="/#features"
                        className="hover:text-yellow-400 duration-300"
                    >
                        Features
                    </a>

                    <a
                        href="/#prizes"
                        className="hover:text-yellow-400 duration-300"
                    >
                        Prizes
                    </a>

                    <a
                        href="/#contact"
                        className="hover:text-yellow-400 duration-300"
                    >
                        Contact
                    </a>

                </div>


                {/* ================= AUTH BUTTONS ================= */}

                <div className="hidden lg:flex items-center gap-3">

                    {isAuthenticated ? (

                        <>
                            <Link
                                to="/dashboard"
                                className="px-5 py-2 rounded-full border border-cyan-300 text-cyan-200 hover:bg-cyan-300 hover:text-black duration-300"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/application"
                                className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 duration-300"
                            >
                                Application
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-full border border-red-400 text-red-300 hover:bg-red-500 hover:text-white duration-300"
                            >
                                Logout
                            </button>
                        </>

                    ) : (

                        <>
                            <Link
                                to="/login"
                                className="px-6 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black duration-300"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="px-6 py-2 rounded-full bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 duration-300"
                            >
                                Register
                            </Link>
                        </>

                    )}

                </div>


                {/* ================= MOBILE BUTTON ================= */}

                <button
                    className="lg:hidden text-white text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <FaBars />
                </button>

            </div>


            {/* ================= MOBILE MENU ================= */}

            {menuOpen && (

                <div className="lg:hidden bg-[#0f172a] px-6 py-5 text-white flex flex-col gap-5 border-t border-white/10">

                    <a href="/#home">
                        Home
                    </a>

                    <a href="/#about">
                        About
                    </a>

                    <a href="/#features">
                        Features
                    </a>

                    <a href="/#prizes">
                        Prizes
                    </a>

                    <a href="/#contact">
                        Contact
                    </a>


                    {isAuthenticated ? (

                        <>
                            <Link
                                to="/dashboard"
                                onClick={() => setMenuOpen(false)}
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/application"
                                onClick={() => setMenuOpen(false)}
                            >
                                Application
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-left text-red-400"
                            >
                                Logout
                            </button>
                        </>

                    ) : (

                        <>
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </>

                    )}

                </div>

            )}

        </nav>
    );
}


export default Navbar;