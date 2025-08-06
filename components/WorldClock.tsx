import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { PixelGlobeIcon } from './PixelGlobeIcon'
import { timezoneService, type SavedTimezone, type TimezoneData } from '../services/timezoneService'
import { Clock, RefreshCw, Wifi, WifiOff, Sun, Moon, Sunrise, Sunset, AlertCircle, Play, Pause } from 'lucide-react'

interface WorldClockProps {
  timezones: SavedTimezone[]
  isOnline?: boolean
  onHapticFeedback?: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection') => void
}

interface ClockData extends TimezoneData {
  label: string
  lastUpdated: number
  error?: string
}

interface TimeInfo {
  time: string
  date: string
  timeOfDay: 'night' | 'dawn' | 'day' | 'dusk'
  relativeTime: string
}

export function WorldClock({ timezones, isOnline = true, onHapticFeedback }: WorldClockProps) {
  const [clockData, setClockData] = useState<Record<string, ClockData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [useRealTime, setUseRealTime] = useState(true)

  // Update current time every second for real-time display
  useEffect(() => {
    if (useRealTime) {
      const interval = setInterval(() => {
        setCurrentTime(new Date())
        
        // Update timezone data using local calculation
        if (timezones.length > 0) {
          const newClockData: Record<string, ClockData> = {}
          
          timezones.forEach((tz) => {
            try {
              const timeData = timezoneService.calculateLocalTime(tz.timezone)
              newClockData[tz.timezone] = {
                ...timeData,
                label: tz.label,
                lastUpdated: Date.now()
              }
            } catch (err) {
              console.error(`Error calculating time for ${tz.timezone}:`, err)
              newClockData[tz.timezone] = {
                timezone: tz.timezone,
                time: '--:--:--',
                date: 'Error',
                timestamp: Date.now(),
                label: tz.label,
                lastUpdated: Date.now(),
                error: 'Failed to calculate time'
              }
            }
          })
          
          setClockData(newClockData)
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [useRealTime, timezones])

  // Fetch initial time data using local calculation
  const fetchTimeData = useCallback(async (force = false) => {
    if (timezones.length === 0) return

    setLoading(true)
    setError(null)

    try {
      // Use local calculation for better performance and reliability
      const newClockData: Record<string, ClockData> = {}
      
      timezones.forEach((tz) => {
        try {
          const timeData = timezoneService.calculateLocalTime(tz.timezone)
          newClockData[tz.timezone] = {
            ...timeData,
            label: tz.label,
            lastUpdated: Date.now()
          }
        } catch (err) {
          console.error(`Error calculating time for ${tz.timezone}:`, err)
          newClockData[tz.timezone] = {
            timezone: tz.timezone,
            time: '--:--:--',
            date: 'Failed to load',
            timestamp: Date.now(),
            label: tz.label,
            lastUpdated: Date.now(),
            error: 'Failed to load time data'
          }
        }
      })

      setClockData(newClockData)
      onHapticFeedback?.('light')
    } catch (err) {
      setError('Failed to fetch time data')
      onHapticFeedback?.('error')
      console.error('Error fetching time data:', err)
    } finally {
      setLoading(false)
    }
  }, [timezones, onHapticFeedback])

  // Load initial data when timezones change
  useEffect(() => {
    if (timezones.length > 0) {
      fetchTimeData()
    }
  }, [timezones, fetchTimeData])

  // Calculate real-time display for each timezone
  const getTimeInfo = useCallback((timezone: string, baseData?: ClockData): TimeInfo => {
    try {
      const timeData = timezoneService.calculateLocalTime(timezone)
      
      // Get hour for time of day calculation
      const hour = parseInt(timeData.time.split(':')[0])

      // Determine time of day
      let timeOfDay: 'night' | 'dawn' | 'day' | 'dusk'
      if (hour >= 6 && hour < 8) timeOfDay = 'dawn'
      else if (hour >= 8 && hour < 18) timeOfDay = 'day'
      else if (hour >= 18 && hour < 20) timeOfDay = 'dusk'
      else timeOfDay = 'night'

      // Calculate relative time to user's timezone
      const userTime = new Date()
      const timezoneTime = new Date(userTime.toLocaleString('en-US', { timeZone: timezone }))
      const diffHours = Math.round((timezoneTime.getTime() - userTime.getTime()) / (1000 * 60 * 60))
      
      let relativeTime = ''
      if (diffHours === 0) relativeTime = 'Same time'
      else if (diffHours > 0) relativeTime = `+${diffHours}h`
      else relativeTime = `${diffHours}h`

      return {
        time: timeData.time,
        date: timeData.date,
        timeOfDay,
        relativeTime
      }
    } catch (err) {
      console.error(`Error calculating time for ${timezone}:`, err)
      return {
        time: '--:--:--',
        date: 'Error',
        timeOfDay: 'day',
        relativeTime: '--'
      }
    }
  }, [currentTime])

  const getTimeOfDayIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'dawn': return <Sunrise className="w-4 h-4 text-orange-500" />
      case 'day': return <Sun className="w-4 h-4 text-yellow-500" />
      case 'dusk': return <Sunset className="w-4 h-4 text-orange-600" />
      case 'night': return <Moon className="w-4 h-4 text-blue-600" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleRefresh = () => {
    onHapticFeedback?.('light')
    fetchTimeData(true)
  }

  const toggleRealTime = () => {
    setUseRealTime(!useRealTime)
    if (!useRealTime) {
      // Force update when enabling real-time
      fetchTimeData(true)
    }
  }

  if (timezones.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <PixelGlobeIcon size={96} animate={true} className="mx-auto" />
          </div>
          <p className="text-gray-500 mb-4">Select time zones to see their current times</p>
          <p className="text-sm text-gray-400">Add time zones using the selector above</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="text-lg font-semibold">World Clocks</h3>
          {!isOnline && <WifiOff className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={toggleRealTime}
            variant="ghost"
            size="sm"
            className="p-2"
            title={useRealTime ? "Pause real-time updates" : "Start real-time updates"}
          >
            {useRealTime ? (
              <Pause className="w-4 h-4 text-orange-500" />
            ) : (
              <Play className="w-4 h-4 text-green-500" />
            )}
          </Button>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            style={{ borderColor: '#FFB74D', color: '#FFB74D' }}
            aria-label="Refresh all times"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Unable to update times</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2">
        {timezones.map((tz) => {
          const timeInfo = getTimeInfo(tz.timezone, clockData[tz.timezone])
          const hasError = clockData[tz.timezone]?.error
          
          return (
            <Card 
              key={tz.timezone} 
              className={`transition-all hover:shadow-md ${hasError ? 'border-red-200 bg-red-50/50' : 'bg-gradient-to-r from-orange-50 to-amber-50'}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-1.5" style={{ color: '#F57C00' }}>
                    {getTimeOfDayIcon(timeInfo.timeOfDay)}
                    <span>{tz.label}</span>
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {timeInfo.relativeTime}
                    {!isOnline && <WifiOff className="w-3 h-3" />}
                    {useRealTime && <Play className="w-3 h-3 text-green-500" title="Live" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {hasError ? (
                  <div className="text-red-600">
                    <div className="text-lg font-mono font-bold">--:--:--</div>
                    <div className="text-sm">Failed to load</div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="text-2xl font-mono font-bold" style={{ color: '#E65100' }}>
                      {timeInfo.time}
                    </div>
                    <div className="text-sm text-gray-600">
                      {timeInfo.date}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        timeInfo.timeOfDay === 'day' ? 'bg-yellow-400' :
                        timeInfo.timeOfDay === 'dawn' ? 'bg-orange-400' :
                        timeInfo.timeOfDay === 'dusk' ? 'bg-orange-600' :
                        'bg-blue-600'
                      }`}></span>
                      <span className="capitalize">{timeInfo.timeOfDay}</span>
                      {useRealTime && (
                        <span className="text-green-600">• Live</span>
                      )}
                      {clockData[tz.timezone]?.lastUpdated && (
                        <span>• Updated {Math.round((Date.now() - clockData[tz.timezone].lastUpdated) / 1000)}s ago</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Status Footer */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-orange-700">
              {useRealTime ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Real-time updates active</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span>
                    {!isOnline ? 'Offline mode' : 'Updates paused'}
                  </span>
                </>
              )}
            </div>
            <span className="text-orange-600">
              Local calculation
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}