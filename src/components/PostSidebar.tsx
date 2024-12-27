import React, { useEffect, useState } from 'react';
import { FaEye, FaThumbsUp, FaComment, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
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
  created_at: string;
}

interface PostSidebarProps {
  post: Post;
  onClose: () => void;
}

interface PlatformData {
  id?: number;
  input_id?: number;
  shortCode?: string;
  Insert_Timestamp?: string;
  
  // YouTube Data
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  
  // Instagram Data
  videoViewCount?: number;
  likesCount?: number;
  commentsCount?: number;
  
  // TikTok Data
  video_view_count?: number;
  like_count?: number;
  comment_count?: number;
}

type MetricType = 'viewCount' | 'likeCount' | 'commentCount';

interface TimeRange {
  label: string;
  days: number;
}

const TIME_RANGES: TimeRange[] = [
  { label: '7 giorni', days: 7 },
  { label: '14 giorni', days: 14 },
  { label: '30 giorni', days: 30 },
  { label: '90 giorni', days: 90 },
  { label: 'Max', days: -1 }
];

const formatMetric = (value: number): string => {
  if (!value) return '0';
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
  });
};

const formatFullDate = (dateString: string | null): string => {
  console.log('formatFullDate input:', dateString);
  if (!dateString) {
    console.log('dateString is null/undefined');
    return 'Data non disponibile';
  }
  const date = new Date(dateString);
  console.log('parsed date:', date);
  if (isNaN(date.getTime())) {
    console.log('Invalid date');
    return 'Data non valida';
  }
  
  const formatted = date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  console.log('formatted date:', formatted);
  return formatted;
};

const METRIC_LABELS = {
  viewCount: 'Visualizzazioni',
  likeCount: 'Like',
  commentCount: 'Commenti'
};

const calculateGrowth = (data: PlatformData[], allData: PlatformData[], metric: MetricType, platform: string) => {
  if (data.length < 2) return { percentage: 0, absolute: 0 };
  
  const metricField = getMetricField(platform, metric);
  // Usa sempre il primo record da allData per il valore iniziale
  const oldValue = Number(allData[0][metricField as keyof PlatformData]) || 0;
  const newValue = Number(data[data.length - 1][metricField as keyof PlatformData]) || 0;
  const absolute = newValue - oldValue;
  const percentage = oldValue === 0 ? 0 : (absolute / oldValue) * 100;
  
  return {
    percentage: percentage,
    absolute: absolute
  };
};

const getMetricField = (platform: string, metric: MetricType): string => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return metric; // viewCount, likeCount, commentCount
    case 'instagram':
      switch (metric) {
        case 'viewCount': return 'videoViewCount';
        case 'likeCount': return 'likesCount';
        case 'commentCount': return 'commentsCount';
      }
      break;
    case 'tiktok':
      switch (metric) {
        case 'viewCount': return 'video_view_count';
        case 'likeCount': return 'like_count';
        case 'commentCount': return 'comment_count';
      }
      break;
  }
  return metric;
};

