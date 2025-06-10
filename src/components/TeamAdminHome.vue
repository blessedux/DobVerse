<template>
  <div class="min-h-screen bg-white flex flex-col items-center pt-20">
    <!-- Header -->
    <div class="w-full max-w-2xl flex flex-col items-start">
      <h1 class="text-5xl font-bold text-gray-900 mb-2">Gestion del Equipo</h1>
      <div class="text-gray-400 text-lg mb-10">Type '/' for commands</div>
    </div>
    <!-- Page Blocks -->
    <div class="w-full max-w-2xl flex flex-col gap-2">
      <router-link
        v-for="block in blocks"
        :key="block.title"
        :to="block.route"
        class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-100 transition group"
        style="text-decoration: none;"
      >
        <span class="text-2xl">{{ block.icon }}</span>
        <span class="text-lg text-gray-800 group-hover:underline">{{ block.title }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const blocks = [
  { icon: '🎉', title: 'Fechas Limites Grants', route: '/grants' },
  { icon: '🏢', title: 'BBDD reuniones estrategicas', route: '/bbdd-reuniones' },
  { icon: '➕🏢', title: 'Propuestas B2B', route: '/propuestas-b2b' },
  { icon: '🛰️', title: 'Plan de comunicaciones 2.0', route: '/plan-comunicaciones' },
  { icon: '📄', title: 'Directorios Dob Protocol', route: '/directorios' },
  { icon: '📄', title: 'UX/UI', route: '/ux-ui' },
  { icon: '📄', title: 'Tareas Equipo Mayo ->', route: '/tareas-mayo' },
]
</script>

<style scoped>
.router-link-active {
  background: #f3f4f6;
}
</style> 