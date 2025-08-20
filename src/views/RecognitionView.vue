<script setup>
// Lógica del componente
import Title from '../components/Title.vue'
import NavBar from '../components/NavBar.vue'
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
  <Title />
  <ImageUpload />
  <NavBar />
</template>

<style scoped>
/* Estilos del componente */
</style>
