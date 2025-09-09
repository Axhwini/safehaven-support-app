import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent, SafeCardDescription, SafeCardHeader, SafeCardTitle } from "@/components/ui/safe-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"

const Auth = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, navigate to dashboard
    navigate("/dashboard")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-soft-gradient flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <SafeButton
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </SafeButton>
        <h1 className="text-xl font-semibold text-primary">SafeHaven</h1>
      </div>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center">
        <SafeCard className="w-full max-w-md">
          <SafeCardHeader className="text-center">
            <SafeCardTitle className="text-2xl">
              {isLogin ? "Welcome back" : "Create your safe space"}
            </SafeCardTitle>
            <SafeCardDescription>
              {isLogin 
                ? "Sign in to access your safe space" 
                : "Join our supportive community"
              }
            </SafeCardDescription>
          </SafeCardHeader>
          
          <SafeCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12 rounded-xl border-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 rounded-xl border-primary/20 focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 h-12 rounded-xl border-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <SafeButton
                type="submit"
                className="w-full"
                size="lg"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </SafeButton>

              {/* Toggle between Login/Signup */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  {" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>
          </SafeCardContent>
        </SafeCard>
      </div>
    </div>
  )
}

export default Auth