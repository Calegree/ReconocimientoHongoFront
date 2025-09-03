<script setup>
// Lógica del componente
import Title from '../components/Title.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { ref } from 'vue'

const imagePreview = ref(null) // Inicialmente no hay imagen subida para preview

//se activa en el evento de subir una imagen
const handleFileUpload = (event) => {
  const file = event.target.file[0] // asigna el file subido a una variable
  if (file) {
    // si el file existe
    // el file como tal no puede ser leido en HTML asi que hay que usar FileReader para pasarlo a Url
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log('Archivo leido')
      //aqui transformaste el file en url para usar en HTML para imprimirlo
      console.log('resultado:', e.target.result)
      imagePreview.value = e.target.result //guarda la url en imagePreview
    }
    //esto transforma pero no tiene que ser parte del proceso de variable para que funcione
    reader.readAsDataURL(file)
    console.log('Leyendo archivo')
  }
}
</script>

<template>
  <!-- HTML del componente -->
  <div class="min-h-screen bg-background">
    <!-- Container principal con padding y spacing -->
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Título -->
      <div class="pt-4">
        <Title />
      </div>
      
      <!-- Espaciado entre título e ImageUpload -->
      <div class="mt-8">
        <ImageUpload />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos del componente */
</style>
