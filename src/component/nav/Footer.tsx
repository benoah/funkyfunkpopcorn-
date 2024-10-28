import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-32 px-4">
      <div className="max-w-12xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Us Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">About Us</h3>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            luctus urna sed urna ultricies ac tempor dui sagittis.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Contact</h3>
          <p className="text-sm">Email: info@example.com</p>
          <p className="text-sm">Phone: +123 456 7890</p>
          <p className="text-sm">Address: 123 Main St, Anytown, USA</p>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-400 hover:text-[#e50914] transition-colors"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-400 hover:text-[#e50914] transition-colors"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-400 hover:text-[#e50914] transition-colors"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-[#e50914] transition-colors"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="mt-8 text-center border-t border-gray-700 pt-4 text-sm">
        <p className="text-gray-500">
          © 2024 Popcorn Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
