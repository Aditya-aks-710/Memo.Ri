import { useState, useEffect, useRef } from 'react';

interface ProfileDropdownProps {
  image?: string;
  onLogout: () => void; // Added onLogout function to the props
}

export function ProfileDropdown({ image, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userImage = image || 'https://res.cloudinary.com/drqcrqxnz/image/upload/v1744918893/user_riupmv.png';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#daedeb] focus:ring-[#438989]"
      >
        <img
          className="w-10 h-10 object-cover rounded-full"
          src={userImage}
          alt="User avatar"
        />
        <svg
          className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
          <div className="py-1">
            <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </a>
            {/* Changed <a> to <button> and added the onClick handler */}
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}