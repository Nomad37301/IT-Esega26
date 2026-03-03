import * as React from "react"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  RadioGroupProps
>(({ className, children, value, onValueChange, defaultValue, ...props }, ref) => {
  // Untuk implementasi sederhana, gunakan context untuk mengelola state
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value || defaultValue);
  
  // Update internal state ketika value external berubah
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  
  // Buat context untuk memberikan value dan setter ke children
  const context = React.useMemo(() => ({
    value: selectedValue,
    onValueChange: (newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    }
  }), [selectedValue, onValueChange]);
  
  return (
    <RadioGroupContext.Provider value={context}>
      <div 
        ref={ref} 
        className={cn("grid gap-2", className)} 
        role="radiogroup"
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

// Context untuk RadioGroup
const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange: (value: string) => void
}>({
  value: undefined,
  onValueChange: () => {}
});

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
}

const RadioGroupItem = React.forwardRef<
  HTMLDivElement,
  RadioGroupItemProps
>(({ className, value, disabled, ...props }, ref) => {
  // Gunakan context dari RadioGroup
  const { value: selectedValue, onValueChange } = React.useContext(RadioGroupContext);
  const isSelected = selectedValue === value;
  
  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center aspect-square h-4 w-4 rounded-full border border-gray-300 cursor-pointer",
        isSelected ? "border-[#ba0000]" : "border-gray-300",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className
      )}
      aria-checked={isSelected}
      role="radio"
      onClick={handleClick}
      {...props}
    >
      {isSelected && (
        <div className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-[#ba0000] text-[#ba0000]" />
        </div>
      )}
    </div>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
