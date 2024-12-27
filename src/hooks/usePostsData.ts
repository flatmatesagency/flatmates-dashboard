import { useState, useEffect } from 'react';
import { queries, Post } from '../lib/api/queries';
import { DateRange } from 'react-day-picker';

interface UsePostsDataOptions {
  client?: string;
  dateRange?: DateRange | null;
  sortBy?: 'views' | 'likes' | 'comments';
  limit?: number;
}

export function usePostsData(options: UsePostsDataOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let data;

        if (options.sortBy) {
          data = await queries.fetchTopPosts(options.sortBy, options.limit);
        } else {
          data = await queries.fetchDashboardData(
            options.client || 'all', 
            options.dateRange || null
          );
        }

        setPosts(data);
      } catch (err) {
        setError('Errore nel caricamento dei dati');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [options.client, options.dateRange, options.sortBy, options.limit]);

  return { posts, loading, error };
} 