import { ref } from 'vue'
import { ethers } from 'ethers'

export function useWallet() {
  const address = ref('')
  const isConnected = ref(false)
  const isLoading = ref(false)

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature')
      return
    }

    try {
      isLoading.value = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      address.value = await signer.getAddress()
      isConnected.value = true
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet')
    } finally {
      isLoading.value = false
    }
  }

  const disconnect = () => {
    address.value = ''
    isConnected.value = false
  }

  return {
    address,
    isConnected,
    isLoading,
    connect,
    disconnect
  }
} 