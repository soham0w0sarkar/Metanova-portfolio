import { useState, useEffect, lazy, Suspense, useCallback, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls, useTexture } from "@react-three/drei";
import { Earth } from "./Earth";
import { Model } from "./Scene";
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
    dpr={[1, 2]}
    performance={{ min: 0.5 }}
  >
    <ambientLight intensity={10} />
    <directionalLight position={[-5, 3, -5]} intensity={10} />
    <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
    <Model position={[0, 0, 0]} scale={1} />
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

// Loading overlay component
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

// A completely transparent fallback for Suspense - essentially no loading indicator
const InvisibleFallback = () => null;

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  // Combined loading and preloading effect
  useEffect(() => {
    if (isLoaded) return;

    const preloadAssets = async () => {
      const startTime = Date.now();
      // Allow at least 3 seconds for the loading animation
      const minLoadingTime = 3000;

      try {
        // Start tracking actual loading progress
        let actualProgress = 0;
        setLoadingProgress(actualProgress);

        // Step 1: Preload components (30% of progress)
        const componentImports = [
          import("./Home"),
          import("./Projects"),
          import("./Testimonials"),
          import("./About"),
          import("./Contact"),
        ];

        for (let i = 0; i < componentImports.length; i++) {
          await componentImports[i];
          actualProgress = 5 + (i + 1) * 5; // 5-30% progress
          setLoadingProgress(actualProgress);
        }

        // Step 2: Preload images (30-70% of progress)
        const imagesToPreload = [
          import.meta.env.BASE_URL + "assets/logo.png",
          import.meta.env.BASE_URL + "assets/mugshot.png",
          // Add other important images here
        ];

        for (let i = 0; i < imagesToPreload.length; i++) {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imagesToPreload[i];
            img.onload = resolve;
            img.onerror = reject;
          });
          actualProgress = 30 + (i + 1) * (40 / imagesToPreload.length); // 30-70% progress
          setLoadingProgress(actualProgress);
        }

        // Step 3: Final preparations (70-100%)
        for (let i = 0; i < 6; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          actualProgress = 70 + (i + 1) * 5; // 70-100% progress
          setLoadingProgress(actualProgress);
        }

        // Ensure we show the loading screen for at least minLoadingTime
        const elapsed = Date.now() - startTime;
        if (elapsed < minLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadingTime - elapsed)
          );
        }

        // Finally complete the loading
        setLoadingProgress(100);
        setTimeout(() => setIsLoaded(true), 800);
      } catch (error) {
        console.error("Error during preloading:", error);
        // Even on error, complete the loading process
        setLoadingProgress(100);
        setTimeout(() => setIsLoaded(true), 800);
      }
    };

    preloadAssets();
  }, [isLoaded]);

  const renderSection = useCallback(() => {
    return (
      <Suspense fallback={<InvisibleFallback />}>
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
