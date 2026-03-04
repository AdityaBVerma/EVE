import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black bitcount-prop-double-dots text-white py-10">

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">

        {/* Social Links */}
        <div className="flex items-center gap-6">

          <a
            href="https://github.com/AdityaBVerma"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 hover:scale-110 transition"
          >
            <Github size={22} />
          </a>

          <a
            href="https://www.linkedin.com/in/aditya-b-verma/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 hover:scale-110 transition"
          >
            <Linkedin size={22} />
          </a>

          {/* LeetCode */}
          <a
            href="https://leetcode.com/u/AdityaBVerma/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 hover:scale-110 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[22px] h-[22px]"
            >
              <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z" />
            </svg>
          </a>

        </div>

        {/* Attribution */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>3D globe visualization powered by CesiumJS</p>
          <p>Air quality data sourced from OpenAQ</p>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © 2026 Aditya Verma • Built with curiosity and code
        </p>

      </div>

    </footer>
  );
}