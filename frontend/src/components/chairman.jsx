import { motion } from "framer-motion";
import chairman from "../assets/images/chairman.jpeg";

function Chairman() {
    return (
        <section className="py-24 bg-[#07111F]">

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Image */}

                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: .8 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >

                    <div className="relative">

                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 blur-3xl opacity-30 rounded-3xl"></div>

                        <img
                            src={chairman}
                            alt="Chairman"
                            className="relative w-[480px] rounded-3xl border border-white/20 shadow-2xl object-contain"
                        />
                    </div>

                </motion.div>

                {/* Right */}

                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: .8 }}
                    viewport={{ once: true }}
                >

                    <span className="inline-block px-5 py-2 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-semibold">
                        Chairman's Message
                    </span>

                    <h2 className="text-5xl font-black mt-6 text-white">
                        Welcome to
                        <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                            Ghazipur Pratibha Khoj
                        </span>
                    </h2>

                    <p className="text-gray-300 leading-9 mt-8 text-lg">

                        Every child has unique talent and deserves an opportunity
                        to shine. Ghazipur Pratibha Khoj is an initiative to
                        identify, encourage and celebrate young minds through
                        a fair and inspiring talent examination.

                    </p>

                    <div className="mt-10">

                        <h3 className="text-2xl font-bold text-white">
                            Arvind Kumar Bhushan
                        </h3>

                        <p className="text-cyan-300 mt-2">
                            Chairman • Ghazipur Pratibha Khoj
                        </p>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}

export default Chairman;