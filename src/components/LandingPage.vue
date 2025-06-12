<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="w-full max-w-md flex flex-col items-center">
      <img class="mx-auto h-12 w-auto mb-6" src="../assets/logo.png" alt="Logo" />
      <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Welcome to DobVerse</h2>
      <p class="text-gray-500 mb-8">Connect your wallet to get started</p>
      <button
        @click="connectWallet"
        class="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        Connect Wallet
      </button>
      <div v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref('')

// Add your whitelisted addresses here (any case)
const WHITELIST = [
  '0x45C53082da755E8B1A0844AB5aBcc035E4a2e84D', 
  // Add more addresses as needed
].map(addr => addr.toLowerCase());

const connectWallet = async () => {
  error.value = ''
  if (!window.ethereum) {
    error.value = 'No Ethereum wallet found. Please install MetaMask.'
    return
  }
  try {
    // 1. Prompt wallet connection
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    if (!accounts || !accounts[0]) {
      error.value = 'No wallet address found.'
      return
    }
    const address = accounts[0].toLowerCase()
    // 2. Prompt for signature
    const message = 'Sign in to DobVerse'
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    })
    if (!signature) {
      error.value = 'Signature required to enter the app.'
      return
    }
    // 3. Whitelist check
    if (WHITELIST.includes(address)) {
      router.push('/main')
    } else {
      error.value = 'This wallet is not authorized to access the app.'
    }
  } catch (err: any) {
    error.value = err?.message || 'Wallet connection failed.'
  }
}
</script> 