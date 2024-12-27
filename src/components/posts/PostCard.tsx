import { Post } from '@/lib/api/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaEye, FaThumbsUp, FaComment, FaInstagram, FaYoutube } from 'react-icons/fa';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const PlatformIcon = {
    Instagram: FaInstagram,
    YouTube: FaYoutube
  }[post.platform] || null;

  return (
    <Card className="overflow-hidden bg-transparent border-gray-800">
      <CardHeader className="relative p-0">
        <div className="relative aspect-video">
          <img
            src={post.post_thumbnail}
            alt={post.input_title}
            className="w-full h-full object-cover"
          />
          {PlatformIcon && (
            <div className="absolute top-2 right-2">
              <PlatformIcon className="text-2xl text-white" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">
          {post.input_title}
        </CardTitle>
        
        <div className="text-sm text-gray-400 mb-4">
          <div>Cliente: {post.input_client}</div>
          <div>Creator: {post.post_creator_name}</div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <FaEye /> {post.post_view_count.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <FaThumbsUp /> {post.post_like_count.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <FaComment /> {post.post_comment_count.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 