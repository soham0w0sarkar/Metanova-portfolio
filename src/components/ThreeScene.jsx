import { useState, useEffect, lazy, Suspense, useCallback, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Earth } from "./Earth";
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "react-lottie";
import animationData from "../lotties/astronaut-with-space-shuttle.json";

// Lazy load components to improve initial load time
const Home = lazy(() => import("./Home"));
const Projects = lazy(() => import("./Projects"));
const Testimonials = lazy(() => import("./Testimonials"));
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));

// Memoized ThreeCanvas component to prevent unnecessary re-renders
const ThreeCanvas = memo(() => (
  <Canvas
    camera={{ position: [0, 0, 10], fov: 75 }}
    className="absolute inset-0 z-0"
    dpr={[1, 2]} // Optimize for different device pixel ratios
    performance={{ min: 0.5 }} // Lower resolution during interactions
  >
    <ambientLight intensity={2} />
    <directionalLight position={[5, 3, 5]} intensity={1} />
    <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
    <Earth position={[0, 0, 0]} scale={1.5} />
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.5}
      autoRotate
      autoRotateSpeed={0.5}
    />
  </Canvas>
));

ThreeCanvas.displayName = "ThreeCanvas";

// Loading overlay component that sits on top of the 3D canvas
const LoadingOverlay = ({ progress }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black bg-opacity-70"
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
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-blue-400 text-center mt-2 font-mono">
          Loading... {Math.round(progress)}%
        </p>
        <div className="mt-4 text-gray-400 text-center text-sm font-mono">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 50 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            Preparing to launch...
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

// Fallback component for Suspense
const SectionFallback = () => (
  <div className="text-white text-center pointer-events-auto">
    Loading section...
  </div>
);

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Animation variants for section transitions
  const variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  // Optimized loading simulation with better timing
  useEffect(() => {
    if (isLoaded) return;

    // Preload critical assets
    const preloadAssets = async () => {
      // You could add actual asset preloading here
      // For example, preloading images or other resources

      const startTime = Date.now();
      const duration = 3000; // 3 seconds total loading time

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / duration) * 100);

        setLoadingProgress(progress);

        if (progress < 100) {
          requestAnimationFrame(updateProgress);
        } else {
          // Add a small delay before removing the loading screen
          setTimeout(() => setIsLoaded(true), 800);
        }
      };

      requestAnimationFrame(updateProgress);
    };

    preloadAssets();
  }, [isLoaded]);

  // Memoized section renderer to prevent unnecessary re-renders
  const renderSection = useCallback(() => {
    return (
      <Suspense fallback={<SectionFallback />}>
        {activeSection === "home" && <Home />}
        {activeSection === "projects" && <Projects />}
        {activeSection === "testimonials" && <Testimonials />}
        {activeSection === "about" && <About />}
        {activeSection === "contact" && <Contact />}
      </Suspense>
    );
  }, [activeSection]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Always render the 3D canvas for background */}
      <ThreeCanvas />

      {/* Show loading overlay while loading */}
      <AnimatePresence>
        {!isLoaded && <LoadingOverlay progress={loadingProgress} />}
      </AnimatePresence>

      {/* Only show navbar and content when loaded */}
      {isLoaded && (
        <>
          <Navbar
            setActiveSection={setActiveSection}
            activeSection={activeSection}
          />

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
        </>
      )}
    </div>
  );
};

export default Portfolio;
