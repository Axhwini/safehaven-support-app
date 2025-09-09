import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent, SafeCardDescription, SafeCardHeader, SafeCardTitle } from "@/components/ui/safe-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, Upload, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Report = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: "",
    date: "",
    time: "",
    anonymous: true
  })

  const incidentTypes = [
    "Harassment",
    "Physical violence",
    "Sexual assault",
    "Domestic violence",
    "Stalking",
    "Online abuse",
    "Other"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Report submitted safely",
      description: "Your report is safe. You're not alone. Support is available 24/7.",
    })
    navigate("/dashboard")
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-soft-gradient">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-primary/10 px-6 py-4">
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
              <h1 className="text-xl font-semibold text-primary">Report Incident</h1>
              <p className="text-sm text-muted-foreground">Step {step} of 3</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm text-primary font-medium">Anonymous</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex-1 h-2 rounded-full ${
                stepNumber <= step ? 'bg-primary' : 'bg-primary/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-4 pb-24">
        <form onSubmit={handleSubmit}>
          <SafeCard>
            <SafeCardHeader>
              <SafeCardTitle>
                {step === 1 && "What happened?"}
                {step === 2 && "When and where?"}
                {step === 3 && "Additional details"}
              </SafeCardTitle>
              <SafeCardDescription>
                {step === 1 && "Your information is completely secure and anonymous"}
                {step === 2 && "Help us understand the context"}
                {step === 3 && "Any additional information you'd like to share"}
              </SafeCardDescription>
            </SafeCardHeader>

            <SafeCardContent className="space-y-6">
              {/* Step 1: What happened */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type of incident</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger className="h-12 rounded-xl border-primary/20">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {incidentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe what happened. Take your time and share only what you feel comfortable sharing."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="min-h-32 rounded-xl border-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: When and where */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Where did this happen? (optional)"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="pl-10 h-12 rounded-xl border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="h-12 rounded-xl border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="h-12 rounded-xl border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-accent-soft rounded-xl border border-accent/20">
                      <h4 className="font-medium text-accent mb-2">Optional attachments</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        You can add photos, audio recordings, or documents if you feel comfortable doing so.
                      </p>
                      <SafeButton variant="outline" type="button" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload files (optional)
                      </SafeButton>
                    </div>

                    <div className="p-4 bg-primary-soft rounded-xl border border-primary/20">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium text-primary">Your privacy is protected</h4>
                          <p className="text-sm text-primary/80">
                            This report is anonymous and encrypted. Only authorized support staff can access it.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SafeCardContent>
          </SafeCard>
        </form>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-primary/10 px-6 py-4">
        <div className="flex space-x-4">
          {step > 1 && (
            <SafeButton
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              Previous
            </SafeButton>
          )}
          
          {step < 3 ? (
            <SafeButton
              onClick={nextStep}
              className="flex-1"
              disabled={step === 1 && (!formData.type || !formData.description)}
            >
              Continue
            </SafeButton>
          ) : (
            <SafeButton
              onClick={handleSubmit}
              className="flex-1"
            >
              Submit Report
            </SafeButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default Report