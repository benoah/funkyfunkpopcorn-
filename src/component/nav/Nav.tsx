import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import throttle from "lodash.throttle";

type NavProps = {
  className?: string;
};

const Nav: React.FC<NavProps> = ({ className }) => {
  const [show, setShow] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    }, 200);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidePanelRef.current &&
        event.target instanceof Node &&
        !sidePanelRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: show ? 0 : -80 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 shadow-lg backdrop-blur-lg bg-opacity-70 ${className}`}
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1 cursor-pointer">
          <motion.div whileHover={{ scale: 1.07 }}>
            <img
              className="h-8 w-auto sm:h-10"
              src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png"
              alt="Popcorn Logo"
              loading="lazy"
            />
            <h2 className="text-[#dcdccd] text-sm font-bold tracking-wide">
              Popcorn
            </h2>
          </motion.div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-8 text-[#dcdccd]">
          {[
            { name: "Startsiden", path: "/" },
            { name: "Serier", path: "/serier" },
            { name: "Film", path: "/film" },
            { name: "Nytt og Populært", path: "/nytt-og-populært" },
            { name: "Min liste", path: "/min-liste" },
          ].map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "font-semibold underline"
                    : "hover:text-[#ffb1b1]"
                } transition-colors duration-300 text-xs`}
              >
                {item.name}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 relative z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-[#dcdccd] transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1.5"
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-[#dcdccd] transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-[#dcdccd] transition-transform duration-300 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1.5"
            }`}
          ></span>
        </button>

        {/* Background Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-[#151717] opacity-60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidepanel for Mobile with Glass Effect */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={sidePanelRef}
              className="fixed inset-y-0 right-0 w-64 p-6 md:hidden z-50 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: "rgba(21, 23, 23, 0.7)",
                backdropFilter: "blur(15px)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#F7C600] focus:outline-none mb-4"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <ul className="space-y-6 text-[#e5e5e5]">
                {[
                  "Startsiden",
                  "Serier",
                  "Film",
                  "Nytt og Populært",
                  "Min liste",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setIsOpen(false)}
                      className="hover:text-[#16A6FC] transition-colors duration-300 text-sm"
                    >
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Nav;
