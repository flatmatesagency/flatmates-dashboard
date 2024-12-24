import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaEye, FaThumbsUp, FaComment, FaInstagram, FaYoutube } from 'react-icons/fa';

interface Post {
  input_id: number;
  post_thumbnail: string;
  input_title: string;
  post_description: string;
  post_view_count: number;
  post_like_count: number;
  post_comment_count: number;
  input_client: string;
  post_creator_name: string;
  platform: string;
  engagementRate?: number;
}

interface TopSocialCardsProps {
  posts: Post[];
  title: string;
}

const TopSocialCards: React.FC<TopSocialCardsProps> = ({ posts = [], title }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.input_id} className="w-full bg-transparent text-white overflow-hidden border-none">
            <CardHeader className="relative flex items-center justify-center h-40 p-0 m-0">
              <div className="relative w-full h-full">
                <img
                  src={post.platform === 'Instagram' && post.post_thumbnail
                    ? `https://cors-anywhere.herokuapp.com/${post.post_thumbnail}` 
                    : post.post_thumbnail || '/placeholder-image.jpg'
                  }
                  alt="Post thumbnail"
                  className="w-full h-full object-cover filter grayscale contrast-125 hover:filter-none transition-all duration-300"
                />
                <div className="absolute inset-0 bg-[#050739] opacity-40 hover:opacity-0 transition-all duration-300"></div>
                <div className="absolute top-2 right-2 p-1 rounded-full">
                  {post.platform === 'Instagram' && <FaInstagram className="text-3xl" style={{ color: '#E5E6FC' }} />}
                  {post.platform === 'YouTube' && <FaYoutube className="text-3xl" style={{ color: '#E5E6FC' }} />}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium mb-2 text-white hover:text-yellow-400 transition-colors duration-300">
                {post.input_title.length > 50 ? `${post.input_title.substring(0, 50)}...` : post.input_title}
              </CardTitle>
              <div className="flex justify-between text-sm text-white mt-2">
                <span className="flex items-center gap-1">
                  <FaEye /> {post.post_view_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <FaThumbsUp /> {post.post_like_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <FaComment /> {post.post_comment_count.toLocaleString()}
                </span>
              </div>
              {post.engagementRate && (
                <div className="mt-2 text-sm text-white">
                  Engagement Rate: {post.engagementRate.toFixed(2)}%
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopSocialCards; 