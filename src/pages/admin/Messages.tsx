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
  replies?: {
    sender: string;
    message: string;
    date: string;
  }[];
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
      replies: [],
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
      replies: [],
    },
    {
      id: 3,
      subject: "Comprehensive Feedback on Recent Workshop",
      message: "I wanted to provide detailed feedback regarding the recent Software Development Practices workshop. The session was incredibly informative, but I noticed several areas that could be improved for future iterations. First, the hands-on coding segments were excellent, but we could benefit from more time allocated to these practical sessions. Many students, myself included, were just getting into the flow when we had to move on to the next topic. Second, while the advanced debugging techniques were well-explained, it would be helpful to have supplementary documentation or resources we could reference later. The section on version control and collaborative development was particularly strong, though some beginners found it slightly overwhelming. Perhaps we could consider splitting this into two separate sessions - basic and advanced? Additionally, I've collected feedback from other participants, and there's a general consensus that more real-world case studies would be beneficial. Lastly, the Q&A session at the end was rushed - maybe we could extend the workshop duration by 30 minutes to accommodate more questions? I'm happy to discuss these points in more detail if you'd like.",
      priority: "low",
      sender: "Emily Chen",
      role: "student",
      date: "2024-03-16",
      isRead: false,
      replies: [],
    }
  ]);

  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

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

  const handleReply = (messageId: number) => {
    if (!replyText.trim()) return;

    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          replies: [
            ...(msg.replies || []),
            {
              sender: "Admin", // Replace with actual admin name
              message: replyText,
              date: new Date().toISOString().split('T')[0],
            }
          ]
        };
      }
      return msg;
    }));
    setReplyText("");
  };

  const truncateMessage = (message: string) => {
    const firstLine = message.split('\n')[0];
    const maxLength = 100;
    if (firstLine.length <= maxLength) return firstLine;
    return `${firstLine.substring(0, maxLength)}...`;
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
              <div 
                className="flex justify-between items-start mb-4 cursor-pointer"
                onClick={() => {
                  setExpandedMessageId(expandedMessageId === message.id ? null : message.id);
                  if (!message.isRead) markAsRead(message.id);
                }}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(message.id);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {expandedMessageId === message.id ? (
                <div className="mt-4">
                  <p className="text-gray-700 whitespace-pre-wrap mb-6">{message.message}</p>
                  
                  {/* Replies Section */}
                  {message.replies && message.replies.length > 0 && (
                    <div className="ml-6 border-l-2 border-gray-200 pl-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Replies</h4>
                      {message.replies.map((reply, index) => (
                        <div key={index} className="mb-3 bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span className="font-medium">{reply.sender}</span>
                            <span>{reply.date}</span>
                          </div>
                          <p className="text-gray-700">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Reply Input */}
                  <div className="mt-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => handleReply(message.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Send Reply
                      </button>
                      <button
                        onClick={() => setExpandedMessageId(null)}
                        className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
                      >
                        Show less
                        <svg
                          className="w-4 h-4 ml-1 transform rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700">{truncateMessage(message.message)}</p>
                  <button
                    onClick={() => setExpandedMessageId(message.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center"
                  >
                    Show more
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages; 