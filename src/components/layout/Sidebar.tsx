import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Classes", href: "/admin/classes", icon: BookOpenIcon },
  { name: "Students", href: "/admin/students", icon: UserGroupIcon },
  { name: "Lecturers", href: "/admin/lecturers", icon: AcademicCapIcon },
  { name: "Announcements", href: "/admin/announcements", icon: BellIcon },
  { name: "Messages", href: "/admin/messages", icon: ChatBubbleLeftRightIcon },
  { name: "Support", href: "/admin/support", icon: QuestionMarkCircleIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
        <h1 className="text-xl font-bold text-white">CAMS Admin</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 