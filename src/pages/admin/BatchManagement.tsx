import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import AddCourseModal from "./components/AddCourseModal";
import AssignLecturerModal from "./components/AssignLecturerModal";

interface Batch {
  id: string;
  name: string;
  year: number;
  grade: string;
  isActive: boolean;
  students: Student[];
  semesters: Semester[];
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
}

interface Semester {
  id: string;
  year: number;
  semester: number;
  courses: Course[];
  isActive: boolean;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  lecturer: Lecturer | null;
  students: Student[];
}

interface Lecturer {
  id: string;
  name: string;
  email: string;
}

// Mock data - replace with actual API calls
const mockBatches: Batch[] = [
  {
    id: "1",
    name: "Batch 2023",
    year: 2023,
    grade: "First Year",
    isActive: true,
    students: [
      {
        id: "1",
        name: "John Doe",
        studentId: "STU001",
        email: "john@example.com",
      },
    ],
    semesters: [
      {
        id: "1",
        year: 2023,
        semester: 1,
        courses: [
          {
            id: "1",
            name: "Introduction to Programming",
            code: "CS101",
            credits: 3,
            lecturer: null,
            students: [],
          },
        ],
        isActive: true,
      },
    ],
  },
];

const mockLecturers: Lecturer[] = [
  {
    id: "1",
    name: "Dr. Smith",
    email: "smith@example.com",
  },
  {
    id: "2",
    name: "Dr. Johnson",
    email: "johnson@example.com",
  },
];

const BatchManagement = () => {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAssigningLecturer, setIsAssigningLecturer] = useState(false);

  const handleActivateSemester = (batchId: string, semesterId: string) => {
    setBatches((prevBatches) =>
      prevBatches.map((batch) => {
        if (batch.id === batchId) {
          return {
            ...batch,
            semesters: batch.semesters.map((semester) => ({
              ...semester,
              isActive: semester.id === semesterId,
            })),
          };
        }
        return batch;
      })
    );
  };

  const handleAddCourse = (courseData: { name: string; code: string; credits: number }) => {
    if (selectedSemester) {
      const newCourse: Course = {
        id: Math.random().toString(36).substr(2, 9),
        ...courseData,
        lecturer: null,
        students: [],
      };

      setBatches((prevBatches) =>
        prevBatches.map((batch) => ({
          ...batch,
          semesters: batch.semesters.map((semester) => {
            if (semester.id === selectedSemester.id) {
              return {
                ...semester,
                courses: [...semester.courses, newCourse],
              };
            }
            return semester;
          }),
        }))
      );
    }
  };

  const handleAssignLecturer = (lecturerId: string) => {
    if (selectedCourse && selectedSemester) {
      const lecturer = mockLecturers.find((l) => l.id === lecturerId);
      if (lecturer) {
        setBatches((prevBatches) =>
          prevBatches.map((batch) => ({
            ...batch,
            semesters: batch.semesters.map((semester) => ({
              ...semester,
              courses: semester.courses.map((course) => {
                if (course.id === selectedCourse.id) {
                  return {
                    ...course,
                    lecturer,
                  };
                }
                return course;
              }),
            })),
          }))
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Batch Management</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage student batches, semesters, and courses
          </p>
        </div>

        {/* Batch List */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Batches</h2>
          </div>
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {batches.map((batch) => (
                <li key={batch.id}>
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {batch.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {batch.grade} - {batch.year}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Semester Details */}
        {selectedBatch && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Semesters - {selectedBatch.name}
              </h2>
            </div>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {selectedBatch.semesters.map((semester) => (
                  <li key={semester.id}>
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            Semester {semester.semester} - {semester.year}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {semester.courses.length} Courses
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 space-x-2">
                          <button
                            onClick={() => setSelectedSemester(semester)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Manage Courses
                          </button>
                          <button
                            onClick={() =>
                              handleActivateSemester(selectedBatch.id, semester.id)
                            }
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                              semester.isActive
                                ? "text-green-700 bg-green-100 hover:bg-green-200"
                                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            {semester.isActive ? (
                              <>
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                Active
                              </>
                            ) : (
                              "Activate"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Course Management */}
        {selectedSemester && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Courses - Semester {selectedSemester.semester}
                </h2>
                <button
                  onClick={() => setIsAddingCourse(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Course
                </button>
              </div>
            </div>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {selectedSemester.courses.map((course) => (
                  <li key={course.id}>
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {course.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {course.code} - {course.credits} Credits
                          </p>
                          {course.lecturer && (
                            <p className="mt-1 text-sm text-gray-500">
                              Lecturer: {course.lecturer.name}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0 space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsAssigningLecturer(true);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Assign Lecturer
                          </button>
                          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Modals */}
        <AddCourseModal
          isOpen={isAddingCourse}
          onClose={() => setIsAddingCourse(false)}
          onAdd={handleAddCourse}
        />

        <AssignLecturerModal
          isOpen={isAssigningLecturer}
          onClose={() => {
            setIsAssigningLecturer(false);
            setSelectedCourse(null);
          }}
          onAssign={handleAssignLecturer}
          lecturers={mockLecturers}
        />
      </div>
    </div>
  );
};

export default BatchManagement; 