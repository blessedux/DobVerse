<template>
  <div class="relative">
    <div class="mb-2">
      <input v-model="search" type="text" placeholder="Search icons..." class="w-full px-3 py-2 rounded bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none border border-neutral-700" />
    </div>
    <div class="grid grid-cols-6 gap-2 max-h-56 overflow-y-auto">
      <Icon v-for="icon in filteredIcons" :key="icon" :icon="icon" color="white" width="24" height="24" class="cursor-pointer opacity-70 hover:opacity-100" @click="$emit('select', icon)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  icons: { type: Array as () => string[], required: true },
})
const emit = defineEmits(['select'])
const search = ref('')
const filteredIcons = computed(() => {
  if (!search.value) return props.icons
  return props.icons.filter(icon => icon.toLowerCase().includes(search.value.toLowerCase()))
})
</script> 