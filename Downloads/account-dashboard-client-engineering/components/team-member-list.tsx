"use client"

import { useState } from "react"
import { Check, Copy, Crown, Building2, Network, Palette } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar: string
}

interface TeamMemberListProps {
  members: TeamMember[]
}

export function TeamMemberList({ members }: TeamMemberListProps) {
  // Sort members alphabetically by name
  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-4 mt-4">
      {sortedMembers.map((member, index) => (
        <div key={member.id}>
          {index > 0 && <Separator className="my-4" />}
          <TeamMemberItem member={member} />
        </div>
      ))}
    </div>
  )
}

interface TeamMemberItemProps {
  member: TeamMember
}

function TeamMemberItem({ member }: TeamMemberItemProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRoleBadgeVariant = (role: string) => {
    // All roles now use the default (black) variant
    return "default"
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "manager":
        return <Crown className="h-3 w-3 mr-1" />
      case "btl":
        return <Building2 className="h-3 w-3 mr-1" />
      case "architect":
        return <Network className="h-3 w-3 mr-1" />
      case "designer":
        return <Palette className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-10 w-10 border border-muted">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1 flex-1">
          <div className="font-medium">{member.name}</div>
          <div className="flex items-center gap-2">
            <Badge variant={getRoleBadgeVariant(member.role) as any} className="text-xs flex items-center">
              {getRoleIcon(member.role)}
              {member.role}
            </Badge>
            <div className="flex items-center gap-2 group">
              <span className="text-sm text-muted-foreground">{member.email}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => copyToClipboard(member.email)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
                      aria-label={`Copy ${member.name}'s email`}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{copied ? "Copied!" : "Copy email"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

