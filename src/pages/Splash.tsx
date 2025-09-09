import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import heroImage from "@/assets/hero-illustration.jpg"

const Splash = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-soft-gradient flex flex-col items-center justify-center px-6">
      <div className="text-center animate-fade-in">
        {/* Logo/Illustration */}
        <div className="mb-8">
          <img 
            src={heroImage} 
            alt="SafeHaven - Peaceful illustration" 
            className="w-64 h-40 object-cover rounded-3xl shadow-calm mx-auto"
          />
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-primary mb-4 animate-gentle-bounce">
          SafeHaven
        </h1>
        
        {/* Tagline */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Your safe space starts here
        </p>
        
        {/* Loading indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse-gentle" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-gentle" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Splash