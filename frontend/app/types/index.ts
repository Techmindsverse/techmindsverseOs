export interface User {
  id: string;
  email: string;
  role: 'admin' | 'student';
  status: 'pending' | 'active' | 'suspended';
}

export interface Student {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  performance_score?: number;
  rank?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  reference: string;
  proof_image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  created_at: string;
}

export interface Project {
  id: string;
  student_id: string;
  title: string;
  description?: string;
  file_url?: string;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected';
  feedback?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved';
  category: string;
  priority: 'low' | 'normal' | 'high';
  admin_response?: string;
  created_at: string;
}

export interface BuildRequest {
  id: string;
  name: string;
  email: string;
  description: string;
  category: string;
  budget?: string;
  requirements?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  priority: 'low' | 'normal' | 'high';
  created_at: string;
}