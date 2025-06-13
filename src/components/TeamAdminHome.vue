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
        <div v-for="folder in folders" :key="folder.id">
          <div class="flex items-center cursor-pointer py-1 px-2 hover:bg-neutral-700 rounded" @click="toggleFolder(folder.id)">
            <Icon :icon="isOpen(folder.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'" color="white" width="18" class="mr-1" />
            <Icon icon="lucide:folder" color="white" width="18" class="mr-2" />
            <span class="font-semibold">{{ folder.title }}</span>
          </div>
          <div v-if="isOpen(folder.id)" class="ml-5 border-l border-neutral-700 pl-2">
            <Container
              orientation="vertical"
              behaviour="move"
              drag-class="dragging"
              @drop="(result) => onFolderDrop(result, folder.id)"
            >
              <Draggable v-for="file in folder.children" :key="file.id">
                <div 
                  class="flex items-center py-1 px-2 hover:bg-neutral-700 rounded cursor-pointer" 
                  @click="openPage(file)"
                >
                  <VPopover placement="bottom" :triggers="['click']" :auto-hide="true" :distance="8">
                    <template #default>
                      <Icon :icon="file.icon || 'lucide:file'" color="white" width="18" class="mr-2 cursor-pointer group-hover:text-blue-400" @click.stop="openIconPicker(file)" />
                    </template>
                    <template #popper>
                      <IconPicker :icons="previewIcons" @select="icon => selectIcon(file, icon)" />
                    </template>
                  </VPopover>
                  <span class="truncate">{{ file.name }}</span>
                </div>
              </Draggable>
            </Container>
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
        <PageModal v-if="selectedPage" :icon="selectedPage.icon || 'lucide:file'" :title="selectedPage.name" @close="selectedPage = null">
          <Lotion :page="selectedPage" />
        </PageModal>
        <!-- Otherwise, show card grid -->
        <div v-else class="w-full max-w-5xl">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-white">Pages</h2>
            <button @click="addPage" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">+ New Page</button>
          </div>
          <div class="relative">
            <BGPattern variant="dots" fill="#252525" :size="24" />
            <div class="p-6">
              <div class="w-full">
                <draggable
                  v-model="pages"
                  :item-key="'id'"
                  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full max-w-6xl mx-auto"
                  :animation="200"
                  :ghost-class="'dragging'"
                  :chosen-class="'dragging'"
                  :drag-class="'dragging'"
                  @end="onGridDragEnd"
                >
                  <template #item="{ element: page }">
                    <div
                      class="card bg-black text-white border border-blue-200 shadow-md rounded-lg flex flex-col cursor-pointer hover:shadow-lg transition-all duration-200 items-stretch justify-stretch"
                      style="width: 100%; height: 180px; min-width: 0; min-height: 180px; margin: 0; padding: 0;"
                      @click="openPage(page)"
                    >
                      <div class="flex items-center gap-2 mb-2">
                        <VPopover placement="bottom" :triggers="['click']" :auto-hide="true" :distance="8">
                          <template #default>
                            <Icon :icon="page.icon || 'lucide:file'" class="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-600" @click.stop="openIconPicker(page)" />
                          </template>
                          <template #popper>
                            <IconPicker :icons="previewIcons" @select="icon => selectIcon(page, icon)" />
                          </template>
                        </VPopover>
                        <span class="text-sm font-medium">{{ page.name }}</span>
                      </div>
                      <div class="flex-1 overflow-hidden">
                        <p class="text-sm text-neutral-400 line-clamp-3">
                          {{ page.blocks[0]?.details.value }}
                        </p>
                      </div>
                    </div>
                  </template>
                </draggable>
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

  <!-- Card Modal with Lotion Editor -->
  <transition name="modal-fade-scale">
    <div v-if="isModalOpen && selectedPage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @mousedown.self="closeCardModal">
      <div class="bg-neutral-900 rounded-xl shadow-2xl p-8 w-full max-w-2xl mx-auto relative flex flex-col items-center">
        <button @click="closeCardModal" class="absolute top-4 right-4 text-neutral-400 hover:text-white text-2xl">
          <span class="sr-only">Close</span>
          &times;
        </button>
        <div class="flex items-center gap-4 mb-4 w-full">
          <VPopover placement="bottom" :triggers="['click']" :auto-hide="true" :distance="8">
            <template #default>
              <Icon :icon="selectedPage?.icon || 'lucide:file'" class="w-12 h-12 text-blue-400 cursor-pointer hover:text-blue-600" @click.stop="selectedPage && openIconPicker(selectedPage)" />
            </template>
            <template #popper>
              <IconPicker :icons="previewIcons" @select="icon => selectedPage && selectIcon(selectedPage, icon)" />
            </template>
          </VPopover>
          <h2 class="text-2xl font-bold text-white">{{ selectedPage?.name }}</h2>
        </div>
        <div class="w-full max-w-full" v-if="selectedPage">
          <Lotion :page="selectedPage" />
        </div>
        <button v-if="selectedPage" @click="addBlockToPage(selectedPage)" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">+ Add Block</button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@iconify/vue'
