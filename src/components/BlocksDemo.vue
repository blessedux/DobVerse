<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Demo Blocks</h2>
      <p class="text-gray-600">Explore the different types of blocks available in DobVerse</p>
    </div>

    <!-- Blocks Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Text Block -->
      <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Text Block</h3>
          <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Basic</span>
        </div>
        <p class="text-gray-600 mb-4">Create and format text content with rich editing capabilities.</p>
        <button 
          @click="showDemo('text')"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try it out →
        </button>
      </div>

      <!-- Image Block -->
      <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Image Block</h3>
          <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Media</span>
        </div>
        <p class="text-gray-600 mb-4">Upload and display images with various layout options.</p>
        <button 
          @click="showDemo('image')"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try it out →
        </button>
      </div>

      <!-- Video Block -->
      <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Video Block</h3>
          <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Media</span>
        </div>
        <p class="text-gray-600 mb-4">Embed and play videos from various sources.</p>
        <button 
          @click="showDemo('video')"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try it out →
        </button>
      </div>

      <!-- Code Block -->
      <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Code Block</h3>
          <span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Developer</span>
        </div>
        <p class="text-gray-600 mb-4">Write and format code with syntax highlighting.</p>
        <button 
          @click="showDemo('code')"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try it out →
        </button>
      </div>

      <!-- NFT Block -->
      <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">NFT Block</h3>
          <span class="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">Web3</span>
        </div>
        <p class="text-gray-600 mb-4">Display and interact with NFTs from your wallet.</p>
        <button 
          @click="showDemo('nft')"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try it out →
        </button>
      </div>

      <!-- Token Block -->
      <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Token Block</h3>
          <span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Web3</span>
        </div>
        <p class="text-gray-600 mb-4">Show token balances and transfer capabilities.</p>
        <button 
          @click="showDemo('token')"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Try it out →
        </button>
      </div>
    </div>

    <!-- Interactive Demo Section -->
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Interactive Demo</h3>
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p class="text-gray-600 mb-4">Click on any block above to see it in action. You can drag and drop blocks to create your own layout.</p>
        <div class="flex space-x-4">
          <button 
            @click="startDemo"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Demo
          </button>
          <button 
            @click="showLearnMore"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>

    <!-- Demo Modal -->
    <div v-if="activeDemo" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-900">{{ getDemoTitle() }}</h3>
          <button 
            @click="closeDemo"
            class="text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-4">
          <component :is="getDemoComponent()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeDemo = ref<string | null>(null)

const showDemo = (type: string) => {
  activeDemo.value = type
}

const closeDemo = () => {
  activeDemo.value = null
}

const startDemo = () => {
  // Implement demo start logic
  console.log('Starting demo...')
}

const showLearnMore = () => {
  // Implement learn more logic
  console.log('Showing learn more...')
}

const getDemoTitle = () => {
  const titles: Record<string, string> = {
    text: 'Text Block Demo',
    image: 'Image Block Demo',
    video: 'Video Block Demo',
    code: 'Code Block Demo',
    nft: 'NFT Block Demo',
    token: 'Token Block Demo'
  }
  return titles[activeDemo.value || ''] || 'Demo'
}

const getDemoComponent = () => {
  // This would return the actual demo component based on the active demo type
  // For now, we'll just return a placeholder
  return {
    template: '<div class="p-4 bg-gray-100 rounded">Demo content will be implemented here</div>'
  }
}
</script> 