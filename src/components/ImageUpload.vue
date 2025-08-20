<script setup>
// Lógica del componente

import { ref } from 'vue'
import { Image, Camera, Upload, X } from 'lucide-vue-next'

const selectedImage = ref(null) // Inicialmente no hay imagen
const imagePreview = ref(null) // Inicialmente no hay URL de la imagen para mostrar en preview
const isAnalyzing = ref(false) // Verifica si está analizando
const analysisResult = ref(null) // Inicialmente no hay resultado del análisis

// este metodo se activa en el evento de subir imagen
const handleFileUpload = (event) => {
  //busca el file dentro del evento, siempre se accede desde target
  console.log('aqui empieza')
  console.log(event)
  console.log('aqui empieza 2')
  console.log(event.target)
  console.log('aqui empieza 3')
  console.log(event.target.files)
  console.log('aqui empieza 4 ')
  console.log(event.target.files[0])
  console.log('aqui termina')
  const file = event.target.files[0]

  if (file) {
    // si existe un file al momento del evento
    selectedImage.value = file // guarda el file que se subio reactivamente
    //para usar la imagen en el HTML en el momento que te la suben tienes que
    //hacer que pase de ser un file a ser una URL y asi ponerla en img
    //eso se hace con FileReader
    //este funciona asi:
    const reader = new FileReader()
    reader.onload = (e) => {
      //asigna el file transformado en URL a una variable reactiva
      imagePreview.value = e.target.result
    }
    //transforma el file a URL de forma asincrona
    reader.readAsDataURL(file)
  }
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
  selectedImage.value = null
  imagePreview.value = null
  analysisResult.value = null
}
</script>

<template>
  <!-- HTML del componente -->
  <!-- mx auto es margin-left y margin-right: auto
    asi que te deja al medio-->
  <!--este es el borde punteado-->
  <div class="max-w-8xl mx-auto p-6">
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8">
      <!--si no hay imagen almacenada en el preview-->
      <div v-if="!imagePreview" class="text-center">
        <!-- muestra Image que viene de lucide por default-->
        <Image class="w-24 h-24 text-gray-500 mx-auto mb-4" />
        <h1 class="text-xl font-medium mb-2">Selecciona una imagen</h1>
        <p class="font-medium text-gray-600">O usa la cámara para fotografiar un hongo</p>
      </div>
      <!--Previsualización de imagen-->
      <!-- si hay una imagen almacenada en el preview-->
      <div v-else class="text-center flex flex-col">
        <div class="relative inline-block">
          <!--pon esa imagen en el template-->
          <img
            :src="imagePreview"
            alt="Imagen seleccionada"
            class="w-80 h-80 object-cover rounded-lg mx-auto"
          />
          <button
            @click="clearImage"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Resultado del análisis -->
        <!-- si hay un resultado de analisis entonces muestra nombre confianza -->
        <!-- no tiene v-else porque si no hay resultado no muestra nombre ni confianza no muestra nada -->
        <div class="p-6 flex flex-col items-center">
          <div v-if="analysisResult">
            <div class="font-bold border bg-black text-white rounded-lg p-2 w-100">
              {{ analysisResult.name }}
            </div>
            <div class="p-2 text-gray-700 font-bold">
              {{ analysisResult.confidence }}
            </div>
          </div>
        </div>

        <!--boton analizar foto se activa cuando la foto es subida para analizar-->
        <!-- si no hay ningun resultado de analisis-->
        <!--activa el metodo analyzeImage que llama a la api y obtiene name y confidence-->
        <!--este boton se disablea si es que isAnalyzing es true-->
        <!--asi evitamos que la persona apriete 10000 de analisis-->
        <div class="pt-6">
          <button
            v-if="!analysisResult"
            class="bg-black text-white hover:bg-gray-800 border border-gray-300 rounded-lg w-80 h-10"
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

    <!--usar camara solo para version movil-->
    <!-- 
    <button class="hover:bg-gray-800" @click="useCamera">
      <Camera />
      Usar Cámara
    </button>
    -->

    <!--subir imagen-->
    <div class="pt-8">
      <label
        class="bg-black text-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-500 flex items-center gap-2 cursor-pointer"
      >
        <Upload class="w-5 h-5" />
        Subir Imagen
        <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
      </label>
    </div>
  </div>
</template>

<style scoped>
/* Estilos del componente */
</style>
