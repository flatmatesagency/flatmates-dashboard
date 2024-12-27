import { Stats } from '@/lib/utils/statsCalculator';
import { StatsCard } from '@/components/stats/StatsCard';
import { FaEye, FaThumbsUp, FaComment, FaChartLine } from 'react-icons/fa';

interface StatsSectionProps {
  stats: Stats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Views"
        value={stats.totalViews}
        icon={<FaEye />}
      />
      <StatsCard
        title="Total Likes"
        value={stats.totalLikes}
        icon={<FaThumbsUp />}
      />
      <StatsCard
        title="Total Comments"
        value={stats.totalComments}
        icon={<FaComment />}
      />
      <StatsCard
        title="Engagement Rate"
        value={stats.engagementRate}
        icon={<FaChartLine />}
        format={(value) => `${value.toFixed(2)}%`}
      />
    </div>
  );
} 