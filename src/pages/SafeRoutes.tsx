import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer, Polygon } from "@react-google-maps/api"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeCard, SafeCardContent } from "@/components/ui/safe-card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MapPin, Navigation, Phone, Eye } from "lucide-react"
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

// Custom marker icons
const markerIcons = {
  hospital: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#3b82f6" stroke="white" stroke-width="2"/>
      <path d="M16 8v16M8 16h16" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `),
  police: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#6366f1" stroke="white" stroke-width="2"/>
      <path d="M16 6l-4 4v6h8v-6l-4-4z M12 16v8h8v-8" fill="white"/>
    </svg>
  `),
  medical: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#10b981" stroke="white" stroke-width="2"/>
      <ellipse cx="16" cy="16" rx="8" ry="12" fill="white"/>
      <ellipse cx="16" cy="16" rx="6" ry="10" fill="#10b981"/>
    </svg>
  `),
  help_centre: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#f59e0b" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="10" fill="white"/>
      <circle cx="16" cy="16" r="6" fill="#f59e0b"/>
      <circle cx="16" cy="16" r="3" fill="white"/>
    </svg>
  `)
}

// Mock unsafe areas data
const unsafeAreas = [
  {
    id: 'unsafe_1',
    coordinates: [
      { lat: 40.7200, lng: -74.0100 },
      { lat: 40.7250, lng: -74.0050 },
      { lat: 40.7220, lng: -74.0000 },
      { lat: 40.7170, lng: -74.0050 }
    ]
  }
]

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
}

const libraries: ("places" | "geometry")[] = ["places", "geometry"]

const SafeRoutes = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (window as any).GOOGLE_MAPS_API_KEY || "",
    libraries
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>(defaultCenter)
  const [selectedLocation, setSelectedLocation] = useState<SafetyLocation | null>(null)
  const [searchDestination, setSearchDestination] = useState("")
  const [quickExitMode, setQuickExitMode] = useState(false)
  const [sosMode, setSosMode] = useState(false)
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
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

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

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

  const planRoute = useCallback(() => {
    if (!map || !searchDestination) return

    const directionsService = new google.maps.DirectionsService()
    
    directionsService.route(
      {
        origin: userLocation,
        destination: searchDestination,
        travelMode: google.maps.TravelMode.WALKING,
        avoidHighways: true,
        avoidTolls: true
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirectionsResponse(result)
        } else {
          toast({
            title: "Route not found",
            description: "Unable to find a safe route to your destination."
          })
        }
      }
    )
  }, [map, searchDestination, userLocation, toast])

  const quickExit = () => {
    setQuickExitMode(true)
    setTimeout(() => setQuickExitMode(false), 3000)
  }

  const findNearestEmergencyLocation = () => {
    const emergencyLocations = safetyLocations.filter(
      loc => loc.type === 'hospital' || loc.type === 'police'
    )
    
    if (emergencyLocations.length > 0) {
      const nearest = emergencyLocations[0] // In real app, calculate actual nearest
      handleDirections(nearest)
    }
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-soft-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
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
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Where do you want to go?"
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="pl-10"
            />
          </div>
          <SafeButton onClick={planRoute} disabled={!searchDestination}>
            Plan Route
          </SafeButton>
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
            <p className="text-sm text-emergency font-medium mb-2">
              🚨 Emergency Mode: Nearest hospitals and police stations are highlighted
            </p>
            <SafeButton
              variant="emergency"
              size="sm"
              onClick={findNearestEmergencyLocation}
            >
              Navigate to Nearest Help
            </SafeButton>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="px-6 pb-6">
        <div className="h-96 rounded-lg overflow-hidden shadow-lg">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ]
            }}
          >
            {/* User location marker */}
            <Marker
              position={userLocation}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#4BB5A7" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24)
              }}
              title="Your location"
            />

            {/* Safety location markers */}
            {safetyLocations
              .filter(location => filters[location.type])
              .map(location => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={{
                    url: markerIcons[location.type],
                    scaledSize: new window.google.maps.Size(32, 32)
                  }}
                  onClick={() => handleLocationSelect(location)}
                  animation={sosMode && (location.type === 'hospital' || location.type === 'police') 
                    ? window.google.maps.Animation.BOUNCE 
                    : undefined}
                />
              ))}

            {/* Info window for selected location */}
            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold mb-1">{selectedLocation.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedLocation.address}</p>
                  <p className="text-sm font-medium mb-3">{selectedLocation.phone}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCall(selectedLocation.phone)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      📞 Call
                    </button>
                    <button
                      onClick={() => handleDirections(selectedLocation)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      📍 Directions
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Directions renderer */}
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: "#10b981",
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                  }
                }}
              />
            )}

            {/* Unsafe area polygons */}
            {unsafeAreas.map(area => (
              <Polygon
                key={area.id}
                paths={area.coordinates}
                options={{
                  fillColor: "#ef4444",
                  fillOpacity: 0.2,
                  strokeColor: "#ef4444",
                  strokeOpacity: 0.6,
                  strokeWeight: 2
                }}
              />
            ))}
          </GoogleMap>
        </div>
      </div>

      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6">
        <SafeButton
          variant="emergency"
          size="lg"
          onClick={() => navigate("/emergency")}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          🆘
        </SafeButton>
      </div>
    </div>
  )
}

export default SafeRoutes