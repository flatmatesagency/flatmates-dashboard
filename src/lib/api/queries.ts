import { supabase } from '../supabase';
import { DateRange } from 'react-day-picker';

export interface Post {
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
  engagementRate?: number;
}

export const queries = {
  // Query per il dashboard
  async fetchDashboardData(selectedClient: string, dateRange: DateRange | null) {
    let query = supabase.from('combined_data').select('*');
    
    if (selectedClient !== 'all') {
      query = query.eq('input_client', selectedClient);
    }

    if (dateRange?.from && dateRange?.to) {
      query = query
        .gte('post_published_at', dateRange.from.toISOString())
        .lte('post_published_at', dateRange.to.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Query per il pannello admin
  async fetchAdminData() {
    const { data, error } = await supabase
      .from('Input Tablev2')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Query per i dati delle piattaforme social
  async fetchPlatformData(platform: string, postId: number) {
    const tableName = {
      youtube: 'Youtube Data',
      instagram: 'Instagram Data',
      tiktok: 'Tiktok Data'
    }[platform.toLowerCase()];

    if (!tableName) throw new Error('Piattaforma non supportata');

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', postId)
      .order('Insert_Timestamp', { ascending: true })
      .limit(30);

    if (error) throw error;
    return data;
  },

  async fetchClients() {
    const { data, error } = await supabase
      .from('combined_data')
      .select('input_client')
      .order('input_client');

    if (error) throw error;
    return Array.from(new Set(data.map(item => item.input_client)));
  },

  async fetchRecentPosts(limit = 5) {
    const { data, error } = await supabase
      .from('combined_data')
      .select('*')
      .order('post_published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async fetchTopPosts(metric: 'views' | 'likes' | 'comments', limit = 3) {
    const orderColumn = {
      views: 'post_view_count',
      likes: 'post_like_count',
      comments: 'post_comment_count'
    }[metric];

    const { data, error } = await supabase
      .from('combined_data')
      .select('*')
      .order(orderColumn, { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}; 