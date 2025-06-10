<template>
  <div class="min-h-screen flex items-center justify-center">
    <button 
      @click="handleWalletConnect"
      class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      :disabled="isLoading"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWallet } from '../composables/useWallet'

const { isConnected, isLoading, connect, disconnect } = useWallet()

const buttonText = computed(() => {
  if (isLoading.value) return 'Loading...'
  return isConnected.value ? 'Disconnect Wallet' : 'Connect Wallet'
})

const handleWalletConnect = async () => {
  if (isConnected.value) {
    disconnect()
  } else {
    await connect()
  }
}
</script> 