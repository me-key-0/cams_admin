import { useState } from "react";

interface Lecturer {
  id: string;
  name: string;
  email: string;
}

interface AssignLecturerModalProps {
  lecturers: Lecturer[];
  onClose: () => void;
  onAssign: (lecturerId: string) => void;
}

const AssignLecturerModal = ({
  lecturers,
  onClose,
  onAssign,
}: AssignLecturerModalProps) => {
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");

  const handleAssign = () => {
    if (selectedLecturerId) {
      onAssign(selectedLecturerId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-96 rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Assign Lecturer</h2>

        <select
          value={selectedLecturerId}
          onChange={(e) => setSelectedLecturerId(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2"
        >
          <option value="">Select a lecturer</option>
          {lecturers.map((lecturer) => (
            <option key={lecturer.id} value={lecturer.id}>
              {lecturer.name} ({lecturer.email})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!selectedLecturerId}
            className={`rounded px-4 py-2 text-white ${
              selectedLecturerId
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignLecturerModal;
