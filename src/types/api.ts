// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// User Types
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN' | 'SUPER_ADMIN';
  departmentId?: number;
  isVerified: boolean;
  profileImage?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Course Types
export interface Course {
  id: number;
  code: string;
  name: string;
  creditHour: number;
  description: string;
  departmentId: string;
  prerequisites: number[];
}

export interface Batch {
  id: number;
  name: string;
  admissionYear: number;
  currentYear: number;
  currentSemester: number;
  departmentId: number;
  createdAt: string;
  isActive: boolean;
  totalStudents: number;
}

export interface CourseSession {
  id: number;
  academicYear: number;
  semester: number;
  year: number;
  courseId: number;
  departmentId: number;
  lecturerIds: number[];
  batchId: number;
  isActive: boolean;
  enrollmentOpen: boolean;
  course: Course;
}

// Enrollment Types
export interface Enrollment {
  id: number;
  studentId: number;
  enrollmentDate: string;
  isActive: boolean;
  courseSession: CourseSession;
}

// Grade Types
export interface GradeType {
  id: number;
  name: string;
  description: string;
  maxScore: number;
  weightPercentage: number;
  courseSessionId: number;
  category: 'QUIZ' | 'ASSIGNMENT' | 'MIDTERM' | 'FINAL' | 'PROJECT';
}

export interface Grade {
  id: number;
  studentId: number;
  gradeTypeId: number;
  score: number;
  feedback?: string;
  gradedAt: string;
}

// Assignment Types
export interface Assignment {
  id: number;
  title: string;
  description: string;
  courseSessionId: number;
  lecturerId: number;
  lecturerName: string;
  dueDate: string;
  createdAt: string;
  maxScore: number;
  type: 'INDIVIDUAL' | 'GROUP';
  status: 'DRAFT' | 'PUBLISHED';
  submissionCount: number;
  isOverdue: boolean;
  attachments: ResourceAttachment[];
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentName: string;
  content?: string;
  attachments: ResourceAttachment[];
  submittedAt: string;
  status: 'SUBMITTED' | 'GRADED';
  score?: number;
  maxScore: number;
  feedback?: string;
  isLate: boolean;
}

// Resource Types
export interface Resource {
  id: number;
  title: string;
  description: string;
  fileName: string;
  originalFileName: string;
  type: 'DOCUMENT' | 'VIDEO' | 'PHOTO' | 'LINK' | 'AUDIO' | 'ARCHIVE';
  fileSize: number;
  mimeType: string;
  categories: string[];
  downloadCount: number;
  uploadedAt: string;
  courseSessionId: number;
  uploadedBy: number;
  uploaderName: string;
  status: 'ACTIVE' | 'INACTIVE';
  downloadUrl: string;
  fileSizeFormatted: string;
  linkUrl?: string;
}

export interface ResourceAttachment {
  id: number;
  title: string;
  fileName: string;
  downloadUrl: string;
}

// Communication Types
export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: 'ACADEMIC' | 'ADMINISTRATIVE';
  createdAt: string;
  createdBy: string;
  createdByName: string;
  role: string;
  departmentCode: string;
  isGlobal: boolean;
  active: boolean;
  isRead?: boolean;
}

export interface AnnouncementResponse {
  totalAnnouncements: number;
  unreadCount: number;
  announcements: Announcement[];
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  category: 'ACADEMIC' | 'ADMINISTRATIVE';
}

export interface UpdateAnnouncementRequest {
  title: string;
  content: string;
  category: 'ACADEMIC' | 'ADMINISTRATIVE';
}

export interface Notification {
  id: number;
  subject: string;
  message: string;
  type: string;
  courseSessionId: number;
  createdAt: string;
  isRead: boolean;
}

export interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  createdBy: number;
  departmentId: number;
  responses: TicketResponse[];
}

export interface TicketResponse {
  id: number;
  message: string;
  createdAt: string;
  createdBy: number;
  createdByName: string;
}

// Evaluation Types
export interface EvaluationSession {
  id: number;
  courseSessionId: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  departmentId: number;
  activatedBy: number;
  courseCode: string;
  courseName: string;
}

export interface EvaluationQuestion {
  id: number;
  question: string;
  category: {
    id: number;
    name: string;
  };
}

export interface EvaluationCategory {
  id: number;
  name: string;
  description: string;
}

export interface EvaluationAnalytics {
  lecturerId: number;
  lecturerName: string;
  courseSessionId: number;
  courseCode: string;
  courseName: string;
  totalSubmissions: number;
  overallRating: number;
  categoryRatings: Record<string, number>;
  questionAnalytics: QuestionAnalytics[];
}

export interface QuestionAnalytics {
  questionId: number;
  question: string;
  category: string;
  averageRating: number;
  ratingDistribution: Record<string, number>;
}

// Lecturer Management Types
export interface LecturerCapacity {
  id: number;
  lecturerId: number;
  departmentId: number;
  maxCreditHours: number;
  currentCreditHours: number;
}

export interface TeachableCourse {
  lecturerId: number;
  courseIds: number[];
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalStudents: number;
  totalLecturers: number;
  activeCourses: number;
  completionRate: number;
  enrollmentTrends: { label: string; value: number }[];
  departmentDistribution: { label: string; value: number; color: string }[];
  coursePerformance: { label: string; value: number }[];
}

// Pagination Types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Error Types
export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
}