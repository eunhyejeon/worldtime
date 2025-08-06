import { useState, useEffect, useCallback, useRef } from 'react'
import { projectId } from '../utils/supabase/info'

interface TimeUpdate {
  type: 'time_update' | 'connected' | 'timezone_update' | 'pong'
  timestamp: number
  utc_time: string
  message?: string
  userId?: string
  timezones?: any[]
  client_timestamp?: number
}

interface WebSocketHook {
  isConnected: boolean
  lastUpdate: Date | null
  connectionError: string | null
  latency: number | null
  sendPing: () => void
  reconnect: () => void
}

export function useWebSocket(onTimeUpdate?: (data: TimeUpdate) => void): WebSocketHook {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [latency, setLatency] = useState<number | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const pingTimeoutRef = useRef<number | null>(null)
  const pingTimestampRef = useRef<number | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    try {
      // Clean up existing connection
      if (wsRef.current) {
        wsRef.current.close()
      }

      setConnectionError(null)
      
      // Determine WebSocket URL based on environment
      const wsUrl = window.location.hostname === 'localhost' 
        ? 'ws://localhost:3055/make-server-1b2606a9/ws'
        : `wss://${projectId}.supabase.co/functions/v1/make-server-1b2606a9/ws`

      console.log('Connecting to WebSocket:', wsUrl)
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttempts.current = 0
        
        // Start periodic ping to measure latency
        const startPing = () => {
          if (ws.readyState === WebSocket.OPEN) {
            pingTimestampRef.current = Date.now()
            ws.send(JSON.stringify({
              type: 'ping',
              timestamp: pingTimestampRef.current
            }))
          }
        }
        
        // Ping every 10 seconds
        pingTimeoutRef.current = window.setInterval(startPing, 10000)
        startPing() // Initial ping
      }

      ws.onmessage = (event) => {
        try {
          const data: TimeUpdate = JSON.parse(event.data)
          
          // Calculate latency for pong responses
          if (data.type === 'pong' && pingTimestampRef.current) {
            const currentLatency = Date.now() - pingTimestampRef.current
            setLatency(currentLatency)
            pingTimestampRef.current = null
          }
          
          // Update last update time for any message
          setLastUpdate(new Date())
          
          // Call the callback with the update
          if (onTimeUpdate) {
            onTimeUpdate(data)
          }
          
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        
        // Clear ping interval
        if (pingTimeoutRef.current) {
          clearInterval(pingTimeoutRef.current)
          pingTimeoutRef.current = null
        }
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)
          setConnectionError(`Connection lost. Reconnecting in ${Math.ceil(delay / 1000)}s...`)
          
          reconnectAttempts.current++
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect()
          }, delay)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionError('Connection failed. Using fallback mode.')
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionError('WebSocket connection error')
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setConnectionError('Failed to establish connection')
    }
  }, [onTimeUpdate, projectId])

  const sendPing = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      pingTimestampRef.current = Date.now()
      wsRef.current.send(JSON.stringify({
        type: 'ping',
        timestamp: pingTimestampRef.current
      }))
    }
  }, [])

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0
    connect()
  }, [connect])

  // Initialize connection
  useEffect(() => {
    connect()

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (pingTimeoutRef.current) {
        clearInterval(pingTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting')
      }
    }
  }, [connect])

  return {
    isConnected,
    lastUpdate,
    connectionError,
    latency,
    sendPing,
    reconnect
  }
}