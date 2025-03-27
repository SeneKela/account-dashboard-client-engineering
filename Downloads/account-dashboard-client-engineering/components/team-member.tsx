"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TeamMemberProps {
  member: {
    name: string
    role: string
    email: string
  }
}

export function TeamMember({ member }: TeamMemberProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "manager":
        return "default"
      case "btl":
        return "outline"
      case "architect":
        return "secondary"
      case "designer":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="flex items-center justify-between rounded-md border p-2 bg-card">
      <div className="flex flex-col gap-1">
        <div className="font-medium text-sm">{member.name}</div>
        <div className="flex items-center gap-2">
          <Badge variant={getRoleBadgeVariant(member.role) as any} className="text-xs">
            {member.role}
          </Badge>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="truncate max-w-[140px]">{member.email}</div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(member.email)}>
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                <span className="sr-only">Copy email</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy email"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

