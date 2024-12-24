import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/carddashboard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import RecentPosts from '@/components/recent-posts';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PieChartComponent } from '@/components/PieChart';// Assicurati che il percorso sia corretto

import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { DatePickerWithRange } from './ui/daterangepicker';
import PostCardGrid from './PostCardGrid';
import { DataTable } from './DataTable';
import { FaEye, FaThumbsUp, FaComment } from 'react-icons/fa';

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


export default function DashboardPage() {
  const { user } = useAuth()
  const [, setPosts] = useState<Post[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [engagementRate, setEngagementRate] = useState<number>(0);
  const [, setLikeToViewRatio] = useState<number>(0);
  const [, setCommentToViewRatio] = useState<number>(0);
  const [, setAverageViewsPerPost] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [] = useState<Date | undefined>(undefined);
  const [pieChartData, setPieChartData] = useState([
    { name: 'Instagram', value: 0 },
    { name: 'TikTok', value: 0 },
    { name: 'YouTube', value: 0 },
  ]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31')
  });
 // const [costo, setCosto] = useState<number>(0);
  //const [CPM, setCPM] = useState<number>(0);
  //const [CPE, setCPE] = useState<number>(0);
  //const [topViewsPosts, setTopViewsPosts] = useState<Post[]>([]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toFixed(0);
    }
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(2) + '%';
  };

  useEffect(() => {
    if (!user) return;
    fetchPosts();
    fetchClients();
    updatePieChartData();
    updateKPIs();
  }, [selectedClient, dateRange, user]);

  async function fetchClients() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('combined_data')
        .select('input_client')
        .order('input_client');

      if (error) throw error;

      const clientSet = new Set(data.map(item => item.input_client));
      const clientList = Array.from(clientSet).filter(client => client !== null && client !== '');
      setClients(['all', ...clientList]);
    } catch (err) {
      console.error('Errore nel recupero dei clienti:', err);
    }
  }

  async function fetchPosts() {
    if (!user) return;
    try {
      setLoading(true);
      
      let query = supabase
        .from('combined_data')
        .select('*');

      if (selectedClient !== 'all') {
        query = query.eq('input_client', selectedClient);
      }

      if (dateRange.start && dateRange.end) {
        query = query
          .gte('post_published_at', dateRange.start.toISOString())
          .lte('post_published_at', dateRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setFilteredPosts(data || []);
      setPosts(data || []);
    } catch (err: any) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const calculateKPIs = (posts: Post[]) => {
    if (posts.length === 0) return;

    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalCost = 0;

    posts.forEach((post) => {
      totalViews += Number(post.post_view_count) || 0;
      totalLikes += Number(post.post_like_count) || 0;
      totalComments += Number(post.post_comment_count) || 0;
      totalCost += 0;
    });

    setTotalViews(totalViews);
    setTotalLikes(totalLikes);
    setTotalComments(totalComments);

    // Engagement Rate
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
    setEngagementRate(engagementRate);

    // Like to View Ratio
    const likeToViewRatio = totalViews > 0 ? totalLikes / totalViews : 0;
    setLikeToViewRatio(likeToViewRatio);

    // Comment to View Ratio
    const commentToViewRatio = totalViews > 0 ? totalComments / totalViews : 0;
    setCommentToViewRatio(commentToViewRatio);

    // Average Views per Post
    const averageViews = posts.length > 0 ? totalViews / posts.length : 0;
    setAverageViewsPerPost(averageViews);

    // Costo
    //setCosto(totalCost);

    // CPM (Costo per Mille)
    //const CPM = totalViews > 0 ? (totalCost / totalViews) * 1000 : 0;
    //setCPM(CPM);

    // CPE (Costo per Engagement)
    //const totalEngagements = totalLikes + totalComments;
    //const CPE = totalEngagements > 0 ? totalCost / totalEngagements : 0;
    //setCPE(CPE);
  };

  const updatePieChartData = async () => {
    if (!user) return;
    try {
      let query = supabase
        .from('combined_data')
        .select('platform, post_view_count')

      if (selectedClient !== 'all') {
        query = query.eq('input_client', selectedClient);
      }

      if (dateRange.start && dateRange.end) {
        query = query
          .gte('post_published_at', dateRange.start.toISOString())
          .lte('post_published_at', dateRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const platformData = data.reduce<Record<string, number>>((acc, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + item.post_view_count;
        return acc;
      }, {});

      const newPieChartData = Object.entries(platformData).map(([name, value]) => ({ name, value }));
      setPieChartData(newPieChartData);
    } catch (err) {
      console.error('Errore nell\'aggiornamento dei dati del grafico:', err);
    }
  };


  async function updateKPIs() {
    try {
      let query = supabase
        .from('combined_data')
        .select('*');

      if (selectedClient !== 'all') {
        query = query.eq('input_client', selectedClient);
      }

      if (dateRange.start && dateRange.end) {
        query = query
          .gte('post_published_at', dateRange.start.toISOString())
          .lte('post_published_at', dateRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Reset dei KPI se non ci sono dati
      if (!data || data.length === 0) {
        setTotalViews(0);
        setTotalLikes(0);
        setTotalComments(0);
        setEngagementRate(0);
        setLikeToViewRatio(0);
        setCommentToViewRatio(0);
        setAverageViewsPerPost(0);
        //setCosto(0);
        //setCPM(0);
        //setCPE(0);
        return;
      }

      calculateKPIs(data);
    } catch (err) {
      console.error('Errore nell\'aggiornamento dei KPI:', err);
      // Reset dei KPI in caso di errore
      setTotalViews(0);
      setTotalLikes(0);
      setTotalComments(0);
      setEngagementRate(0);
      setLikeToViewRatio(0);
      setCommentToViewRatio(0);
      setAverageViewsPerPost(0);
      //setCosto(0);
      //setCPM(0);
      //setCPE(0);
    }
  }

  return (
    <>
      <div className="flex-1 space-y-6">

        {/* Filtri che diventano sticky con opacità */}
        <div className="sticky top-[60px] z-50 bg-background/80 backdrop-blur-sm border-y border-border px-6 py-3">
          <div className="flex items-center justify-end space-x-3 max-w-[1500px] mx-auto">
            <Select onValueChange={(value) => setSelectedClient(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleziona cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client === 'all' ? 'Tutti i clienti' : client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePickerWithRange
              onChange={(range: import("react-day-picker").DateRange | undefined) => {
                if (range?.from && range?.to) {
                  const start = new Date(range.from);
                  const end = new Date(range.to);
                  end.setHours(23, 59, 59, 999);
                  setDateRange({
                    start,
                    end,
                  });
                } else {
                  setDateRange({
                    start: null,
                    end: null,
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Contenuto principale */}
        <div className="p-6 md:p-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="text-white px-4 py-2">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                {/* Total Views Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                      <FaEye className="text-lg" /> Total Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{formatNumber(totalViews)}</div>
                  </CardContent>
                </Card>

                {/* Likes Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                      <FaThumbsUp className="text-lg" /> Likes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{formatNumber(totalLikes)}</div>
                  </CardContent>
                </Card>

                {/* Comments Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                      <FaComment className="text-lg" /> Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{formatNumber(totalComments)}</div>
                  </CardContent>
                </Card>

                {/* Engagement Rate Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{formatPercentage(engagementRate)}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-xl">Distribuzione delle Visualizzazioni per Piattaforma</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 text-white">
                    <PieChartComponent data={pieChartData} />
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-xl">Post Recenti</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 text-white">
                    <RecentPosts 
                      selectedClient={selectedClient} 
                      dateRange={dateRange}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-xl">Top 3 Posts per Visualizzazioni</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostCardGrid 
                      posts={[...filteredPosts].sort((a, b) => b.post_view_count - a.post_view_count)} 
                      maxPosts={3} 
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-xl">Top 3 Posts per Like</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostCardGrid 
                      posts={[...filteredPosts].sort((a, b) => b.post_like_count - a.post_like_count)} 
                      maxPosts={3} 
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-xl">Tutti i Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable posts={filteredPosts.map(post => ({...post, input_id: post.input_id.toString()}))} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}