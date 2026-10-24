import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBookOpen,
  FaUniversity,
  FaHotel,
  FaChalkboardTeacher,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaArrowRight,
  FaYoutube,
} from "react-icons/fa";

const examCategories = [
  {
    title: "Civil Services",
    icon: FaUniversity,
    exams: ["IAS", "IPS", "PCS", "RO", "ARO"],
    description: "Foundation Batch",
  },
  {
    title: "SSC & Police",
    icon: FaGraduationCap,
    exams: ["SSC", "CPO (SI)", "SSC GD", "UPP", "RPF", "Army"],
    description: "Competitive Exam Preparation",
  },
  {
    title: "Railway & Other Exams",
    icon: FaBookOpen,
    exams: ["NTPC", "Railway", "UPSSSC", "PET", "VDO", "Lekhpal"],
    description: "Government Job Preparation",
  },
  {
    title: "Teaching & Other Exams",
    icon: FaChalkboardTeacher,
    exams: ["TET", "STET", "High Court", "Other One Day Exams"],
    description: "Complete Exam Preparation",
  },
];

const facilities = [
  {
    icon: FaHotel,
    title: "Hostel Facility",
    description: "Hostel accommodation facility.",
  },
  {
    icon: FaChalkboardTeacher,
    title: "Online & Offline",
    description: "Classes as per available batches.",
  },
  {
    icon: FaBookOpen,
    title: "Expert Guidance",
    description: "Guidance for competitive examinations.",
  },
];

function NishchayAcademy() {
  const phoneNumber = "918429111580";
  const whatsappMessage = encodeURIComponent(
    "Namaste, mujhe Nishchay Academy ke courses, fees aur hostel facility ke baare mein jankari chahiye."
  );

  return (
    <section
      id="nishchay-academy"
      className="relative overflow-hidden bg-gradient-to-b from-[#08111F] via-[#0B1324] to-[#050B18] py-20 sm:py-24"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            <FaGraduationCap />
            Our Coaching Partner
          </span>

          <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Nishchay{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Academy
            </span>
          </h2>

          <p className="mt-3 text-lg font-semibold text-cyan-300">
            An Optimistic Success
          </p>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
            Prepare for your future with guidance for competitive examinations,
            foundation courses and school entrance examinations.
          </p>
        </motion.div>

        {/* Exam Categories */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {examCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -7 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                  <Icon />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  {category.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {category.exams.map((exam) => (
                    <span
                      key={exam}
                      className="rounded-lg border border-white/10 bg-[#020617]/70 px-3 py-2 text-xs font-semibold text-gray-200"
                    >
                      {exam}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Foundation Batch Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-6 sm:p-8"
        >
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                Build Your Foundation
              </span>

              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                IAS / IPS / PCS / RO / ARO
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Foundation Batch for aspirants preparing for civil services
                and related competitive examinations.
              </p>
            </div>

            <a
              href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
target = "_blank"
rel = "noopener noreferrer"
className = "inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-[#020617] transition hover:bg-cyan-300"
    >
    Enquire Now < FaArrowRight />
            </a >
          </div >
        </motion.div >

    {/* School Entrance Preparation */ }
    < motion.div
initial = {{ opacity: 0, y: 25 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true }}
transition = {{ duration: 0.5 }}
className = "mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6 text-center sm:p-8"
    >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            School Entrance Preparation
          </span>

          <h3 className="mt-3 text-xl font-black text-white sm:text-3xl">
            Navodaya Vidyalaya & Sainik School
          </h3>

          <p className="mt-3 text-gray-300">
            Special preparation batches for Class 6 entrance examinations.
          </p>
        </motion.div >

    {/* Facilities */ }
    < div className = "mt-16" >
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-black text-white sm:text-4xl">
              Learn, Prepare &{" "}
              <span className="text-cyan-300">Succeed</span>
            </h3>

            <p className="mt-3 text-gray-400">
              Learning support and facilities at Nishchay Academy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;

              return (
                <motion.div
                  key={facility.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-300">
                    <Icon />
                  </div>

                  <div>
                    <h4 className="font-bold text-white">
                      {facility.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {facility.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div >

    {/* Teachers */ }
    < motion.div
initial = {{ opacity: 0, y: 25 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true }}
transition = {{ duration: 0.5 }}
className = "mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300">
              <FaChalkboardTeacher />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-cyan-300">
              Director
            </p>

            <h4 className="mt-2 text-xl font-black text-white">
              Gudiya Bhooshan
            </h4>

            <p className="mt-2 text-sm text-gray-400">
              M.Sc., NET
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300">
              <FaGraduationCap />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-cyan-300">
              Under the Guidance of
            </p>

            <h4 className="mt-2 text-xl font-black text-white">
              R. Arvind Sir
            </h4>

            <p className="mt-2 text-sm text-gray-400">
              IAS Aspirant
            </p>
          </div>
        </motion.div >

    {/* Address & Contact */ }
    < motion.div
initial = {{ opacity: 0, y: 25 }}
whileInView = {{ opacity: 1, y: 0 }}
viewport = {{ once: true }}
transition = {{ duration: 0.5 }}
className = "mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#0B1729] to-[#101C32] p-6 sm:p-9"
    >
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                Visit Our Academy
            </span>

            <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Take the First Step Towards Your Goal
            </h3>

            <div className="mt-5 flex items-start gap-3 text-gray-300">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-cyan-300" />

                <p className="text-sm leading-7">
                    Krishna Nagar, Jhunsi, Prayagraj, Uttar Pradesh
                </p>
            </div>

            <div className="mt-3 flex items-center gap-3 text-gray-300">
                <FaPhoneAlt className="text-cyan-300" />

                <p className="text-sm">8429111580</p>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <a
                href={`tel:+${phoneNumber}`}
                className="flex items-center justify-center gap-3 rounded-xl bg-cyan-400 px-5 py-4 font-bold text-[#020617] transition hover:bg-cyan-300"
            >
                <FaPhoneAlt /> Call Academy
            </a>

            <a
                href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 font-bold text-emerald-300 transition hover:bg-emerald-400/20"
            >
                <FaWhatsapp /> Enquire on WhatsApp
            </a>

            <a
                href="https://youtube.com/@rnishchayacademy?si=pqk9Q2DxAgYdvupI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 font-semibold text-gray-200 transition hover:border-cyan-400/30"
            >
                <FaYoutube className="text-red-400" />
                Nishchay Academy on YouTube
            </a>
        </div>
    </div>
        </motion.div >

      </div >
    </section >
  );
}

export default NishchayAcademy;

