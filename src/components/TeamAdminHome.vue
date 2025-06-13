<template>
  <div class="min-h-screen bg-neutral-900 flex flex-row">
    <!-- Wallet Disconnect Button -->
    <div class="fixed top-4 right-6 z-50">
      <button v-if="address" @click="handleDisconnect" class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full shadow border border-white/20 backdrop-blur transition">
        <span class="font-mono text-sm">{{ shortAddress }}</span>
        <Icon icon="lucide:log-out" color="white" width="20" height="20" />
      </button>
    </div>
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
        <div v-for="folder in sidebarFolders" :key="folder.id">
          <div class="flex items-center cursor-pointer py-1 px-2 hover:bg-neutral-700 rounded" @click="toggleFolder(folder.id)">
            <Icon :icon="isOpen(folder.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'" color="white" width="18" class="mr-1" />
            <Icon icon="lucide:folder" color="white" width="18" class="mr-2" />
            <span class="font-semibold">{{ folder.name }}</span>
          </div>
          <div v-if="isOpen(folder.id)" class="ml-5 border-l border-neutral-700 pl-2">
            <div v-for="file in folder.children" :key="file.id" class="flex items-center py-1 px-2 hover:bg-neutral-700 rounded cursor-pointer" @click="openPage(file.id)">
              <Icon :icon="file.icon || 'lucide:file'" color="white" width="16" class="mr-2" />
              <span class="truncate">{{ file.name }}</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Banner/Header -->
      <div class="w-full h-56 bg-black flex items-center justify-center relative">
        <span class="text-white text-2xl font-bold tracking-widest">[ Banner Placeholder ]</span>
        <button class="absolute right-4 top-4 text-xs text-neutral-400 hover:text-white">Change Banner</button>
      </div>
      <div class="flex-1 flex flex-col items-center py-8 px-2 w-full">
        <!-- If a page is selected, show Lotion editor -->
        <PageModal v-if="selectedPage" :icon="selectedPage.icon || 'lucide:file'" :title="selectedPage.name" @close="selectedPageId = null">
          <Lotion :page="selectedPage" />
        </PageModal>
        <!-- Otherwise, show card grid -->
        <div v-else class="w-full max-w-5xl">
          <div class="relative">
            <BGPattern variant="grid" fill="#252525" :size="24" />
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              <div v-for="card in mockupCards" :key="card.id" class="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-2xl transition group relative cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">
                    <Icon :icon="card.icon" color="white" width="28" height="28" />
                  </span>
                  <span class="text-white text-xl font-semibold flex-1 truncate">{{ card.name }}</span>
                </div>
                <div class="text-neutral-300 text-sm truncate whitespace-pre-line">{{ card.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Icon Picker Popover (UI only for now) -->
      <VPopover placement="bottom" :triggers="['click']" :auto-hide="true" :distance="8">
        <template #default>
          <Icon :icon="selectedPage?.icon || 'lucide:file'" color="white" width="32" height="32" class="cursor-pointer" />
        </template>
        <template #popper>
          <IconPicker :icons="previewIcons" @select="icon => selectIcon(selectedPage, icon)" />
        </template>
      </VPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@iconify/vue'
import FileTree from './FileTree.vue'
import Lotion from './Lotion.vue'
import IconPicker from './IconPicker.vue'
import VPopover from 'floating-vue'
import 'floating-vue/dist/style.css'
import PageModal from './PageModal.vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useRouter } from 'vue-router'
import { useWalletConnect } from '../composables/useWalletConnect'
import SkeletonLoader from 'vue3-skeleton-loader'
import BGPattern from './BGPattern.vue'
import { ref as vueRef } from 'vue'

// --- Data Model: Each page has its own Lotion block data ---
const defaultBlocks = () => ([
  { id: uuidv4(), type: 'TEXT', details: { value: '' } }
])

const pages = ref([
  { id: uuidv4(), icon: 'lucide:users', name: 'My Team', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: '👥 Team\nJasper\nMegan\nCharles' } } ], pinned: true },
  { id: uuidv4(), icon: 'lucide:party-popper', name: 'Fechas Limites Grants', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: 'Deadlines and grant info' } } ], pinned: true },
  { id: uuidv4(), icon: 'lucide:database', name: 'BBDD reuniones estrategicas', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: 'Strategic meetings database' } } ], pinned: true },
  { id: uuidv4(), icon: 'lucide:handshake', name: 'Propuestas B2B', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: 'Business proposals and partnerships' } } ], pinned: true },
  { id: uuidv4(), icon: 'lucide:satellite-dish', name: 'Plan de comunicaciones 2.0', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: 'Communications plan and updates' } } ] },
  { id: uuidv4(), icon: 'lucide:folder', name: 'Directorios Dob Protocol', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: 'Team and protocol directories' } } ] },
  { id: uuidv4(), icon: 'lucide:palette', name: 'UX/UI', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: 'Design and user experience docs' } } ] },
  { id: uuidv4(), icon: 'lucide:clipboard-list', name: 'Tareas Equipo Mayo ->', blocks: [ { id: uuidv4(), type: 'TEXT', details: { value: 'May team tasks and assignments' } } ] },
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

