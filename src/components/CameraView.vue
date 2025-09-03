<template>
  <div class="relative min-h-screen bg-black overflow-hidden">
    <!-- Camera Stream -->
    <div class="absolute inset-0 flex items-center justify-center">
      <video 
        ref="videoElement" 
        class="w-full h-full object-cover"
        autoplay 
        playsinline 
        muted
        v-show="isStreaming && !capturedImage"
      />
      
      <!-- Placeholder when camera is not active -->
      <div 
        v-show="!isStreaming && !capturedImage" 
        class="w-full h-full bg-gray-900 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <CameraIcon class="mx-auto mb-4 h-16 w-16 opacity-50" />
          <p class="text-lg opacity-70">Toca el botón de cámara para comenzar</p>
        </div>
      </div>

      <!-- Captured Image Preview -->
      <img 
        v-if="capturedImage" 
        :src="capturedImage" 
        class="w-full h-full object-cover"
        alt="Captured photo"
      />
    </div>

    <!-- Top UI - App Title and Debug Info -->
    <div class="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-6 pt-12">
      <h1 class="text-white text-xl font-bold text-center">Reconocimiento Morchella</h1>
      <p class="text-white/80 text-sm text-center mt-1">Sistema de IA para identificación de hongos</p>
      
      <!-- Debug Panel (can be hidden in production) -->
      <div class="bg-white/10 backdrop-blur-md rounded-lg p-3 mt-4 text-xs text-white/90">
        <div class="grid grid-cols-2 gap-2">
          <div>📷 Imagen: {{ capturedImage ? 'Capturada' : 'Sin imagen' }}</div>
          <div>🔍 Análisis: {{ analysisResult ? analysisResult.name : 'Sin resultado' }}</div>
          <div>⏳ Estado: {{ isAnalyzing ? 'Analizando...' : 'Inactivo' }}</div>
          <div>📡 Cámara: {{ isStreaming ? 'Activa' : 'Inactiva' }}</div>
        </div>
        <div v-if="analysisResult && analysisResult.fullConfidence !== undefined" class="mt-2 text-center">
          📊 Confianza: {{ analysisResult.fullConfidence }}%
        </div>
        <div v-if="analysisResult && analysisResult.error" class="mt-2 text-center text-red-300">
          ❌ Error: {{ analysisResult.errorDetails }}
        </div>
      </div>
    </div>

    <!-- Bottom UI - Floating Action Buttons -->
    <div class="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-6 pb-12">
      <div class="flex justify-center items-center space-x-8">
        
        <!-- History Button -->
        <button 
          @click="goToHistory"
          class="bg-white/20 backdrop-blur-md rounded-full p-4 text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
          :disabled="isAnalyzing"
        >
          <BarChart3Icon class="h-6 w-6" />
        </button>

        <!-- Main Camera/Capture Button -->
        <button 
          v-if="!capturedImage"
          @click="handleMainAction"
          :disabled="isAnalyzing"
          class="bg-white rounded-full p-6 text-black hover:bg-gray-200 transition-all duration-200 shadow-lg relative overflow-hidden"
        >
          <div v-if="isAnalyzing" class="absolute inset-0 bg-sand flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-background"></div>
          </div>
          <CameraIcon v-if="!isStreaming && !isAnalyzing" class="h-8 w-8" />
          <div v-else-if="isStreaming && !isAnalyzing" class="h-8 w-8 bg-red-500 rounded-full"></div>
        </button>

        <!-- Actions when image is captured -->
        <div v-if="capturedImage" class="flex space-x-4">
          <button 
            @click="retakePhoto"
            class="bg-red-500/80 backdrop-blur-md rounded-full p-4 text-white hover:bg-red-600/80 transition-all duration-200 shadow-lg"
          >
            <X class="h-6 w-6" />
          </button>
          <button 
            @click="analyzePhoto"
            :disabled="isAnalyzing"
            class="bg-green-500/80 backdrop-blur-md rounded-full p-6 text-white hover:bg-green-600/80 transition-all duration-200 shadow-lg relative"
          >
            <div v-if="isAnalyzing" class="absolute inset-0 bg-green-600/80 rounded-full flex items-center justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
            <Upload v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- File Upload Button -->
        <label 
          class="bg-white/20 backdrop-blur-md rounded-full p-4 text-white hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': isAnalyzing }"
        >
          <Image class="h-6 w-6" />
          <input 
            type="file" 
            class="hidden" 
            accept="image/*" 
            @change="handleFileUpload"
            :disabled="isAnalyzing"
          />
        </label>
      </div>
    </div>

    <!-- Analysis Result Modal -->
    <div 
      v-if="analysisResult && showResult" 
      class="absolute inset-0 z-30 bg-black/90 backdrop-blur-sm flex items-end"
      @click="closeResult"
    >
      <div class="w-full bg-white rounded-t-3xl p-6 max-h-3/4 overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Resultado del Análisis</h3>
          <button @click="closeResult" class="p-2 rounded-full hover:bg-gray-100">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Error State -->
        <div v-if="analysisResult.error" class="space-y-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X class="w-6 h-6 text-red-600" />
              </div>
              <h4 class="text-xl font-semibold text-red-800">{{ analysisResult.name }}</h4>
            </div>
          </div>
        </div>

        <!-- Success State -->
        <div v-else class="space-y-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div class="space-y-4">
              <h4 class="text-2xl font-bold text-gray-800">{{ analysisResult.name }}</h4>
              <div class="space-y-2">
                <p class="text-lg font-medium text-green-600">Confianza: {{ analysisResult.confidence }}</p>
                <!-- Visual confidence indicator -->
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    class="h-3 rounded-full transition-all duration-500"
                    :class="{
                      'bg-green-500': analysisResult.fullConfidence >= 80,
                      'bg-yellow-500': analysisResult.fullConfidence >= 50 && analysisResult.fullConfidence < 80,
                      'bg-orange-500': analysisResult.fullConfidence >= 30 && analysisResult.fullConfidence < 50,
                      'bg-red-500': analysisResult.fullConfidence < 30
                    }"
                    :style="{ width: analysisResult.fullConfidence + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { CameraIcon, Image, Upload, X, BarChart3Icon } from 'lucide-vue-next'
