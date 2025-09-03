<script setup>
// Lógica del componente

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function], // Permite Object o Function (los iconos de Lucide son funciones)
    required: true,
  },
  percentage: {
    type: [String, Number], // Permite String o Number
    required: true,
  },
})
</script>

<template>
  <!-- HTML del componente -->
  <div class="mt-4 mb-4 flex flex-col mx-auto p-6 w-80 h-32 border border-border rounded-lg bg-background shadow-md">
    <div class="flex justify-between items-start mb-4">
      <p class="font-bold text-text">{{ title }}</p>
      <!-- Usa directamente el icono pasado como prop -->
      <component :is="icon" class="w-6 h-6 ml-auto text-text-deep" />
    </div>

    <p class="text-3xl font-bold text-sand">{{ percentage }}</p>
  </div>
</template>
