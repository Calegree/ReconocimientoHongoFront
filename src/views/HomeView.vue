<template>
  <div>
    <input type="file" @change="handleFile" />
    <img :src="imgSrc" v-if="imgSrc" />
    <p v-if="result">
      Predicción: {{ result.label }} (confianza: {{ result.confidence.toFixed(2) }})
    </p>
  </div>
</template>

<script>
import * as ml5 from 'ml5'

export default {
  data() {
    return {
      classifier: null,
      imgSrc: null,
      result: null,
    }
  },
  async mounted() {
    this.classifier = await ml5.imageClassifier('/model/model.json')
  },
  methods: {
    handleFile(event) {
      const file = event.target.files[0]
      this.imgSrc = URL.createObjectURL(file)

      this.$nextTick(() => {
        const image = document.querySelector('img')
        this.classifier.classify(image, (err, results) => {
          if (err) return console.error(err)
          this.result = results[0] // resultado con mayor confianza
        })
      })
    },
  },
}
</script>
