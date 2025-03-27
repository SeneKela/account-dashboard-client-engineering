import { AccountDashboard } from "@/components/account-dashboard"
import { getAccounts } from "@/app/actions"

export default async function Home() {
  const { accounts, teamMembers, usedMockData } = await getAccounts()

  return <AccountDashboard initialAccounts={accounts} initialTeamMembers={teamMembers} usedMockData={usedMockData} />
}

