<template>
  <div class="loading">
    <div class="content-wrapper">
      <img width="24" height="24" src="./loading.gif" class="img" />
      <div class="text" v-html="text"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '正在加载中...'
      }
    }
  }
</script>

<style lang="stylus">
  .loading
    position: fixed
    top: 0
    left: 0
    height: 100%
    width: 100%
    display: flex
    .content-wrapper
      display: flex
      margin: auto
      .img
        margin-right: 10px
      .text
        display: inline-block
        margin: auto
</style>