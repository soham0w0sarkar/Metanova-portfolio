import React, { useState, useRef } from "react";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(1);
  const [hoverProject, setHoverProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
    if (!project) return;

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

  return (
    <div className="pointer-events-auto w-full max-w-4xl">
      {/* Title in top corner */}
      <h2 className="text-5xl font-bold text-white absolute top-20 left-12">
        Our Projects
      </h2>

      {/* Projects menu with transparent background */}
      <div className="bg-transparent absolute rounded-lg left-12 top-1/2 transform -translate-y-1/2">
        <ul className="flex flex-col space-y-8">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`cursor-pointer transition-all duration-300 ${
                activeProject === project.id || hoverProject === project.id
                  ? "text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  : "text-gray-400"
              }`}
              onClick={() => handleProjectClick(project.id)}
              onMouseEnter={() => setHoverProject(project.id)}
              onMouseLeave={() => setHoverProject(null)}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-light tracking-wider">
                  {project.name}
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {getActiveProject() && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-6 items-center bg-transparent w-[950px] max-w-full justify-center">
          {/* Enhanced Left Arrow */}
          <button
            onClick={() => handleArrowClick("left")}
            className="text-white/70 hover:text-blue-400 transition-colors duration-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
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

          {/* Enhanced Image Carousel */}
          <div
            ref={carouselRef}
            className="relative w-[640px] h-[360px] flex overflow-hidden scroll-smooth rounded-lg"
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
          </div>

          {/* Enhanced Right Arrow */}
          <button
            onClick={() => handleArrowClick("right")}
            className="text-white/70 hover:text-blue-400 transition-colors duration-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
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

          {/* Project Info */}
        </div>
      )}

      {/* Enhanced Dots */}
      {getActiveProject() && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {getActiveProject().urls.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeImageIndex
                  ? "bg-blue-500 w-4"
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
