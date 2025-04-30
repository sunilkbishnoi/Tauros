
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  children: ReactNode;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ children, placeholder, value, onValueChange, triggerClassName, contentClassName, disabled }, ref) => {
    return (
      <SelectPrimitive 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger 
          ref={ref} 
          className={cn("w-full", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {children}
        </SelectContent>
      </SelectPrimitive>
    );
  }
);

Select.displayName = 'Select';

export { Select, SelectItem };
