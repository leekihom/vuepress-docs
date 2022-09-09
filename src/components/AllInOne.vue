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
                name: '即时工具',
                desc: '即时工具-致力打造即用即走型在线工具箱',
                logo: 'https://file.67tool.com/favicon.ico/',
                href: 'https://www.67tool.com/',
                bgColor: 'linear-gradient(0deg,#fbc2eb 0%, #a6c1ee 100%)',
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