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

// Add your whitelisted addresses here (lowercase)
const WHITELIST = [
  '0x1234abcd5678efgh9012ijkl3456mnop7890qrst', // example
  // Add more addresses as needed
]

const connectWallet = async () => {
  error.value = ''
  if (!window.ethereum) {
    error.value = 'No Ethereum wallet found. Please install MetaMask.'
    return
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    if (!accounts || !accounts[0]) {
      error.value = 'No wallet address found.'
      return
    }
    const address = accounts[0].toLowerCase()
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