import { useHistoryStore } from '@/stores/history'

const router = useRouter()
const historyStore = useHistoryStore()

// Camera and UI state
const videoElement = ref(null)
const isStreaming = ref(false)
const capturedImage = ref(null)
const stream = ref(null)
const isAnalyzing = ref(false)
const analysisResult = ref(null)
const showResult = ref(false)

// Initialize camera on component mount
onMounted(() => {
  if (!Capacitor.isNativePlatform()) {
    // For web browsers, we'll start the camera immediately
    // startCamera()
  }
})

// Cleanup camera stream on component unmount
onUnmounted(() => {
  stopCamera()
})

const startCamera = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // On native platforms, we'll use the capacitor camera directly
      return
    }

    // For web browsers
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream.value = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',  // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoElement.value) {
        videoElement.value.srcObject = stream.value
        isStreaming.value = true
      }
    } else {
      console.warn('Camera not available in this browser')
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
    alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.')
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  isStreaming.value = false
}

const handleMainAction = async () => {
  if (!isStreaming.value) {
    await startCamera()
  } else {
    capturePhoto()
  }
}

const capturePhoto = () => {
  if (Capacitor.isNativePlatform()) {
    // Use native camera
    takePhotoNative()
  } else {
    // Capture from video stream
    captureFromStream()
  }
}

const takePhotoNative = async () => {
  try {
    const image = await CapCamera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    })

    if (image.dataUrl) {
      capturedImage.value = image.dataUrl
      stopCamera()
    }
  } catch (error) {
    console.error('Error taking photo:', error)
    alert('Error al tomar la foto')
  }
}

const captureFromStream = () => {
  if (!videoElement.value || !stream.value) return

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  
  context.drawImage(videoElement.value, 0, 0)
  
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.9)
  stopCamera()
}

const retakePhoto = () => {
  capturedImage.value = null
  analysisResult.value = null
  showResult.value = false
  startCamera()
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    capturedImage.value = e.target.result
    stopCamera()
  }
  reader.readAsDataURL(file)
  
  // Clear the input
  event.target.value = ''
}

