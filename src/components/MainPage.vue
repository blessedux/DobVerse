<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="../assets/logo.png" alt="Logo" />
            </div>
          </div>
          <div class="flex items-center">
            <div class="ml-4 flex items-center md:ml-6">
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">
                  {{ shortAddress }}
                </span>
                <button
                  @click="disconnect"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <BlocksDemo />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletConnect } from '../composables/useWalletConnect'
import BlocksDemo from './BlocksDemo.vue'

const router = useRouter()
const { address, disconnect: disconnectWallet } = useWalletConnect()

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const disconnect = async () => {
  await disconnectWallet()
  router.push('/')
}
</script> 