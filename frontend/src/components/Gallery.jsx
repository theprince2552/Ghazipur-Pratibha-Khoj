import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Images
import event1 from "../assets/gallery/event1.jpeg";
import event2 from "../assets/gallery/event2.jpeg";
import event3 from "../assets/gallery/event3.jpeg";
import event4 from "../assets/gallery/event4.jpeg";
import event5 from "../assets/gallery/event5.jpeg";
import event6 from "../assets/gallery/event6.jpeg";
import event7 from "../assets/gallery/event7.jpeg";
import event8 from "../assets/gallery/event8.jpeg";
import event9 from "../assets/gallery/event9.jpeg";
import event10 from "../assets/gallery/event10.jpeg";
import event11 from "../assets/gallery/event11.jpeg";
import event12 from "../assets/gallery/event12.jpeg";
import event13 from "../assets/gallery/event13.jpeg";
import event14 from "../assets/gallery/event14.jpeg";
import event15 from "../assets/gallery/event15.jpeg";
import event16 from "../assets/gallery/event16.jpeg";
import event17 from "../assets/gallery/event17.jpeg";
import event18 from "../assets/gallery/event18.jpeg";
import event19 from "../assets/gallery/event19.jpeg";
import event20 from "../assets/gallery/event20.jpeg";
import event21 from "../assets/gallery/event21.jpeg";
import event22 from "../assets/gallery/event22.jpeg";
import event23 from "../assets/gallery/event23.jpeg";
import event24 from "../assets/gallery/event24.jpeg";
import event25 from "../assets/gallery/event25.jpeg";

const images = [
  event1,
  event2,
  event3,
  event4,
  event5,
  event6,
  event7,
  event8,
  event9,
  event10,
  event11,
  event12,
  event13,
  event14,
  event15,
  event16,
  event17,
  event18,
  event19,
  event20,
  event21,
  event22,
  event23,
  event24,
  event25,
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <section
      id="gallery"
      className="py-24 bg-gradient-to-b from-[#050B18] via-[#08111F] to-[#0B1324]"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <span className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm uppercase tracking-[0.2em]">

            Gallery

          </span>

          <h2 className="mt-6 text-5xl font-black text-white">

            Previous

            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">

              Events

            </span>

          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-gray-400 leading-8">

            Explore memorable moments from Ghazipur Pratibha Khoj,
            scholarship ceremonies and prize distribution events.

          </p>

        </motion.div>

        {/* Gallery */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

          {images.map((img, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedImage(index)}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer"
            >

              <img

                src={img}

                alt={`Event ${index + 1}`}

                className="w-full h-64 object-cover group-hover:scale-110 duration-500"

              />

            </motion.div>



          ))}

        </div>

      </div>
      <AnimatePresence>
  {selectedImage !== null ? (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
    >

      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-8 right-8 text-white text-4xl"
      >
        <FaTimes />
      </button>

      <button
        onClick={() =>
          setSelectedImage(
            selectedImage === 0
              ? images.length - 1
              : selectedImage - 1
          )
        }
        className="absolute left-8 text-white text-4xl"
      >
        <FaChevronLeft />
      </button>

      <img
        src={images[selectedImage]}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-2xl"
      />

      <button
        onClick={() =>
          setSelectedImage(
            selectedImage === images.length - 1
              ? 0
              : selectedImage + 1
          )
        }
        className="absolute right-8 text-white text-4xl"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-8 text-white text-lg font-semibold">
        {selectedImage + 1} / {images.length}
      </div>

    </motion.div>

  ) : null}
</AnimatePresence>
    </section>
  );
}

export default Gallery;