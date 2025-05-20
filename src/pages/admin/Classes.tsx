import { useState, useEffect } from "react";
import AssignLecturerModal from "./components/AssignLecturerModal";


interface Batch {
  id: string;
  year: number;
  grade: string;
  status: "active" | "inactive";
}

interface Semester {
  id: string;
  name: string;
  batchId: string;
  courseCount: number;
  isActive: boolean;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  lecturerId?: string;
  lecturerName?: string;
  batchId?: string;
  semesterId?: string;
}

const Classes = () => {
  const [isAssignLecturerModalOpen, setIsAssignLecturerModalOpen] = useState(false);
  const [isAddCourseFormVisible, setIsAddCourseFormVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseId, setNewCourseId] = useState<string>("");
  const [newCourseCredits, setNewCourseCredits] = useState<string>("");

  const batches: Batch[] = [
    { id: "1", year: 2023, grade: "A", status: "active" },
    { id: "2", year: 2022, grade: "B", status: "active" },
    { id: "3", year: 2021, grade: "C", status: "inactive" },
  ];

  const semesters: Semester[] = [
    { id: "1", name: "Semester 1", batchId: "1", courseCount: 5, isActive: true },
    { id: "2", name: "Semester 2", batchId: "1", courseCount: 4, isActive: false },
    { id: "1", name: "Semester 1", batchId: "2", courseCount: 6, isActive: true },
    { id: "2", name: "Semester 2", batchId: "2", courseCount: 5, isActive: false },
  ];

  const allCourses: Course[] = [
    { id: "1", name: "Introduction to Programming", code: "CS101", credits: 3 },
    { id: "2", name: "Data Structures", code: "CS102", credits: 4 },
    { id: "3", name: "Algorithms", code: "CS201", credits: 4 },
    { id: "4", name: "Databases", code: "CS301", credits: 3 },
  ];

  const lecturers = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ];

  // When batch or semester changes, set default semester or update courses
  useEffect(() => {
    if (!selectedBatch) {
      setCourses([]);
      setSelectedSemester("");
      return;
    }

    const filteredSemesters = semesters.filter((sem) => sem.batchId === selectedBatch.id);
    if (filteredSemesters.length === 0) {
      setCourses([]);
      setSelectedSemester("");
      return;
    }

    if (!selectedSemester || !filteredSemesters.some((s) => s.id === selectedSemester)) {
      setSelectedSemester(filteredSemesters[0].id);
      return;
    }

    // Filter courses matching selected batch & semester
    const batchSemesterCourses = courses.filter(
      (c) => c.batchId === selectedBatch.id && c.semesterId === selectedSemester
    );

    setCourses(batchSemesterCourses);
  }, [selectedBatch, selectedSemester]);

  const filteredBatches = batches.filter((batch) => batch.year === selectedYear);
  const filteredSemesters = selectedBatch
    ? semesters.filter((sem) => sem.batchId === selectedBatch.id)
    : [];

  const displayedCourses = courses.filter(
    (c) => c.batchId === selectedBatch?.id && c.semesterId === selectedSemester
  );

  const availableCourses = allCourses.filter(
    (course) => !displayedCourses.some((c) => c.id === course.id)
  );

  const handleAddCourse = () => {
    const courseToAdd = allCourses.find((c) => c.id === newCourseId);
    if (!courseToAdd || !newCourseCredits || !selectedBatch || !selectedSemester) return;

    const newCourse: Course = {
      ...courseToAdd,
      credits: Number(newCourseCredits),
      batchId: selectedBatch.id,
      semesterId: selectedSemester,
    };

    setCourses((prev) => [...prev, newCourse]);
    setNewCourseId("");
    setNewCourseCredits("");
    setIsAddCourseFormVisible(false);
  };

  const handleAssignLecturer = (lecturerId: string) => {
    if (!selectedCourse) return;

    setCourses((prev) =>
      prev.map((course) =>
        course.id === selectedCourse.id &&
        course.batchId === selectedCourse.batchId &&
        course.semesterId === selectedCourse.semesterId
          ? {
              ...course,
              lecturerId,
              lecturerName: lecturers.find((l) => l.id === lecturerId)?.name,
            }
          : course
      )
    );
    setIsAssignLecturerModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="h-full p-6">
      {!selectedBatch && (
        <>
          <h1 className="text-2xl font-semibold mb-6">Classes</h1>

          <div className="w-60 mb-8">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {[...new Set(batches.map((batch) => batch.year))].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                className="cursor-pointer rounded-lg border border-gray-300 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Batch {batch.year}</h3>
                    <p className="text-sm text-gray-500">Grade {batch.grade}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      batch.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedBatch && (
        <div>
          <button
            onClick={() => setSelectedBatch(null)}
            className="mb-6 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          >
            &larr; Back to batches
          </button>

          <div className="mb-6 w-60">
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {filteredSemesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
              Batch {selectedBatch.year} - Grade {selectedBatch.grade}
            </h3>

            <button
              onClick={() => setIsAddCourseFormVisible((v) => !v)}
              className="mb-6 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              {isAddCourseFormVisible ? "Cancel" : "Add Course"}
            </button>

            {isAddCourseFormVisible && (
              <div className="mb-6 flex gap-4 items-end">
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a course</option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={newCourseCredits}
                  onChange={(e) => setNewCourseCredits(e.target.value)}
                  className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Credits"
                />
                <button
                  onClick={handleAddCourse}
                  className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  Create
                </button>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Courses</h4>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Course
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Code</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Credits</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lecturer</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {displayedCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {course.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{course.code}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{course.credits}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {course.lecturerName || "-"}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsAssignLecturerModalOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Assign Lecturer
                          </button>
                        </td>
                      </tr>
                    ))}
                    {displayedCourses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-sm text-gray-500">
                          No courses assigned to this semester.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    <AssignLecturerModal
  isOpen={isAssignLecturerModalOpen}
  onClose={() => {
    setIsAssignLecturerModalOpen(false);
    setSelectedCourse(null);
  }}
  onAssign={handleAssignLecturer}
  lecturers={lecturers}
/>

    </div>
  );
};

export default Classes;
