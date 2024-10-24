import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import throttle from "lodash.throttle"; // Import throttle

function Nav() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setShow(window.scrollY > 100);
    }, 200);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="sticky top-0 transition-all ease-in duration-500 bg-black z-50 shadow-md">
      <div className=" mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <img
            className="h-8 w-auto sm:h-10"
            src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png"
            alt="Popcorn Logo"
            loading="lazy"
          />
          <h4 className="text-[#e50914] text-lg font-bold sm:block">Popcorn</h4>
        </div>

        <ul className="hidden md:flex space-x-4 text-white">
          <li>
            <Link to="/" className="text-[#e5e5e5] hover:text-[#e50914]">
              Startsiden
            </Link>
          </li>
          <li>
            <Link to="/series" className="text-[#e5e5e5] hover:text-[#e50914]">
              Serier
            </Link>
          </li>
          <li>
            <Link to="/movies" className="text-[#e5e5e5] hover:text-[#e50914]">
              Film
            </Link>
          </li>
          <li>
            <Link
              to="/new-popular"
              className="text-[#e5e5e5] hover:text-[#e50914]"
            >
              Nytt og Populært
            </Link>
          </li>
          <li>
            <Link to="/my-list" className="text-[#e5e5e5] hover:text-[#e50914]">
              Min liste
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <img
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png"
            alt="User Avatar"
            loading="lazy"
          />
          <button
            className="text-white focus:outline-none"
            aria-label="Open menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
