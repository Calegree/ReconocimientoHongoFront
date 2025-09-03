import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', () => {
  const historyItems = ref([])

  // Agregar un nuevo elemento al historial
  const addToHistory = (item) => {
    const historyItem = {
      id: Date.now(), // ID único basado en timestamp
      timestamp: new Date(),
      image: item.image, // URL de la imagen
      result: item.result, // Resultado del análisis
      originalFile: item.originalFile || null // Información del archivo original
    }
    
    // Agregar al inicio del array para mostrar los más recientes primero
    historyItems.value.unshift(historyItem)
    
    // Opcional: limitar el historial a los últimos 50 elementos
    if (historyItems.value.length > 50) {
      historyItems.value = historyItems.value.slice(0, 50)
    }
  }

  // Eliminar un elemento del historial
  const removeFromHistory = (id) => {
    historyItems.value = historyItems.value.filter(item => item.id !== id)
  }

  // Limpiar todo el historial
  const clearHistory = () => {
    historyItems.value = []
  }

  return { 
    historyItems, 
    addToHistory, 
    removeFromHistory, 
    clearHistory
  }
})
