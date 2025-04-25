import { useState, useEffect, lazy, Suspense, useCallback, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls, useTexture } from "@react-three/drei";
import { Earth } from "./Earth";
import { Model } from "./Scene";
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "react-lottie";
import animationData from "../lotties/astronaut-with-space-shuttle.json";
import MusicSelector from "./MusicSelector";

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
    dpr={[1, 1.5]}
    performance={{ min: 0.3 }}
  >
    <ambientLight intensity={10} />
    <directionalLight position={[-5, 3, -5]} intensity={10} />
    <Stars radius={100} depth={50} count={1500} factor={4} fade speed={1} />
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
      // Reduced minimum loading time from 3000ms to 1500ms
      const minLoadingTime = 1500;

      try {
        let actualProgress = 0;
        setLoadingProgress(actualProgress);

        // Optimized preloading strategy
        const componentImports = [
          import("./Home"),
          import("./Projects"),
          import("./Testimonials"),
          import("./About"),
          import("./Contact"),
        ];

        // Load components in parallel instead of sequentially
        await Promise.all(componentImports);
        actualProgress = 40; // Jump to 40% after components are loaded
        setLoadingProgress(actualProgress);

        // Optimize image preloading
        const imagesToPreload = [
          import.meta.env.BASE_URL + "assets/logo.png",
          import.meta.env.BASE_URL + "assets/mugshot.png",
        ];

        // Load images in parallel
        await Promise.all(
          imagesToPreload.map(
            (src) =>
              new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
              })
          )
        );
        actualProgress = 80; // Jump to 80% after images are loaded
        setLoadingProgress(actualProgress);

        // Quick final preparations
        for (let i = 0; i < 4; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          actualProgress = 80 + (i + 1) * 5;
          setLoadingProgress(actualProgress);
        }

        const elapsed = Date.now() - startTime;
        if (elapsed < minLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadingTime - elapsed)
          );
        }

        setLoadingProgress(100);
        setTimeout(() => setIsLoaded(true), 400); // Reduced from 800ms to 400ms
      } catch (error) {
        console.error("Error during preloading:", error);
        setLoadingProgress(100);
        setTimeout(() => setIsLoaded(true), 400);
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

          {/* Add MusicSelector */}
          <MusicSelector />
        </>
      )}
    </div>
  );
};

export default Portfolio;
