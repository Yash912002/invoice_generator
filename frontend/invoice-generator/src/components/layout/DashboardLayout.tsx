import { useEffect, useState } from "react";
import {
  BriefcaseIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  type LucideProps
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { NAVIGATION_MENU } from "../../utils/data";

type Props = {
  children?: React.ReactNode;
  activeMenu: string;
};

type NavigationItemProps = {
  item: {
    id: string;
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  },
  isActive: boolean;
  onClick: (id: string) => void;
  isCollapsed: boolean;
}

const NavigationItem = ({
  item,
  isActive,
  onClick,
  isCollapsed
}: NavigationItemProps) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive
          ? "bg-blue-50 text-blue-900 shadow-sm shadow-blue-50"
          : "text-gray-600 hover:bg-blue-100 hover:text-gray-900"
        } flex items-center gap-3 rounded-md p-2 cursor-pointer transition`
      }
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 
          ${isActive ? "text-blue-900" : "text-gray-500"}`
        }
      />

      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
  )
}

const DashboardLayout = ({ children, activeMenu }: Props) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string>(activeMenu || "dashboard");
  const [profileDropDownOpen, setProfileDropDownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // clone dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropDownOpen) {
        setProfileDropDownOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [profileDropDownOpen])

  const handleNavigation = (itemId: string) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapsed = !isMobile && false;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className=
        {`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform 
        ${isMobile
            ?
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
          } ${sidebarCollapsed ? "w-16" : "w-64"}
          bg-white border-r border-gray-200
        `}
      >
        {/* Company Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 px-6">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div
              className="h-8 w-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center"
            >
              <BriefcaseIcon className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-gray-900 font-bold text-xl">
                AI Invoice app
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Ḷogout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer text-gray-600 hover:bg-blue-100 hover:text-gray-900 transition-all duration-300"
            onClick={logout}
          >
            <LogOutIcon className="h-5 w-5 shrink-0 text-gray-500" />
            {!sidebarCollapsed && <span className="ml-3"> Logout </span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-25 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 
        ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky z-30">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleSidebar}>
                {sidebarOpen ? (
                  <XIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <MenuIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}

            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Welcome back, {user?.name}!
              </h1>

              <p className="text-sm text-gray-500 hidden sm:block ">
                Here's your invoice review
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Profile dropdown */}
            <ProfileDropdown
              isOpen={profileDropDownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropDownOpen(!profileDropDownOpen);
              }}
              // avatar={user?.avatar || ""}
              companyName={user?.name || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div >
  )
}

export default DashboardLayout;