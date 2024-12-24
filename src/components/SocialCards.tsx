import React, { useState, useEffect } from 'react'; 
import PostCardGrid from './PostCardGrid';
import { supabase } from '@/lib/supabase';

// Define the type of a post object
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
}

type SortKey = keyof Pick<Post, 'post_view_count' | 'post_like_count' | 'post_comment_count'>;

const SocialPostCards: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | ''>('');
  
  // Define state for filters
  const [inputClientFilter, setInputClientFilter] = useState<string>('');
  const [youtubeChannelTitleFilter, setYoutubeChannelTitleFilter] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>(''); // Added platform filter

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('combined_data')
        .select('*')
        .order('post_published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', err.message);
    } finally {
      setLoading(false);
    }
  }

  // Extract unique values for dropdowns
  const uniqueInputClients = youtubeChannelTitleFilter ? Array.from(new Set(posts.filter(post => post.post_creator_name === youtubeChannelTitleFilter).map(post => post.input_client))) : Array.from(new Set(posts.map(post => post.input_client)));
  const uniqueYoutubeChannelTitles = inputClientFilter ? Array.from(new Set(posts.filter(post => post.input_client === inputClientFilter).map(post => post.post_creator_name))) : Array.from(new Set(posts.map(post => post.post_creator_name)));

  // Apply filters to the posts
  let filteredPosts = posts.filter((post) => {
    const inputClientMatches = inputClientFilter ? post.input_client === inputClientFilter : true;
    const youtubeChannelMatches = youtubeChannelTitleFilter ? post.post_creator_name === youtubeChannelTitleFilter : true;
    const platformMatches = platformFilter ? post.platform === platformFilter : true; // New platform filter logic
    return inputClientMatches && youtubeChannelMatches && platformMatches;
  });

  // Apply sorting to the posts
  if (sortKey) {
    filteredPosts = [...filteredPosts].sort((a, b) => b[sortKey] - a[sortKey]);
  }

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-2">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
        <select
          value={inputClientFilter}
          onChange={(e) => { setInputClientFilter(e.target.value); setYoutubeChannelTitleFilter(''); }}
          className="bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
        >
          <option value="">All Clients</option>
          {uniqueInputClients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>

        <select
          value={youtubeChannelTitleFilter} onChange={(e) => { setYoutubeChannelTitleFilter(e.target.value); setInputClientFilter(''); }} className="bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
        >
          <option value="">All Creators</option>
          {uniqueYoutubeChannelTitles.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>

        {/* Platform Filter Dropdown */}
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
        >
          <option value="">All Platforms</option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
        </select>
      </div>

      {/* Sorting Buttons Section */}
      <div className="flex gap-4 mb-6 items-center justify-center">
        <button
          onClick={() => setSortKey('post_view_count')}
          className="bg-transparent text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
        >
          Sort by Views
        </button>
        <button
          onClick={() => setSortKey('post_like_count')}
          className="bg-transparent text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
        >
          Sort by Likes
        </button>
        <button
          onClick={() => setSortKey('post_comment_count')}
          className="bg-transparent text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
        >
          Sort by Comments
        </button>
      </div>
      {/* Posts Section using new component */}
      <PostCardGrid posts={filteredPosts as any} />
    </div>
  );
};

export default SocialPostCards;
