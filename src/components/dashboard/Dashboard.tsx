import { useState } from 'react';
import { usePostsData } from '@/hooks/usePostsData';
import { useClients } from '@/hooks/useClients';
import { StatsSection } from './StatsSection';
import { DashboardFilters } from './DashboardFilters';
import { PostsGrid } from '@/components/posts/PostsGrid';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { calculateStats } from '@/lib/utils/statsCalculator';
import { DateRange } from 'react-day-picker';

interface Filters {
  client: string;
  dateRange: DateRange | null;
}

export function Dashboard() {
  const [filters, setFilters] = useState<Filters>({ 
    client: 'all', 
    dateRange: null 
  });
  
  const { clients, loading: clientsLoading } = useClients();
  const { posts, loading: postsLoading, error } = usePostsData({
    client: filters.client,
    dateRange: filters.dateRange
  });

  if (postsLoading || clientsLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const stats = calculateStats(posts);

  return (
    <div className="space-y-6 p-6">
      <DashboardFilters 
        onFilterChange={setFilters}
        currentFilters={filters}
        clients={clients}
      />
      
      <StatsSection stats={stats} />
      
      <PostsGrid posts={posts} />
    </div>
  );
} 