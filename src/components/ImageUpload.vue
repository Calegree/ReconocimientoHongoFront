<script setup>
// Lógica del componente

import { ref, watch } from 'vue'
import { Image, Camera, Upload, X } from 'lucide-vue-next'
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { useHistoryStore } from '@/stores/history'

const selectedImage = ref(null) // Inicialmente no hay imagen
const imagePreview = ref(null) // Inicialmente no hay URL de la imagen para mostrar en preview
const isAnalyzing = ref(false) // Verifica si está analizando
const analysisResult = ref(null) // Inicialmente no hay resultado del análisis

// Store del historial
const historyStore = useHistoryStore()

// Watchers para debug
watch(imagePreview, (newVal) => {
  console.log(' imagePreview cambió:', newVal ? 'Imagen cargada' : 'Sin imagen')
})

watch(selectedImage, (newVal) => {
  console.log(' selectedImage cambió:', newVal ? `Archivo: ${newVal.name}` : 'Sin archivo')
})

// este metodo se activa en el evento de subir imagen
const handleFileUpload = (event) => {
  console.log('=== INICIO handleFileUpload ===')
  console.log('Event completo:', event)
  console.log('Event target:', event.target)
  console.log('Files array:', event.target.files)
  console.log('Primer archivo:', event.target.files?.[0])
  
  const file = event.target.files?.[0]

  if (file) {
    console.log(' Archivo detectado:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    // Limpiar resultado anterior cuando se selecciona nueva imagen
    analysisResult.value = null
    isAnalyzing.value = false
    
    // si existe un file al momento del evento
    selectedImage.value = file // guarda el file que se subio reactivamente
    
    //para usar la imagen en el HTML en el momento que te la suben tienes que
    //hacer que pase de ser un file a ser una URL y asi ponerla en img
    //eso se hace con FileReader
    //este funciona asi:
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log(' FileReader completado, resultado:', e.target.result?.substring(0, 100) + '...')
      //asigna el file transformado en URL a una variable reactiva
      imagePreview.value = e.target.result
      console.log('imagePreview.value actualizado')
    }
    reader.onerror = (e) => {
      console.error('Error en FileReader:', e)
    }
    //transforma el file a URL de forma asincrona
    reader.readAsDataURL(file)
    console.log('Iniciando lectura con FileReader...')
  } else {
    console.log('No se encontró archivo')
  }
  
  // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
  event.target.value = ''
  console.log(' Input limpiado')
  console.log('=== FIN handleFileUpload ===')
}

// Función para tomar foto con la cámara
const takePhoto = async () => {
  try {
    console.log(' === INICIO takePhoto ===')
    
    // Limpiar resultado anterior cuando se toma nueva foto
    analysisResult.value = null
    isAnalyzing.value = false
    
    // Verifica si estamos en un dispositivo móvil
    if (!Capacitor.isNativePlatform()) {
      console.log(' Ejecutándose en navegador web')
      // En navegador web, usa la API de MediaDevices si está disponible
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Crear un input file que active la cámara
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.capture = 'environment' // Usa la cámara trasera
        input.onchange = (e) => {
          console.log(' Foto tomada desde navegador')
          handleFileUpload(e)
        }
        input.click()
        return
      } else {
        console.log(' La cámara no está disponible en este navegador')
        alert('La cámara no está disponible en este navegador')
        return
      }
    }

    console.log('Ejecutándose en dispositivo móvil nativo')
    // Para dispositivos móviles nativos
    const image = await CapCamera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    })

    // La imagen viene como data URL
    if (image.dataUrl) {
      console.log('Foto obtenida de cámara nativa')
      imagePreview.value = image.dataUrl
      // Convertir dataUrl a blob para selectedImage
      const response = await fetch(image.dataUrl)
      const blob = await response.blob()
      selectedImage.value = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
      console.log(' Archivo creado desde foto de cámara')
    }
  } catch (error) {
    console.error(' Error al tomar foto:', error)
    alert('Error al acceder a la cámara')
  }
  console.log(' === FIN takePhoto ===')
}

