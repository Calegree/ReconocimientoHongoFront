<script setup>
import Title from '../components/Title.vue'
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-vue-next'

const isDragging = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const isUploading = ref(false)
const showSuccess = ref(false)

const openFilePicker = () => fileInput.value && fileInput.value.click()
const onFileChange = (e) => handleFiles(e.target.files)
const onDragOver = (e) => { e.preventDefault(); isDragging.value = true }
const onDragLeave = () => { isDragging.value = false }
const onDrop = (e) => { e.preventDefault(); isDragging.value = false; if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files) }

const MODELS_DIR = '/upload' // unused here, just semantic
const currentModelName = ref('morchella_v2.h5')
const lastUpdated = ref('Actualizado hace 2 días')

const uploadModel = async (file) => {
  isUploading.value = true
  showSuccess.value = false
  try {
  const fd = new FormData()
  fd.append('model', file)
  // usar proxy /api
  const res = await fetch('/api/upload/model', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('upload failed')
    const json = await res.json()
    currentModelName.value = json.filename || file.name
    lastUpdated.value = 'Actualizado hace unos segundos'
    showSuccess.value = true
    await listModels()
  } catch (e) {
    console.error('upload error', e)
  } finally {
    isUploading.value = false
  }
}

const handleFiles = (files) => {
  const file = files[0]
  if (file) {
    selectedFile.value = file
    uploadModel(file)
  }
}

const models = ref([])
const runs = ref([])

const listModels = async () => {
  try {
  const res = await fetch('/api/upload/models')
    if (res.ok) {
      const j = await res.json()
      models.value = j.models || []
    }
  } catch (e) {}
}

const listRuns = async () => {
  try {
    const res = await fetch('/api/mlflow/runs')
    if (res.ok) runs.value = await res.json()
  } catch (e) {}
}

onMounted(() => {
  listModels()
  listRuns()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f5e6c8]">
    <Title />
    <div class="flex-1 flex items-center justify-center">
      <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-lg w-full max-w-xl">
        <h2 class="text-center text-xl font-bold text-gold-900 mb-2">Actualizar Modelo de IA</h2>
        <div
          class="mt-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors"
          :class="isDragging ? 'border-gold-800 bg-gold-50' : 'border-gold-300'"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
        >
          <Upload class="w-10 h-10 mx-auto text-gold-500" />
          <p class="mt-2 text-gold-900 font-medium">Arrastra tu modelo aquí</p>
          <p class="text-sm text-gold-700">Formatos soportados: .h5, .pb, .onnx, .pkl</p>
          <button @click="openFilePicker" class="mt-4 inline-flex items-center rounded-md border border-gold-300 bg-gold-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isUploading">
            Seleccionar Archivo
          </button>
          <input ref="fileInput" type="file" class="hidden" accept=".h5,.pb,.onnx,.pkl" @change="onFileChange" />
          <div v-if="selectedFile && !isUploading" class="mt-3 text-sm text-gold-700">Seleccionado: {{ selectedFile.name }}</div>

          <div v-if="isUploading" class="mt-4 flex items-center justify-center gap-2 text-sm text-gold-900">
            <Loader2 class="w-5 h-5 animate-spin text-gold-800" />
            <span>Subiendo modelo...</span>
          </div>
        </div>

        <div v-if="showSuccess" class="rounded-lg border border-gold-200 bg-white px-4 py-3 shadow-sm flex items-start gap-2 mt-4">
          <CheckCircle2 class="w-5 h-5 text-green-600 mt-0.5" />
          <p class="text-sm text-gold-900">Modelo actualizado exitosamente. El sistema ahora usa el nuevo modelo para reconocimiento.</p>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gold-200 shadow-sm flex items-center mt-4">
          <FileText class="w-5 h-5 text-gold-500 mr-3" />
          <div>
            <div class="text-sm font-medium text-gold-900">Modelo Actual</div>
            <div class="text-sm text-gold-700">{{ currentModelName }} - {{ lastUpdated }}</div>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-medium text-gold-900 mb-2">Modelos subidos</h3>
          <ul>
            <li v-for="m in models" :key="m" class="text-sm text-gold-700">{{ m }}</li>
          </ul>
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-medium text-gold-900 mb-2">Runs MLflow</h3>
          <ul>
            <li v-for="r in runs" :key="r.run_id" class="text-sm text-gold-700">{{ r.run_id }} - {{ r.status }}</li>
          </ul>
        </div>

      </div>
    </div>
    <NavBar/>
  </div>
</template>

<style scoped>
/* Colores dorados personalizados */
.text-gold-900 { color: #8d6a00; }
.text-gold-700 { color: #bfa14a; }
.text-gold-500 { color: #d4af37; }
.text-gold-200 { color: #f5e6c8; }
.border-gold-300 { border-color: #d4af37; }
.border-gold-200 { border-color: #f5e6c8; }
.border-gold-800 { border-color: #8d6a00; }
.bg-gold-500 { background: #d4af37; }
.bg-gold-50 { background: #f5e6c8; }
.hover\:bg-gold-600:hover { background: #bfa14a; }
</style>
