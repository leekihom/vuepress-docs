<style>
  .websiteList_bvLH{
    display:grid;
    gap:16px;
    grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
    padding:0;
  }
  .websiteCard {
  background-color: var(--ifm-card-background-color);
  border-radius: 8px;
  border: 1px solid rgba(204, 204, 204, 0.5);
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.websiteCard:hover {
  box-shadow: 5px 5px 20px 0 rgba(0, 0, 0, 0.1);
  background-color: #f2f8fd;
  transform: translateY(-5px);
}

.websiteCardImage {
  align-self: center;
  width: 64px;
  height: 64px;
  min-width: 64px;
}

.websiteCardHeader {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.websiteCardTitle {
  margin-bottom: 0;
  flex: 1 1 auto;
}

.websiteCardTitle a {
  text-decoration: none;
  background: linear-gradient(
      var(--ifm-color-primary),
      var(--ifm-color-primary)
    )
    0% 100% / 0% 1px no-repeat;
  transition: background-size ease-out 200ms;
}

.websiteCardTitle a:not(:focus):hover {
  background-size: 100% 1px;
}

.websiteCardBody {
  padding: 0.2rem 0 0 var(--ifm-card-horizontal-spacing);
}

.websiteCardDesc {
  cursor: pointer;
  font-size: smaller;
  line-height: 1.66;
  width: 100%;
  margin: 0;
  display: -webkit-box;
  overflow: hidden;
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
          tags: [''],
        },
        {
        name: 'Road To Coding',
        desc: 'Road To Coding，意为「编程自学之路」，是自学编程以来所用资源和分享内容的大聚合',
        logo: 'https://r2coding.com/favicon.ico',
        href: 'https://r2coding.com/',
        tags: [''],
      },
      {
        name: '印记中文',
        desc: '深入挖掘国外前端新领域，为中国 Web 前端开发人员提供优质文档！',
        logo: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/al1nd-ai8jt.png',
        href: 'https://docschina.org/',
        tags: ['前端', '文档'],
      },
      {
        name: 'ES6 入门教程',
        desc: '《ECMAScript 6 入门教程》是一本开源的 JavaScript 语言教程，全面介绍 ECMAScript 6 新引入的语法特性。',
        logo: '/img/website/es6.png',
        href: 'https://es6.ruanyifeng.com/',
        tags: ['前端', '文档'],
      },
      ]
    }
  }
}
</script>

<template>

  <ul class="websiteList_bvLH">
    <div v-for="item in list" :key="item.name">
    <li
    class="websiteCard">
    <img
      :src="item.logo"
      :alt="item.name"
      class="websiteCardImage"
    />
    <div class="websiteCardBody">
      <div class="websiteCardHeader">
        <h4 class="websiteCardTitle">
          <a href={{item.href}} class="websiteCardLink">
            {{item.name}}
          </a>
        </h4>
      </div>
      <p class="websiteCardDesc">{{item.desc}}</p>
    </div>
  </li>
  </div>
  </ul>
</template>