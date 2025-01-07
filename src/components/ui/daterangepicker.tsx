"use client"

import * as React from "react"
import { format, subDays, subMonths, subYears } from "date-fns"
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

interface DatePickerWithRangeProps {
  className?: string
  onChange?: (date: DateRange | undefined) => void
  defaultValue?: DateRange
}

export function DatePickerWithRange({
  className,
  onChange,
  defaultValue
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(defaultValue)

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
  }

  const handleQuickSelect = (days: number) => {
    const end = new Date()
    let start: Date

    if (days === 7) {
      start = subDays(end, 7)
    } else if (days === 30) {
      start = subDays(end, 30)
    } else if (days === 90) {
      start = subMonths(end, 3)
    } else if (days === 180) {
      start = subMonths(end, 6)
    } else {
      start = subYears(end, 1)
    }

    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)

    const newRange = { from: start, to: end }
    setDate(newRange)
    onChange?.(newRange)
  }

  return (
    <div className={cn("grid gap-2", className)}>
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
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex gap-2 p-2 border-b">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickSelect(7)}
            >
              7 giorni
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickSelect(30)}
            >
              30 giorni
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickSelect(90)}
            >
              3 mesi
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickSelect(180)}
            >
              6 mesi
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickSelect(365)}
            >
              1 anno
            </Button>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
