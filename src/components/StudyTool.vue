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
                  name: 'bugstack 虫洞栈',
                  desc: '包含: Java 基础，面经手册，Netty4.x，手写Spring，用Java实现JVM，重学Java设计模式，SpringBoot中间件开发，IDEA插件开发，DDD系统架构项目开发，字节码编程...',
                  logo: 'https://bugstack.cn/favicon.ico',
                  href: 'https://bugstack.cn/',
                  //bgColor: 'linear-gradient(0deg,#a18cd1 0%, #fbc2eb 100%)',
                  //color: ' rgb(104, 84, 161)',
                },
                {
                  name: 'JavaGuide',
                  desc: '「Java学习+面试指南」一份涵盖大部分 Java 程序员所需要掌握的核心知识。准备 Java 面试，首选 JavaGuide！',
                  logo: 'https://javaguide.cn/logo.svg',
                  href: 'https://javaguide.cn',
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