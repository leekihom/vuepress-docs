<style lang="scss" scoped>
  @import "style/index.scss";
</style>

<script >

export default {
  props: {
    Card: Object
  }
}
</script>

<template>
      <div class="card-list" >
        <a v-for="(item,index) in Card" :key="index"
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