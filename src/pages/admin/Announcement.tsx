import { useState } from "react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

const Announcement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      date: new Date().toLocaleDateString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setFormData({ title: "", content: "" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Announcements</h1>

      {/* Create Announcement Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
              placeholder="Enter announcement content"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Post Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No announcements yet</p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                <span className="text-sm text-gray-500">{announcement.date}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcement; 