import VPopover from 'floating-vue'
import 'floating-vue/dist/style.css'
import { useRouter } from 'vue-router'
import { MoreHorizontal, ChevronLeft } from 'lucide-vue-next'
import { Container, Draggable } from 'vue3-smooth-dnd'
import type { DropResult } from 'vue3-smooth-dnd'
import BGPattern from './BGPattern.vue'
import PageModal from './PageModal.vue'
import IconPicker from './IconPicker.vue'
import { useWalletConnect } from '../composables/useWalletConnect'
import SkeletonLoader from 'vue3-skeleton-loader'

// --- Lotion-style Pages Data ---
const pages = ref([
  {
    id: uuidv4(),
    name: 'Project Overview',
    icon: 'lucide:file-text',
    blocks: [
      { id: uuidv4(), type: 'TEXT', details: { value: 'Welcome to the project!' } },
    ],
  },
  {
    id: uuidv4(),
    name: 'Team Members',
    icon: 'lucide:users',
    blocks: [
      { id: uuidv4(), type: 'TEXT', details: { value: 'Meet the team.' } },
    ],
  },
  {
    id: uuidv4(),
    name: 'Timeline',
    icon: 'lucide:calendar',
    blocks: [
      { id: uuidv4(), type: 'TEXT', details: { value: 'Project timeline and milestones.' } },
    ],
  },
  {
    id: uuidv4(),
    name: 'Settings',
    icon: 'lucide:settings',
    blocks: [
      { id: uuidv4(), type: 'TEXT', details: { value: 'Project configuration and settings.' } },
    ],
  },
  {
    id: uuidv4(),
    name: 'Discussions',
    icon: 'lucide:message-square',
    blocks: [
      { id: uuidv4(), type: 'TEXT', details: { value: 'Team discussions and important conversations.' } },
    ],
  },
])

const previewIcons = [
  'lucide:file-text', 'lucide:users', 'lucide:calendar', 'lucide:settings', 'lucide:message-square',
  'lucide:party-popper', 'lucide:database', 'lucide:handshake', 'lucide:satellite-dish', 'lucide:folder', 'lucide:palette', 'lucide:clipboard-list',
  'lucide:book', 'lucide:check-circle', 'lucide:star', 'lucide:flag', 'lucide:mail', 'lucide:dot', 'lucide:grid', 'lucide:slash', 'lucide:minus', 'lucide:line', 'lucide:square'
]

const folders = computed(() => [
  {
    id: 'folder1',
    title: 'Dob Team',
    type: 'folder',
    children: pages.value,
  }
])

