import { Post } from '../api/queries';

export interface Stats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
  averageViewsPerPost: number;
}

export function calculateStats(posts: Post[]): Stats {
  const initialStats = {
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    engagementRate: 0,
    averageViewsPerPost: 0
  };

  if (!posts.length) return initialStats;

  const stats = posts.reduce((acc, post) => {
    acc.totalViews += post.post_view_count;
    acc.totalLikes += post.post_like_count;
    acc.totalComments += post.post_comment_count;
    return acc;
  }, {...initialStats});

  stats.engagementRate = ((stats.totalLikes + stats.totalComments) / stats.totalViews) * 100;
  stats.averageViewsPerPost = stats.totalViews / posts.length;

  return stats;
} 