function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">

        {/* Logo / Title */}
        <a href="#home">
        <h1 className="text-xl sm:text-2xl bitcount-prop-double-dots tracking-widest">
          EVE
        </h1>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm">

          <a
            href="#home"
            className="hover:text-gray-300 bitcount-prop-double-dots transition"
          >
            Home
          </a>

          <a
            href="#about"
            className="hover:text-gray-300 bitcount-prop-double-dots transition"
          >
            About
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/AdityaBVerma/EVE"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 px-2 sm:px-4 py-1 rounded bitcount-prop-double-dots hover:bg-white hover:text-black transition"
          >
            GitHub
          </a>

        </nav>

      </div>

    </header>
  );
}

export default Header;