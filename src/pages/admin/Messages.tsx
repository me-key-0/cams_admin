import { useState } from "react";

interface Message {
  id: number;
  subject: string;
  message: string;
  priority: "high" | "medium" | "low";
  sender: string;
  role: "student" | "lecturer";
  date: string;
  isRead: boolean;
}

const Messages = () => {
  // Sample data - replace with actual API data later
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      subject: "Question about Course Registration",
      message: "I'm having trouble registering for the Advanced Programming course. The system shows it's full but the lecturer said there are still spots available.",
      priority: "high",
      sender: "John Doe",
      role: "student",
      date: "2024-03-15",
      isRead: false,
    },
    {
      id: 2,
      subject: "Room Scheduling Conflict",
      message: "There seems to be a double booking for Room 301 next Tuesday. Can you please help resolve this?",
      priority: "medium",
      sender: "Dr. Sarah Smith",
      role: "lecturer",
      date: "2024-03-14",
      isRead: true,
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const markAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="flex gap-4">
          <select 
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue="all"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages to display</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                !message.isRead ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {message.subject}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-gray-300">•</span>
                      <span>{message.role}</span>
                      <span className="text-gray-300">•</span>
                      <span>{message.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      message.priority
                    )}`}
                  >
                    {message.priority}
                  </span>
                  {!message.isRead && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages; 