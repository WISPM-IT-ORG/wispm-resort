import { login } from '@/app/auth/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-heading text-2xl font-bold mb-6">Log in</h1>

      {message && (
        <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</p>
      )}
      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>
      )}

      <form action={login} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full rounded-lg bg-secondary px-4 py-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full rounded-lg bg-secondary px-4 py-3"
        />
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg">
          Log in
        </button>
      </form>

      <p className="text-sm text-muted mt-4">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-primary underline">Sign up</a>
      </p>
    </main>
  )
}