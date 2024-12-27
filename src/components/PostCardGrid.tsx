import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaEye, FaThumbsUp, FaComment, FaInstagram, FaYoutube } from 'react-icons/fa';
import PostSidebar from './PostSidebar';

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
  created_at: string;
}

interface PostCardGridProps {
  posts: Post[];
  maxPosts?: number;
}

const PostCardGrid: React.FC<PostCardGridProps> = ({ posts = [], maxPosts }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const displayPosts = maxPosts ? posts.slice(0, maxPosts) : posts;

  const handlePostClick = (e: React.MouseEvent, post: Post) => {
    e.preventDefault();
    setSelectedPost(post);
  };

  console.log('maxPosts:', maxPosts);
  console.log('displayPosts length:', displayPosts.length);

  return (
    <div className="relative flex">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-gray-700 pb-6 mb-6">
        {displayPosts.map((post) => (
          <a 
            key={post.input_id} 
            href={post.input_link} 
            onClick={(e) => handlePostClick(e, post)}
            className="block hover:opacity-80 transition-opacity"
          >
            <Card key={post.input_id} className="w-full max-w-sm flex flex-col justify-between bg-transparent text-white overflow-hidden border-none">
              <CardHeader className="relative flex items-center justify-center h-52 p-0 m-0">
                <div className="relative w-full h-40">
                  <img
                    src={post.platform === 'Instagram' 
                      ? `https://cors-anywhere.herokuapp.com/${post.post_thumbnail}` 
                      : post.post_thumbnail
                    }
                    alt="Post thumbnail"
                    className="w-full h-full object-cover filter grayscale contrast-125 hover:filter-none transition-all duration-300 p-0"
                  />
                  <div className="absolute inset-0 bg-[#050739] opacity-40 hover:opacity-0 transition-all duration-300"></div>
                  
                  <div className="absolute top-2 right-2 p-1 rounded-full">
                    {post.platform === 'Instagram' && (
                      <FaInstagram className="text-3xl" style={{ color: '#E5E6FC' }} />
                    )}
                    {post.platform === 'YouTube' && (
                      <FaYoutube className="text-3xl" style={{ color: '#E5E6FC' }} />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 flex flex-col justify-between flex-1">
                <CardTitle className="text-base font-medium mb-2 text-center text-white hover:text-yellow-400 transition-colors duration-300">{post.input_title}</CardTitle>
                <p className="text-xs mb-4 text-gray-400">
                  {post.post_description.length > 100
                    ? `${post.post_description.substring(0, 100)}...`
                    : post.post_description}
                </p>
                <div className="flex justify-between text-sm text-gray-300 mb-4">
                  <p>
                    <strong>Client</strong>
                    <p>{post.input_client}</p>
                  </p>
                  <p>
                    <strong>Creator</strong>
                    <p>{post.post_creator_name}</p>
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm text-white">
                    <span className="flex items-center gap-1 font-bold">
                      <FaEye className='text-white' /> {post.post_view_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <FaThumbsUp className='text-white' /> {post.post_like_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <FaComment className='text-white' /> {post.post_comment_count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {selectedPost && (
        <PostSidebar 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
};

export default PostCardGrid; 