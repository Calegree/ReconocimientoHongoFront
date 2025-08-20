<script setup>
import Title from '../components/Title.vue'
import NavBar from '../components/NavBar.vue'
import { ref } from 'vue'
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-vue-next'

const isDragging = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const isUploading = ref(false)
const showSuccess = ref(false)

const openFilePicker = () => fileInput.value && fileInput.value.click()
const onFileChange = (e) => handleFiles(e.target.files)
const onDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}
const onDragLeave = () => {
  isDragging.value = false
}
const onDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files)
}

const uploadModel = async (file) => {
  isUploading.value = true
  showSuccess.value = false
  // Aquí iría tu llamada real al backend con FormData
  await new Promise((r) => setTimeout(r, 2500)) // simulación de subida
  isUploading.value = false
  showSuccess.value = true
  currentModelName.value = file.name
  lastUpdated.value = 'Actualizado hace unos segundos'
}

const handleFiles = (files) => {
  const file = files[0]
  if (file) {
    selectedFile.value = file
    uploadModel(file)
  }
}

const currentModelName = ref('morchella_v2.h5')
const lastUpdated = ref('Actualizado hace 2 días')
</script>

<template>
  <Title />

  <div class="max-w-3xl mx-auto p-4 space-y-6">
    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 class="text-center text-lg font-semibold text-gray-900">Actualizar Modelo de IA</h2>

      <div
        class="mt-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors"
        :class="isDragging ? 'border-gray-800 bg-gray-50' : 'border-gray-300'"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <Upload class="w-10 h-10 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-700 font-medium">Arrastra tu modelo aquí</p>
        <p class="text-sm text-gray-500">Formatos soportados: .h5, .pb, .onnx, .pkl</p>

        <button
          class="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="openFilePicker"
          :disabled="isUploading"
        >
          Seleccionar Archivo
        </button>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept=".h5,.pb,.onnx,.pkl"
          @change="onFileChange"
        />

        <div v-if="selectedFile && !isUploading" class="mt-3 text-sm text-gray-600">
          Seleccionado: {{ selectedFile.name }}
        </div>

        <!-- Spinner durante la subida -->
        <div
          v-if="isUploading"
          class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700"
        >
          <Loader2 class="w-5 h-5 animate-spin text-gray-800" />
          <span>Subiendo modelo...</span>
        </div>
      </div>
    </div>

    <!-- Aviso de éxito -->
    <div
      v-if="showSuccess"
      class="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm flex items-start gap-2"
    >
      <CheckCircle2 class="w-5 h-5 text-green-600 mt-0.5" />
      <p class="text-sm text-gray-700">
        Modelo actualizado exitosamente. El sistema ahora usa el nuevo modelo para reconocimiento.
      </p>
    </div>

    <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
      <FileText class="w-5 h-5 text-gray-500 mr-3" />
      <div>
        <div class="text-sm font-medium text-gray-900">Modelo Actual</div>
        <div class="text-sm text-gray-600">{{ currentModelName }} - {{ lastUpdated }}</div>
      </div>
    </div>
  </div>

  <NavBar />
</template>

<style scoped>
/* Estilos del componente */
</style>
