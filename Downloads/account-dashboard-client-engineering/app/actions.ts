import { type Account, type TeamMember, getMockAccounts, searchMockAccounts, getSupabaseClient } from "@/lib/supabase"

// Test function to verify database connection and table existence
export async function testDatabaseConnection() {
  try {
    const supabase = getSupabaseClient()
    
    // Test accounts table
    const { data: accountsData, error: accountsError } = await supabase
      .from('Account for Client Engineering')
      .select('*')
      .limit(1)
    
    if (accountsError) {
      console.error("Accounts table error:", accountsError)
      return { success: false, message: "Accounts table error: " + accountsError.message }
    }

    // Test team members table
    const { data: teamMembersData, error: teamMembersError } = await supabase
      .from('Team Members')
      .select('*')
      .limit(1)
    
    if (teamMembersError) {
      console.error("Team Members table error:", teamMembersError)
      return { success: false, message: "Team Members table error: " + teamMembersError.message }
    }

    return { 
      success: true, 
      message: "Database connection successful",
      accountsCount: accountsData?.length || 0,
      teamMembersCount: teamMembersData?.length || 0
    }
  } catch (error) {
    console.error("Database connection test error:", error)
    return { success: false, message: "Database connection test failed: " + error.message }
  }
}

export async function getAccounts(category?: string): Promise<{
  accounts: Account[]
  teamMembers: Record<string, TeamMember[]>
  usedMockData: boolean
}> {
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

    return {
      accounts: accounts.map(acc => ({
        id: acc.name,
        name: acc.name,
        logo: acc.files || '/placeholder.svg?height=80&width=80',
        category: acc.category,
        last_active: new Date().toISOString()
      })),
      teamMembers: teamMembersByAccount,
      usedMockData: false,
    }
  } catch (error) {
    console.error("Database error:", error)

    // Use mock data as fallback
    console.log("Using mock data due to database error")
    const { accounts, teamMembers } = getMockAccounts(category)
    return {
      accounts,
      teamMembers,
      usedMockData: true,
    }
  }
}

export async function searchAccounts(query: string): Promise<{
  accounts: Account[]
  teamMembers: Record<string, TeamMember[]>
  usedMockData: boolean
}> {
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

    return {
      accounts: accounts.map(acc => ({
        id: acc.name,
        name: acc.name,
        logo: acc.files || '/placeholder.svg?height=80&width=80',
        category: acc.category,
        last_active: new Date().toISOString()
      })),
      teamMembers: teamMembersByAccount,
      usedMockData: false,
    }
  } catch (error) {
    console.error("Database error:", error)

    // Use mock data as fallback
    console.log("Using mock data due to database error")
    const { accounts, teamMembers } = searchMockAccounts(query)
    return {
      accounts,
      teamMembers,
      usedMockData: true,
    }
  }
}

