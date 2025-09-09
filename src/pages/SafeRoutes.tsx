import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent } from "@/components/ui/safe-card"
import { Input } from "@/components/ui/input"
import { Wrapper } from "@googlemaps/react-wrapper"
import { ArrowLeft, MapPin, Navigation, Phone, Filter, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import GoogleMapsWrapper from "@/components/GoogleMapsWrapper"

// Safety marker types
type SafetyMarkerType = 'hospital' | 'police' | 'medical' | 'help_centre'

interface SafetyLocation {
  id: string
  name: string
  address: string
  phone: string
  type: SafetyMarkerType
  lat: number
  lng: number
}

interface FilterState {
  hospital: boolean
  police: boolean
  medical: boolean
  help_centre: boolean
}

// Mock data for safety locations
const safetyLocations: SafetyLocation[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Main St, Downtown',
    phone: '+1-555-0123',
    type: 'hospital',
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: '2',
    name: 'Central Police Station',
    address: '456 Safety Blvd',
    phone: '+1-555-0456',
    type: 'police',
    lat: 40.7589,
    lng: -73.9851
  },
  {
    id: '3',
    name: 'SafeHaven Crisis Center',
    address: '789 Hope Avenue',
    phone: '+1-555-0789',
    type: 'help_centre',
    lat: 40.7505,
    lng: -73.9934
  },
  {
    id: '4',
    name: '24/7 Pharmacy',
    address: '321 Health Road',
    phone: '+1-555-0321',
    type: 'medical',
    lat: 40.7282,
    lng: -73.9942
  }
]

const markerIcons = {
  hospital: '🏥',
  police: '🛡️', 
  medical: '💊',
  help_centre: '🆘'
}

const markerColors = {
  hospital: '#3b82f6', // blue
  police: '#6366f1', // indigo  
  medical: '#10b981', // emerald
  help_centre: '#f59e0b' // amber
}

interface MapComponentProps {
  center: google.maps.LatLngLiteral
  zoom: number
  locations: SafetyLocation[]
  filters: FilterState
  onLocationSelect: (location: SafetyLocation) => void
  searchDestination: string
  sosMode: boolean
}

const MapComponent = ({ center, zoom, locations, filters, onLocationSelect, searchDestination, sosMode }: MapComponentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })
      setMap(newMap)
    }
  }, [ref, map, center, zoom])

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker.setMap(null))
    setMarkers([])
  }, [markers])

  // Add markers based on filters
  useEffect(() => {
    if (!map) return

    clearMarkers()
    const newMarkers: google.maps.Marker[] = []

    const filteredLocations = locations.filter(location => filters[location.type])

    filteredLocations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="${markerColors[location.type]}" stroke="white" stroke-width="2"/>
              <text x="20" y="25" text-anchor="middle" font-size="16" fill="white">${markerIcons[location.type]}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      })

      marker.addListener('click', () => {
        onLocationSelect(location)
      })

      // Highlight in SOS mode
      if (sosMode && (location.type === 'hospital' || location.type === 'police')) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(() => marker.setAnimation(null), 3000)
      }

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)
  }, [map, locations, filters, clearMarkers, onLocationSelect, sosMode])

  return <div ref={ref} className="w-full h-full rounded-lg" />
}

const SafeRoutes = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>({ lat: 40.7128, lng: -74.0060 })
  const [selectedLocation, setSelectedLocation] = useState<SafetyLocation | null>(null)
  const [searchDestination, setSearchDestination] = useState("")
  const [quickExitMode, setQuickExitMode] = useState(false)
  const [sosMode, setSosMode] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    hospital: true,
    police: true,
    medical: true,
    help_centre: true
  })

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location access needed",
            description: "Please enable location services for better safety features."
          })
        }
      )
    }
  }, [toast])

  // Check for SOS mode from emergency page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('sos') === 'true') {
      setSosMode(true)
      toast({
        title: "Emergency Mode",
        description: "Showing nearest hospitals and police stations.",
      })
    }
  }, [toast])

  const toggleFilter = (type: SafetyMarkerType) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }))
  }

  const handleLocationSelect = (location: SafetyLocation) => {
    setSelectedLocation(location)
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const handleDirections = (location: SafetyLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${location.lat},${location.lng}`
    window.open(url, '_blank')
  }

  const quickExit = () => {
    setQuickExitMode(true)
    setTimeout(() => setQuickExitMode(false), 3000)
  }

  if (quickExitMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="h-16 w-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            📝
          </div>
          <h1 className="text-2xl font-bold mb-4">Notes</h1>
          <div className="space-y-3 w-full">
            {Array.from({length: 4}, (_, i) => (
              <div key={i} className="h-8 bg-muted rounded-lg"></div>
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
              <h1 className="text-xl font-semibold text-primary">Safe Routes</h1>
              <p className="text-sm text-muted-foreground">Find your safest path</p>
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

      {/* Search & Filters */}
      <div className="px-6 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where do you want to go?"
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { key: 'hospital' as SafetyMarkerType, label: 'Hospitals', icon: '🏥' },
            { key: 'police' as SafetyMarkerType, label: 'Police', icon: '🛡️' },
            { key: 'medical' as SafetyMarkerType, label: 'Pharmacy', icon: '💊' },
            { key: 'help_centre' as SafetyMarkerType, label: 'Help Centres', icon: '🆘' }
          ].map((filter) => (
            <SafeButton
              key={filter.key}
              variant={filters[filter.key] ? "primary" : "outline"}
              size="sm"
              onClick={() => toggleFilter(filter.key)}
              className="flex-shrink-0"
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </SafeButton>
          ))}
        </div>

        {sosMode && (
          <div className="bg-emergency/10 border border-emergency/20 rounded-lg p-3">
            <p className="text-sm text-emergency font-medium">
              🚨 Emergency Mode: Nearest hospitals and police stations are highlighted
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="px-6 pb-6">
        <div className="h-96 rounded-lg overflow-hidden shadow-lg">
          <GoogleMapsWrapper>
            <Wrapper apiKey={(window as any).GOOGLE_MAPS_API_KEY || ""}>
              <MapComponent
                center={userLocation}
                zoom={14}
                locations={safetyLocations}
                filters={filters}
                onLocationSelect={handleLocationSelect}
                searchDestination={searchDestination}
                sosMode={sosMode}
              />
            </Wrapper>
          </GoogleMapsWrapper>
        </div>
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 p-6">
          <SafeCard>
            <SafeCardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{markerIcons[selectedLocation.type]}</span>
                    <h3 className="font-semibold">{selectedLocation.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{selectedLocation.address}</p>
                  <p className="text-sm text-primary font-medium">{selectedLocation.phone}</p>
                </div>
                <SafeButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                >
                  ✕
                </SafeButton>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <SafeButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleCall(selectedLocation.phone)}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </SafeButton>
                <SafeButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleDirections(selectedLocation)}
                  className="flex-1"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Directions
                </SafeButton>
              </div>
            </SafeCardContent>
          </SafeCard>
        </div>
      )}
    </div>
  )
}

export default SafeRoutes