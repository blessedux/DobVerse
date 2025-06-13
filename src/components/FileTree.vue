<template>
  <div>
    <template v-for="node in nodes" :key="(node as any).id">
      <div v-if="(node as any).type === 'folder'">
        <div class="flex items-center cursor-pointer py-1 px-2 hover:bg-neutral-700 rounded" @click="toggleFolder((node as any).id)">
          <Icon :icon="isOpen((node as any).id) ? 'lucide:chevron-down' : 'lucide:chevron-right'" color="white" width="18" class="mr-1" />
          <Icon icon="lucide:folder" color="white" width="18" class="mr-2" />
          <span class="font-semibold">{{ (node as any).name }}</span>
        </div>
        <div v-if="isOpen((node as any).id) && (node as any).children" class="ml-5 border-l border-neutral-700 pl-2">
          <FileTree :nodes="(node as any).children" :search="search" />
        </div>
      </div>
      <div v-else class="flex items-center py-1 px-2 hover:bg-neutral-700 rounded cursor-pointer">
        <Icon icon="lucide:file" color="white" width="16" class="mr-2" />
        <span class="truncate" v-html="highlight((node as any).name)"></span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import FileTree from './FileTree.vue'

const props = defineProps({
  nodes: { type: Array, required: true },
  search: { type: String, default: '' },
})

const openFolders = ref<Set<string>>(new Set())
function toggleFolder(id: string) {
  if (openFolders.value.has(id)) openFolders.value.delete(id)
  else openFolders.value.add(id)
}
function isOpen(id: string) {
  return openFolders.value.has(id)
}
function highlight(name: string) {
  if (!props.search) return name
  return name.replace(new RegExp(`(${props.search})`, 'gi'), '<mark class="bg-yellow-400 text-black">$1</mark>')
}
</script>

<style scoped>
mark {
  background: #fde047;
  color: #18181b;
  border-radius: 0.2em;
  padding: 0 0.1em;
}
</style> 