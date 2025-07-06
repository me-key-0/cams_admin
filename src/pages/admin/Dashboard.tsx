import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  BellIcon,
  TrendingDownIcon,
} from "@heroicons/react/24/outline";


const stats = [
  {
    name: "Total Students",
    value: "1,234",
    icon: UserGroupIcon ||TrendingDownIcon,
    change: "+12%",
    changeType: "increase",
  },
  {
    name: "Total Lecturers",
    value: "45",
    icon: AcademicCapIcon,
    change: "+5%",
    changeType: "increase",
  },
  {
    name: "Active Courses",
    value: "89",
    icon: BookOpenIcon,
    change: "+3%",
    changeType: "increase",
  },
  {
    name: "Pending Requests",
    value: "12",
    icon: BellIcon,
    change: "-2%",
    changeType: "decrease",
  },
];

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {item.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium ${
                  item.changeType === "increase"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 