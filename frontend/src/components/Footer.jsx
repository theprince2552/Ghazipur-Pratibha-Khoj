import { motion } from "framer-motion";
import {
    FaWhatsapp,
    FaYoutube,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#040913] border-t border-white/10">

            {/* Glow */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <h2 className="text-3xl font-black text-white">
                                Ghazipur

                                <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                                    Pratibha Khoj
                                </span>
                            </h2>

                            <div className="mt-6">
                                <p className="uppercase tracking-[0.25em] text-xs text-gray-500 font-semibold">
                                    In Collaboration With
                                </p>

                                <h3 className="mt-2 text-2xl font-extrabold text-white leading-tight">
                                    NISHCHAY ACADEMY
                                </h3>

                                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                                    ASSOCIATION
                                </h3>
                            </div>
                        </div>

                    </motion.div>

                    {/* Quick Links */}

                    <div>

                        <h3 className="text-white text-xl font-bold">

                            Quick Links

                        </h3>

                        <ul className="mt-6 space-y-3 text-gray-400">

                            <li><a href="#hero" className="hover:text-cyan-400">Home</a></li>
                            <li><a href="#about" className="hover:text-cyan-400">About</a></li>
                            <li><a href="#features" className="hover:text-cyan-400">Features</a></li>
                            <li><a href="#scholarship" className="hover:text-cyan-400">Scholarship</a></li>
                            <li><a href="#prizes" className="hover:text-cyan-400">Prizes</a></li>
                            <li><a href="#contact" className="hover:text-cyan-400">Contact</a></li>

                        </ul>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="text-white text-xl font-bold">

                            Contact

                        </h3>

                        <div className="mt-6 space-y-5 text-gray-400">

                            <div className="flex gap-3">

                                <FaPhoneAlt className="text-cyan-400 mt-1" />

                                <a
                                    href="tel:+919415289162"
                                    className="hover:text-cyan-400 transition"
                                >
                                    +91 9415289162
                                </a>

                            </div>

                            <div className="flex gap-3">

                                <FaEnvelope className="text-cyan-400 mt-1" />

                                <a
                                    href="mailto:r.nishchayofficial@gmail.com"
                                    className="hover:text-cyan-400 transition break-all"
                                >
                                    r.nishchayofficial@gmail.com
                                </a>

                            </div>

                            <div className="flex gap-3">

                                <FaMapMarkerAlt className="text-cyan-400 mt-1" />

                                <span>Central Office
                                    Krishna Nagar, Jhunsi,
                                    Prayagraj, Uttar Pradesh</span>

                            </div>

                        </div>

                    </div>

                    {/* Social */}

                    <div>

                        <h3 className="text-white text-xl font-bold">

                            Follow Us

                        </h3>

                        <div className="flex gap-4 mt-6">

                            

                            <a
                                href="https://wa.me/919415289162"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 transition"
                            >
                                <FaWhatsapp />
                            </a>

                            <a
                                href="https://youtube.com/@rnishchayacademy?si=pqk9Q2DxAgYdvupI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500 transition"
                            >
                                <FaYoutube />
                            </a>

                        </div>

                    </div>

                </div>

                {/* Bottom */}

                <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">

                    <p>

                        © 2026 Ghazipur Pratibha Khoj Association.
                        All Rights Reserved.

                    </p>

                    <p className="mt-4 md:mt-0">

                        Designed & Developed by
                        <span className="text-cyan-400 font-semibold">
                            {" "}Prince Kumar
                        </span>

                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;