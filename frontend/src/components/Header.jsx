import { useState } from "react";
import { Link } from "react-router-dom";
import { Link2, Menu, X } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-lg"
          >
            <Link2 size={18} color="#fff" />
          </Link>

          <div>
            <h1 className="m-0 text-lg font-semibold">TinyLink</h1>
            <p className="text-xs text-gray-500 m-0">URL Shortener</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-black hover:underline font-medium">Dashboard</Link>
          <Link to="/create" className="text-gray-600 hover:text-black hover:underline font-medium">Create Link</Link>
          <Link to="/status" className="text-gray-600 hover:text-black hover:underline font-medium">Status</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation */}
      {open && (
        <nav className="md:hidden py-2 px-6 pb-3 flex flex-col gap-3 text-sm border-t border-gray-200 bg-gray-50">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
          <Link to="/create" className="text-gray-700 hover:text-gray-900">Create Link</Link>
          <Link to="/status" className="text-gray-700 hover:text-gray-900">Status</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
