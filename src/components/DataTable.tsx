import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowUpDown } from "lucide-react"

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
  
  const postsPerPage = 20;

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

  return (
    <div className="space-y-4 w-full overflow-x-auto text-xs">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white cursor-pointer w-20 text-xs font-medium">
                <div className="flex items-center gap-1" onClick={() => handleSort('post_thumbnail')}>
                  <span className="whitespace-nowrap">Thumbs</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white cursor-pointer text-xs font-medium">
                <div className="flex items-center gap-1" onClick={() => handleSort('input_client')}>
                  <span className="whitespace-nowrap">Cliente</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white cursor-pointer max-w-[200px] text-xs font-medium">
                <div className="flex items-center gap-1" onClick={() => handleSort('input_title')}>
                  <span className="whitespace-nowrap">Titolo</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white cursor-pointer text-xs font-medium" onClick={() => handleSort('platform')}>
                Platform <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-white cursor-pointer text-xs font-medium" onClick={() => handleSort('post_view_count')}>
                Views <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-white cursor-pointer text-xs font-medium" onClick={() => handleSort('post_like_count')}>
                Likes <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-white cursor-pointer text-xs font-medium" onClick={() => handleSort('post_comment_count')}>
                Comments <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-white cursor-pointer text-xs font-medium" onClick={() => handleSort('post_published_at')}>
                Data Pubblicazione <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
              <TableHead className="text-white cursor-pointer text-xs font-medium" onClick={() => handleSort('post_creator_name')}>
                Creator <ArrowUpDown className="inline h-3 w-3" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPosts.map((post) => (
              <TableRow key={post.input_id}>
                <TableCell className="text-white text-xs">
                  <a
                    href={post.input_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={post.post_thumbnail} 
                      alt={post.input_title}
                      className="w-12 h-12 object-cover rounded cursor-pointer"
                    />
                  </a>
                </TableCell>
                <TableCell className="text-white text-xs">{post.input_client}</TableCell>
                <TableCell className="text-white max-w-[200px] truncate text-xs">
                  <a
                    href={post.input_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {post.input_title}
                  </a>
                </TableCell>
                <TableCell className="text-white text-xs">{post.platform}</TableCell>
                <TableCell className="text-white text-xs">{post.post_view_count.toLocaleString()}</TableCell>
                <TableCell className="text-white text-xs">{post.post_like_count.toLocaleString()}</TableCell>
                <TableCell className="text-white text-xs">{post.post_comment_count.toLocaleString()}</TableCell>
                <TableCell className="text-white text-xs">{format(new Date(post.post_published_at), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="text-white text-xs">{post.post_creator_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationPrevious 
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} 
          aria-disabled={currentPage === 1}
          className="text-white text-xs data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none" 
        />
        <PaginationContent className="text-white text-xs">
          Pagina {currentPage} di {Math.max(1, totalPages)}
        </PaginationContent>
        <PaginationNext 
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} 
          aria-disabled={currentPage === totalPages || totalPages === 0}
          className="text-white text-xs data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none" 
        />
      </Pagination>
    </div>
  )
} 