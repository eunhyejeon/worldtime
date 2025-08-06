import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { PixelGlobeIcon } from './PixelGlobeIcon'
import { X, Plus, Search, MapPin, Clock, Star, StarOff, Globe } from 'lucide-react'
import type { SavedTimezone } from '../services/timezoneService'

interface TimezoneSelectorProps {
  selectedTimezones: SavedTimezone[]
  onTimezonesChange: (timezones: SavedTimezone[]) => void
  onHapticFeedback?: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection') => void
}

const WORLD_TIMEZONES = [
  { value: 'Asia/Seoul', label: 'Seoul (KST)', region: 'Asia', popular: true },
  { value: 'America/New_York', label: 'New York (EST/EDT)', region: 'North America', popular: true },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', region: 'North America', popular: true },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', region: 'North America', popular: true },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', region: 'North America', popular: false },
  { value: 'Europe/London', label: 'London (GMT/BST)', region: 'Europe', popular: true },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', region: 'Europe', popular: true },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', region: 'Europe', popular: true },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', region: 'Europe', popular: false },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', region: 'Europe', popular: false },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', region: 'Europe', popular: false },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)', region: 'Europe', popular: false },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', region: 'Europe', popular: true },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', region: 'Asia', popular: true },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', region: 'Asia', popular: true },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', region: 'Asia', popular: true },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', region: 'Asia', popular: true },
  { value: 'Asia/Mumbai', label: 'Mumbai (IST)', region: 'Asia', popular: true },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', region: 'Asia', popular: true },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', region: 'Asia', popular: false },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', region: 'Oceania', popular: true },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', region: 'Oceania', popular: false },
  { value: 'Australia/Perth', label: 'Perth (AWST)', region: 'Oceania', popular: false },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', region: 'Oceania', popular: true },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', region: 'North America', popular: true },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', region: 'North America', popular: false },
  { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)', region: 'North America', popular: false },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', region: 'South America', popular: true },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART)', region: 'South America', popular: true },
  { value: 'Africa/Cairo', label: 'Cairo (EET)', region: 'Africa', popular: true },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)', region: 'Africa', popular: true },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', region: 'Africa', popular: true },
]

const REGIONS = ['Popular', 'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania']

