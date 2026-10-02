import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserEdit,
  FaCreditCard,
  FaFileDownload,
  FaMedal,
} from "react-icons/fa";

const steps = [
  {
    number: "01",
    icon: <FaUserEdit />,
    title: "Fill Registration Form",
    desc: "Complete the online registration form by providing your personal and academic details.",
  },
  {
    number: "02",
    icon: <FaCreditCard />,
    title: "Pay ₹100 Registration Fee",
    desc: "Confirm your participation by paying the registration fee through the secure payment gateway.",
  },
  {
    number: "03",
    icon: <FaFileDownload />,
    title: "Download Admit Card",
    desc: "After successful registration, download your admit card instantly from the portal.",
  },
  {
    number: "04",
    icon: <FaMedal />,
    title: "Appear in Examination",
    desc: "Participate in the district-level talent competition and compete for scholarships & prizes.",
  },
];

function RegistrationProcess() {
  return (
    <section
      id="registration"
      className="relative py-28 bg-gradient-to-b from-[#050B18] via-[#08111F] to-[#0B1324] overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px]"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex px-6 py-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 uppercase tracking-[0.2em] font-bold">
            Registration Process
          </span>

          <h2 className="mt-7 text-5xl lg:text-6xl font-black text-white">
            Register in
            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-7 text-lg leading-9 text-gray-300">
            Complete your registration in just a few simple steps and become a
            part of Ghazipur Pratibha Khoj.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {steps.map((step, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * .15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 overflow-hidden"
            >

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10"></div>

              <div className="relative">

                {/* Number */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mt-8 text-5xl text-cyan-400 group-hover:scale-110 transition">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="mt-8 text-2xl font-bold text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-5 text-gray-400 leading-8">
                  {step.desc}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[32px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl p-10 text-center"
        >

          <h3 className="text-3xl md:text-4xl font-black text-white">
            Ready to Showcase Your Talent?
          </h3>

          <p className="mt-5 text-lg text-gray-300">
            Registration is now open for students from <span className="font-semibold text-cyan-300">Class 4 to 12</span>.
            Join the competition and get a chance to win scholarships and exciting prizes.
          </p>

          <Link
            to="/register"
            className="inline-block mt-10 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-105 transition duration-300 shadow-lg"
          >
            Register Now
          </Link>

        </motion.div>

      </div>
    </section>
  );
}

export default RegistrationProcess;