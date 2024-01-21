import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Category {
  value: string;
  label: string;
}

interface DropdownProps {
  categoriesList: Category[];
}

export function Dropdown({ categoriesList }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState(categoriesList);
  console.log(categories[0].label)
  console.log(value)
  useEffect(() => {
    setCategories(prevCategories => {
      if (prevCategories !== categoriesList) {
        return categoriesList;
      }
      return prevCategories;
    });
  }, [categoriesList]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="col-span-3 justify-between"
        >
          {
            value
            ? categories.find((category) => category.value === value) ? "yes" : "Select category..."
            : "Select category..."
          
          }
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="col-span-3 p-0">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.value}
                value={category.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {category.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === category.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
