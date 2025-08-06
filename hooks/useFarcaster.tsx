import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterState {
  isReady: boolean
  error: string | null
  capabilities: string[]
  isInMiniApp: boolean
  context: any
}

export function useFarcaster() {
  const [state, setState] = useState<FarcasterState>({
    isReady: false,
    error: null,
    capabilities: [],
    isInMiniApp: false,
    context: null
  })

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        // Check if we're in a Mini App environment
        const inMiniApp = await sdk.isInMiniApp()
        
        if (!inMiniApp) {
          setState({
            isReady: true,
            error: 'Running in development mode outside Farcaster',
            capabilities: [],
            isInMiniApp: false,
            context: null
          })
          return
        }

        // Get capabilities if we're in a Mini App
        const capabilities = await sdk.getCapabilities()
        
        setState(prev => ({
          ...prev,
          isReady: true,
          capabilities,
          isInMiniApp: true,
          context: sdk.context
        }))

      } catch (err) {
        console.error('Farcaster SDK initialization error:', err)
        
        // In development, still set ready to true
        setState({
          isReady: true,
          error: `Failed to initialize Farcaster SDK: ${err instanceof Error ? err.message : 'Unknown error'}`,
          capabilities: [],
          isInMiniApp: false,
          context: null
        })
      }
    }

    initializeFarcaster()
  }, [])

  return {
    isReady: state.isReady,
    error: state.error,
    capabilities: state.capabilities,
    isInMiniApp: state.isInMiniApp,
    context: state.context,
    
    // Helper methods for common capability checks
    hasCapability: (capability: string) => state.capabilities.includes(capability),
    hasHaptics: state.capabilities.some(cap => cap.startsWith('haptics.')),
    hasWallet: state.capabilities.includes('wallet.getEthereumProvider'),
    hasQuickAuth: state.capabilities.includes('quickAuth.getToken')
  }
}