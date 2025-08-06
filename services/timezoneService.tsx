import { projectId, publicAnonKey } from '../utils/supabase/info'

export interface SavedTimezone {
  timezone: string
  label: string
}

export interface TimezoneData {
  timezone: string
  time: string
  date: string
  timestamp: number
}

class TimezoneService {
  private baseUrl: string
  private enableServerCalls: boolean

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-1b2606a9`
    // Disable server calls in development or if we're having connection issues
    this.enableServerCalls = false // Set to false for now to use local calculation
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    if (!this.enableServerCalls) {
      throw new Error('Server calls disabled - using local fallback')
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HTTP ${response.status}: ${error}`)
    }

    return response.json()
  }

  async getUserTimezones(userId: string): Promise<SavedTimezone[]> {
    try {
      // Try localStorage first as a fallback
      const localData = localStorage.getItem(`user_timezones_${userId}`)
      if (localData) {
        return JSON.parse(localData)
      }

      if (this.enableServerCalls) {
        const data = await this.fetchWithAuth(`${this.baseUrl}/user/${userId}/timezones`)
        return data.timezones || []
      }

      // Return empty array if no server and no local data
      return []
    } catch (error) {
      console.error('Error fetching user timezones:', error)
      
      // Try localStorage as fallback
      try {
        const localData = localStorage.getItem(`user_timezones_${userId}`)
        return localData ? JSON.parse(localData) : []
      } catch (localError) {
        console.error('Error reading local timezones:', localError)
        return []
      }
    }
  }

  async saveUserTimezones(userId: string, timezones: SavedTimezone[]): Promise<void> {
    try {
      // Always save to localStorage first
      localStorage.setItem(`user_timezones_${userId}`, JSON.stringify(timezones))

      if (this.enableServerCalls) {
        await this.fetchWithAuth(`${this.baseUrl}/user/${userId}/timezones`, {
          method: 'POST',
          body: JSON.stringify({ timezones }),
        })
      }
    } catch (error) {
      console.error('Error saving user timezones:', error)
      // If server save fails but localStorage succeeded, that's okay
      // Don't throw error since localStorage save is sufficient for demo
    }
  }

  async getTimeForTimezone(timezone: string): Promise<TimezoneData> {
    try {
      // Always use local calculation for reliability
      return this.calculateLocalTime(timezone)
    } catch (error) {
      console.error(`Error fetching time for ${timezone}:`, error)
      throw new Error(`Failed to get time for ${timezone}`)
    }
  }

  async getServerHealth(): Promise<{ status: string; websocket_connections: number }> {
    if (!this.enableServerCalls) {
      return { status: 'disabled', websocket_connections: 0 }
    }

    try {
      return await this.fetchWithAuth(`${this.baseUrl}/health`)
    } catch (error) {
      console.error('Error checking server health:', error)
      return { status: 'error', websocket_connections: 0 }
    }
  }

  async getWebSocketStatus(): Promise<{ active_connections: number; server_time: string }> {
    if (!this.enableServerCalls) {
      return { active_connections: 0, server_time: new Date().toISOString() }
    }

    try {
      return await this.fetchWithAuth(`${this.baseUrl}/ws/status`)
    } catch (error) {
      console.error('Error checking WebSocket status:', error)
      return { active_connections: 0, server_time: new Date().toISOString() }
    }
  }

  // Calculate time for timezone using browser APIs (primary method)
  calculateLocalTime(timezone: string): TimezoneData {
    try {
      const now = new Date()
      
      const time = now.toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      const date = now.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      return {
        timezone,
        time,
        date,
        timestamp: now.getTime()
      }
    } catch (error) {
      console.error(`Error calculating time for ${timezone}:`, error)
      throw new Error(`Invalid timezone: ${timezone}`)
    }
  }

  // Get real-time data for multiple timezones
  getMultipleTimezoneData(timezones: string[]): Record<string, TimezoneData> {
    const result: Record<string, TimezoneData> = {}
    
    for (const timezone of timezones) {
      try {
        result[timezone] = this.calculateLocalTime(timezone)
      } catch (error) {
        console.error(`Error processing timezone ${timezone}:`, error)
        result[timezone] = {
          timezone,
          time: '--:--:--',
          date: 'Error',
          timestamp: Date.now()
        }
      }
    }
    
    return result
  }

  // Enable/disable server calls
  setServerEnabled(enabled: boolean) {
    this.enableServerCalls = enabled
  }

  // Check if server calls are enabled
  isServerEnabled(): boolean {
    return this.enableServerCalls
  }
}

export const timezoneService = new TimezoneService()