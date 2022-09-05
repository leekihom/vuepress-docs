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
                name: '程序员盒子',
                desc: '程序员一站式编程导航，专注于程序员学习编程提效，官网',
                logo: 'https://www.coderutil.com/favicon.ico',
                href: 'https://www.coderutil.com/',
                bgColor: 'linear-gradient(0deg,#a18cd1 0%, #fbc2eb 100%)',
                color: ' rgb(104, 84, 161)',
              },
              {
                name: 'Road To Coding',
                desc: 'Road To Coding，意为「编程自学之路」，是自学编程以来所用资源和分享内容的大聚合',
                logo: 'https://r2coding.com/favicon.ico',
                href: 'https://r2coding.com/',
                bgColor: 'rgb(203, 234, 250)',
                color: ' rgb(104, 84, 161)',
              },
              {
                name: '印记中文',
                desc: '深入挖掘国外前端新领域，为中国 Web 前端开发人员提供优质文档！',
                logo: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/al1nd-ai8jt.png',
                href: 'https://docschina.org/',
                bgColor: 'rgb(203, 234, 250)',
                color: ' rgb(104, 84, 161)',
              },
              {
                name: 'ES6 入门教程',
                desc: '《ECMAScript 6 入门教程》是一本开源的 JavaScript 语言教程，全面介绍 ECMAScript 6 新引入的语法特性。',
                logo: 'https://r2coding.com/favicon.ico',
                href: 'https://es6.ruanyifeng.com/',
                bgColor: 'rgb(203, 234, 250)',
                color: ' rgb(104, 84, 161)',
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