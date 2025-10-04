import { ChevronDownIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

type ProfileDropdownProps = {
  isOpen: boolean;
  onToggle: (e: React.FormEvent) => void;
  avatar: string;
  companyName: string;
  email: string;
  onLogout: () => void;
}

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout
}: ProfileDropdownProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl cursor-pointer"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="h-9 w-9 object-cover rounded-xl"
          />
        ) : (
          <div className="h-8 w-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{companyName}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>

        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {companyName}
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <a
            onClick={() => navigate("/profile")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            View Profile
          </a>

          <div className="border-t border-gray-100 mt-2">
            <a
              href="#"
              onClick={onLogout}
              className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown