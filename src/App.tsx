import { useState, useEffect } from 'react'

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

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }

  const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '2rem'
  }

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#E65100',
    margin: '0 0 1rem 0'
  }

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#F57C00',
    marginBottom: '1rem'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #FFE0B2',
    transition: 'box-shadow 0.3s ease'
  }

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  }

  const cityStyle = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  }

  const flagStyle = {
    fontSize: '1.5rem'
  }

  const timeStyle = {
    fontSize: '2rem',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#F57C00',
    textAlign: 'center' as const,
    marginBottom: '0.5rem'
  }

  const dateStyle = {
    fontSize: '0.875rem',
    color: '#666',
    textAlign: 'center' as const,
    marginBottom: '1rem'
  }

  const timezoneStyle = {
    fontSize: '0.75rem',
    color: '#999',
    textAlign: 'center' as const,
    paddingTop: '1rem',
    borderTop: '1px solid #f0f0f0'
  }

  const footerStyle = {
    textAlign: 'center' as const,
    color: '#666'
  }

  const footerCardStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }

  return (
    <div style={containerStyle}>
      <div style={mainStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>
            🌍 World Time
          </h1>
          <p style={subtitleStyle}>
            Know the time anywhere, anytime
          </p>
          <div style={{fontSize: '0.875rem', color: '#F57C00'}}>
            Updated every second • Farcaster Mini App
          </div>
        </header>
        
        <div style={gridStyle}>
          {timeZones.map((location) => (
            <div 
              key={location.city} 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={cardHeaderStyle}>
                <h3 style={cityStyle}>{location.city}</h3>
                <span style={flagStyle}>{location.flag}</span>
              </div>
              
              <div style={timeStyle}>
                {formatTime(location.timezone)}
              </div>
              <div style={dateStyle}>
                {formatDate(location.timezone)}
              </div>
              
              <div style={timezoneStyle}>
                {location.timezone.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
        
        <footer style={footerStyle}>
          <div style={footerCardStyle}>
            <p style={{fontSize: '0.875rem', margin: '0 0 0.5rem 0'}}>
              🕐 World Time Checker - Track time zones across the globe
            </p>
            <p style={{fontSize: '0.75rem', margin: 0}}>
              Built for Farcaster • Updates in real-time
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App