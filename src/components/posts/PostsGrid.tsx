import { Post } from '@/lib/api/queries';
import { PostCard } from '@/components/posts/PostCard';

interface PostsGridProps {
  posts: Post[];
}

export function PostsGrid({ posts }: PostsGridProps) {
  if (!posts.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nessun post trovato
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.input_id} post={post} />
      ))}
    </div>
  );
} 