export function TimezoneSelector({ selectedTimezones, onTimezonesChange, onHapticFeedback }: TimezoneSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSelector, setShowSelector] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('Popular')
  const [favorites, setFavorites] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search input when selector opens
  useEffect(() => {
    if (showSelector && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSelector])

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('timezone-favorites')
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('timezone-favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }, [favorites])

  const getFilteredTimezones = () => {
    let timezones = WORLD_TIMEZONES.filter(tz =>
      !selectedTimezones.some(selected => selected.timezone === tz.value)
    )

    // Apply search filter
    if (searchTerm) {
      timezones = timezones.filter(tz =>
        tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply region filter
    if (selectedRegion === 'Popular') {
      // Show popular timezones and favorites
      timezones = timezones.filter(tz => 
        tz.popular || favorites.includes(tz.value)
      )
    } else {
      timezones = timezones.filter(tz => tz.region === selectedRegion)
    }

    // Sort: favorites first, then alphabetically
    return timezones.sort((a, b) => {
      const aFav = favorites.includes(a.value)
      const bFav = favorites.includes(b.value)
      
      if (aFav && !bFav) return -1
      if (!aFav && bFav) return 1
      return a.label.localeCompare(b.label)
    })
  }

  const addTimezone = (timezone: string, label: string) => {
    const newTimezone: SavedTimezone = { timezone, label }
    onTimezonesChange([...selectedTimezones, newTimezone])
    onHapticFeedback?.('light')
    setShowSelector(false)
    setSearchTerm('')
  }

  const removeTimezone = (timezone: string) => {
    onTimezonesChange(selectedTimezones.filter(tz => tz.timezone !== timezone))
    onHapticFeedback?.('light')
  }

  const toggleFavorite = (timezone: string) => {
    const newFavorites = favorites.includes(timezone)
      ? favorites.filter(fav => fav !== timezone)
      : [...favorites, timezone]
    
    setFavorites(newFavorites)
    onHapticFeedback?.('selection')
  }

  const clearAll = () => {
    if (selectedTimezones.length > 0) {
      onTimezonesChange([])
      onHapticFeedback?.('medium')
    }
  }

  const addPopularTimezones = () => {
    const popular = WORLD_TIMEZONES
      .filter(tz => tz.popular && !selectedTimezones.some(s => s.timezone === tz.value))
      .slice(0, 5)
      .map(tz => ({ timezone: tz.value, label: tz.label }))
    
    onTimezonesChange([...selectedTimezones, ...popular])
    onHapticFeedback?.('medium')
  }

  const filteredTimezones = getFilteredTimezones()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Selected Time Zones</h3>
          <p className="text-sm text-gray-500">
            {selectedTimezones.length} of 10 zones selected
          </p>
        </div>
        <div className="flex gap-2">
          {selectedTimezones.length > 0 && (
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
          <Button
            onClick={() => setShowSelector(!showSelector)}
            variant="outline"
            size="sm"
            style={{ borderColor: '#FFB74D', color: '#FFB74D' }}
            disabled={selectedTimezones.length >= 10}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </div>

      {selectedTimezones.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <PixelGlobeIcon size={72} animate={true} className="mx-auto" />
            </div>
            <p className="text-gray-500 mb-4">No time zones selected</p>
            <p className="text-xs text-gray-400 mb-4">
              💡 You can also use URL parameters: ?tz1=Asia/Seoul&tz2=America/New_York
            </p>
            <Button
              onClick={addPopularTimezones}
              variant="outline"
              size="sm"
              style={{ borderColor: '#FFB74D', color: '#FFB74D' }}
            >
              <Star className="w-4 h-4 mr-2" />
              Add Popular Zones
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedTimezones.map((tz) => (
        <Card key={tz.timezone} className="transition-all hover:shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium">{tz.label}</span>
                <p className="text-xs text-gray-500">{tz.timezone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => toggleFavorite(tz.timezone)}
                variant="ghost"
                size="sm"
                className="p-1"
                aria-label={favorites.includes(tz.timezone) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorites.includes(tz.timezone) ? (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="w-4 h-4 text-gray-400" />
                )}
              </Button>
              <Button
                onClick={() => removeTimezone(tz.timezone)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 p-1"
                aria-label={`Remove ${tz.label}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {showSelector && (
        <Card className="border-2" style={{ borderColor: '#FFB74D' }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PixelGlobeIcon size={24} />
                <span>Add Time Zone</span>
              </div>
              <Button
                onClick={() => setShowSelector(false)}
                variant="ghost"
                size="sm"
                className="p-1"
                aria-label="Close timezone selector"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                placeholder="Search time zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search time zones"
              />
            </div>

            {/* Region Filter */}
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <Button
                  key={region}
                  onClick={() => {
                    setSelectedRegion(region)
                    onHapticFeedback?.('selection')
                  }}
                  variant={selectedRegion === region ? "default" : "outline"}
                  size="sm"
                  className={selectedRegion === region ? 'bg-orange-400 hover:bg-orange-500' : ''}
                >
                  {region}
                </Button>
              ))}
            </div>

            {/* URL Hint */}
            <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded">
              💡 <strong>Pro tip:</strong> Share URLs with timezone parameters!<br/>
              Example: <code className="bg-white px-1 rounded">?tz1=Asia/Seoul&tz2=America/New_York</code>
            </div>
          </CardHeader>
          
          <CardContent className="max-h-80 overflow-y-auto space-y-2">
            {filteredTimezones.length === 0 ? (
              <div className="text-center py-8">
                <PixelGlobeIcon size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-gray-500">
                  {searchTerm ? `No zones found matching "${searchTerm}"` : 'No zones available in this region'}
                </p>
              </div>
            ) : (
              filteredTimezones.map((tz) => (
                <Button
                  key={tz.value}
                  onClick={() => addTimezone(tz.value, tz.label)}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-orange-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{tz.label}</div>
                        <div className="text-xs text-gray-500">{tz.region} • {tz.value}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {favorites.includes(tz.value) && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {tz.popular && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}