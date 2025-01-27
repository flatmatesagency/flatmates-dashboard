import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaEye, FaThumbsUp, FaComment, FaInstagram, FaYoutube } from 'react-icons/fa';
import PostSidebar from './PostSidebar';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/types';
import { styles } from '@/lib/styles';
import { cn } from '@/lib/utils';

interface PostCardGridProps {
  posts: Post[];
  maxPosts?: number;
}

const PostCardGrid: React.FC<PostCardGridProps> = ({ posts, maxPosts = Infinity }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>({});
  
  const displayPosts = posts.slice(0, maxPosts);

  const handlePostClick = (e: React.MouseEvent, post: Post) => {
    e.preventDefault();
    setSelectedPost(post);
  };

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

  useEffect(() => {
    let isMounted = true;

    const loadThumbnails = async () => {
      const newUrls: { [key: string]: string } = {};
      const instagramPosts = displayPosts.filter(post => post.platform === 'Instagram');
      
      const needsUpdate = instagramPosts.some(
        post => !thumbnailUrls[post.input_id]
      );
      
      if (!needsUpdate) return;

      for (const post of instagramPosts) {
        if (!thumbnailUrls[post.input_id]) {
          const url = await getInstagramThumbnailUrl(post.post_thumbnail);
          newUrls[post.input_id] = url;
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
  }, [displayPosts, getInstagramThumbnailUrl, thumbnailUrls]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-border pb-6 mb-6">
      {displayPosts.map((post) => (
        <Card 
          key={post.input_id} 
          className={cn(styles.postCard.wrapper, "cursor-pointer")}
          onClick={(e) => handlePostClick(e, post)}
        >
          <CardHeader className="relative flex items-center justify-center h-52 p-0 m-0">
            <div className={styles.postCard.imageWrapper}>
              <img
                src={post.platform === 'Instagram' 
                  ? thumbnailUrls[post.input_id] || post.post_thumbnail
                  : post.post_thumbnail
                }
                alt="Post thumbnail"
                className={styles.postCard.image}
              />
              <div className={styles.postCard.overlay}></div>
              
              <div className={styles.postCard.platformIcon}>
                {post.platform === 'Instagram' && (
                  <FaInstagram className="text-3xl" style={{ color: '#E5E6FC' }} />
                )}
                {post.platform === 'YouTube' && (
                  <FaYoutube className="text-3xl" style={{ color: '#E5E6FC' }} />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <CardTitle className={styles.postCard.title}>{post.input_title}</CardTitle>
            <p className={styles.postCard.description}>
              {post.post_description.length > 100
                ? `${post.post_description.substring(0, 100)}...`
                : post.post_description}
            </p>
            <div className={styles.postCard.metadata}>
              <div>
                <strong>Client</strong>
                <p>{post.input_client}</p>
              </div>
              <div>
                <strong>Creator</strong>
                <p>{post.post_creator_name}</p>
              </div>
            </div>
            <div className={styles.postCard.stats}>
              <div className={styles.postCard.statsWrapper}>
                <span className={styles.postCard.statItem}>
                  <FaEye /> {post.post_view_count.toLocaleString()}
                </span>
                <span className={styles.postCard.statItem}>
                  <FaThumbsUp /> {post.post_like_count.toLocaleString()}
                </span>
                <span className={styles.postCard.statItem}>
                  <FaComment /> {post.post_comment_count.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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