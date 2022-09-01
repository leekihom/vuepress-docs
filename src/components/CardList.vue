<style>

.card-list{
  margin: -.35rem;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(250px,1fr));
  flex-wrap: wrap;
  align-items: flex-start;
}
.card-list a{
  height: 88px;
}
.card-item{
  margin: .35rem;
  border-radius:  3px;
  display: flex;
  transition: all .4s;
}
.card-item:hover{
  transform: translateY(-3px) scale(1.01);
  text-decoration: none !important;
}
.name{
  margin: .2rem 0 .3rem;
}
.desc{
  font-size: .8rem;
  line-height: 1.1rem;
  opacity: .8;
  margin-bottom: .2rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.card-list p{
  margin: 0;
  padding: 0 1rem;
  transition: text-shadow .4s;
  text-align: center;
}
.card-list div{
  flex: 1;
  display: inline-block;
  padding: 1rem 0;
}
.card-img{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin: 1rem 0 1rem 1rem;
  box-shadow: 3px 2px 5px rgb(0 0 0 / 8%);
  transition: all .4s;
}


</style>
<script>
export default {
  data() {
    return {
      list: [
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

  <div class="card-list">

    <a v-for="item in list" :key="item.name"
    class="card-item" :href="item.href" target="_blank" :style="{'background-image': item.bgColor,color: item.color}">
      <img
        :src="item.logo"
        :alt="item.name"
        class="card-img"
      />
      <div>
        <p class="name">{{item.name}}</p>
        <p class="desc">{{item.desc}}</p>
      </div>
    </a>
  </div>
</template>