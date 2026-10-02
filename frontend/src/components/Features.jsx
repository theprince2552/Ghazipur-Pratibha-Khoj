import { motion } from "framer-motion";
import {
  FaBrain,
  FaMoneyBillWave,
  FaGift,
  FaCertificate,
  FaLanguage,
  FaBalanceScale,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBrain />,
    title: "District Level Talent Competition",
    desc: "A fair and transparent examination designed to identify and encourage talented students from Class 4 to 12.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "₹1 Lakh Scholarship Scheme",
    desc: "Meritorious students get an opportunity to receive scholarship benefits under the Symbol of Knowledge Scholarship Programme.",
  },
  {
    icon: <FaGift />,
    title: "Exciting Rewards",
    desc: "Win attractive prizes including Bicycle, Ceiling Fan, Study Lamp, School Bag and Wall Clock.",
  },
  {
    icon: <FaCertificate />,
    title: "Certificates & Recognition",
    desc: "Participants receive certificates and top performers are honored for their outstanding achievements.",
  },
  {
    icon: <FaLanguage />,
    title: "Hindi & English Medium",
    desc: "Students from both Hindi and English medium schools can participate without any discrimination.",
  },
  {
    icon: <FaBalanceScale />,
    title: "Fair & Transparent Evaluation",
    desc: "Every student gets an equal opportunity through a well-structured and unbiased evaluation process.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="relative py-28 bg-gradient-to-b from-[#08111F] via-[#0B1324] to-[#050B18] overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[120px]"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center px-6 py-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold uppercase tracking-[0.2em]">
            Why Choose GPKA
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black text-white">
            Why Choose
            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Ghazipur Pratibha Khoj?
            </span>
          </h2>

          <p className="max-w-3xl mx-auto mt-8 text-lg leading-9 text-gray-300">
            We are committed to discovering talent, rewarding excellence and
            empowering students through education, scholarships and equal
            opportunities.
          </p>
        </motion.div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400/40 hover:-translate-y-3 transition-all duration-500"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10"></div>

              <div className="relative">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition duration-300">
                  {feature.icon}
                </div>

                <h3 className="mt-7 text-2xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-5 text-gray-400 leading-8">
                  {feature.desc}
                </p>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;