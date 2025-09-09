import { useState, useEffect } from "react"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent, SafeCardHeader, SafeCardTitle } from "@/components/ui/safe-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, ExternalLink } from "lucide-react"

declare global {
  interface Window {
    GOOGLE_MAPS_API_KEY: string
  }
}

interface GoogleMapsWrapperProps {
  children: React.ReactNode
}

const GoogleMapsWrapper = ({ children }: GoogleMapsWrapperProps) => {
  const [apiKey, setApiKey] = useState("")
  const [isKeySet, setIsKeySet] = useState(false)

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = localStorage.getItem('google_maps_api_key')
    if (storedKey) {
      setApiKey(storedKey)
      setIsKeySet(true)
      // Set the key in the environment for the Maps component
      window.GOOGLE_MAPS_API_KEY = storedKey
    }
  }, [])

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('google_maps_api_key', apiKey)
      window.GOOGLE_MAPS_API_KEY = apiKey
      setIsKeySet(true)
    }
  }

  const handleClearKey = () => {
    localStorage.removeItem('google_maps_api_key')
    setApiKey("")
    setIsKeySet(false)
    window.GOOGLE_MAPS_API_KEY = ""
  }

  if (!isKeySet) {
    return (
      <div className="min-h-screen bg-soft-gradient flex items-center justify-center px-6">
        <SafeCard className="w-full max-w-md">
          <SafeCardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <SafeCardTitle>Google Maps Setup Required</SafeCardTitle>
          </SafeCardHeader>
          <SafeCardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              To use the Safe Routes feature, you need a Google Maps API key. 
              This will be stored securely in your browser.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">Google Maps API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <SafeButton 
              onClick={handleSetApiKey}
              disabled={!apiKey.trim()}
              className="w-full"
            >
              Set API Key
            </SafeButton>

            <div className="text-center">
              <SafeButton
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://console.cloud.google.com/google/maps-apis', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Get API Key from Google
              </SafeButton>
            </div>

            <div className="bg-accent-soft p-3 rounded-lg">
              <p className="text-xs text-accent">
                <strong>Note:</strong> Make sure to enable the "Maps JavaScript API" 
                and "Places API" in your Google Cloud Console.
              </p>
            </div>
          </SafeCardContent>
        </SafeCard>
      </div>
    )
  }

  return (
    <div className="relative">
      {children}
      <div className="fixed top-4 right-4 z-50">
        <SafeButton
          variant="ghost"
          size="sm"
          onClick={handleClearKey}
          className="text-xs opacity-50 hover:opacity-100"
        >
          Reset Maps Key
        </SafeButton>
      </div>
    </div>
  )
}

export default GoogleMapsWrapper