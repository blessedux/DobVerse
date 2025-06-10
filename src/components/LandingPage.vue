<template>
  <div class="min-h-screen flex items-center justify-center">
    <button 
      @click="connectWallet"
      class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Connect Wallet
    </button>
  </div>
</template>

<script setup lang="ts">
const connectWallet = async () => {
  // Privy integration will be added here once API key is provided
  console.log('Connecting wallet...')
}
</script> 