<template>
  <div class="min-h-screen bg-neutral-900 flex flex-row">
    <!-- Sidebar: File Explorer -->
    <aside :class="['transition-all duration-200 bg-neutral-800 text-white h-screen flex flex-col', sidebarOpen ? 'w-72' : 'w-16']">
      <div class="flex items-center justify-between px-4 py-4 border-b border-neutral-700">
        <span v-if="sidebarOpen" class="font-bold text-lg tracking-wide">Files</span>
        <button @click="sidebarOpen = !sidebarOpen" class="focus:outline-none">
          <span v-if="sidebarOpen">⏪</span>
          <span v-else>☰</span>
        </button>
      </div>
      <div v-if="sidebarOpen" class="px-4 py-2 border-b border-neutral-700">
        <input
          v-model="search"
          type="text"
          placeholder="Search files..."
          class="w-full px-3 py-2 rounded bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none"
        />
      </div>
      <nav class="flex-1 overflow-y-auto mt-2 px-2" v-if="sidebarOpen">
        <FileTree :nodes="filteredTree" :search="search" @open-page="openPage" />
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Banner/Header -->
      <div class="w-full h-32 bg-black flex items-center justify-center relative">
        <span class="text-white text-2xl font-bold tracking-widest">[ Banner Placeholder ]</span>
        <button class="absolute right-4 top-4 text-xs text-neutral-400 hover:text-white">Change Banner</button>
      </div>
      <div class="flex-1 flex flex-col items-center py-8 px-2 w-full">
        <!-- If a page is selected, show Lotion editor -->
        <div v-if="selectedPage" class="w-full max-w-4xl">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl cursor-pointer" @click="iconPickerOpen = 'page'">
              <Icon :icon="selectedPage.icon" color="white" width="32" height="32" />
            </span>
            <input v-model="selectedPage.name" class="bg-transparent border-none outline-none text-white text-3xl font-bold flex-1" />
            <button class="text-neutral-400 hover:text-white text-sm" @click="selectedPageId = null">Back to cards</button>
          </div>
          <Lotion :page="selectedPage" />
        </div>
        <!-- Otherwise, show card grid -->
        <div v-else class="w-full max-w-5xl">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="page in pages" :key="page.id" class="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-2xl transition group relative cursor-pointer" @click="openPage(page.id)">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">
                  <Icon :icon="page.icon" color="white" width="28" height="28" />
                </span>
                <span class="text-white text-xl font-semibold flex-1 truncate">{{ page.name }}</span>
              </div>
              <div class="text-neutral-300 text-sm truncate">
                {{ page.blocks[0]?.details?.value?.slice(0, 80) || 'No content yet...' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Icon Picker Popover (UI only for now) -->
      <div v-if="iconPickerOpen" class="fixed z-30 left-1/2 top-1/3 -translate-x-1/2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg p-4 w-72">
        <div class="text-white text-sm mb-2">Pick an icon (coming soon)</div>
        <button class="absolute top-2 right-2 text-neutral-400 hover:text-white" @click="iconPickerOpen = null">✕</button>
        <div class="grid grid-cols-6 gap-2 mt-4">
          <Icon v-for="icon in previewIcons" :key="icon" :icon="icon" color="white" width="24" height="24" class="cursor-pointer opacity-70 hover:opacity-100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@iconify/vue'
import FileTree from './FileTree.vue'
import Lotion from './Lotion.vue'

// --- Data Model: Each page has its own Lotion block data ---
const defaultBlocks = () => ([
  { id: uuidv4(), type: 'TEXT', details: { value: '' } }
])

const pages = ref([
  { id: uuidv4(), icon: 'lucide:party-popper', name: 'Fechas Limites Grants', blocks: defaultBlocks() },
  { id: uuidv4(), icon: 'lucide:database', name: 'BBDD reuniones estrategicas', blocks: defaultBlocks() },
  { id: uuidv4(), icon: 'lucide:handshake', name: 'Propuestas B2B', blocks: defaultBlocks() },
  { id: uuidv4(), icon: 'lucide:satellite-dish', name: 'Plan de comunicaciones 2.0', blocks: defaultBlocks() },
  { id: uuidv4(), icon: 'lucide:folder', name: 'Directorios Dob Protocol', blocks: defaultBlocks() },
  { id: uuidv4(), icon: 'lucide:palette', name: 'UX/UI', blocks: defaultBlocks() },
  { id: uuidv4(), icon: 'lucide:clipboard-list', name: 'Tareas Equipo Mayo ->', blocks: defaultBlocks() },
])

// --- File Explorer Tree ---
const fileTree = ref([
  {
    id: uuidv4(),
    name: 'Gestion del Equipo',
    type: 'folder',
    children: pages.value.map(page => ({ id: page.id, name: page.name, type: 'file' })),
  },
  {
    id: uuidv4(),
    name: 'Miscellaneous',
    type: 'folder',
    children: [
      { id: uuidv4(), name: 'User Stories Fase 3', type: 'file' },
    ],
  },
])

const search = ref('')
function filterTree(nodes: any[], searchTerm: string): any[] {
  if (!searchTerm) return nodes
  const term = searchTerm.toLowerCase()
  return nodes
    .map((node: any): any | null => {
      if (node.type === 'folder') {
        const filteredChildren: any[] = filterTree(node.children || [], term)
        if (filteredChildren.length > 0 || node.name.toLowerCase().includes(term)) {
          return { ...node, children: filteredChildren }
        }
        return null
      } else {
        return node.name.toLowerCase().includes(term) ? node : null
      }
    })
    .filter(Boolean) as any[]
}
const filteredTree = computed(() => filterTree(fileTree.value, search.value))

// --- Page Selection Logic ---
const selectedPageId = ref<string|null>(null)
const selectedPage = computed(() => pages.value.find(p => p.id === selectedPageId.value) || null)
function openPage(id: string) {
  selectedPageId.value = id
}

// --- Icon Picker (UI only for now) ---
const iconPickerOpen = ref<null|string>(null)
const previewIcons = [
  'lucide:party-popper', 'lucide:database', 'lucide:handshake', 'lucide:satellite-dish', 'lucide:folder', 'lucide:palette', 'lucide:clipboard-list',
  'lucide:calendar', 'lucide:users', 'lucide:book', 'lucide:check-circle', 'lucide:star', 'lucide:flag', 'lucide:mail', 'lucide:settings',
]

const sidebarOpen = ref(true)

defineExpose({ sidebarOpen })
</script>

<style scoped>
input, textarea {
  transition: background 0.2s;
}
</style> 