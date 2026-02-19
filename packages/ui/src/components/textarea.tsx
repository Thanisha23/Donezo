import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 min-h-[80px] rounded-lg border bg-transparent px-3 py-2 text-base transition-colors focus-visible:ring-3 aria-invalid:ring-3 md:text-sm placeholder:text-muted-foreground w-full outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }