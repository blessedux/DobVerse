<template>
  <div id="app" class="min-h-screen bg-neutral-900">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('App mounted')
})
</script>

<style>
#app {
  font-family: Inter, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}

/* Global dark theme styles */
body {
  background-color: #18181b;
  color: white;
}

/* Remove purple from visited links */
a {
  color: white !important;
  text-decoration: none;
}

a:visited {
  color: white !important;
}

/* Lotion block styles */
.lotion {
  color: white !important;
}

.lotion h1 {
  color: white !important;
  font-size: 2rem !important;
  font-weight: bold !important;
  margin-bottom: 1rem !important;
}

.lotion .block {
  background: #27272a !important;
  border-radius: 0.5rem !important;
  padding: 1rem !important;
  margin-bottom: 1rem !important;
  color: white !important;
}

.lotion .block:hover {
  background: #3f3f46 !important;
}

/* Command menu styles */
.lotion .block-menu {
  background: rgba(39, 39, 42, 0.95) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(63, 63, 70, 0.5) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  border-radius: 0.5rem !important;
  padding: 0.5rem !important;
}

.lotion .block-menu-item {
  color: white !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.375rem !important;
  transition: all 0.2s ease !important;
}

.lotion .block-menu-item:hover {
  background: rgba(63, 63, 70, 0.5) !important;
}

/* Command menu search */
.lotion .block-menu-search {
  color: #a1a1aa !important;
  border-bottom: 1px solid rgba(63, 63, 70, 0.5) !important;
  padding: 0.5rem 1rem !important;
  margin-bottom: 0.5rem !important;
}

/* Command menu section headers */
.lotion .block-menu .section-header {
  color: #a1a1aa !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 0.5rem 1rem !important;
}

/* Ensure all text in blocks is white */
.lotion * {
  color: white !important;
}

/* Style for active router links */
.router-link-active {
  background: #3f3f46 !important;
  color: white !important;
}
</style>
