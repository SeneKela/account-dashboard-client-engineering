"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TeamMemberList } from "@/components/team-member-list"
import { Separator } from "@/components/ui/separator"
import { TeamAvatars } from "@/components/team-avatars"
import type { TeamMember } from "@/lib/supabase"

interface Account {
  id: string
  name: string
  logo: string
  category: string
  team: TeamMember[]
  lastActive: string
}

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  const [teamDialogOpen, setTeamDialogOpen] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "enterprise":
        return "bg-blue-500"
      case "strategic":
        return "bg-purple-500"
      case "select":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case "enterprise":
        return "default"
      case "strategic":
        return "secondary"
      case "select":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <>
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={account.logo || "/placeholder.svg"}
                  alt={`${account.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-none tracking-tight">{account.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getCategoryBadgeVariant(account.category) as any}>{account.category}</Badge>
                  <div className={`w-2 h-2 rounded-full ${getCategoryColor(account.category)}`} />
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTeamDialogOpen(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>View Team</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Edit Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <span>Delete Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Team Members</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {account.team.length}
              </Badge>
            </div>

            <TeamAvatars members={account.team} maxDisplay={4} onClick={() => setTeamDialogOpen(true)} />
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="p-4 text-xs text-muted-foreground bg-muted/30">
          Last active {formatDistanceToNow(new Date(account.lastActive), { addSuffix: true })}
        </CardFooter>
      </Card>

      <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                <Image
                  src={account.logo || "/placeholder.svg"}
                  alt={`${account.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <DialogTitle>{account.name} Team</DialogTitle>
                <DialogDescription>{account.team.length} team members</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <TeamMemberList members={account.team} />
        </DialogContent>
      </Dialog>
    </>
  )
}

