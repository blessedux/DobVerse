<template>
  <div class="toggle-block">
    <button @click="open = !open" class="toggle-btn">
      <span :class="open ? 'rotate-90' : ''">▶</span>
    </button>
    <div class="inline-block w-full">
      <Editor v-if="!props.readonly" v-model="props.block.details.value" class="py-1.5" />
      <div v-else v-html="markdownToHtml(props.block.details.value as string)" class="py-1.5"></div>
      <div v-show="open" class="toggle-content pl-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue'
import { Block } from '../../utils/types'
import { markdownToHtml } from '../../utils/utils'
import Editor from '../elements/Editor.vue'

const props = defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const open = ref(false)
</script>

<style scoped>
.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 1rem;
  transition: transform 0.2s;
}
.rotate-90 {
  transform: rotate(90deg);
}
</style> 