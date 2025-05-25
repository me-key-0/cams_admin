import React, { useState } from 'react';

interface Teacher {
  id: string;
  fullName: string;
  department: string;
  email: string;
  courses: string[];
  yearsOfTeaching: number;
}

// Mock data - replace with actual API call
const mockTeachers: Teacher[] = [
  {
    id: "T001",
    fullName: "Dr. Robert Wilson",
    department: "Computer Science",
    email: "robert.wilson@university.com",
    courses: ["Introduction to Programming", "Data Structures", "Algorithms"],
    yearsOfTeaching: 8
  },
  {
    id: "T002",
    fullName: "Prof. Sarah Johnson",
    department: "Computer Science",
    email: "sarah.johnson@university.com",
    courses: ["Database Systems", "Web Development", "Software Engineering"],
    yearsOfTeaching: 12
  },
  // Add more mock data as needed
];

const TeachersList = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lecturers List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {mockTeachers.map((teacher) => (
              <li
                key={teacher.id}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTeacher(teacher)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">{teacher.fullName}</p>
                    <p className="text-sm text-gray-500">{teacher.department}</p>
                  </div>
                  <p className="text-sm text-gray-500">{teacher.yearsOfTeaching} years</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedTeacher && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lecturer Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-sm text-gray-900">{selectedTeacher.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="mt-1 text-sm text-gray-900">{selectedTeacher.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-sm text-gray-900">{selectedTeacher.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Years of Teaching</p>
                <p className="mt-1 text-sm text-gray-900">{selectedTeacher.yearsOfTeaching} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Courses</p>
                <ul className="mt-1 space-y-1">
                  {selectedTeacher.courses.map((course, index) => (
                    <li key={index} className="text-sm text-gray-900">
                      • {course}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersList; 