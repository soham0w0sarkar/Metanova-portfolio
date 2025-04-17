import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Earth } from "./Earth";
import Navbar from "./Navbar";
import Home from "./Home";
import Projects from "./Projects";
import Testimonials from "./Testimonials";
import About from "./About";
import Contact from "./Contact";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "react-lottie";
import animationData from "../lotties/astronaut-with-space-shuttle.json";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false); // State to track loading
  const [loadingProgress, setLoadingProgress] = useState(0);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "projects":
        return <Projects />;
      case "testimonials":
        return <Testimonials />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  // Animation variants for section transitions
  const variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    // Simulate asset loading with incremental progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 500);

    // When progress reaches 100%, set a small delay before showing the main content
    if (loadingProgress === 100) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        clearInterval(interval);
      }, 800);
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [loadingProgress]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-64 h-64">
            <Lottie options={defaultOptions} />
          </div>
          <div className="mt-8 w-64">
            <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-blue-400 text-center mt-2 font-mono">
              Loading... {Math.round(loadingProgress)}%
            </p>
            <div className="mt-4 text-gray-400 text-center text-sm font-mono">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: loadingProgress > 50 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                Preparing to launch...
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        className="absolute inset-0 z-0"
      >
        <ambientLight intensity={2} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <Earth position={[0, 0, 0]} scale={1.5} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Navbar */}
      <Navbar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      {/* Animated Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
