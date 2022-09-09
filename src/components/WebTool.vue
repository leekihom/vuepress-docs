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
                //bgColor: 'linear-gradient(0deg,#a18cd1 0%, #fbc2eb 100%)',
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