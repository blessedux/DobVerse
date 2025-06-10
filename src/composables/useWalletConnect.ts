import { ref, onMounted } from 'vue'

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (...args: any[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useWalletConnect() {
  const address = ref('')
  const isConnected = ref(false)
  const isLoading = ref(false)
  const ready = ref(true)
  const error = ref<string | null>(null)

  const checkIfWalletIsInstalled = () => {
    if (!window.ethereum) {
      error.value = 'Please install MetaMask or another Web3 wallet'
      return false
    }
    return true
  }

  const connect = async () => {
    try {
      error.value = null
      isLoading.value = true
      
      if (!checkIfWalletIsInstalled()) {
        return
      }

      // Request account access
      const accounts = await window.ethereum!.request({ 
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        address.value = accounts[0]
        isConnected.value = true
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err)
      error.value = err.message || 'Failed to connect wallet'
      isConnected.value = false
      address.value = ''
    } finally {
      isLoading.value = false
    }
  }

  const disconnect = async () => {
    try {
      error.value = null
      address.value = ''
      isConnected.value = false
    } catch (err: any) {
      console.error('Error disconnecting wallet:', err)
      error.value = err.message || 'Failed to disconnect wallet'
    }
  }

  const checkConnection = async () => {
    try {
      if (!checkIfWalletIsInstalled()) {
        return
      }

      const accounts = await window.ethereum!.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        address.value = accounts[0]
        isConnected.value = true
      }
    } catch (err: any) {
      console.error('Error checking connection:', err)
      error.value = err.message || 'Failed to check wallet connection'
    }
  }

  onMounted(async () => {
    await checkConnection()

    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          address.value = accounts[0]
          isConnected.value = true
        } else {
          address.value = ''
          isConnected.value = false
        }
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  })

  return {
    address,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    ready
  }
} 