const analyzePhoto = async () => {
  if (!capturedImage.value) return
  
  isAnalyzing.value = true
  
  try {
    console.log('=== INICIO analyzePhoto ===')
    
    // Convert image to blob for analysis
    const response = await fetch(capturedImage.value)
    const blob = await response.blob()
    const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
    
    // Convert to base64 for API - using the same method as original
    const base64Image = await convertImageToBase64(file)
    console.log('Imagen convertida a base64')

    // Call the mushroom identification API - exactly like original
    const apiUrl = 'https://mushroom.kindwise.com/api/v1/identification'
    const apiKey = 'xlJWL63eR46Y1K4X21RUUuNAIK8VbNHnzyD1Kd47ee8ONax3p6'

    const requestBody = {
      images: [base64Image],
      latitude: 0,
      longitude: 0,
      similar_images: true
    }

    console.log('Enviando petición a la API de Mushroom Identification...')
    console.log('Request body:', requestBody)

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify(requestBody)
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error('Error de API:', apiResponse.status, apiResponse.statusText, errorText)
      throw new Error(`Error HTTP: ${apiResponse.status} - ${apiResponse.statusText}`)
    }

    const result = await apiResponse.json()
    console.log('Respuesta completa de la API de Mushroom:', result)

    // Process the response exactly like the original implementation
    if (result.result && result.result.classification && result.result.classification.suggestions && result.result.classification.suggestions.length > 0) {
      const topSuggestion = result.result.classification.suggestions[0]
      const confidence = Math.round(topSuggestion.probability * 100)
      
      console.log('Procesando sugerencia principal de hongo:', topSuggestion)
      
      // Extract detailed mushroom information - same as original
      const mushroomName = topSuggestion.name || 'Hongo no identificado'
      const similarImages = topSuggestion.similar_images || []
      
      analysisResult.value = {
        name: mushroomName,
        confidence: `${confidence}%`,
        commonNames: [], // La nueva API no parece incluir nombres comunes directamente
        taxonomy: {}, // La nueva API no incluye taxonomía detallada
        similarImages: similarImages.slice(0, 3), // Mostrar solo las primeras 3 imágenes similares
        fullConfidence: confidence,
        rawData: result // Para debug completo
      }
      
      console.log('Resultado de hongo procesado:', analysisResult.value)
    } else {
      // No suggestions found - same as original
      analysisResult.value = {
        name: 'No se pudo identificar el hongo',
        confidence: '0%',
        commonNames: [],
        description: 'El hongo no pudo ser identificado. Intenta con una imagen más clara o desde otro ángulo.',
        taxonomy: {},
        similarImages: [],
        fullConfidence: 0
      }
      console.log('No se encontraron sugerencias de hongos en la respuesta')
    }

    // Save to history - same as original  
    if (analysisResult.value && capturedImage.value) {
      const historyItem = {
        image: capturedImage.value, // URL de la imagen para mostrar
        result: analysisResult.value, // Resultado completo del análisis
        originalFile: {
          name: 'camera-photo.jpg',
          size: blob.size,
          type: 'image/jpeg'
        }
      }
      
      historyStore.addToHistory(historyItem)
      console.log('Resultado guardado en el historial')
    }

    showResult.value = true

  } catch (error) {
    console.error('Error al analizar imagen:', error)
    
    // Determine error type and show appropriate message - same as original
    let errorMessage = 'Error desconocido'
    
    if (error.message.includes('Error HTTP: 401')) {
      errorMessage = 'Error de autenticación: API key inválida'
    } else if (error.message.includes('Error HTTP: 429')) {
      errorMessage = 'Límite de peticiones alcanzado. Intenta más tarde.'
    } else if (error.message.includes('Error HTTP: 400')) {
      errorMessage = 'Error en los datos enviados'
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Error de conexión. Verifica tu internet.'
    } else if (error.message.includes('Error HTTP:')) {
      errorMessage = `Error del servidor: ${error.message}`
    } else {
      errorMessage = 'Error al procesar la imagen'
    }
    
    // Show error to user - same as original
    analysisResult.value = {
      name: 'Error en el análisis',
      confidence: errorMessage,
      commonNames: [],
      description: 'Hubo un problema al analizar la imagen. Por favor, intenta nuevamente.',
      taxonomy: {},
      similarImages: [],
      error: true,
      errorDetails: error.message
    }
    
    // Show alert to user
    alert(`Error: ${errorMessage}`)
    
  } finally {
    isAnalyzing.value = false
    console.log('=== FIN analyzePhoto ===')
  }
}

const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Remover el prefijo "data:image/...;base64," para obtener solo la cadena base64
      const base64String = reader.result.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
      console.log('📷 Base64 generado (primeros 50 chars):', base64String.substring(0, 50) + '...')
      resolve(base64String)
    }
    reader.onerror = (error) => {
      console.error('❌ Error en FileReader para base64:', error)
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}

const closeResult = () => {
  showResult.value = false
}

const goToHistory = () => {
  router.push('/history')
}
</script>

<style scoped>
/* Additional mobile-specific styles */
@media (max-width: 768px) {
  .absolute.bottom-0 {
    padding-bottom: env(safe-area-inset-bottom, 1rem);
  }
  
  .absolute.top-0 {
    padding-top: env(safe-area-inset-top, 1rem);
  }
}

/* Ensure full screen on mobile */
.min-h-screen {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
}
</style>
