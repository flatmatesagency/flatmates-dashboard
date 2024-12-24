import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

interface Post {
  input_id: number;
  post_thumbnail: string;
  input_title: string;
  input_link: string;
  post_description: string;
  post_view_count: number;
  post_like_count: number;
  post_comment_count: number;
  input_client: string;
  post_creator_name: string;
  platform: string;
  post_published_at: string;
}

interface RecentPostsProps {
  selectedClient: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export default function RecentPosts({ selectedClient, dateRange }: RecentPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        let query = supabase
          .from('combined_data')
          .select('*')
          .order('post_published_at', { ascending: false });

        if (selectedClient !== 'all') {
          query = query.eq('input_client', selectedClient);
        }

        if (dateRange.start && dateRange.end) {
          query = query
            .gte('post_published_at', dateRange.start.toISOString())
            .lte('post_published_at', dateRange.end.toISOString());
        }

        query = query.limit(5);

        const { data, error } = await query;

        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    }

    fetchRecentPosts();
  }, [selectedClient, dateRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    } else {
      return views.toString();
    }
  };

  return (
    <div className="space-y-4 overflow-auto">
      {posts.map((post) => (
        <a
          key={post.input_id}
          href={post.input_link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={post.post_thumbnail} alt="Post Thumbnail" />
                <AvatarFallback>{post.input_client.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 overflow-hidden">
                <p className="text-sm font-medium leading-none truncate">{post.input_title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {post.post_creator_name} - {post.platform}
                </p>
                <p className="text-xs text-muted-foreground">
                  Pubblicato il: {formatDate(post.post_published_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center ml-4 text-sm font-medium text-muted-foreground">
              {formatViews(post.post_view_count)}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
