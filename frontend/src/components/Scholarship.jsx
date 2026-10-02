import { motion } from "framer-motion";
import {
  FaAward,
  FaCheckCircle,
  FaGraduationCap,
} from "react-icons/fa";

function Scholarship() {
  return (
    <section
      id="scholarship"
      className="relative py-28 overflow-hidden bg-gradient-to-b from-[#050B18] via-[#0A1324] to-[#08111F]"
    >
      {/* Glow */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            viewport={{ once: true }}
          >

            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold uppercase tracking-[0.2em]">

              <FaGraduationCap />

              Symbol of Knowledge

            </span>

            <h2 className="mt-8 text-5xl lg:text-6xl font-black text-white">

              Scholarship

              <span className="block bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">

                Programme

              </span>

            </h2>

            <div className="mt-10">

              <p className="text-gray-400 uppercase tracking-[0.3em]">

                Total Scholarship

              </p>

              <h1 className="text-6xl lg:text-7xl font-black mt-3 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">

                ₹1,00,000

              </h1>

            </div>

            <p className="mt-8 text-lg leading-9 text-gray-300">

              Outstanding students will have the opportunity to receive
              scholarships under the Symbol of Knowledge Scholarship
              Programme based on merit, performance and transparent
              evaluation.

            </p>

            <div className="mt-10 space-y-4">

              {[
                "Merit Based Selection",
                "Transparent Evaluation",
                "Equal Opportunity",
                "Multiple Scholarship Levels",
              ].map((item, index) => (

                <div key={index} className="flex items-center gap-4">

                  <FaCheckCircle className="text-cyan-400 text-xl" />

                  <span className="text-gray-300">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >

            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-[100px]"></div>

              <div className="relative w-[420px] h-[420px] rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-[0_0_80px_rgba(255,193,7,.35)]">

                <FaAward className="text-white text-[180px]" />

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}

export default Scholarship;