const analyzeImage = async () => {
  //si no hay imagen subida entonces no entra a la funcion
  if (!selectedImage.value) return
  //avisa que esta analizando
  isAnalyzing.value = true

  try {
    console.log(' === INICIO analyzeImage ===')
    
    // Convertir la imagen a base64
    const base64Image = await convertImageToBase64(selectedImage.value)
    console.log('Imagen convertida a base64')

    // Preparar la petición a la API de Kindwise Mushroom
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
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error de API:', response.status, response.statusText, errorText)
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()
    console.log(' Respuesta completa de la API de Mushroom:', result)

    // Procesar la respuesta de la API de hongos según el nuevo formato
    if (result.result && result.result.classification && result.result.classification.suggestions && result.result.classification.suggestions.length > 0) {
      const topSuggestion = result.result.classification.suggestions[0]
      const confidence = Math.round(topSuggestion.probability * 100)
      
      console.log(' Procesando sugerencia principal de hongo:', topSuggestion)
     
      
      // Extraer información detallada del hongo
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
      console.log(' Resultado de hongo procesado:', analysisResult.value)
    } else {
      // No se encontraron sugerencias
      analysisResult.value = {
        name: 'No se pudo identificar el hongo',
        confidence: '0%',
        commonNames: [],
        description: 'El hongo no pudo ser identificado. Intenta con una imagen más clara o desde otro ángulo.',
        taxonomy: {},
        similarImages: [],
        fullConfidence: 0,

      }
      console.log(' No se encontraron sugerencias de hongos en la respuesta')
    }

  } catch (error) {
    console.error(' Error al analizar imagen:', error)
    
    // Determinar el tipo de error y mostrar mensaje apropiado
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
    
    // Mostrar error al usuario
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
    
    // Opcional: mostrar alerta al usuario
    alert(`Error: ${errorMessage}`)
  } finally {
    isAnalyzing.value = false
    
    // Guardar en el historial si hay un resultado válido
    if (analysisResult.value && imagePreview.value) {
      const historyItem = {
        image: imagePreview.value, // URL de la imagen para mostrar
        result: analysisResult.value, // Resultado completo del análisis
        originalFile: selectedImage.value ? {
          name: selectedImage.value.name,
          size: selectedImage.value.size,
          type: selectedImage.value.type
        } : null
      }
      
      historyStore.addToHistory(historyItem)
      console.log('Resultado guardado en el historial')
    }
    
    console.log(' === FIN analyzeImage ===')
  }
}

// Función auxiliar para convertir imagen a base64
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

// Función para limpiar la imagen seleccionada
const clearImage = () => {
  console.log('🧹 === Limpiando imagen ===')
  selectedImage.value = null
  imagePreview.value = null
  analysisResult.value = null
  console.log('✅ Imagen limpiada completamente')
}
</script>

