import { useState } from "react";
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

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");

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

  // Animation variants
  const variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
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
