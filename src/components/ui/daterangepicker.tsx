"use client"

import * as React from "react"
import { subDays, subMonths, subYears, startOfYear, endOfYear, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DatePickerWithRange({
  className,
  onChange,
}: { className?: string; onChange: (range: DateRange | undefined) => void }) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfYear(new Date()),
    to: endOfYear(new Date()),
  });

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    onChange(selectedDate);
  };

  const handlePresetChange = (value: string) => {
    const today = new Date()
    let newRange: DateRange | undefined;

    switch (value) {
      case "last-7":
        newRange = { from: subDays(today, 7), to: today }
        break
      case "last-30":
        newRange = { from: subDays(today, 30), to: today }
        break
      case "last-month":
        newRange = { from: subMonths(today, 1), to: today }
        break
      case "last-year":
        newRange = { from: subYears(today, 1), to: today }
        break
      case "this-year":
        newRange = { from: startOfYear(today), to: endOfYear(today) }
        break
      case "clear":
        newRange = undefined
        break
      default:
        return
    }

    handleDateChange(newRange)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[200px] mb-2">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7">Ultimi 7 giorni</SelectItem>
                <SelectItem value="last-30">Ultimi 30 giorni</SelectItem>
                <SelectItem value="last-month">Ultimo mese</SelectItem>
                <SelectItem value="last-year">Ultimo anno</SelectItem>
                <SelectItem value="this-year">Anno corrente</SelectItem>
                <SelectItem value="clear">Cancella selezione</SelectItem>
              </SelectContent>
            </Select>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {date && (
          <Button 
            variant="ghost" 
            className="px-2" 
            onClick={() => handleDateChange(undefined)}
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  )
}
