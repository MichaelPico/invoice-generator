import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function formatDate(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function isoToDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso + "T00:00:00");
  return isNaN(d.getTime()) ? undefined : d;
}

function dateToISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

interface Props {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
}

export function DateInput({ id, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(() => isoToDate(value));
  const [month, setMonth] = React.useState<Date | undefined>(() => isoToDate(value));
  const [inputValue, setInputValue] = React.useState(() => formatDate(isoToDate(value)));

  React.useEffect(() => {
    const d = isoToDate(value);
    setDate(d);
    setMonth(d);
    setInputValue(formatDate(d));
  }, [value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      setDate(parsed);
      setMonth(parsed);
    }
  }

  function handleBlur() {
    if (date && !isNaN(date.getTime())) {
      onChange(dateToISO(date));
      setInputValue(formatDate(date));
    } else {
      const d = isoToDate(value);
      setDate(d);
      setMonth(d);
      setInputValue(formatDate(d));
    }
  }

  function handleSelect(selected: Date | undefined) {
    setDate(selected);
    if (selected) {
      onChange(dateToISO(selected));
      setInputValue(formatDate(selected));
    }
    setOpen(false);
  }

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        value={inputValue}
        placeholder="June 1, 2026"
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton size="icon-xs" variant="ghost" aria-label="Select date">
              <CalendarIcon />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
