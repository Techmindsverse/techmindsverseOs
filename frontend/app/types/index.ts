export type UserRole = 'admin' | 'student' | 'instructor';
export type UserStatus = 'pending' | 'active' | 'suspended';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';
export type ProjectStatus = 'submitted' | 'reviewed' | 'approved' | 'rejected';
export type ComplaintStatus = 'pending' | 'resolved';
export type BuildStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  track?: string;
  performance_score?: number;
  rank?: number;
  users?: { email: string; status: UserStatus };
}

export interface Payment {
  id: string;
  user_id: string;
  course_id?: string;
  amount: number;
  reference: string;
  proof_image_url?: string;
  status: PaymentStatus;
  admin_note?: string;
  created_at: string;
  users?: { email: string };
  courses?: { title: string };
}

export interface Project {
  id: string;
  student_id: string;
  title: string;
  description?: string;
  file_url?: string;
  status: ProjectStatus;
  feedback?: string;
  created_at: string;
  students?: { full_name: string };
}

export interface Complaint {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: ComplaintStatus;
  category?: string;
  priority?: string;
  admin_response?: string;
  created_at: string;
  users?: { email: string };
}

export interface Build {
  id: string;
  name: string;
  email: string;
  description: string;
  category: string;
  budget?: string;
  requirements?: string;
  status: BuildStatus;
  priority?: string;
  admin_note?: string;
  created_at: string;
}

export interface Course {
  id: string;
  instructor_id?: string;
  title: string;
  description?: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}