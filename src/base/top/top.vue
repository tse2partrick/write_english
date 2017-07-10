<template>
  <div class="top">
    <i class="icon-back iconfont icon-fanhui-copy" @click.stop="back"></i>
    <h1 class="title">{{title}}</h1>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      backMethodCustom: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      back() {
        if (this.backMethodCustom) {
          this.$emit('back')
          return
        }
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .top
    position: relative
    width: 100%
    background: $color-background
    height: 50px
    line-height: 50px
    .icon-back
      position: absolute
      left: 7px
    .title
      text-align: center
</style>