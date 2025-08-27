<script setup>
// Lógica del componente

import { ref, watch } from 'vue'
import { Image, Camera, Upload, X } from 'lucide-vue-next'
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

const selectedImage = ref(null) // Inicialmente no hay imagen
const imagePreview = ref(null) // Inicialmente no hay URL de la imagen para mostrar en preview
const isAnalyzing = ref(false) // Verifica si está analizando
const analysisResult = ref(null) // Inicialmente no hay resultado del análisis

// Watchers para debug
watch(imagePreview, (newVal) => {
  console.log('🖼️ imagePreview cambió:', newVal ? 'Imagen cargada' : 'Sin imagen')
})

watch(selectedImage, (newVal) => {
  console.log('📁 selectedImage cambió:', newVal ? `Archivo: ${newVal.name}` : 'Sin archivo')
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
    console.log('✅ Archivo detectado:', {
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
      console.log('✅ FileReader completado, resultado:', e.target.result?.substring(0, 100) + '...')
      //asigna el file transformado en URL a una variable reactiva
      imagePreview.value = e.target.result
      console.log('✅ imagePreview.value actualizado')
    }
    reader.onerror = (e) => {
      console.error('❌ Error en FileReader:', e)
    }
    //transforma el file a URL de forma asincrona
    reader.readAsDataURL(file)
    console.log('📖 Iniciando lectura con FileReader...')
  } else {
    console.log('❌ No se encontró archivo')
  }
  
  // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
  event.target.value = ''
  console.log('🧹 Input limpiado')
  console.log('=== FIN handleFileUpload ===')
}

// Función para tomar foto con la cámara
const takePhoto = async () => {
  try {
    console.log('📸 === INICIO takePhoto ===')
    
    // Limpiar resultado anterior cuando se toma nueva foto
    analysisResult.value = null
    isAnalyzing.value = false
    
    // Verifica si estamos en un dispositivo móvil
    if (!Capacitor.isNativePlatform()) {
      console.log('🌐 Ejecutándose en navegador web')
      // En navegador web, usa la API de MediaDevices si está disponible
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Crear un input file que active la cámara
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.capture = 'environment' // Usa la cámara trasera
        input.onchange = (e) => {
          console.log('📸 Foto tomada desde navegador')
          handleFileUpload(e)
        }
        input.click()
        return
      } else {
        console.log('❌ La cámara no está disponible en este navegador')
        alert('La cámara no está disponible en este navegador')
        return
      }
    }

    console.log('📱 Ejecutándose en dispositivo móvil nativo')
    // Para dispositivos móviles nativos
    const image = await CapCamera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    })

    // La imagen viene como data URL
    if (image.dataUrl) {
      console.log('✅ Foto obtenida de cámara nativa')
      imagePreview.value = image.dataUrl
      // Convertir dataUrl a blob para selectedImage
      const response = await fetch(image.dataUrl)
      const blob = await response.blob()
      selectedImage.value = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
      console.log('✅ Archivo creado desde foto de cámara')
    }
  } catch (error) {
    console.error('❌ Error al tomar foto:', error)
    alert('Error al acceder a la cámara')
  }
  console.log('📸 === FIN takePhoto ===')
}

const analyzeImage = async () => {
  //si no hay imagen subida entonces no entra a la funcion
  if (!selectedImage.value) return
  //avisa que esta analizando
  isAnalyzing.value = true

  //conecta con la api de reconocimiento y obtiene un json con
  //nombre del hongo (clase donde se encasilla a la foto)
  //porcentaje de confianza con que se identificó

  //simulacion de prueba da un json con morchella y 71.9 confianza
  //tiene 2000 para ver que onda los spinners
  setTimeout(() => {
    analysisResult.value = {
      name: 'Morchella',
      confidence: 'Confianza: 71.9%',
    }
    isAnalyzing.value = false
  }, 2000)
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
    <div class="bg-yellow-50 border border-yellow-200 rounded p-2 mb-4 text-xs">
      <div>🖼️ imagePreview: {{ imagePreview ? 'Cargada' : 'Vacía' }}</div>
      <div>📁 selectedImage: {{ selectedImage ? selectedImage.name : 'Vacío' }}</div>
      <div>🔍 analysisResult: {{ analysisResult ? 'Presente' : 'Vacío' }}</div>
    </div>
    
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8">
      <!--si no hay imagen almacenada en el preview-->
      <div v-if="!imagePreview" class="text-center">
        <!-- muestra Image que viene de lucide por default-->
        <Image class="w-16 h-16 md:w-24 md:h-24 text-gray-500 mx-auto mb-4" />
        <h1 class="text-lg md:text-xl font-medium mb-2">Selecciona una imagen</h1>
        <p class="text-sm md:text-base font-medium text-gray-600">O usa la cámara para fotografiar un hongo</p>
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
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Resultado del análisis -->
        <!-- si hay un resultado de analisis entonces muestra nombre confianza -->
        <!-- no tiene v-else porque si no hay resultado no muestra nombre ni confianza no muestra nada -->
        <div class="p-4 md:p-6 flex flex-col items-center w-full">
          <div v-if="analysisResult" class="w-full max-w-sm">
            <div class="font-bold border bg-black text-white rounded-lg p-3 w-full text-center">
              {{ analysisResult.name }}
            </div>
            <div class="p-2 text-gray-700 font-bold text-center">
              {{ analysisResult.confidence }}
            </div>
            <!-- Botón para volver a analizar -->
            <div class="pt-2">
              <button
                class="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 rounded-lg w-full h-10 disabled:opacity-50 transition-colors"
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
            class="bg-black text-white hover:bg-gray-800 border border-gray-300 rounded-lg w-full max-w-sm h-12 mx-auto block disabled:opacity-50"
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
        class="bg-blue-600 text-white border border-blue-600 px-4 md:px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 w-full max-w-sm mx-auto transition-colors"
      >
        <Camera class="w-5 h-5" />
        <span class="text-sm md:text-base">Tomar Foto</span>
      </button>

      <!-- Botón de subir imagen -->
      <label
        class="bg-black text-white border border-gray-300 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 cursor-pointer w-full max-w-sm mx-auto transition-colors"
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
