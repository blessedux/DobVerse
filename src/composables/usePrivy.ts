import { ref, onMounted } from 'vue'
import { PrivyClient } from '@privy-io/react-auth'

const privyClient = new PrivyClient({
  appId: import.meta.env.VITE_PRIVY_APP_ID,
})

export function usePrivy() {
  const isConnected = ref(false)
  const address = ref('')
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const user = await privyClient.getUser()
      isConnected.value = !!user
      if (user?.wallet?.address) {
        address.value = user.wallet.address
      }
    } catch (error) {
      console.error('Error initializing Privy:', error)
    } finally {
      isLoading.value = false
    }
  })

  const connect = async () => {
    try {
      await privyClient.login()
      const user = await privyClient.getUser()
      isConnected.value = !!user
      if (user?.wallet?.address) {
        address.value = user.wallet.address
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const disconnect = async () => {
    try {
      await privyClient.logout()
      isConnected.value = false
      address.value = ''
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  return {
    isConnected,
    address,
    isLoading,
    connect,
    disconnect
  }
} 