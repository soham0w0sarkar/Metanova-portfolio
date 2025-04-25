import React, { useState, useRef, useEffect } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [currentField, setCurrentField] = useState("name");
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const messageInputRef = useRef(null);

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

  // Set autofocus on initial render
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Handle field changes when current field updates
  useEffect(() => {
    if (currentField === "name" && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (currentField === "email" && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (currentField === "message" && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [currentField]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "name") {
        setCurrentField("email");
      } else if (field === "email") {
        setCurrentField("message");
      } else if (field === "message") {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
    setCurrentField("name");
  };

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  return (
    <div className="w-full h-full px-4 sm:px-8 md:px-12 lg:px-24 py-8 md:py-16 text-white pointer-events-auto">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 lg:mb-16 tracking-wider text-center relative">
        <span className="relative">CONTACT US</span>
      </h2>

      <div className="w-full relative">
        {/* Grid container for responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Contact Form */}
            <div className="bg-black/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-300">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "name")}
                    className="w-full bg-transparent border-b border-white/30 px-2 py-2 text-white focus:outline-none focus:border-blue-300"
                    disabled={currentField !== "name" && formData.name !== ""}
                    placeholder={
                      currentField === "name"
                        ? "Type your name and press Enter"
                        : ""
                    }
                  />
                </div>

                <div
                  className={`space-y-2 transition-opacity duration-300 ${
                    currentField === "name" ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <input
                    ref={emailInputRef}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "email")}
                    className="w-full bg-transparent border-b border-white/30 px-2 py-2 text-white focus:outline-none focus:border-blue-300"
                    disabled={currentField !== "email"}
                    placeholder={
                      currentField === "email"
                        ? "Type your email and press Enter"
                        : ""
                    }
                  />
                </div>

                <div
                  className={`space-y-2 transition-opacity duration-300 ${
                    currentField === "name" || currentField === "email"
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <textarea
                    ref={messageInputRef}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "message")}
                    rows="4"
                    className="w-full bg-transparent border border-white/30 rounded px-2 py-2 text-white focus:outline-none focus:border-blue-300"
                    disabled={currentField !== "message"}
                    placeholder={
                      currentField === "message"
                        ? "Type your message and press Enter to send"
                        : ""
                    }
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Location Info */}
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-purple-300">
                Our Location
              </h3>
              <div className="space-y-4">
                <div className="transition-all duration-300 hover:-translate-x-2">
                  <h4 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-blue-300">
                    Address
                  </h4>
                  <p className="text-gray-300">Greater Noida, IN</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-black/30 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-300">
                Get in Touch
              </h3>
              <div className="space-y-6">
                <div className="transition-all duration-300 hover:-translate-x-2">
                  <h4 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-blue-300">
                    Email
                  </h4>
                  <p className="text-gray-300">techmetanova09@gmail.com</p>
                </div>

                <div className="transition-all duration-300 hover:-translate-x-2">
                  <h4 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-blue-300">
                    Phone
                  </h4>
                  <p className="text-gray-300">+91 9109383849</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-purple-300">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-5 w-5 md:h-6 md:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-5 w-5 md:h-6 md:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-5 w-5 md:h-6 md:w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