// --- Icon Picker ---
const iconPickerOpen = ref<null|string>(null)
const iconPickerTarget = ref<any>(null)
const previewIcons = [
  'lucide:party-popper', 'lucide:database', 'lucide:handshake', 'lucide:satellite-dish', 'lucide:folder', 'lucide:palette', 'lucide:clipboard-list',
  'lucide:calendar', 'lucide:users', 'lucide:book', 'lucide:check-circle', 'lucide:star', 'lucide:flag', 'lucide:mail', 'lucide:settings',
]
function openIconPicker(page: any) {
  iconPickerOpen.value = page.id
  iconPickerTarget.value = page
}
function selectIcon(page: any, icon: string) {
  if (page) {
    page.icon = icon
  }
  iconPickerOpen.value = null
  iconPickerTarget.value = null
}

const sidebarOpen = ref(true)

const router = useRouter()
const { address, disconnect } = useWalletConnect()
const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})
async function handleDisconnect() {
  await disconnect()
  router.push('/')
}

// Mockup data for cards
const mockupCards = [
  { id: '1', icon: 'lucide:users', name: 'My Team', description: '👥 Team\nJasper\nMegan\nCharles', pinned: true },
  { id: '2', icon: 'lucide:party-popper', name: 'Fechas Limites Grants', description: 'Deadlines and grant info', pinned: true },
  { id: '3', icon: 'lucide:database', name: 'BBDD reuniones estrategicas', description: 'Strategic meetings database', pinned: true },
  { id: '4', icon: 'lucide:handshake', name: 'Propuestas B2B', description: 'Business proposals and partnerships', pinned: true },
  { id: '5', icon: 'lucide:satellite-dish', name: 'Plan de comunicaciones 2.0', description: 'Communications plan and updates' },
  { id: '6', icon: 'lucide:folder', name: 'Directorios Dob Protocol', description: 'Team and protocol directories' },
  { id: '7', icon: 'lucide:palette', name: 'UX/UI', description: 'Design and user experience docs' },
  { id: '8', icon: 'lucide:clipboard-list', name: 'Tareas Equipo Mayo ->', description: 'May team tasks and assignments' },
]

// For the sidebar, dynamically group mockupCards into folders
const sidebarFolders = [
  {
    id: 'folder1',
    name: 'Gestion del Equipo',
    type: 'folder',
    children: mockupCards.slice(0, 4),
  },
  {
    id: 'folder2',
    name: 'Miscellaneous',
    type: 'folder',
    children: mockupCards.slice(4),
  },
]
const openFolders = ref(new Set(['folder1']))
function toggleFolder(id: string) {
  if (openFolders.value.has(id)) openFolders.value.delete(id)
  else openFolders.value.add(id)
}
function isOpen(id: string) {
  return openFolders.value.has(id)
}

const loading = ref(true)
setTimeout(() => { loading.value = false }, 1200)

const patternOptions = [
  { label: 'Grid', value: 'grid', icon: 'lucide:grid' },
  { label: 'Dots', value: 'dots', icon: 'lucide:dot' },
  { label: 'Diagonal Stripes', value: 'diagonal-stripes', icon: 'lucide:slash' },
  { label: 'Horizontal Lines', value: 'horizontal-lines', icon: 'lucide:minus' },
  { label: 'Vertical Lines', value: 'vertical-lines', icon: 'lucide:line' },
  { label: 'Checkerboard', value: 'checkerboard', icon: 'lucide:square' },
]
const optionsPopoverOpen = vueRef<string|null>(null)
function openOptionsPopover(cardId: string) {
  optionsPopoverOpen.value = cardId
}
function selectPattern(card: any, pattern: string) {
  card.background = pattern
  optionsPopoverOpen.value = null
}

defineExpose({ sidebarOpen })
</script>

<style scoped>
input, textarea {
  transition: background 0.2s;
}
</style> 