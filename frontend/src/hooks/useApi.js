import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Query keys for cache management
export const QUERY_KEYS = {
  COURSES: 'courses',
  COURSE_DETAIL: 'courseDetail',
  CATEGORIES: 'categories',
  ENROLLED_COURSES: 'enrolledCourses',
  USERS: 'users',
  INSTRUCTORS: 'instructors',
  ADMIN_STATS: 'adminStats',
  HELP_TICKETS: 'helpTickets',
};

// Courses
export const useCourses = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSES, filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/courses${params ? `?${params}` : ''}`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Course Detail
export const useCourseDetail = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE_DETAIL, id],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${id}`);
      return data;
    },
    enabled: !!id, // Only fetch if id exists
    staleTime: 5 * 60 * 1000,
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
};

// Enrolled Courses
export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ENROLLED_COURSES],
    queryFn: async () => {
      const { data } = await api.get('/courses/enrolled');
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Admin - Users
export const useUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
    staleTime: 3 * 60 * 1000,
  });
};

// Admin - Instructors
export const useInstructors = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.INSTRUCTORS],
    queryFn: async () => {
      const { data } = await api.get('/admin/instructors');
      return data;
    },
    staleTime: 3 * 60 * 1000,
  });
};

// Admin - Stats (parallel requests)
export const useAdminStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: async () => {
      // Parallel API calls
      const [users, courses, categories, enrollments] = await Promise.all([
        api.get('/admin/users'),
        api.get('/courses'),
        api.get('/categories'),
        api.get('/admin/enrollments'),
      ]);
      
      return {
        users: users.data,
        courses: courses.data,
        categories: categories.data,
        enrollments: enrollments.data,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Help Tickets
export const useHelpTickets = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.HELP_TICKETS],
    queryFn: async () => {
      const { data } = await api.get('/help/tickets');
      return data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Mutations (for create/update/delete operations)

// Enroll in course
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId) => {
      const { data } = await api.post(`/courses/${courseId}/enroll`);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch enrolled courses
      queryClient.invalidateQueries([QUERY_KEYS.ENROLLED_COURSES]);
    },
  });
};

// Create help ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ticketData) => {
      const { data } = await api.post('/help/tickets', ticketData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.HELP_TICKETS]);
    },
  });
};

// Update ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/help/tickets/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.HELP_TICKETS]);
    },
  });
};

// Approve instructor
export const useApproveInstructor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (instructorId) => {
      const { data } = await api.patch(`/admin/instructors/${instructorId}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.INSTRUCTORS]);
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
    },
  });
};

// Approve course
export const useApproveCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId) => {
      const { data } = await api.patch(`/admin/courses/${courseId}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.COURSES]);
    },
  });
};
