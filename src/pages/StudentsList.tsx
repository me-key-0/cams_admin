import React, { useState } from 'react';

interface Student {
  id: string;
  fullName: string;
  department: string;
  batchYear: number;
  email: string;
  studentId: string;
}

// Mock data - replace with actual API call
const mockStudents: Student[] = [
  {
    id: "ST001",
    fullName: "John Doe",
    department: "Computer Science",
    batchYear: 2023,
    email: "john.doe@university.com",
    studentId: "2023CS001"
  },
  {
    id: "ST002",
    fullName: "Jane Smith",
    department: "Computer Science",
    batchYear: 2022,
    email: "jane.smith@university.com",
    studentId: "2022CS002"
  },
  // Add more mock data as needed
];

const StudentsList = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>('all');

  // Get current year
  const currentYear = new Date().getFullYear();

  // Function to convert batch year to year level
  const getYearLevel = (batchYear: number) => {
    const yearDiff = currentYear - batchYear;
    if (yearDiff === 0) return '1st Year';
    if (yearDiff === 1) return '2nd Year';
    if (yearDiff === 2) return '3rd Year';
    if (yearDiff === 3) return '4th Year';
    return yearDiff < 0 ? '1st Year' : '4th Year';
  };

  // Available year levels
  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const filteredStudents = selectedYearLevel === 'all'
    ? mockStudents
    : mockStudents.filter(student => getYearLevel(student.batchYear) === selectedYearLevel);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students List</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="yearLevel" className="text-sm font-medium text-gray-700">
            Filter by Year Level:
          </label>
          <select
            id="yearLevel"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedYearLevel}
            onChange={(e) => setSelectedYearLevel(e.target.value)}
          >
            <option value="all">All Years</option>
            {yearLevels.map((yearLevel) => (
              <option key={yearLevel} value={yearLevel}>
                {yearLevel}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">{student.fullName}</p>
                    <p className="text-sm text-gray-500">{student.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{getYearLevel(student.batchYear)}</p>
                    <p className="text-xs text-gray-400">Batch {student.batchYear}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedStudent && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Student Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-sm text-gray-900">{selectedStudent.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Student ID</p>
                <p className="mt-1 text-sm text-gray-900">{selectedStudent.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="mt-1 text-sm text-gray-900">{selectedStudent.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year Level</p>
                <p className="mt-1 text-sm text-gray-900">{getYearLevel(selectedStudent.batchYear)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Batch Year</p>
                <p className="mt-1 text-sm text-gray-900">{selectedStudent.batchYear}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-sm text-gray-900">{selectedStudent.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList; 