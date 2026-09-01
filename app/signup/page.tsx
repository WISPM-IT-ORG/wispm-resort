import { signup } from '@/app/auth/actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-heading text-2xl font-bold mb-6">Create an account</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>
      )}

      <form action={signup} className="space-y-4">
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
          placeholder="Password (min 6 characters)"
          required
          minLength={6}
          className="w-full rounded-lg bg-secondary px-4 py-3"
        />
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg">
          Sign up
        </button>
      </form>

      <p className="text-sm text-muted mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-primary underline">Log in</a>
      </p>
    </main>
  )
}