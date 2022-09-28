<style lang="scss" scoped>
  @import "style/index.scss";
</style>

<script >
import Card from "./Card.vue"
export default {
  components: {
    Card
  },
  data() {
    return {
      items: [
              {
                name: '开发者武器库',
                desc: '开发者武器库，做开发者最专业最好用的专业工具箱',
                logo: 'https://devtool.tech/assets/logo.svg',
                href: 'https://devtool.tech/',
              },
              {
                name: 'Vercel',
                desc: 'Develop. Preview. Ship. For the best frontend teams – Vercel',
                logo: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico',
                href: 'https://vercel.com/',
              },
              {
                name: '渐变色',
                desc: 'Fresh Background Gradients | WebGradients.com 💎',
                logo: 'https://webgradients.com/favicons/favicon-32x32.png',
                href: 'https://webgradients.com',
                bgColor: '',
                //color: ' rgb(104, 84, 161)',
              },
          ]
    }
  }
  
}
</script>

<template>
    <Card 
      :Card="items"
      :key="index"
    ></Card>
</template>