"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FloatingSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function FloatingSearch({ value, onChange, placeholder = "Search accounts or team members..." }: FloatingSearchProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-gray-800/20" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            className="pl-12 h-14 w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
} 