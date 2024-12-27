import { DatePickerWithRange } from '@/components/ui/daterangepicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';

interface DashboardFiltersProps {
  onFilterChange: (filters: { client: string; dateRange: DateRange | null }) => void;
  currentFilters: {
    client: string;
    dateRange: DateRange | null;
  };
  clients: string[];
}

export function DashboardFilters({ onFilterChange, currentFilters, clients }: DashboardFiltersProps) {
  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFilterChange({ 
      ...currentFilters, 
      dateRange: range || null 
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Select
        value={currentFilters.client}
        onValueChange={(value) => 
          onFilterChange({ ...currentFilters, client: value })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Seleziona cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutti i clienti</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client} value={client}>
              {client}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePickerWithRange
        value={currentFilters.dateRange}
        onChange={handleDateRangeChange}
      />
    </div>
  );
} 