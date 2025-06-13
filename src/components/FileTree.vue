<template>
  <div>
    <template v-for="node in nodes" :key="(node as any).id">
      <div v-if="(node as any).type === 'folder'">
        <div class="flex items-center cursor-pointer py-1 px-2 hover:bg-neutral-700 rounded">
          <Icon :icon="isOpen((node as any).id) ? 'lucide:chevron-down' : 'lucide:chevron-right'" color="white" width="18" class="mr-1" @click.stop="toggleFolder((node as any).id)" />
          <span class="relative">
            <VPopover placement="bottom" :triggers="['click']" :auto-hide="true" :distance="8">
              <template #default>
                <Icon :icon="(node as any).icon || 'lucide:folder'" color="white" width="18" class="mr-2 cursor-pointer" />
              </template>
              <template #popper>
                <IconPicker :icons="previewIcons" @select="icon => selectIcon(node, icon)" />
              </template>
            </VPopover>
          </span>
          <span v-if="editingId !== (node as any).id" class="font-semibold ml-1" @dblclick="startEdit(node)">
            {{ (node as any).name }}
          </span>
          <input v-else v-model="node.name" @blur="stopEdit" @keyup.enter="stopEdit" class="ml-1 bg-neutral-700 text-white rounded px-1 py-0.5 w-32" />
        </div>
        <div v-if="isOpen((node as any).id) && (node as any).children" class="ml-5 border-l border-neutral-700 pl-2">
          <FileTree :nodes="(node as any).children" :search="search" @open-page="$emit('open-page', $event)" />
        </div>
      </div>
      <div v-else class="flex items-center py-1 px-2 hover:bg-neutral-700 rounded cursor-pointer">
        <span class="relative">
          <VPopover placement="bottom" :triggers="['click']" :auto-hide="true" :distance="8">
            <template #default>
              <Icon :icon="(node as any).icon || 'lucide:file'" color="white" width="16" class="mr-2 cursor-pointer" />
            </template>
            <template #popper>
              <IconPicker :icons="previewIcons" @select="icon => selectIcon(node, icon)" />
            </template>
          </VPopover>
        </span>
        <span v-if="editingId !== (node as any).id" class="truncate" v-html="highlight((node as any).name)" @click="$emit('open-page', (node as any).id)" @dblclick="startEdit(node)"></span>
        <input v-else v-model="node.name" @blur="stopEdit" @keyup.enter="stopEdit" class="ml-1 bg-neutral-700 text-white rounded px-1 py-0.5 w-32" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import FileTree from './FileTree.vue'
import IconPicker from './IconPicker.vue'
import VPopover from 'floating-vue'
import 'floating-vue/dist/style.css'

const props = defineProps({
  nodes: { type: Array, required: true },
  search: { type: String, default: '' },
})
const emit = defineEmits(['open-page'])

const openFolders = ref<Set<string>>(new Set())
const editingId = ref<string|null>(null)
const previewIcons = [
  'lucide:party-popper', 'lucide:database', 'lucide:handshake', 'lucide:satellite-dish', 'lucide:folder', 'lucide:palette', 'lucide:clipboard-list',
  'lucide:calendar', 'lucide:users', 'lucide:book', 'lucide:check-circle', 'lucide:star', 'lucide:flag', 'lucide:mail', 'lucide:settings',
]
function toggleFolder(id: string) {
  if (openFolders.value.has(id)) openFolders.value.delete(id)
  else openFolders.value.add(id)
}
function isOpen(id: string) {
  return openFolders.value.has(id)
}
function highlight(name: string) {
  if (!props.search) return name
  return name.replace(new RegExp(`(${props.search})`, 'gi'), '<mark class=\"bg-yellow-400 text-black\">$1</mark>')
}
function selectIcon(node: any, icon: string) {
  node.icon = icon
}
function startEdit(node: any) {
  editingId.value = node.id
}
function stopEdit() {
  editingId.value = null
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