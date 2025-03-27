import { testDatabaseConnection } from "../actions"

export default async function TestPage() {
  const result = await testDatabaseConnection()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className="font-semibold">{result.success ? '✅ Success' : '❌ Error'}</p>
        <p>{result.message}</p>
        {result.success && (
          <div className="mt-4">
            <p>Accounts count: {result.accountsCount}</p>
            <p>Team members count: {result.teamMembersCount}</p>
          </div>
        )}
      </div>
    </div>
  )
} 