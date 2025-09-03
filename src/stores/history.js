import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', () => {
  // Clave para localStorage
  const STORAGE_KEY = 'mushroom-recognition-history'
  
  // Función para cargar datos desde localStorage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validar que sea un array válido
        if (Array.isArray(parsed)) {
          // Convertir timestamps de string a Date objects
          return parsed.map(item => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
        }
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error)
    }
    return []
  }

  // Función para guardar en localStorage
  const saveToStorage = (data) => {
    try {
      // Convertir Date objects a strings para JSON
      const dataToStore = data.map(item => ({
        ...item,
        timestamp: item.timestamp.toISOString()
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    } catch (error) {
      console.error('Error saving history to localStorage:', error)
    }
  }

  // Inicializar historyItems con datos del localStorage
  const historyItems = ref(loadFromStorage())

  // Watcher para guardar automáticamente en localStorage cuando cambie el historial
  watch(
    historyItems,
    (newValue) => {
      saveToStorage(newValue)
    },
    { deep: true }
  )

  // Agregar un nuevo elemento al historial
  const addToHistory = (item) => {
    const historyItem = {
      id: Date.now(), // ID único basado en timestamp
      timestamp: new Date(),
      image: item.image, // URL de la imagen
      result: item.result, // Resultado del análisis
      originalFile: item.originalFile || null // Información del archivo original
    }
    
    console.log('Agregando nuevo elemento al historial:', historyItem.id)
    
    // Agregar al inicio del array para mostrar los más recientes primero
    historyItems.value.unshift(historyItem)
    
    // Opcional: limitar el historial a los últimos 50 elementos
    if (historyItems.value.length > 50) {
      historyItems.value = historyItems.value.slice(0, 50)
    }
    
    console.log('Total elementos en historial:', historyItems.value.length)
  }

  // Eliminar un elemento del historial
  const removeFromHistory = (id) => {
    const initialLength = historyItems.value.length
    historyItems.value = historyItems.value.filter(item => item.id !== id)
    console.log(`Elemento ${id} eliminado. Elementos restantes: ${historyItems.value.length}`)
    
    // Verificar que se eliminó correctamente
    if (historyItems.value.length === initialLength) {
      console.warn(`No se pudo eliminar el elemento con id: ${id}`)
    }
  }

  // Limpiar todo el historial
  const clearHistory = () => {
    historyItems.value = []
    console.log('Historial completamente limpiado')
  }

  // Función para obtener estadísticas del historial
  const getHistoryStats = () => {
    const total = historyItems.value.length
    const successful = historyItems.value.filter(item => !item.result?.error).length
    const errors = total - successful
    
    return {
      total,
      successful,
      errors,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0
    }
  }

  // Función para exportar historial (útil para backup)
  const exportHistory = () => {
    try {
      const dataToExport = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: historyItems.value.map(item => ({
          ...item,
          timestamp: item.timestamp.toISOString()
        }))
      }
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
        type: 'application/json' 
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mushroom-history-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      console.log('Historial exportado exitosamente')
    } catch (error) {
      console.error('Error exportando historial:', error)
    }
  }

  // Función para importar historial
  const importHistory = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          if (imported.data && Array.isArray(imported.data)) {
            const importedItems = imported.data.map(item => ({
              ...item,
              timestamp: new Date(item.timestamp)
            }))
            
            // Agregar elementos importados (evitando duplicados por ID)
            const existingIds = new Set(historyItems.value.map(item => item.id))
            const newItems = importedItems.filter(item => !existingIds.has(item.id))
            
            historyItems.value = [...newItems, ...historyItems.value]
            
            // Limitar a 50 elementos
            if (historyItems.value.length > 50) {
              historyItems.value = historyItems.value.slice(0, 50)
            }
            
            console.log(`${newItems.length} nuevos elementos importados`)
            resolve(newItems.length)
          } else {
            reject(new Error('Formato de archivo inválido'))
          }
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Error leyendo archivo'))
      reader.readAsText(file)
    })
  }

  return { 
    historyItems, 
    addToHistory, 
    removeFromHistory, 
    clearHistory,
    getHistoryStats,
    exportHistory,
    importHistory
  }
})