<template>
  <!-- HTML del componente -->
  <!-- Container responsivo -->
  <div class="w-full max-w-2xl mx-auto px-4">
    <!-- Panel de debug (temporal para testing) -->
    <div class="bg-sand bg-opacity-30 border border-hover rounded p-2 mb-4 text-xs">
      <div class="text-text">🖼️ imagePreview: {{ imagePreview ? 'Cargada' : 'Vacía' }}</div>
      <div class="text-text">📁 selectedImage: {{ selectedImage ? selectedImage.name : 'Vacío' }}</div>
      <div class="text-text">🔍 analysisResult: {{ analysisResult ? analysisResult.name : 'Vacío' }}</div>
      <div class="text-text">⏳ isAnalyzing: {{ isAnalyzing ? 'Analizando...' : 'Inactivo' }}</div>
      <div v-if="analysisResult && analysisResult.fullConfidence !== undefined" class="text-text">
        📊 Confianza: {{ analysisResult.fullConfidence }}%
      </div>

      <div v-if="analysisResult && analysisResult.error" class="text-red-600">
        ❌ Error: {{ analysisResult.errorDetails }}
      </div>
    </div>
    
    <div class="border-2 border-dashed border-hover rounded-lg p-4 md:p-8 bg-background shadow-sm">
      <!--si no hay imagen almacenada en el preview-->
      <div v-if="!imagePreview" class="text-center">
        <!-- muestra Image que viene de lucide por default-->
        <Image class="w-16 h-16 md:w-24 md:h-24 text-text-deep mx-auto mb-4" />
        <h1 class="text-lg md:text-xl font-medium mb-2 text-text">Selecciona una imagen</h1>
        <p class="text-sm md:text-base font-medium text-text-deep">O usa la cámara para fotografiar un hongo</p>
      </div>
      <!--Previsualización de imagen-->
      <!-- si hay una imagen almacenada en el preview-->
      <div v-else class="text-center flex flex-col items-center">
        <div class="relative inline-block max-w-full">
          <!--pon esa imagen en el template con tamaño responsivo-->
          <img
            :src="imagePreview"
            alt="Imagen seleccionada"
            class="w-full max-w-sm md:max-w-md h-64 md:h-80 object-cover rounded-lg mx-auto"
          />
          <button
            @click="clearImage"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg border-2 border-border"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Resultado del análisis -->
        <!-- si hay un resultado de analisis entonces muestra nombre confianza -->
        <!-- no tiene v-else porque si no hay resultado no muestra nombre ni confianza no muestra nada -->
        <div class="p-4 md:p-6 flex flex-col items-center w-full">
          <div v-if="analysisResult" class="w-full max-w-sm">
            <!-- Resultado principal -->
            <div 
              class="font-bold border border-border rounded-lg p-3 w-full text-center shadow-md"
              :class="analysisResult.error ? 'bg-red-500 text-white' : 'bg-sand text-background'"
            >
              {{ analysisResult.name }}
            </div>
            
            <!-- Confianza -->
            <div 
              class="p-2 font-bold text-center"
              :class="analysisResult.error ? 'text-red-700' : 'text-text-deep'"
            >
              {{ analysisResult.error ? analysisResult.confidence : `Confianza: ${analysisResult.confidence}` }}
            </div>
            
            <!-- Descripción (si existe y no es error) -->
            <div v-if="analysisResult.description && !analysisResult.error" 
                 class="p-2 text-sm text-text text-center">
              <strong>Descripción:</strong>
              <div class="mt-1 text-justify">
                {{ analysisResult.description }}
              </div>
            </div>
            
            <!-- Nombres comunes (si existen) -->
            <div v-if="analysisResult.commonNames && analysisResult.commonNames.length > 0" 
                 class="p-2 text-sm text-text text-center">
              <strong>Nombres comunes:</strong>
              <div class="mt-1">
                {{ analysisResult.commonNames.join(', ') }}
              </div>
            </div>
            
            <!-- Taxonomía (si existe) -->
            <div v-if="analysisResult.taxonomy && Object.keys(analysisResult.taxonomy).length > 0 && !analysisResult.error" 
                 class="p-2 text-sm text-text text-center">
              <strong>Clasificación:</strong>
              <div class="mt-1 space-y-1">
                <div v-if="analysisResult.taxonomy.kingdom">Reino: {{ analysisResult.taxonomy.kingdom }}</div>
                <div v-if="analysisResult.taxonomy.phylum">Filo: {{ analysisResult.taxonomy.phylum }}</div>
                <div v-if="analysisResult.taxonomy.class">Clase: {{ analysisResult.taxonomy.class }}</div>
                <div v-if="analysisResult.taxonomy.order">Orden: {{ analysisResult.taxonomy.order }}</div>
                <div v-if="analysisResult.taxonomy.family">Familia: {{ analysisResult.taxonomy.family }}</div>
                <div v-if="analysisResult.taxonomy.genus">Género: {{ analysisResult.taxonomy.genus }}</div>
              </div>
            </div>
            
            <!-- Botones de acción después del análisis -->
            <div class="pt-2 space-y-2">
              <button
                class="bg-hover text-background hover:bg-text-deep border border-border rounded-lg w-full h-10 disabled:opacity-50 transition-colors shadow-md"
                @click="analyzeImage"
                :disabled="isAnalyzing"
              >
                {{ isAnalyzing ? 'Analizando...' : 'Volver a Analizar' }}
              </button>
            </div>
          </div>
        </div>

        <!--boton analizar foto se activa cuando la foto es subida para analizar-->
        <!-- si no hay ningun resultado de analisis-->
        <!--activa el metodo analyzeImage que llama a la api y obtiene name y confidence-->
        <!--este boton se disablea si es que isAnalyzing es true-->
        <!--asi evitamos que la persona apriete 10000 de analisis-->
        <div class="pt-4 w-full">
          <button
            v-if="!analysisResult"
            class="bg-sand text-background hover:bg-hover border border-border rounded-lg w-full max-w-sm h-12 mx-auto block disabled:opacity-50 shadow-md transition-colors"
            @click="analyzeImage"
            :disabled="isAnalyzing"
          >
            <!--si isAnalyzing es false entonces dice Analizar imagen
          si es true entonces pone analizando (mientras esta disabled)-->
            {{ isAnalyzing ? 'Analizando...' : 'Analizar Imagen' }}
          </button>
        </div>
      </div>
    </div>
    <!--botones de subir imagen o usar camara-->

    <!--Botones de acción para subir imagen o tomar foto-->
    <div class="pt-6 md:pt-8 space-y-4">
      <!-- Botón de cámara -->
      <button
        @click="takePhoto"
        class="bg-hover text-background border border-border px-4 md:px-6 py-3 rounded-lg hover:bg-text-deep flex items-center justify-center gap-2 w-full max-w-sm mx-auto transition-colors shadow-md"
      >
        <Camera class="w-5 h-5" />
        <span class="text-sm md:text-base">Tomar Foto</span>
      </button>

      <!-- Botón de subir imagen -->
      <label
        class="bg-sand text-background border border-border px-4 md:px-6 py-3 rounded-lg hover:bg-hover flex items-center justify-center gap-2 cursor-pointer w-full max-w-sm mx-auto transition-colors shadow-md"
      >
        <Upload class="w-5 h-5" />
        <span class="text-sm md:text-base">Subir Imagen</span>
        <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
      </label>
    </div>
  </div>
</template>

<style scoped>
/* Estilos del componente */
</style>
