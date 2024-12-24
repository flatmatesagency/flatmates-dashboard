import React, { useEffect, useState } from 'react';
import { FaEye, FaThumbsUp, FaComment, FaTimes } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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

interface PostSidebarProps {
  post: Post;
  onClose: () => void;
}

interface PlatformData {
  id: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  Insert_Timestamp?: string;
  // altri campi specifici per piattaforma...
}

type MetricType = 'viewCount' | 'likeCount' | 'commentCount';

const PostSidebar: React.FC<PostSidebarProps> = ({ post, onClose }) => {
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('viewCount');

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        setLoading(true);
        let tableName = '';
        
        switch (post.platform?.toLowerCase()) {
          case 'youtube':
            tableName = 'Youtube Data';
            break;
          case 'instagram':
            tableName = 'Instagram Data';
            break;
          case 'tiktok':
            tableName = 'Tiktok Data';
            break;
          default:
            console.error('Piattaforma non supportata');
            return;
        }

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', post.input_id)
          .order('Insert_Timestamp', { ascending: true })
          .limit(30); // Ultimi 30 record

        if (error) {
          console.error('Errore nel recupero dei dati:', error);
          return;
        }

        setPlatformData(data || []);
      } catch (err) {
        console.error('Errore:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformData();
  }, [post.input_id, post.platform]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const truncateDescription = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const renderChart = () => {
    if (!platformData.length) return null;

    return (
      <div className="mt-8">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Andamento nel Tempo</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="bg-[#0a0d4c] text-white p-2 rounded-lg"
          >
            <option value="viewCount">Visualizzazioni</option>
            <option value="likeCount">Like</option>
            <option value="commentCount">Commenti</option>
          </select>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformData}>
              <XAxis 
                dataKey="Insert_Timestamp" 
                stroke="#fff"
                tick={{ fill: '#fff' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                stroke="#fff"
                tick={{ fill: '#fff' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0d4c', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric}
                stroke="#E5E6FC" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={handleOverlayClick}
    >
      <div className="fixed top-0 right-0 h-full w-[70%] bg-[#050739] border-l border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto z-50">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <FaTimes size={24} />
          </button>

          <div className="flex gap-6">
            <div className="w-1/2">
              <img
                src={post.post_thumbnail}
                alt="Post thumbnail"
                className="w-full aspect-video object-cover rounded-lg"
              />
            </div>

            <div className="w-1/2">
              <h2 className="text-xl font-bold text-white mb-4">{post.input_title}</h2>
              <p className="text-gray-300 mb-6">
                {truncateDescription(post.post_description)}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-white">
                  <p className="font-bold">Client</p>
                  <p>{post.input_client}</p>
                </div>
                <div className="text-white">
                  <p className="font-bold">Creator</p>
                  <p>{post.post_creator_name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Statistiche della Piattaforma</h3>
            {loading ? (
              <p className="text-white">Caricamento statistiche...</p>
            ) : platformData ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0a0d4c] p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaEye />
                    <p>Views</p>
                  </div>
                  <p className="text-white text-xl font-bold">
                    {platformData[platformData.length - 1]?.viewCount || 0}
                  </p>
                </div>
                <div className="bg-[#0a0d4c] p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaThumbsUp />
                    <p>Likes</p>
                  </div>
                  <p className="text-white text-xl font-bold">
                    {platformData[platformData.length - 1]?.likeCount || 0}
                  </p>
                </div>
                <div className="bg-[#0a0d4c] p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaComment />
                    <p>Comments</p>
                  </div>
                  <p className="text-white text-xl font-bold">
                    {platformData[platformData.length - 1]?.commentCount || 0}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-white">Nessun dato disponibile</p>
            )}
          </div>

          {loading ? (
            <p className="text-white">Caricamento dati...</p>
          ) : (
            renderChart()
          )}
        </div>
      </div>
    </div>
  );
};

export default PostSidebar; 