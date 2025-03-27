import { useState, useEffect } from 'react'
import { type Account, type TeamMember, getMockAccounts, searchMockAccounts, getSupabaseClient } from "@/lib/supabase"

export function useAccounts(category?: string) {
  const [data, setData] = useState<{
    accounts: Account[]
    teamMembers: Record<string, TeamMember[]>
    usedMockData: boolean
  }>({
    accounts: [],
    teamMembers: {},
    usedMockData: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = getSupabaseClient()
        
        // Fetch accounts
        let query = supabase.from('Account for Client Engineering').select('*')
        if (category && category !== 'all') {
          query = query.eq('category', category)
        }
        const { data: accounts, error: accountsError } = await query

        if (accountsError) throw accountsError

        // Fetch team members for all accounts
        const { data: teamMembers, error: teamMembersError } = await supabase
          .from('Team Members')
          .select('*')
          .in('account_name', accounts.map(acc => acc.name))

        if (teamMembersError) throw teamMembersError

        // Group team members by account_name
        const teamMembersByAccount = teamMembers.reduce((acc, member) => {
          if (!acc[member.account_name]) {
            acc[member.account_name] = []
          }
          acc[member.account_name].push(member)
          return acc
        }, {} as Record<string, TeamMember[]>)

        setData({
          accounts: accounts.map(acc => ({
            id: acc.name,
            name: acc.name,
            logo: acc.files || '/placeholder.svg?height=80&width=80',
            category: acc.category,
            last_active: new Date().toISOString()
          })),
          teamMembers: teamMembersByAccount,
          usedMockData: false,
        })
      } catch (error) {
        console.error("Database error:", error)
        // Use mock data as fallback
        console.log("Using mock data due to database error")
        const { accounts, teamMembers } = getMockAccounts(category)
        setData({
          accounts,
          teamMembers,
          usedMockData: true,
        })
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category])

  return { ...data, loading, error }
}

export function useSearchAccounts(query: string) {
  const [data, setData] = useState<{
    accounts: Account[]
    teamMembers: Record<string, TeamMember[]>
    usedMockData: boolean
  }>({
    accounts: [],
    teamMembers: {},
    usedMockData: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = getSupabaseClient()
        
        // Search accounts by name
        const { data: accounts, error: accountsError } = await supabase
          .from('Account for Client Engineering')
          .select('*')
          .ilike('name', `%${query}%`)

        if (accountsError) throw accountsError

        // Search team members by name or email
        const { data: teamMembers, error: teamMembersError } = await supabase
          .from('Team Members')
          .select('*')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%`)

        if (teamMembersError) throw teamMembersError

        // Get unique account names from both accounts and team members
        const accountNames = new Set([
          ...accounts.map(acc => acc.name),
          ...teamMembers.map(member => member.account_name)
        ])

        // Fetch all team members for the matching accounts
        const { data: allTeamMembers, error: allTeamMembersError } = await supabase
          .from('Team Members')
          .select('*')
          .in('account_name', Array.from(accountNames))

        if (allTeamMembersError) throw allTeamMembersError

        // Group team members by account_name
        const teamMembersByAccount = allTeamMembers.reduce((acc, member) => {
          if (!acc[member.account_name]) {
            acc[member.account_name] = []
          }
          acc[member.account_name].push(member)
          return acc
        }, {} as Record<string, TeamMember[]>)

        setData({
          accounts: accounts.map(acc => ({
            id: acc.name,
            name: acc.name,
            logo: acc.files || '/placeholder.svg?height=80&width=80',
            category: acc.category,
            last_active: new Date().toISOString()
          })),
          teamMembers: teamMembersByAccount,
          usedMockData: false,
        })
      } catch (error) {
        console.error("Database error:", error)
        // Use mock data as fallback
        console.log("Using mock data due to database error")
        const { accounts, teamMembers } = searchMockAccounts(query)
        setData({
          accounts,
          teamMembers,
          usedMockData: true,
        })
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query])

  return { ...data, loading, error }
} 