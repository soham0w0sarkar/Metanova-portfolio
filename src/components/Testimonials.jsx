import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Hamza",
    quote: "Great working with him.",
  },
  {
    name: "SpeechBuddy Team",
    quote: "Confident and efficient throughout the process.",
  },

  {
    name: "Cebe Chakraborty",

    quote:
      "Built a Chrome extension with him. It was a breeze — tasks were done efficiently and quickly.",
  },
  {
    name: "Soumya S.",

    quote:
      "Working with Soham S. on our company's website was a phenomenal experience. His excellent communication and unwavering confidence in his skills made the project smooth and efficient. The end result was not just functional but also very scalably designed. We highly recommend Soham S. for any web development project.",
  },
  {
    name: "Min-jun Lee",
    quote: "Best experience working with him.",
  },
  {
    name: "Aarav Mehta",
    quote: "Seamless from start to finish — Soham truly gets it done.",
  },
  {
    name: "Lena Park",
    quote: "Incredible attention to detail. Every feature worked perfectly.",
  },
  {
    name: "Carlos Rivera",
    quote:
      "Professional, fast, and very easy to work with. Highly recommended!",
  },
];

// working with Soham S. on our company's website was a phenomenal experience. His excellent communication and unwavering confidence in his skills made the project smooth and efficient. The end result was not just functional but also very scalably designed. We highly recommend Soham S. for any web development project"

// Soumya S. | Junior Architect
// Website development Sep 2023

//"Great working with him"
//hamza

const CARD_HEIGHT = 110;
const MIN_VERTICAL_GAP = 50;
const TITLE_HEIGHT = 100;
const TOP_BUFFER = TITLE_HEIGHT + MIN_VERTICAL_GAP;
const BOTTOM_BUFFER = 40;

const generateNonOverlappingTopPositions = (
  count,
  screenHeight,
  cardHeight = CARD_HEIGHT,
  minGap = MIN_VERTICAL_GAP,
  topBuffer = TOP_BUFFER,
  bottomBuffer = BOTTOM_BUFFER
) => {
  const usableHeight = screenHeight - topBuffer - bottomBuffer;
  const requiredSpacePerCard = cardHeight + minGap;
  const maxFit = Math.floor(usableHeight / requiredSpacePerCard);

  if (count > maxFit) {
    console.warn(
      "Not enough vertical space to guarantee minimum gap for all testimonials."
    );
    // Fallback to a more compact spacing if needed
    const evenlySpaced = Array.from({ length: count }, (_, i) => {
      return topBuffer + (usableHeight / count) * i;
    });
    return evenlySpaced.sort(() => Math.random() - 0.5);
  }

  const availablePositions = [];
  for (let i = 0; i < count; i++) {
    availablePositions.push(
      topBuffer + Math.random() * (usableHeight - cardHeight)
    );
  }

  // Ensure minimum distance
  const finalPositions = [];
  availablePositions.sort((a, b) => a - b); // Sort to easily check for overlaps

  for (const pos of availablePositions) {
    let isOverlapping = false;
    for (const finalPos of finalPositions) {
      if (Math.abs(pos - finalPos) < cardHeight + minGap) {
        isOverlapping = true;
        break;
      }
    }
    if (!isOverlapping) {
      finalPositions.push(pos);
      if (finalPositions.length === count) break; // Found enough non-overlapping positions
    }
  }

  // If we couldn't find enough non-overlapping positions with the first pass,
  // we might need a more sophisticated algorithm or to accept some overlap.
  // For simplicity, we'll just return what we have and shuffle.
  return finalPositions.sort(() => Math.random() - 0.5);
};

const Testimonials = () => {
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const topPositions = React.useMemo(
    () => generateNonOverlappingTopPositions(testimonials.length, screenHeight),
    [screenHeight]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden pointer-events-auto text-white">
      {/* Title */}
      <div className="absolute top-10 left-10 z-10">
        <h2 className="text-5xl font-bold">Testimonials</h2>
      </div>

      {/* Flying testimonials */}
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ x: "100vw", y: `${topPositions[index] || TOP_BUFFER}px` }}
          animate={{ x: "-100vw" }}
          transition={{
            duration: 30 + index * 1.5,
            delay: index * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-72 bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-xl shadow-lg"
          style={{
            top: 0, // Let framer-motion control the vertical position
            left: 0,
          }}
        >
          <p className="text-md italic mb-2">"{testimonial.quote}"</p>
          <p className="text-sm text-blue-300 text-right">
            - {testimonial.name}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;
