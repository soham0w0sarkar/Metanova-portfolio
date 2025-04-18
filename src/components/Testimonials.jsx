import React, { useState, useEffect, useMemo } from "react";
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
    name: "Cebe Chakraborthy",
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

const Testimonials = () => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate responsive values
  const responsiveValues = useMemo(() => {
    const cardHeight = Math.max(dimensions.height * 0.12, 80); // Min height of 80px
    const titleHeight = Math.max(dimensions.height * 0.08, 60); // Min height of 60px
    const verticalGap = Math.max(dimensions.height * 0.05, 30); // Min gap of 30px
    const topBuffer = titleHeight + verticalGap;
    const bottomBuffer = dimensions.height * 0.04;

    return { cardHeight, titleHeight, verticalGap, topBuffer, bottomBuffer };
  }, [dimensions.height]);

  // Helper function to redistribute positions when overlaps can't be resolved
  const redistributePositions = (
    count,
    screenHeight,
    cardHeight,
    minGap,
    topBuffer,
    bottomBuffer
  ) => {
    const usableHeight = screenHeight - topBuffer - bottomBuffer;
    const segment = usableHeight / count;

    return Array.from({ length: count }, (_, i) => {
      // Add some randomness within each segment
      const randomOffset = Math.random() * (segment - cardHeight);
      return topBuffer + segment * i + randomOffset;
    });
  };

  // Generate non-overlapping vertical positions
  const topPositions = useMemo(() => {
    const { cardHeight, topBuffer, bottomBuffer, verticalGap } =
      responsiveValues;
    const usableHeight = dimensions.height - topBuffer - bottomBuffer;

    // Generate initial random positions
    let positions = testimonials.map(() => {
      return topBuffer + Math.random() * (usableHeight - cardHeight);
    });

    // Sort positions for easier overlap detection
    positions.sort((a, b) => a - b);

    // Check for overlaps and adjust
    for (let i = 1; i < positions.length; i++) {
      if (positions[i] - positions[i - 1] < cardHeight + verticalGap) {
        // Try to move current position down
        const newPos = positions[i - 1] + cardHeight + verticalGap;

        // If we can't move down without exceeding usable area, redistribute
        if (newPos + cardHeight > dimensions.height - bottomBuffer) {
          positions = redistributePositions(
            testimonials.length,
            dimensions.height,
            cardHeight,
            verticalGap,
            topBuffer,
            bottomBuffer
          );
          break;
        }

        positions[i] = newPos;
      }
    }

    // Shuffle the final positions
    return positions.sort(() => Math.random() - 0.5);
  }, [dimensions, responsiveValues]);

  // Calculate animation speed based on screen width
  const getAnimationDuration = (index) => {
    const baseSpeed = dimensions.width * 0.03; // Wider screens = longer animation
    return baseSpeed + index * 1.5;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden pointer-events-auto text-white">
      {/* Title - scales with viewport */}
      <div className="absolute top-0 left-0 p-4 sm:p-6 md:p-8 lg:p-10 z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          Testimonials
        </h2>
      </div>

      {/* Flying testimonials */}
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{
            x: dimensions.width,
            y: topPositions[index] || responsiveValues.topBuffer,
          }}
          animate={{ x: -dimensions.width * 1.2 }}
          transition={{
            duration: getAnimationDuration(index),
            delay: index * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-56 sm:w-64 md:w-72 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 md:p-4 rounded-xl shadow-lg"
          style={{
            top: 0,
            left: 0,
            maxWidth: dimensions.width * 0.8, // Limit width on very small screens
          }}
        >
          <p className="text-sm md:text-md italic mb-2">
            "{testimonial.quote}"
          </p>
          <p className="text-xs md:text-sm text-blue-300 text-right">
            - {testimonial.name}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;
