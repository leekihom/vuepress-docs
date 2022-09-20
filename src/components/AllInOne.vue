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
                name: '',
                desc: '',
                logo: '',
                href: '',
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