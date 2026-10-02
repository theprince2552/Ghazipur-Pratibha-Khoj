import { motion } from "framer-motion";

import bicycle from "../assets/images/bicycle.png";
import fan from "../assets/images/fan.png";
import lamp from "../assets/images/lamp.png";
import bag from "../assets/images/bag.png";
import clock from "../assets/images/clock.png";

const prizes = [
  {
    rank: "🥇 First Prize",
    title: "Mountain Bicycle",
    image: bicycle,
    color: "from-yellow-300 to-amber-500",
  },
  {
    rank: "🥈 Second Prize",
    title: "Ceiling Fan",
    image: fan,
    color: "from-slate-300 to-gray-400",
  },
  {
    rank: "🥉 Third Prize",
    title: "Study Lamp",
    image: lamp,
    color: "from-orange-300 to-orange-500",
  },
  {
    rank: "4th Prize",
    title: "School Bag",
    image: bag,
    color: "from-cyan-400 to-blue-500",
  },
  {
    rank: "5th Prize",
    title: "Wall Clock",
    image: clock,
    color: "from-purple-400 to-pink-500",
  },
];

function PrizeSection() {
  return (
    <section
      id="prizes"
      className="relative py-28 bg-gradient-to-b from-[#08111F] via-[#0B1324] to-[#050B18] overflow-hidden"
    >
      {/* Background Glow */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <span className="inline-flex px-6 py-3 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 uppercase tracking-[0.2em] font-bold">

            🏆 Winner Rewards

          </span>

          <h2 className="mt-7 text-5xl lg:text-6xl font-black text-white">

            Amazing

            <span className="block bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">

              Prize Collection

            </span>

          </h2>

          <p className="max-w-3xl mx-auto mt-7 text-lg leading-9 text-gray-300">

            Perform your best and stand a chance to win exciting prizes,
            scholarships and recognition for your outstanding achievement.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {prizes.map((prize, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * .12 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl p-8"
            >

              {/* Hover Gradient */}

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-cyan-500/10 via-transparent to-yellow-500/10"></div>

              <div className="relative">

                {/* Rank */}

                <div
                  className={`inline-flex px-5 py-2 rounded-full bg-gradient-to-r ${prize.color} text-black font-bold shadow-lg`}
                >
                  {prize.rank}
                </div>

                {/* Image */}

                <div className="mt-10 flex justify-center">

                  <img
                    src={prize.image}
                    alt={prize.title}
                    className="h-48 object-contain transition duration-500 group-hover:scale-110"
                  />

                </div>

                {/* Title */}

                <h3 className="mt-10 text-2xl text-center font-bold text-white">

                  {prize.title}

                </h3>

                <p className="mt-3 text-center text-gray-400">

                  Rewarding excellence with recognition and motivation.

                </p>

              </div>

            </motion.div>

          ))}

        </div>

        {/* Bottom Quote */}

        <motion.div
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          transition={{ duration:1 }}
          viewport={{ once:true }}
          className="mt-20 text-center"
        >

          <p className="text-2xl italic text-white">

            "Every achievement deserves recognition,
            and every talent deserves an opportunity."

          </p>

        </motion.div>

      </div>

    </section>
  );
}

export default PrizeSection;