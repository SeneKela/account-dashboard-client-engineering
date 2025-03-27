"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AccountCard } from "@/components/account-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FloatingSearch } from "@/components/floating-search"
import { getAccounts, searchAccounts } from "@/app/actions"
import type { Account, TeamMember } from "@/lib/supabase"
import { useDebounce } from "@/hooks/use-debounce"

interface AccountDashboardProps {
  initialAccounts: Account[]
  initialTeamMembers: Record<string, TeamMember[]>
  usedMockData: boolean
}

export function AccountDashboard({ initialAccounts, initialTeamMembers, usedMockData }: AccountDashboardProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>(initialTeamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isPending, startTransition] = useTransition()
  const [usingMockData, setUsingMockData] = useState(usedMockData)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Handle search
  useEffect(() => {
    if (debouncedSearchQuery) {
      startTransition(async () => {
        try {
          const {
            accounts: searchResults,
            teamMembers: searchTeamMembers,
            usedMockData,
          } = await searchAccounts(debouncedSearchQuery)
          setAccounts(searchResults)
          setTeamMembers(searchTeamMembers)
          setUsingMockData(usedMockData)
        } catch (error) {
          console.error("Search error:", error)
          // Keep the current state on error
        }
      })
    } else if (activeTab !== "all") {
      // If search is cleared but we have a category filter
      startTransition(async () => {
        try {
          const {
            accounts: filteredAccounts,
            teamMembers: filteredTeamMembers,
            usedMockData,
          } = await getAccounts(activeTab)
          setAccounts(filteredAccounts)
          setTeamMembers(filteredTeamMembers)
          setUsingMockData(usedMockData)
        } catch (error) {
          console.error("Filter error:", error)
          // Keep the current state on error
        }
      })
    } else {
      // If search is cleared and no category filter
      startTransition(async () => {
        try {
          const { accounts: allAccounts, teamMembers: allTeamMembers, usedMockData } = await getAccounts()
          setAccounts(allAccounts)
          setTeamMembers(allTeamMembers)
          setUsingMockData(usedMockData)
        } catch (error) {
          console.error("Fetch error:", error)
          // Keep the current state on error
        }
      })
    }
  }, [debouncedSearchQuery, activeTab])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    startTransition(async () => {
      try {
        const {
          accounts: filteredAccounts,
          teamMembers: filteredTeamMembers,
          usedMockData,
        } = await getAccounts(value === "all" ? undefined : value)
        setAccounts(filteredAccounts)
        setTeamMembers(filteredTeamMembers)
        setUsingMockData(usedMockData)
      } catch (error) {
        console.error("Tab change error:", error)
        // Keep the current state on error
      }
    })
  }

  return (
    <DashboardShell>
      <div className="container mx-auto max-w-7xl">
        <FloatingSearch value={searchQuery} onChange={setSearchQuery} />
        
        <div className="pt-20">
          <DashboardHeader heading="Company Accounts" text="Manage your enterprise, strategic, and select accounts.">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Account
            </Button>
          </DashboardHeader>

          {usingMockData && (
            <Alert className="my-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Using Mock Data</AlertTitle>
              <AlertDescription>
                The dashboard is currently using mock data because the database tables don't exist yet. Please run the SQL
                schema in your Supabase SQL Editor to create the necessary tables.
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-8 space-y-8">
            <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Enterprise">Enterprise</TabsTrigger>
                <TabsTrigger value="Strategic">Strategic</TabsTrigger>
                <TabsTrigger value="Select">Select</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {isPending ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="text-center p-8 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No accounts found</p>
                  </div>
                ) : (
                  <TabsContent value={activeTab} className="mt-0 space-y-0">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {accounts.map((account) => (
                        <AccountCard
                          key={account.id}
                          account={{
                            id: account.id,
                            name: account.name,
                            logo: account.logo,
                            category: account.category,
                            team: teamMembers[account.id] || [],
                            lastActive: account.last_active,
                          }}
                        />
                      ))}
                    </div>
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

