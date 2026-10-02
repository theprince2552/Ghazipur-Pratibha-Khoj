import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBullseye,
  FaEye,
  FaUsers,
  FaHandshake,
  FaTrophy,
} from "react-icons/fa";

function About() {
  return (
    <section
      id="about"
      className="relative py-28 bg-gradient-to-b from-[#08111f] via-[#0B1324] to-[#0F172A] overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 font-bold uppercase tracking-[0.2em]">

            <FaGraduationCap />

            About Us

          </span>

          <h2 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-black text-white">

            About

            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">

              Ghazipur Pratibha Khoj Association

            </span>

          </h2>

          <p className="max-w-4xl mx-auto mt-10 text-gray-300 text-lg leading-9">

            <span className="text-white font-semibold">
              Ghazipur Pratibha Khoj Association
            </span>{" "}
            is a social and educational organization dedicated to empowering
            students through education, talent recognition, and equal
            opportunities. We identify and encourage talented as well as
            underprivileged students by providing guidance, scholarships,
            competitions, and skill development initiatives. We believe that
            education, values, and community support are the strongest
            foundations for building a brighter, self-reliant, and progressive
            society.

          </p>

        </motion.div>

        {/* Vision & Mission */}

        <div className="grid lg:grid-cols-2 gap-10 mt-20">

          {/* Vision */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 hover:border-cyan-400/40 transition-all duration-300"
          >

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-3xl text-white">

              <FaEye />

            </div>

            <h3 className="mt-6 text-3xl font-bold text-white">

              Our Vision

            </h3>

            <p className="mt-6 text-gray-300 leading-9">

              To build an educated, self-reliant and empowered society where
              every individual gets an equal opportunity to discover their
              talent, achieve their potential and live with dignity.

            </p>

          </motion.div>

          {/* Mission */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 hover:border-cyan-400/40 transition-all duration-300"
          >

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-3xl text-white">

              <FaBullseye />

            </div>

            <h3 className="mt-6 text-3xl font-bold text-white">

              Our Mission

            </h3>

            <p className="mt-6 text-gray-300 leading-9">

              To promote education, social service and talent development
              through scholarship programs, career guidance, awareness
              campaigns, competitions and skill development initiatives that
              inspire the next generation to contribute towards nation
              building.

            </p>

          </motion.div>

        </div>

        {/* Highlights */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {[
            {
              icon: <FaGraduationCap />,
              title: "Education",
              text: "Promoting quality education for every student."
            },
            {
              icon: <FaTrophy />,
              title: "Talent Development",
              text: "Recognizing and encouraging young talents."
            },
            {
              icon: <FaHandshake />,
              title: "Social Welfare",
              text: "Supporting underprivileged families and students."
            },
            {
              icon: <FaUsers />,
              title: "Career Guidance",
              text: "Helping students build a brighter future."
            },
          ].map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * .15 }}
              viewport={{ once: true }}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400/40 hover:-translate-y-2 transition-all duration-300"
            >

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-3xl text-white mb-6">

                {item.icon}

              </div>

              <h3 className="text-2xl font-bold text-white">

                {item.title}

              </h3>

              <p className="mt-4 text-gray-400 leading-8">

                {item.text}

              </p>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default About;