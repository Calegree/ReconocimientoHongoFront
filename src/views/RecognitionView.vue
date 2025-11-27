<script setup>
// Lógica del componente
import Title from '../components/Title.vue'
import NavBar from '../components/NavBar.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { ref } from 'vue'
import { Image, Camera } from 'lucide-vue-next'

const imagePreview = ref(null)
const prediction = ref(null)
const uploading = ref(false)
const fileInput = ref(null)

const openFilePicker = () => fileInput.value && fileInput.value.click()

const handleFileUpload = (event) => {
  const file = event.target.files ? event.target.files[0] : null
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    // enviar al backend automáticamente
    sendPredict(file)
  }
}

const sendPredict = async (file) => {
  uploading.value = true
  prediction.value = null
  try {
  const fd = new FormData()
  // el backend espera el campo 'imagen'
  fd.append('imagen', file)
  // usar proxy /api
  const res = await fetch('/api/predict', { method: 'POST', body: fd })
    if (!res.ok) {
      const err = await res.json().catch(()=>({error: 'error'}))
      throw new Error(err.error || res.statusText)
    }
    prediction.value = await res.json()
  } catch (e) {
    prediction.value = { error: String(e) }
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f5e6c8]">
    <div class="text-center mt-8 mb-2">
      <h1 class="text-3xl font-bold text-gold-900">Reconocimiento Morchella</h1>
      <p class="text-lg text-gold-700 mt-2">Sistema de IA para identificación de hongos</p>
    </div>
    <div class="flex-1 flex items-center justify-center">
      <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-lg w-full max-w-xl">
        <div class="rounded-lg border-2 border-dashed p-8 text-center border-gold-300 mb-6">
          <Image class="mx-auto w-12 h-12 text-gold-500 mb-2" />
          <p class="text-xl font-semibold text-gold-900">Selecciona una imagen</p>
          <p class="text-base text-gold-700 mt-2">O usa la cámara para fotografiar un hongo</p>
        </div>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
        <button @click="openFilePicker" class="w-full flex items-center justify-center gap-2 rounded-md bg-[#bfa14a] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#8d6a00] transition-colors">
          <Camera class="h-5 w-5" />
          Subir Imagen
        </button>

        <div v-if="imagePreview" class="mt-4">
          <img :src="imagePreview" class="w-full rounded" />
        </div>

        <div v-if="uploading" class="mt-3 text-sm text-gold-900">Enviando imagen...</div>

        <div v-if="prediction" class="mt-4 p-3 bg-gray-50 rounded">
          <pre class="text-sm">{{ prediction }}</pre>
        </div>
      </div>
    </div>
    <NavBar class="fixed left-0 right-0 bottom-0 z-50" />
  </div>
</template>

<style scoped>
.text-gold-900 { color: #8d6a00; }
.text-gold-700 { color: #bfa14a; }
.text-gold-500 { color: #d4af37; }
.border-gold-300 { border-color: #d4af37; }
</style>
