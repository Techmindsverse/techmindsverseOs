import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CoursesService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllCourses() {
    const { data, error } = await this.supabaseService.clientRef
      .from('courses')
      .select('id, title, slug, description, overview, duration, level, category, instructor_name, thumbnail_url, order_index')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw new NotFoundException('Failed to fetch courses');
    return data;
  }

  async getCourseBySlug(slug: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) throw new NotFoundException('Course not found');
    return data;
  }

  async getEnrolledCourses(studentId: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('enrollments')
      .select('*, courses(id, title, slug, description, duration, level, category, instructor_name)')
      .eq('student_id', studentId)
      .order('enrolled_at', { ascending: false });

    if (error) throw new NotFoundException('Failed to fetch enrollments');
    return data;
  }

  async checkEnrollment(studentId: string, courseId: string) {
    const { data } = await this.supabaseService.clientRef
      .from('enrollments')
      .select('id, status')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();

    return { enrolled: !!data, status: data?.status || null };
  }
}