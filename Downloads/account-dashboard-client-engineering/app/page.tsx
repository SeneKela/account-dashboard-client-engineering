'use client'

import { useAccounts } from "@/hooks/use-accounts"
import { AccountDashboard } from "@/components/account-dashboard"

export default function IndexPage() {
  const { accounts, teamMembers, usedMockData, loading, error } = useAccounts()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error("Error loading accounts:", error)
  }

  return (
    <AccountDashboard
      initialAccounts={accounts}
      initialTeamMembers={teamMembers}
      usedMockData={usedMockData}
    />
  )
}

