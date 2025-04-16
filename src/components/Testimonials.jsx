import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Alice", quote: "Truly impressed with the quality!" },
  { name: "Bob", quote: "Creative and professional – highly recommend." },
  { name: "Charlie", quote: "Always delivers more than expected." },
  { name: "Dana", quote: "Working together was seamless." },
  { name: "Eli", quote: "Brings ideas to life!" },
  { name: "Faye", quote: "Super reliable and fast." },
  { name: "Gabe", quote: "Can't wait to collaborate again!" },
  { name: "Hana", quote: "Loved every detail in the final product." },
  { name: "Ian", quote: "Top-tier results every time." },
  { name: "Juno", quote: "Absolute game changer." },
];

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
