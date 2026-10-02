import { motion } from "framer-motion";
import {
    FaPhoneAlt,
    FaWhatsapp,
    FaEnvelope,
    FaMapMarkerAlt,
    FaYoutube,
} from "react-icons/fa";

function Contact() {
    return (
        <section
            id="contact"
            className="py-24 bg-gradient-to-b from-[#08111F] to-[#050B18]"
        >
            <div className="max-w-6xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-14">
                    <span className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 uppercase tracking-widest text-sm font-semibold">
                        Contact
                    </span>

                    <h2 className="mt-6 text-5xl font-black text-white">
                        Get In <span className="text-cyan-400">Touch</span>
                    </h2>

                    <p className="mt-5 text-gray-400 max-w-2xl mx-auto">
                        For registration, scholarship, examination or any other enquiry,
                        feel free to contact us.
                    </p>
                </div>

                {/* Contact Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: .6 }}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10"
                >

                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Phone */}
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-xl">
                                <FaPhoneAlt />
                            </div>

                            <div>
                                <h3 className="text-white font-bold text-xl">
                                    Phone
                                </h3>

                                <a
                                    href="tel:+919415289162"
                                    className="text-gray-400 mt-2 block hover:text-cyan-400 transition"
                                >
                                    +91 9415289162
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp */}

                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white text-xl">
                                <FaWhatsapp />
                            </div>

                            <div>
                                <h3 className="text-white font-bold text-xl">
                                    WhatsApp
                                </h3>

                                <a
                                    href="https://wa.me/919415289162"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-400 mt-2 block hover:text-green-400 transition"
                                >
                                    +91 9415289162
                                </a>
                            </div>
                        </div>

                        {/* Email */}

                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-xl">
                                <FaEnvelope />
                            </div>

                            <div>
                                <h3 className="text-white font-bold text-xl">
                                    Email
                                </h3>

                                <a
                                    href="mailto:r.nishchayofficial@gmail.com"
                                    className="text-gray-400 mt-2 block hover:text-cyan-400 transition break-all"
                                >
                                    r.nishchayofficial@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* YouTube */}

                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white text-xl">
                                <FaYoutube />
                            </div>

                            <div>
                                <h3 className="text-white font-bold text-xl">
                                    YouTube
                                </h3>

                                <a
                                    href="https://youtube.com/@rnishchayacademy?si=pqk9Q2DxAgYdvupI"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-400 mt-2 hover:text-red-400 transition"
                                >
                                    Visit Our Channel
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Office Address */}

                    <div className="flex items-start gap-5 md:col-span-2">
                        <div className="w-14 h-14 mt-10 rounded-2xl bg-purple-500 flex items-center justify-center text-white text-xl flex-shrink-0">
                            <FaMapMarkerAlt />
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-2xl mt-14 mb-6">
                                Office Addresses
                            </h3>

                            <div className="grid md:grid-cols-3 divide-x divide-white/10 mt-3">

                                <div className="px-6">

                                    <h4 className="text-cyan-400 font-bold text-lg mb-3">
                                        Head Office
                                    </h4>

                                    <p className="leading-8 text-gray-400">
                                        Kalaura,Abishan <br />
                                        District - Ghazipur <br />
                                        Pin - 233222
                                    </p>

                                </div>
                                <div className="px-6">

                                    <h4 className="text-cyan-400 font-bold text-lg mb-3">
                                        Purvanchal Office
                                    </h4>

                                    <p className="leading-8 text-gray-400">
                                        Sainik Chauraha <br />
                                        Ghazipur <br />
                                        Pin - 233001
                                    </p>

                                </div>
                                <div className="px-6">

                                    <h4 className="text-cyan-400 font-bold text-lg mb-3">
                                        Central Office
                                    </h4>

                                    <p className="leading-8 text-gray-400">
                                        Krishna Nagar <br />
                                        Jhunsi, Prayagraj <br />
                                        Pin - 211019
                                    </p>

                                </div>

                            </div>
                        </div>
                    </div>

                </motion.div>

            </div>
        </section>
    );
}

export default Contact;