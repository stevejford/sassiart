import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Starting login process...")

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Authentication error:", authError)
        throw authError
      }

      console.log("User authenticated:", user)

      // Check if user is admin
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("is_admin")
        .eq("email", email)
        .single()

      if (studentError) {
        console.error("Error fetching student data:", studentError)
        throw studentError
      }

      console.log("Student data:", studentData)

      if (!studentData?.is_admin) {
        console.log("User is not an admin")
        await supabase.auth.signOut()
        toast.error("Access denied. Admin privileges required.")
        setIsLoading(false)
        return
      }

      console.log("Admin access confirmed, redirecting...")
      toast.success("Welcome back, admin!")
      navigate("/admin")
    } catch (error) {
      console.error("Login process error:", error)
      toast.error("Invalid login credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://sassi4art.netlify.app/admin/reset-password',
      })

      if (error) throw error

      toast.success("Password reset email sent! Please check your inbox.")
      setIsForgotPassword(false)
    } catch (error) {
      toast.error("Error sending reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>

        {!isForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
              <Link
                to="/admin/signup"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <Alert>
              <AlertDescription>
                Enter your email address and we'll send you a link to reset your password.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="reset-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back to login
              </button>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}