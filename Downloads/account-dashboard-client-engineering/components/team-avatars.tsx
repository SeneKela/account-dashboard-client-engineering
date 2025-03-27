"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar: string
}

interface TeamAvatarsProps {
  members: TeamMember[]
  maxDisplay?: number
  onClick?: () => void
}

export function TeamAvatars({ members, maxDisplay = 4, onClick }: TeamAvatarsProps) {
  // Determine how many avatars to show and if we need a +X indicator
  const displayMembers = members.slice(0, maxDisplay)
  const remainingCount = members.length - maxDisplay

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleGradient = (role: string) => {
    switch (role.toLowerCase()) {
      case "manager":
        return "bg-gradient-to-br from-[#0f62fe] to-[#007d79]" // Blue 60 to Teal 80
      case "btl":
        return "bg-gradient-to-br from-[#001d6c] to-[#6929c4]" // Blue 90 to Purple 70
      case "architect":
        return "bg-gradient-to-br from-[#539ac3] to-[#007d79]" // Cyan 70 to Teal 60
      case "designer":
        return "bg-gradient-to-br from-[#005d5d] to-[#1b8038]" // Teal 70 to Green 90
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600" // Default gray gradient
    }
  }

  return (
    <div className="flex items-center cursor-pointer" onClick={onClick}>
      <div className="flex -space-x-3">
        <TooltipProvider>
          {displayMembers.map((member, index) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 border-2 border-background hover:translate-y-[-2px] transition-transform">
                  <AvatarFallback className={`${getRoleGradient(member.role)} !bg-transparent text-white font-medium`}>
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.role}</div>
              </TooltipContent>
            </Tooltip>
          ))}

          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 border-2 border-background bg-gradient-to-br from-gray-400 to-gray-600 hover:translate-y-[-2px] transition-transform">
                  <AvatarFallback className="!bg-transparent text-white font-medium">+{remainingCount}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">{remainingCount} more team members</div>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <span className="ml-3 text-sm text-muted-foreground hover:text-foreground transition-colors">View all</span>
    </div>
  )
}

