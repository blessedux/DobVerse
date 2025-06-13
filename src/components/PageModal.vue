<template>
  <teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" @mousedown.self="$emit('close')">
      <div class="relative bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 p-8 flex flex-col" @keydown.esc="$emit('close')" tabindex="0">
        <div class="flex items-center mb-6">
          <button class="mr-4 text-neutral-400 hover:text-white text-2xl flex items-center" @click="$emit('close')" title="Back to all pages">
            <Icon icon="lucide:arrow-left" color="currentColor" width="32" height="32" />
          </button>
          <Icon :icon="icon" color="white" width="40" height="40" class="rounded-lg bg-neutral-800 p-2" />
          <span class="ml-4 text-3xl font-bold text-white truncate">{{ title }}</span>
        </div>
        <div class="flex-1 min-h-[300px]">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
const props = defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
})
</script>

<style scoped>
/* Optional: add smooth modal animation */
</style> 