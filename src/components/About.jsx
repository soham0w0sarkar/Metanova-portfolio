import React, { useEffect, useRef } from "react";

const aboutTexts = [
  "Hey there — we're Yash and Soham, two tech brothers with a shared passion for building and engineering the future.",
  "Together, we started Metanova, a software service studio driven by creativity, curiosity, and code. It's our little corner of the tech universe where ideas become real, fast.",
  "We work on everything web and mobile — from full-stack websites and modern mobile apps, to Chrome extensions, scrapers, dashboards, APIs, UI/UX, and just about anything you can imagine in code.",
  "More than just delivering features, we care about the craft. We thrive on meaningful collaborations, solving real-world problems, and building with people who dream big.",
  "This is our journey — building Metanova, one solution at a time.",
];

const About = () => {
  const textRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.1 }
    );

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      textRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="w-full h-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 text-white pointer-events-auto">
      <div className="flex items-center justify-between mb-8 sm:mb-12 md:mb-16 relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-left pl-3 sm:pl-6 relative">
          <span className="relative">ABOUT US</span>
        </h2>
        <div className="rounded-full overflow-hidden h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 flex-shrink-0 fixed top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8">
          <img
            src={import.meta.env.BASE_URL + "assets/mugshot.png"}
            alt="Yash and Soham"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {aboutTexts.map((text, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div
              ref={(el) => (textRefs.current[index] = el)}
              className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl text-base sm:text-lg text-gray-300 leading-relaxed px-4 sm:px-6
                opacity-0 translate-y-4 transition-all duration-500 delay-${
                  (index % 5) * 100
                }
                ${index % 2 === 0 ? "border-l-2" : "border-r-2"}
                border-blue-500 border-opacity-40`}
            >
              <span
                className={
                  index % 2 === 0 ? "text-blue-300" : "text-purple-300"
                }
              >
                {text.split(" ")[0]}
              </span>{" "}
              {text.split(" ").slice(1).join(" ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