const sidebarOpen = ref(true)
const search = ref('')
const selectedPage = ref<{ id: string; name: string; icon?: string; blocks: any[] } | null>(null)
const isModalOpen = ref(false)
const iconPickerOpen = ref(null)
const iconPickerTarget = ref<{ id: string; name: string; icon?: string; blocks: any[] } | null>(null)

function openPage(page: { id: string; name: string; icon?: string; blocks: any[] }) {
  selectedPage.value = page
  isModalOpen.value = true
}
function closeCardModal() {
  isModalOpen.value = false
  selectedPage.value = null
}
function addPage() {
  const newPage = {
    id: uuidv4(),
    name: 'Untitled',
    icon: 'lucide:file-text',
    blocks: [
      { id: uuidv4(), type: 'TEXT', details: { value: 'New page.' } },
    ],
  }
  pages.value.unshift(newPage)
  openPage(newPage)
}
function openIconPicker(page: { id: string; name: string; icon?: string; blocks: any[] }) {
  if (!page) return
  iconPickerOpen.value = page.id
  iconPickerTarget.value = page
}
function selectIcon(page: { id: string; name: string; icon?: string; blocks: any[] }, icon: string) {
  if (page) page.icon = icon
  iconPickerOpen.value = null
  iconPickerTarget.value = null
}
function addBlockToPage(page: { id: string; name: string; icon?: string; blocks: any[] }) {
  if (!page) return
  page.blocks.push({ id: uuidv4(), type: 'TEXT', details: { value: 'New block.' } })
}
import { VueDraggableNext as draggable } from 'vue-draggable-next'
function onGridDragEnd(e: any) {}

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
const optionsPopoverOpen = ref<string | null>(null)
function openOptionsPopover(cardId: string) {
  optionsPopoverOpen.value = cardId
}
function selectPattern(card: any, pattern: string) {
  card.background = pattern
  optionsPopoverOpen.value = null
}

function onFolderDrop(dropResult: DropResult, folderId: string) {
  const { removedIndex, addedIndex } = dropResult
  if (removedIndex === null && addedIndex === null) return

  const folder = folders.value.find(f => f.id === folderId)
  if (!folder) return

  const result = [...folder.children]
  let itemToAdd = removedIndex !== null ? result.splice(removedIndex, 1)[0] : null

  if (addedIndex !== null && itemToAdd) {
    result.splice(addedIndex, 0, itemToAdd)
    folder.children = result
  }
}

const openFolders = ref(new Set(['folder1']))

function toggleFolder(id: string) {
  if (openFolders.value.has(id)) {
    openFolders.value.delete(id)
  } else {
    openFolders.value.add(id)
  }
}

function isOpen(id: string) {
  return openFolders.value.has(id)
}

defineExpose({ sidebarOpen })

document.addEventListener('keydown', (event:KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    if (selectedPage.value) {
      addBlockToPage(selectedPage.value);
    }
  }
});
</script>

<style scoped>
.card {
  @apply relative border border-blue-200 shadow-md transition-transform duration-300;
  width: 240px;
  height: 180px;
  min-width: 240px;
  min-height: 180px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card::before {
  content: '';
  @apply absolute inset-0 rounded-lg opacity-0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  transition: opacity 0.2s;
}

.card:hover::before {
  @apply opacity-100;
}

.dragging {
  @apply opacity-80 shadow-2xl z-50;
  transform: scale(0.95) rotate(2deg);
}

.dropping {
  @apply bg-blue-500 border-blue-500;
  background-color: rgba(59, 130, 246, 0.1);
}

.flex {
  @apply transition-all duration-300;
}

@media (max-width: 640px) {
  .p-6 {
    @apply p-4;
  }
  .card {
    width: 100%;
    min-width: 0;
    height: 140px;
    min-height: 140px;
  }
}

.drag-handle {
  @apply p-1 rounded-md hover:bg-blue-100 transition-colors;
}

.drag-handle:hover {
  @apply bg-blue-100;
}

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