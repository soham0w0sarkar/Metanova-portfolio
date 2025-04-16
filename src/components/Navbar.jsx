import React from "react";
import { Home, Briefcase, MessageCircle, User, Mail } from "lucide-react";

const Navbar = ({ setActiveSection, activeSection }) => {
  const navigateTo = (section) => {
    setActiveSection(section);
  };

  const navItems = [
    { icon: <Home size={24} strokeWidth={1} />, label: "Home", id: "home" },
    {
      icon: <Briefcase size={24} strokeWidth={1} />,
      label: "Projects",
      id: "projects",
    },
    {
      icon: <MessageCircle size={24} strokeWidth={1} />,
      label: "Testimonials",
      id: "testimonials",
    },
    { icon: <User size={24} strokeWidth={1} />, label: "About", id: "about" },
    {
      icon: <Mail size={24} strokeWidth={1} />,
      label: "Contact",
      id: "contact",
    },
  ];

  return (
    <nav className="fixed right-10 top-1/2 transform -translate-y-1/2 z-20">
      <div className="flex flex-col gap-10 p-3 rounded-full bg-transparent shadow-lg">
        {navItems.map(({ icon, label, id }) => (
          <button
            key={id}
            onClick={() => navigateTo(id)}
            aria-label={label}
            className={`text-gray-400 hover:text-white transition-all duration-300
              ${
                activeSection === id
                  ? "text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  : ""
              }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
