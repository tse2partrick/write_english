<template>
  <div class="header" ref="header" :style="getWHeaderSty">
    <span class="title">Write English</span>
    <div class="changeDayWrapper" @click="onToggleDay">
      <i class="changeDay iconfont" :class="getShowModeCls"></i>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {showModeMixin} from 'common/js/mixins'
  import {showMode} from 'common/js/config'
  export default {
    mixins: [showModeMixin],
    computed: {
      ...mapGetters([
        'mode'
      ])
    },
    methods: {
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
  .header
    position: relative
    padding-top: 20px
    margin-bottom: 40px
    height: 48px
    text-align: center
    font-size: 28px
    color: $n-colorTheme
    background: $n-background
    .changeDayWrapper
      position: absolute
      display: flex
      height: 100%
      right: 0
      padding-right: 5%
      top: 0
      .changeDay
        margin: auto
        font-size: $font-size-large-x
</style>