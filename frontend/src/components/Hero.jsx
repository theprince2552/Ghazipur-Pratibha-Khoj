import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroStudents from "../assets/images/hero-image.png";

function Hero() {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] overflow-hidden pt-24"
        >
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* LEFT */}

                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-md shadow-lg">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>

                        <span className="text-sm md:text-base font-extrabold tracking-[0.2em] uppercase text-cyan-200">
                            Symbol of Knowledge
                        </span>
                    </span>

                    <h1 className="mt-6 text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">

                        <span className="text-white">
                            GHAZIPUR
                        </span>

                        <br />

                        <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                            PRATIBHA KHOJ
                        </span>

                        <br />

                        <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">

                        </span>

                    </h1>

                    <p className="mt-8 text-lg leading-8 text-gray-300">
                        Participate in Ghazipur Pratibha Khoj and showcase your
                        talent among thousands of students. Compete fairly,
                        win exciting prizes and make your future brighter.
                    </p>

                    <div className="flex gap-5 mt-10 flex-wrap">

                        <Link
                            to="/register"
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 duration-300 shadow-xl"
                        >
                            Register Now
                        </Link>

                    </div>

                    {/* Stats */}

                    <div className="grid grid-cols-3 gap-5 mt-14">

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">

                            <h2 className="text-3xl font-bold text-yellow-400">
                                10K+
                            </h2>

                            <p className="text-gray-300 mt-2">
                                Students
                            </p>

                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">

                            <h2 className="text-3xl font-bold text-blue-400">
                                100+
                            </h2>

                            <p className="text-gray-300 mt-2">
                                Schools
                            </p>

                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">

                            <h2 className="text-3xl font-bold text-purple-400">
                                360+
                            </h2>

                            <p className="text-gray-300 mt-2">
                                Exciting Prizes
                            </p>

                        </div>

                    </div>

                </motion.div>

                {/* RIGHT */}

                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="
        relative
        flex
        justify-center
        w-full
        mt-8
        md:mt-12
        lg:-mt-52
    "
                >

                    {/* Glow */}

                    <div className="
        absolute
        top-20
        left-10
        md:left-20
        w-72
        h-72
        bg-blue-500/20
        blur-[120px]
        rounded-full
    "></div>


                    <div className="
        absolute
        bottom-20
        right-10
        md:right-20
        w-80
        h-80
        bg-purple-500/20
        blur-[120px]
        rounded-full
    "></div>


                    <div className="
        absolute
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-72
        h-72
        md:w-96
        md:h-96
        bg-cyan-500/10
        blur-[150px]
        rounded-full
    "></div>


                    {/* Image */}

                    <div className="
        relative
        w-full
        max-w-[820px]
        rounded-[20px]
        overflow-hidden
        border
        border-white/20
        bg-white/10
        backdrop-blur-xl
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        p-2
        md:p-3
    ">

                        <img
                            src={heroStudents}
                            alt="Students Giving Exam"
                            className="
                w-full
                h-[260px]
                sm:h-[300px]
                md:h-[340px]
                lg:h-[360px]
                object-cover
                rounded-[16px]
                md:rounded-[20px]
            "
                        />

                    </div>

                </motion.div>

            </div>
        </section>
    );
}

export default Hero;