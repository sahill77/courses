# 📚 React Query Usage Examples

## Quick Start

### 1. Fetch Courses (with caching)

```javascript
import { useCourses } from '../hooks/useApi';

function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}
```

### 2. Fetch with Filters

```javascript
const [category, setCategory] = useState('');
const { data: courses } = useCourses({ category });

// When category changes, automatically refetches with new filter
```

### 3. Debounced Search

```javascript
import { useDebounce } from '../hooks/useDebounce';

function SearchCourses() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  const { data: courses } = useCourses({ search: debouncedSearch });

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search courses..."
    />
  );
}
```

### 4. Parallel Requests

```javascript
function Dashboard() {
  // Both requests happen in parallel
  const { data: courses } = useCourses();
  const { data: categories } = useCategories();
  const { data: enrolled } = useEnrolledCourses();

  // All three requests execute simultaneously
}
```

### 5. Mutation (Enroll in Course)

```javascript
import { useEnrollCourse } from '../hooks/useApi';

function CourseDetail() {
  const enrollMutation = useEnrollCourse();

  const handleEnroll = (courseId) => {
    enrollMutation.mutate(courseId, {
      onSuccess: () => {
        alert('Enrolled successfully!');
        // Enrolled courses automatically refetched
      },
      onError: (error) => {
        alert('Enrollment failed: ' + error.message);
      },
    });
  };

  return (
    <button
      onClick={() => handleEnroll(course._id)}
      disabled={enrollMutation.isLoading}
    >
      {enrollMutation.isLoading ? 'Enrolling...' : 'Enroll Now'}
    </button>
  );
}
```

### 6. Admin Stats (Multiple Parallel Requests)

```javascript
import { useAdminStats } from '../hooks/useApi';

function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div>
      <StatCard title="Users" value={stats.users.length} />
      <StatCard title="Courses" value={stats.courses.length} />
      <StatCard title="Categories" value={stats.categories.length} />
      <StatCard title="Enrollments" value={stats.enrollments.length} />
    </div>
  );
}
```

### 7. Conditional Fetching (Lazy Loading)

```javascript
function CourseDetail({ courseId }) {
  // Only fetch if courseId exists
  const { data: course } = useCourseDetail(courseId);

  // Or with custom condition
  const { data: enrolled } = useEnrolledCourses({
    enabled: !!user, // Only fetch if user is logged in
  });
}
```

### 8. Manual Refetch

```javascript
function Courses() {
  const { data: courses, refetch } = useCourses();

  return (
    <div>
      <button onClick={() => refetch()}>
        Refresh Courses
      </button>
      {/* ... */}
    </div>
  );
}
```

### 9. Cache Invalidation

```javascript
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../hooks/useApi';

function SomeComponent() {
  const queryClient = useQueryClient();

  const handleAction = () => {
    // Manually invalidate cache
    queryClient.invalidateQueries([QUERY_KEYS.COURSES]);
    
    // Or invalidate multiple
    queryClient.invalidateQueries([QUERY_KEYS.COURSES]);
    queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES]);
  };
}
```

### 10. Optimistic Updates

```javascript
const enrollMutation = useEnrollCourse();

const handleEnroll = (courseId) => {
  enrollMutation.mutate(courseId, {
    onMutate: async () => {
      // Optimistically update UI before API call completes
      // Show "Enrolled" immediately
    },
    onError: () => {
      // Rollback on error
    },
    onSuccess: () => {
      // Confirm success
    },
  });
};
```

## Available Hooks

### Query Hooks (Fetching Data)

```javascript
// Courses
const { data, isLoading, error } = useCourses(filters);
const { data } = useCourseDetail(id);

// Categories
const { data } = useCategories();

// Enrolled Courses
const { data } = useEnrolledCourses();

// Admin
const { data } = useUsers();
const { data } = useInstructors();
const { data } = useAdminStats(); // Parallel requests

// Help Tickets
const { data } = useHelpTickets();
```

### Mutation Hooks (Modifying Data)

```javascript
// Enrollment
const mutation = useEnrollCourse();
mutation.mutate(courseId);

// Help Tickets
const mutation = useCreateTicket();
mutation.mutate(ticketData);

const mutation = useUpdateTicketStatus();
mutation.mutate({ id, status });

// Admin Actions
const mutation = useApproveInstructor();
mutation.mutate(instructorId);

const mutation = useApproveCourse();
mutation.mutate(courseId);
```

## Common Patterns

### Pattern 1: Loading States

```javascript
const { data, isLoading, isFetching, error } = useCourses();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
if (!data) return null;

return <CourseList courses={data} />;
```

### Pattern 2: Refetch on Action

```javascript
const { data, refetch } = useCourses();

const handleRefresh = () => {
  refetch();
};
```

### Pattern 3: Dependent Queries

```javascript
const { data: course } = useCourseDetail(courseId);
const { data: instructor } = useInstructor(course?.instructorId, {
  enabled: !!course?.instructorId, // Only fetch if course loaded
});
```

### Pattern 4: Pagination

```javascript
const [page, setPage] = useState(1);
const { data } = useCourses({ page, limit: 10 });
```

### Pattern 5: Infinite Scroll

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';

const {
  data,
  fetchNextPage,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: ['courses'],
  queryFn: ({ pageParam = 1 }) => fetchCourses(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

## Performance Tips

1. **Use appropriate staleTime**
   ```javascript
   // Frequently changing data
   useCourses({ staleTime: 1 * 60 * 1000 }); // 1 minute
   
   // Rarely changing data
   useCategories({ staleTime: 10 * 60 * 1000 }); // 10 minutes
   ```

2. **Prefetch data**
   ```javascript
   const queryClient = useQueryClient();
   
   // Prefetch on hover
   const handleHover = (courseId) => {
     queryClient.prefetchQuery([QUERY_KEYS.COURSE_DETAIL, courseId], () =>
       fetchCourseDetail(courseId)
     );
   };
   ```

3. **Use select to transform data**
   ```javascript
   const { data: courseNames } = useCourses({
     select: (data) => data.map(course => course.title),
   });
   ```

4. **Disable automatic refetching**
   ```javascript
   useCourses({
     refetchOnWindowFocus: false,
     refetchOnMount: false,
     refetchOnReconnect: false,
   });
   ```

## Debugging

### React Query DevTools

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Check Cache

```javascript
const queryClient = useQueryClient();
const cachedData = queryClient.getQueryData([QUERY_KEYS.COURSES]);
console.log('Cached courses:', cachedData);
```

## Summary

✅ Simple API: Just use hooks
✅ Automatic caching: No manual state management
✅ Parallel requests: Multiple hooks = parallel
✅ Debouncing: Use useDebounce hook
✅ Mutations: Automatic cache invalidation
✅ Loading states: Built-in
✅ Error handling: Built-in
✅ Refetching: Manual or automatic

**Result**: Faster app, fewer API calls, better UX!
