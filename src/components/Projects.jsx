import React, { useState, useRef, useEffect } from "react";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(1);
  const [hoverProject, setHoverProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const carouselRef = useRef(null);

  const projects = [
    {
      id: 1,
      name: "ZenFlow",
      tech: "React, Node.js",
      description: "Workflow and mindfulness app",
      urls: [
        "/assets/first.png",
        "/assets/second.png",
        "/assets/terminal.png",
        "/assets/fourth.png",
      ],
    },
    {
      id: 2,
      name: "MultiSearch",
      tech: "JavaScript, REST APIs",
      description: "Aggregates multiple search engines",
      urls: [],
    },
    {
      id: 3,
      name: "Focus",
      tech: "React, Redux",
      description: "Distraction-free work environment",
      urls: [],
    },
    {
      id: 4,
      name: "SpeechBuddy",
      tech: "Python, TensorFlow",
      description: "Speech recognition assistant",
      urls: [],
    },
    {
      id: 5,
      name: "Selenium Web Crawler",
      tech: "Python, Selenium",
      description: "Data extraction tool",
      urls: [],
    },
    {
      id: 6,
      name: "Popup Dictionary",
      tech: "JavaScript, Chrome Extension API",
      description: "Instant word definitions",
      urls: [],
    },
    {
      id: 7,
      name: "IMS",
      tech: "Java, Spring Boot, MySQL",
      description: "Inventory management system",
      urls: [],
    },
    {
      id: 8,
      name: "Metanova PM Toolkit",
      tech: "React, Firebase",
      description: "Team collaboration toolkit",
      urls: [],
    },
  ];

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get the current active project's URL safely
  const getActiveProject = () => {
    return projects.find((p) => p.id === activeProject) || null;
  };

  const handleProjectClick = (id) => {
    setActiveProject(id === activeProject ? null : id);
    setActiveImageIndex(0);
  };

  const scrollToImage = (index) => {
    const container = carouselRef.current;
    if (container) {
      const width = container.offsetWidth;
      container.scrollTo({ left: index * width, behavior: "smooth" });
    }
  };

  const handleArrowClick = (direction) => {
    const project = getActiveProject();
    if (!project || !project.urls.length) return;

    const newIndex =
      direction === "left"
        ? (activeImageIndex - 1 + project.urls.length) % project.urls.length
        : (activeImageIndex + 1) % project.urls.length;

    setActiveImageIndex(newIndex);
    scrollToImage(newIndex);
  };

  const handleDotClick = (index) => {
    setActiveImageIndex(index);
    scrollToImage(index);
  };

  // Calculate responsive dimensions
  const getCarouselSize = () => {
    const maxWidth = dimensions.width > 1200 ? 640 : dimensions.width * 0.5;
    const maxHeight = dimensions.height > 800 ? 360 : dimensions.height * 0.45;

    // For mobile screens
    if (dimensions.width < 768) {
      return {
        width: dimensions.width * 0.8,
        height: dimensions.height * 0.3,
      };
    }

    return {
      width: maxWidth,
      height: maxHeight,
    };
  };

  const { width: carouselWidth, height: carouselHeight } = getCarouselSize();

  return (
    <div className="pointer-events-auto w-full h-full relative">
      {/* Title - responsive positioning */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white absolute top-8 md:top-12 lg:top-20 left-4 md:left-8 lg:left-12">
        Our Projects
      </h2>

      {/* Projects menu with responsive layout */}
      <div
        className={`bg-transparent absolute rounded-lg 
        ${
          dimensions.width < 768
            ? "bottom-8 left-1/2 transform -translate-x-1/2"
            : "left-4 md:left-8 lg:left-12 top-1/2 transform -translate-y-1/2"
        }`}
      >
        <ul
          className={`flex ${
            dimensions.width < 768
              ? "flex-row flex-wrap justify-center gap-3"
              : "flex-col space-y-4 md:space-y-6 lg:space-y-8"
          }`}
        >
          {projects.map((project) => (
            <li
              key={project.id}
              className={`cursor-pointer transition-all duration-300 
                ${dimensions.width < 768 ? "mx-2" : ""} 
                ${
                  activeProject === project.id || hoverProject === project.id
                    ? "text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                    : "text-gray-400"
                }`}
              onClick={() => handleProjectClick(project.id)}
              onMouseEnter={() => setHoverProject(project.id)}
              onMouseLeave={() => setHoverProject(null)}
            >
              <div className="flex flex-col">
                <h3
                  className={`text-base md:text-lg lg:text-xl font-light tracking-wider 
                  ${dimensions.width < 768 ? "text-center" : ""}`}
                >
                  {project.name}
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {getActiveProject() && (
        <div
          className={`absolute ${
            dimensions.width < 768
              ? "left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2"
              : "left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          } 
          flex gap-2 md:gap-4 lg:gap-6 items-center bg-transparent max-w-full justify-center`}
        >
          {/* Left Arrow */}
          <button
            onClick={() => handleArrowClick("left")}
            className="text-white/70 hover:text-blue-400 transition-colors duration-300 focus:outline-none"
            aria-label="Previous image"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          {/* Image Carousel */}
          <div
            ref={carouselRef}
            className="relative flex overflow-hidden scroll-smooth rounded-lg"
            style={{
              width: `${carouselWidth}px`,
              height: `${carouselHeight}px`,
            }}
          >
            {getActiveProject().urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Project image ${i + 1}`}
                className="w-full h-full object-cover flex-shrink-0 transition-opacity duration-300"
                style={{ display: i === activeImageIndex ? "block" : "none" }}
              />
            ))}

            {getActiveProject().urls.length === 0 && (
              <div className="w-full h-full flex items-center justify-center bg-gray-800/50 text-white">
                <p className="text-center p-4">No images available</p>
              </div>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleArrowClick("right")}
            className="text-white/70 hover:text-blue-400 transition-colors duration-300 focus:outline-none"
            aria-label="Next image"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      )}

      {/* Dots Navigation */}
      {getActiveProject() && getActiveProject().urls.length > 0 && (
        <div className="absolute bottom-4 md:bottom-6 lg:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
          {getActiveProject().urls.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                i === activeImageIndex
                  ? "bg-blue-500 w-3 md:w-4"
                  : "bg-gray-400 hover:bg-gray-300"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
