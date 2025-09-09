import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent, SafeCardDescription, SafeCardHeader, SafeCardTitle } from "@/components/ui/safe-card"
import { ArrowLeft, AlertTriangle, Phone, MapPin, Clock, Eye, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Emergency = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [sosActivated, setSosActivated] = useState(false)
  const [quickExitMode, setQuickExitMode] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const activateSOS = () => {
    if (!sosActivated) {
      setSosActivated(true)
      toast({
        title: "SOS Alert Activated",
        description: "Emergency contacts and authorities have been notified. Help is on the way.",
      })
      
      // Simulate sending location and alerts
      setTimeout(() => {
        toast({
          title: "Location shared",
          description: "Your current location has been sent to emergency contacts.",
        })
      }, 2000)
    }
  }

  const quickExit = () => {
    setQuickExitMode(true)
    // In a real app, this would immediately hide the interface
    setTimeout(() => {
      setQuickExitMode(false)
    }, 3000)
  }

  if (quickExitMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Calculator</h1>
          <div className="grid grid-cols-3 gap-3 w-full">
            {Array.from({length: 9}, (_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center text-lg font-medium">
                {i + 1}
              </div>
            ))}
          </div>
          <SafeButton 
            variant="ghost" 
            onClick={() => setQuickExitMode(false)}
            className="mt-4 text-xs"
          >
            Return to SafeHaven
          </SafeButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-gradient">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-emergency/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeButton
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </SafeButton>
            <div>
              <h1 className="text-xl font-semibold text-emergency">Emergency SOS</h1>
              <p className="text-sm text-muted-foreground">Immediate help available</p>
            </div>
          </div>
          <SafeButton
            variant="ghost"
            size="sm"
            onClick={quickExit}
            className="text-xs"
          >
            <Eye className="h-4 w-4 mr-1" />
            Quick Exit
          </SafeButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24">
        {!sosActivated ? (
          <div className="space-y-6">
            {/* Emergency Warning */}
            <SafeCard className="border-emergency/20 bg-emergency/5">
              <SafeCardHeader>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-emergency" />
                  <div>
                    <SafeCardTitle className="text-emergency">Emergency Mode</SafeCardTitle>
                    <SafeCardDescription>
                      Use this only in immediate danger situations
                    </SafeCardDescription>
                  </div>
                </div>
              </SafeCardHeader>
            </SafeCard>

            {/* SOS Button */}
            <div className="text-center py-8">
              <SafeButton
                variant="emergency"
                size="xl"
                onClick={activateSOS}
                className="w-40 h-40 rounded-full text-xl font-bold shadow-2xl"
              >
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <span>SOS</span>
                  <span className="text-sm font-normal">Tap for Help</span>
                </div>
              </SafeButton>
            </div>

            {/* What SOS Does */}
            <SafeCard>
              <SafeCardHeader>
                <SafeCardTitle>What happens when you tap SOS:</SafeCardTitle>
              </SafeCardHeader>
              <SafeCardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Shares your current location with emergency contacts</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Notifies local authorities and NGOs</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Starts automatic check-ins every 15 minutes</span>
                </div>
              </SafeCardContent>
            </SafeCard>

            {/* Emergency Contacts */}
            <SafeCard>
              <SafeCardHeader>
                <SafeCardTitle>Emergency Hotlines</SafeCardTitle>
                <SafeCardDescription>Available 24/7 for immediate support</SafeCardDescription>
              </SafeCardHeader>
              <SafeCardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary-soft rounded-lg">
                  <div>
                    <p className="font-medium text-primary">National Hotline</p>
                    <p className="text-sm text-primary/80">Crisis counseling & support</p>
                  </div>
                  <SafeButton variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </SafeButton>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent-soft rounded-lg">
                  <div>
                    <p className="font-medium text-accent">Local Police</p>
                    <p className="text-sm text-accent/80">Emergency law enforcement</p>
                  </div>
                  <SafeButton variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </SafeButton>
                </div>
              </SafeCardContent>
            </SafeCard>
          </div>
        ) : (
          <div className="space-y-6">
            {/* SOS Activated Status */}
            <SafeCard className="border-emergency/20 bg-emergency/5">
              <SafeCardContent className="text-center py-8">
                <div className="animate-pulse-gentle mb-4">
                  <AlertTriangle className="h-16 w-16 text-emergency mx-auto" />
                </div>
                <h2 className="text-xl font-bold text-emergency mb-2">SOS ACTIVATED</h2>
                <p className="text-emergency/80">
                  Help is on the way. Stay calm and stay safe.
                </p>
              </SafeCardContent>
            </SafeCard>

            {/* Status Updates */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-primary-soft rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-gentle"></div>
                <span className="text-sm text-primary">Location shared with emergency contacts</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-accent-soft rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse-gentle"></div>
                <span className="text-sm text-accent">Local authorities notified</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-secondary-soft rounded-lg">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-sm text-secondary">Support services alerted</span>
              </div>
            </div>

            {/* Cancel SOS */}
            <SafeCard>
              <SafeCardContent className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  If you're no longer in immediate danger:
                </p>
                <SafeButton
                  variant="outline"
                  onClick={() => setSosActivated(false)}
                >
                  I'm Safe Now
                </SafeButton>
              </SafeCardContent>
            </SafeCard>
          </div>
        )}
      </main>
    </div>
  )
}

export default Emergency