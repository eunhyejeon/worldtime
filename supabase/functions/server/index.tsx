import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Enable CORS for all routes
app.use('*', cors({
  origin: ['https://terra-pacing-05021987.figma.site', 'http://localhost:3000'],
  credentials: true,
}))

// Enable logging
app.use('*', logger(console.log))

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// WebSocket connections store
const wsConnections = new Set<WebSocket>()

// Broadcast current time to all connected clients
function broadcastTime() {
  const timeData = {
    type: 'time_update',
    timestamp: Date.now(),
    utc_time: new Date().toISOString(),
  }

  const message = JSON.stringify(timeData)
  
  // Remove closed connections and broadcast to active ones
  for (const ws of wsConnections) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(message)
      } catch (error) {
        console.log('Error sending WebSocket message:', error)
        wsConnections.delete(ws)
      }
    } else {
      wsConnections.delete(ws)
    }
  }
}

// Start broadcasting time every second
setInterval(broadcastTime, 1000)

// WebSocket upgrade handler
app.get('/make-server-1b2606a9/ws', (c) => {
  const upgrade = c.req.header('upgrade')
  if (upgrade !== 'websocket') {
    return c.text('Expected websocket', 400)
  }

  const { socket, response } = Deno.upgradeWebSocket(c.req.raw)
  
  socket.addEventListener('open', () => {
    console.log('WebSocket client connected')
    wsConnections.add(socket)
    
    // Send initial time data
    const initialData = {
      type: 'connected',
      timestamp: Date.now(),
      utc_time: new Date().toISOString(),
      message: 'Real-time clock updates enabled'
    }
    socket.send(JSON.stringify(initialData))
  })

  socket.addEventListener('close', () => {
    console.log('WebSocket client disconnected')
    wsConnections.delete(socket)
  })

  socket.addEventListener('error', (error) => {
    console.log('WebSocket error:', error)
    wsConnections.delete(socket)
  })

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('WebSocket message received:', data)
      
      // Echo back with timestamp for latency testing
      if (data.type === 'ping') {
        socket.send(JSON.stringify({
          type: 'pong',
          timestamp: Date.now(),
          client_timestamp: data.timestamp
        }))
      }
    } catch (error) {
      console.log('Error parsing WebSocket message:', error)
    }
  })

  return response
})

// Health check
app.get('/make-server-1b2606a9/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    websocket_connections: wsConnections.size
  })
})

// Get user timezones
app.get('/make-server-1b2606a9/user/:userId/timezones', async (c) => {
  try {
    const userId = c.req.param('userId')
    const timezones = await kv.get(`user_timezones_${userId}`)
    return c.json({ timezones: timezones || [] })
  } catch (error) {
    console.log('Error fetching user timezones:', error)
    return c.json({ error: 'Failed to fetch timezones' }, 500)
  }
})

// Save user timezones
app.post('/make-server-1b2606a9/user/:userId/timezones', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { timezones } = await c.req.json()
    
    await kv.set(`user_timezones_${userId}`, timezones)
    
    // Broadcast timezone update to all connected clients
    const updateData = {
      type: 'timezone_update',
      userId,
      timezones,
      timestamp: Date.now()
    }
    
    const message = JSON.stringify(updateData)
    for (const ws of wsConnections) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(message)
        } catch (error) {
          console.log('Error broadcasting timezone update:', error)
        }
      }
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Error saving user timezones:', error)
    return c.json({ error: 'Failed to save timezones' }, 500)
  }
})

// Get current time for specific timezone
app.get('/make-server-1b2606a9/timezone/:timezone', async (c) => {
  try {
    const timezone = decodeURIComponent(c.req.param('timezone'))
    const now = new Date()
    
    const timeData = {
      timezone,
      timestamp: now.getTime(),
      utc_time: now.toISOString(),
      local_time: now.toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      date: now.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return c.json(timeData)
  } catch (error) {
    console.log('Error getting timezone data:', error)
    return c.json({ error: 'Invalid timezone' }, 400)
  }
})

// WebSocket connection status
app.get('/make-server-1b2606a9/ws/status', (c) => {
  return c.json({
    active_connections: wsConnections.size,
    server_time: new Date().toISOString(),
    uptime: Date.now()
  })
})

console.log('Server starting with WebSocket support on port 3055...')
console.log('WebSocket endpoint: /make-server-1b2606a9/ws')

Deno.serve({
  port: 3055,
  hostname: '0.0.0.0'
}, app.fetch)