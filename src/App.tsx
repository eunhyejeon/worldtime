import React, { useState, useEffect } from 'react'

interface TimeZone {
  city: string
  timezone: string
  flag: string
}

const timeZones: TimeZone[] = [
  { city: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Sydney', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { city: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' }
]

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (timezone: string) => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (timezone: string) => {
    return currentTime.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-800 mb-2">
            🌍 World Time
          </h1>
          <p className="text-xl text-orange-600 mb-4">
            Know the time anywhere, anytime
          </p>
          <div className="text-sm text-orange-500">
            Updated every second • Farcaster Mini App
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeZones.map((location) => (
            <div 
              key={location.city} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-orange-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">{location.city}</h3>
                <span className="text-2xl">{location.flag}</span>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-orange-600 mb-2">
                  {formatTime(location.timezone)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(location.timezone)}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 text-center">
                  {location.timezone.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <footer className="text-center mt-12 text-gray-500">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm">
              🕐 World Time Checker - Track time zones across the globe
            </p>
            <p className="text-xs mt-2">
              Built for Farcaster • Updates in real-time
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App