const PostSidebar: React.FC<PostSidebarProps> = ({ post, onClose }) => {
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [allPlatformData, setAllPlatformData] = useState<PlatformData[]>([]);
  const [firstInsertDate, setFirstInsertDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('viewCount');
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(30);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let tableName = '';
        let idField = 'id';

        switch (post.platform?.toLowerCase()) {
          case 'youtube':
            tableName = 'Youtube Data';
            break;
          case 'instagram':
            tableName = 'Instagram Data';
            idField = 'shortCode';
            break;
          case 'tiktok':
            tableName = 'Tiktok Data';
            break;
          default:
            console.error('Piattaforma non supportata');
            return;
        }

        // Ottieni tutti i dati non filtrati
        const { data: allData, error: allDataError } = await supabase
          .from(tableName)
          .select('*')
          .eq(idField, post.input_id)
          .order('Insert_Timestamp', { ascending: true });

        if (allDataError) {
          console.error('Errore nel recupero di tutti i dati:', allDataError);
          return;
        }

        setAllPlatformData(allData || []); // Salva tutti i dati
        setFirstInsertDate(allData?.[0]?.Insert_Timestamp || null);

        // Filtra i dati per il periodo selezionato
        const filteredData = selectedTimeRange !== -1
          ? (allData || []).filter(item => {
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - selectedTimeRange);
              return new Date(item.Insert_Timestamp || '') >= startDate;
            })
          : allData || [];

        setPlatformData(filteredData);
      } catch (err) {
        console.error('Errore:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [post.input_id, post.platform, selectedTimeRange]);

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

    const selectedMetricField = getMetricField(post.platform, selectedMetric);

    return (
      <div className="mt-8">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Andamento nel Tempo</h3>
          <div className="flex gap-4 items-center">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
              className="bg-[#0a0d4c] text-white p-2 rounded-lg text-sm"
            >
              {TIME_RANGES.map((range) => (
                <option key={range.days} value={range.days}>
                  {range.label}
                </option>
              ))}
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
              className="bg-[#0a0d4c] text-white p-2 rounded-lg text-sm"
            >
              <option value="viewCount">Visualizzazioni</option>
              <option value="likeCount">Like</option>
              <option value="commentCount">Commenti</option>
            </select>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformData}>
              <XAxis 
                dataKey="Insert_Timestamp" 
                stroke="#fff"
                tick={{ fill: '#fff' }}
                tickFormatter={formatDate}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#fff"
                tick={{ fill: '#fff' }}
                tickFormatter={formatMetric}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0d4c', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [formatMetric(value), METRIC_LABELS[selectedMetric]]}
                labelFormatter={(label) => formatDate(label as string)}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetricField}
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
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
      onClick={handleOverlayClick}
    >
      <div className="fixed top-0 right-0 h-full w-[70%] bg-[#050739] border-l border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto z-[10000]">
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <FaTimes size={24} />
          </button>

          <div className="flex gap-6">
            <div className="w-1/2">
              <div className="relative group">
                <img
                  src={post.post_thumbnail}
                  alt="Post thumbnail"
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <a
                  href={post.input_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                >
                  <div className="flex items-center gap-2 bg-[#050739] px-4 py-2 rounded-lg text-white">
                    <FaExternalLinkAlt size={16} />
                    <span>Apri Video</span>
                  </div>
                </a>
              </div>
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
                <div className="text-white">
                  <p className="font-bold">Data Pubblicazione</p>
                  <p>{formatFullDate(post.post_published_at)}</p>
                </div>
                <div className="text-white">
                  <p className="font-bold">Data Inserimento</p>
                  <p>
                    {firstInsertDate 
                      ? formatFullDate(firstInsertDate)
                      : 'Data non disponibile'
                    }
                  </p>
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
                {(['viewCount', 'likeCount', 'commentCount'] as MetricType[]).map((metric) => {
                  const growth = calculateGrowth(platformData, allPlatformData, metric, post.platform);
                  const metricField = getMetricField(post.platform, metric) as keyof PlatformData;
                  const currentValue = platformData[platformData.length - 1]?.[metricField] || 0;
                  const isPositive = growth.absolute >= 0;
                  
                  return (
                    <div key={metric} className="bg-[#0a0d4c] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-300">
                        {metric === 'viewCount' && <FaEye />}
                        {metric === 'likeCount' && <FaThumbsUp />}
                        {metric === 'commentCount' && <FaComment />}
                        <p>{METRIC_LABELS[metric]}</p>
                      </div>
                      <p className="text-white text-xl font-bold mb-2">
                        {formatMetric(Number(currentValue))}
                      </p>
                      <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        <span>{isPositive ? '↑' : '↓'} </span>
                        <span>{Math.abs(growth.percentage).toFixed(1)}% </span>
                        <span className="text-gray-400">
                          ({isPositive ? '+' : ''}{formatMetric(growth.absolute)})
                        </span>
                      </div>
                    </div>
                  );
                })}
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