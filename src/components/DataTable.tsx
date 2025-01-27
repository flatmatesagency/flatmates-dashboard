import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { useState, useEffect, useCallback } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowUpDown } from "lucide-react"
import { supabase } from '@/lib/supabase'

interface Post {
  input_id: string;
  input_client: string;
  input_title: string;
  platform: string;
  post_thumbnail: string;
  post_view_count: number;
  post_like_count: number;
  post_comment_count: number;
  post_published_at: string;
  post_creator_name: string;
  input_link: string;
}

interface DataTableProps {
  posts: Post[];
}

export function DataTable({ posts }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Post;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>({});
  
  const postsPerPage = 20;

  const getInstagramThumbnailUrl = useCallback(async (originalUrl: string) => {
    try {
      const baseFileName = originalUrl.split('/').pop()?.split('?')[0];
      const fileName = `instagram_${baseFileName}`;
      
      const { data } = await supabase
        .storage
        .from('Instagram Thumbnails')
        .getPublicUrl(fileName);
      
      if (!data?.publicUrl) {
        return originalUrl;
      }
      
      return data.publicUrl;
    } catch (err) {
      console.error('Errore durante la richiesta del thumbnail:', err);
      return originalUrl;
    }
  }, []);

  const handleSort = (key: keyof Post) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    let isMounted = true;

    const loadThumbnails = async () => {
      const newUrls: { [key: string]: string } = {};
      const instagramPosts = currentPosts.filter(post => post.platform === 'Instagram');
      
      for (const post of instagramPosts) {
        if (!thumbnailUrls[post.input_id]) {
          const url = await getInstagramThumbnailUrl(post.post_thumbnail);
          if (url !== post.post_thumbnail) {
            newUrls[post.input_id] = url;
          }
        }
      }
      
      if (isMounted && Object.keys(newUrls).length > 0) {
        setThumbnailUrls(prev => ({...prev, ...newUrls}));
      }
    };

    loadThumbnails();

    return () => {
      isMounted = false;
    };
  }, [currentPosts, getInstagramThumbnailUrl]);

  return (
    <div className="space-y-4 w-full overflow-x-auto text-xs">
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted/70">
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('input_title')}>
                Titolo <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('input_client')}>
                Cliente <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('platform')}>
                Platform <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('post_view_count')}>
                Views <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('post_like_count')}>
                Likes <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('post_comment_count')}>
                Comments <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('post_published_at')}>
                Data Pubblicazione <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-card-foreground cursor-pointer text-xs font-medium" onClick={() => handleSort('post_creator_name')}>
                Creator <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPosts.map((post) => (
              <TableRow key={post.input_id} className="border-b border-border hover:bg-muted/50">
                <TableCell className="text-card-foreground text-xs">{post.input_title}</TableCell>
                <TableCell className="text-card-foreground text-xs">{post.input_client}</TableCell>
                <TableCell className="text-card-foreground text-xs">{post.platform}</TableCell>
                <TableCell className="text-card-foreground text-xs">{post.post_view_count.toLocaleString()}</TableCell>
                <TableCell className="text-card-foreground text-xs">{post.post_like_count.toLocaleString()}</TableCell>
                <TableCell className="text-card-foreground text-xs">{post.post_comment_count.toLocaleString()}</TableCell>
                <TableCell className="text-card-foreground text-xs">{format(new Date(post.post_published_at), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="text-card-foreground text-xs">{post.post_creator_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationPrevious 
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} 
          aria-disabled={currentPage === 1}
          className="text-card-foreground text-xs data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none" 
        />
        <PaginationContent className="text-card-foreground text-xs">
          Pagina {currentPage} di {Math.max(1, totalPages)}
        </PaginationContent>
        <PaginationNext 
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} 
          aria-disabled={currentPage === totalPages || totalPages === 0}
          className="text-card-foreground text-xs data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none" 
        />
      </Pagination>
    </div>
  )
} 