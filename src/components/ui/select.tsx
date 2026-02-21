import * as React from "react";
import { cn } from "../../utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
}

const Select = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  id,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-md border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-muted/30 hover:border-primary/30",
            className,
          )}
        >
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center ml-2 pl-2 border-l border-white/10">
            <ChevronDown
              className={cn(
                "h-4 w-4 opacity-50 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-full min-w-[300px]" align="start">
        <div className="flex flex-col gap-0.5">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                value === option.value && "bg-accent/50 text-accent-foreground",
              )}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { Select };
