import { createClient } from "@supabase/supabase-js"

// Type definitions for our database schema
export type Account = {
  id: string
  name: string
  logo: string
  category: string
  last_active: string
}

export type TeamMember = {
  id: string
  account_name: string
  name: string
  role: string
  email: string
  avatar: string
}

// Create a singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Helper function to get mock data filtered by category
export function getMockAccounts(category?: string) {
  if (!category || category === "all") {
    return { accounts: mockAccounts, teamMembers: mockTeamMembers }
  }

  const filteredAccounts = mockAccounts.filter((account) => account.category.toLowerCase() === category.toLowerCase())

  const filteredTeamMembers: Record<string, TeamMember[]> = {}
  filteredAccounts.forEach((account) => {
    if (mockTeamMembers[account.id]) {
      filteredTeamMembers[account.id] = mockTeamMembers[account.id]
    }
  })

  return { accounts: filteredAccounts, teamMembers: filteredTeamMembers }
}

// Helper function to search mock data
export function searchMockAccounts(query: string) {
  const filteredAccounts = mockAccounts.filter((account) => account.name.toLowerCase().includes(query.toLowerCase()))

  const accountsFromTeamMembers: Account[] = []
  const filteredTeamMembers: Record<string, TeamMember[]> = {}

  Object.entries(mockTeamMembers).forEach(([accountId, members]) => {
    const matchingMembers = members.filter(
      (member) =>
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()),
    )

    if (matchingMembers.length > 0) {
      filteredTeamMembers[accountId] = matchingMembers

      // Add the account if not already in filteredAccounts
      if (!filteredAccounts.some((a) => a.id === accountId)) {
        const account = mockAccounts.find((a) => a.id === accountId)
        if (account) {
          accountsFromTeamMembers.push(account)
        }
      }
    } else if (filteredAccounts.some((a) => a.id === accountId)) {
      // Include all team members for accounts that match the query
      filteredTeamMembers[accountId] = members
    }
  })

  return {
    accounts: [...filteredAccounts, ...accountsFromTeamMembers],
    teamMembers: filteredTeamMembers,
  }
}

// Mock data to use as fallback when database tables don't exist yet
export const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Acme Corporation",
    logo: "/placeholder.svg?height=80&width=80",
    category: "Enterprise",
    last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Globex Industries",
    logo: "/placeholder.svg?height=80&width=80",
    category: "Strategic",
    last_active: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Initech Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    category: "Select",
    last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Massive Dynamic",
    logo: "/placeholder.svg?height=80&width=80",
    category: "Enterprise",
    last_active: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    name: "Stark Industries",
    logo: "/placeholder.svg?height=80&width=80",
    category: "Strategic",
    last_active: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    name: "Wayne Enterprises",
    logo: "/placeholder.svg?height=80&width=80",
    category: "Enterprise",
    last_active: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockTeamMembers: Record<string, TeamMember[]> = {
  "1": [
    {
      id: "1-1",
      account_name: "1",
      name: "John Doe",
      role: "Manager",
      email: "john.doe@acme.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "1-2",
      account_name: "1",
      name: "Alice Johnson",
      role: "Designer",
      email: "alice.johnson@acme.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "1-3",
      account_name: "1",
      name: "Bob Smith",
      role: "Architect",
      email: "bob.smith@acme.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "1-4",
      account_name: "1",
      name: "Carol Williams",
      role: "BTL",
      email: "carol.williams@acme.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  "2": [
    {
      id: "2-1",
      account_name: "2",
      name: "Jane Smith",
      role: "BTL",
      email: "jane.smith@globex.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2-2",
      account_name: "2",
      name: "David Brown",
      role: "Manager",
      email: "david.brown@globex.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2-3",
      account_name: "2",
      name: "Eva Green",
      role: "Designer",
      email: "eva.green@globex.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  "3": [
    {
      id: "3-1",
      account_name: "3",
      name: "Michael Johnson",
      role: "Architect",
      email: "michael.johnson@initech.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3-2",
      account_name: "3",
      name: "Frank Miller",
      role: "BTL",
      email: "frank.miller@initech.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3-3",
      account_name: "3",
      name: "Grace Lee",
      role: "Designer",
      email: "grace.lee@initech.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3-4",
      account_name: "3",
      name: "Henry Wilson",
      role: "Manager",
      email: "henry.wilson@initech.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3-5",
      account_name: "3",
      name: "Irene Davis",
      role: "Designer",
      email: "irene.davis@initech.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3-6",
      account_name: "3",
      name: "Jack Robinson",
      role: "BTL",
      email: "jack.robinson@initech.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  "4": [
    {
      id: "4-1",
      account_name: "4",
      name: "Sarah Williams",
      role: "Designer",
      email: "sarah.williams@massive.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4-2",
      account_name: "4",
      name: "Ian Clark",
      role: "Architect",
      email: "ian.clark@massive.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4-3",
      account_name: "4",
      name: "Julia Davis",
      role: "BTL",
      email: "julia.davis@massive.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  "5": [
    {
      id: "5-1",
      account_name: "5",
      name: "Tony Stark",
      role: "Architect",
      email: "tony.stark@stark.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5-2",
      account_name: "5",
      name: "Pepper Potts",
      role: "Manager",
      email: "pepper.potts@stark.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5-3",
      account_name: "5",
      name: "Happy Hogan",
      role: "BTL",
      email: "happy.hogan@stark.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  "6": [
    {
      id: "6-1",
      account_name: "6",
      name: "Bruce Wayne",
      role: "Manager",
      email: "bruce.wayne@wayne.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6-2",
      account_name: "6",
      name: "Lucius Fox",
      role: "Architect",
      email: "lucius.fox@wayne.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6-3",
      account_name: "6",
      name: "Alfred Pennyworth",
      role: "Designer",
      email: "alfred.pennyworth@wayne.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
}

