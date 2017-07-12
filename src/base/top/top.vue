<template>
  <div class="top" :style="getWHeaderSty">
    <div class="icon-back" @click.stop="back">
      <i class="iconfont icon-fanhui-copy"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="changeDayWrapper" @click="onToggleDay">
      <i class="changeDay" :class="getShowModeCls"></i>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {showModeMixin} from 'common/js/mixins'
  import {showMode} from 'common/js/config'
  export default {
    mixins: [showModeMixin],
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
    computed: {
      ...mapGetters([
        'mode'
      ])
    },
    methods: {
      back() {
        if (this.backMethodCustom) {
          this.$emit('back')
          return
        }
        this.$router.go(-1)
      },
      onToggleDay() {
        let mode = this.mode === showMode.day ? 'night' : 'day'
        this.setMode(mode)
      },
      ...mapMutations({
        'setMode': 'SET_MODE'
      })
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .top
    position: relative
    width: 100%
    color: #d3d7d4
    background: #333
    height: 50px
    line-height: 50px
    .icon-back
      position: absolute
      padding-left: 20px
      left: 0
    .title
      text-align: center
    .changeDayWrapper
      position: absolute
      right: 0
      padding-right: 20px
      top: 0
</style>