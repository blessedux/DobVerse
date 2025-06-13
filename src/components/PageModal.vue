<template>
  <teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" @mousedown.self="$emit('close')">
      <transition name="modal-fade-scale">
        <div class="relative bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 p-8 flex flex-col" @keydown.esc="$emit('close')" tabindex="0" v-if="true">
          <div class="flex items-center mb-6">
            <Icon :icon="icon" color="white" width="40" height="40" class="rounded-lg bg-neutral-800 p-2" />
            <span class="ml-4 text-3xl font-bold text-white truncate">{{ title }}</span>
          </div>
          <div class="flex-1 min-h-[300px]">
            <slot />
          </div>
        </div>
      </transition>
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
.modal-fade-scale-enter-active, .modal-fade-scale-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1);
}
.modal-fade-scale-enter-from, .modal-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.modal-fade-scale-enter-to, .modal-fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style> 