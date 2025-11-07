import { useState, useRef, useEffect } from "react";

interface TopNavProps {
  user: string;
  onLogout: () => void;
  onLogin: () => void; 
}

export default function TopNav({ user, onLogout, onLogin }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow border-b">
      {/* App Title */}
      <h1 className="text-xl font-bold text-blue-700">AI Chat Portal</h1>

      {/* Profile Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <span className="text-gray-700">👤 {user}</span>
          <svg
            className={`w-4 h-4 text-gray-600 transform transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <ul className="py-1 text-sm text-gray-700">
              {user === "Guest" ? (
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                    onClick={onLogin}
                  >
                    Login
                  </button>
                </li>
              ) : (
                
               <ul>
                 <li>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </li>
                <li>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => alert("Settings coming soon!")}
                    >
                      ⚙️ Settings
                    </button>
                </li>
                </ul>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
