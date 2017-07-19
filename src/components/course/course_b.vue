<template>
  <div class="course">
    <ul>
      <li v-for="(item, index) in remoteData">
        <p @click="speakk(item.nons, index)">
          <span>{{item.eWord}}</span>
          <i v-show="currentPlayIndex === index">播放</i>
          <i v-show="currentPlayIndex !== index">播放中</i>
        </p>
        <span>{{item.cWord}}</span>
      </li>
    </ul>
    <!-- <audio ref="audio" @canplay="onPlay"></audio> -->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        currentPlayIndex: null
      }
    },
    methods: {
      speakk(item, index) {
        this.currentPlayIndex = index
        // this.$refs.audio.src = item
        var self = this
        setTimeout(() => {
          self.currentPlayIndex = null
        }, 2000)
      }
    },
    computed: {
      ...mapGetters([
        'remoteData'
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .course
    position: fixed
    width: 100%
    top: 0
    bottom: 0
    background: $n-background
    color: $n-colorTheme
    .scroll-wrapper
      position: fixed
      width: 100%
      height: 100%
      top: 60px
      .words-wrapper
        position: relative
        height: 100%
        overflow:hidden
    .words-table
      & td
        padding: 15px
        vertical-align: top
      .cWord
        margin-left: 50px
        float: left
    .singleSelect
      position: absolute
      bottom: 0
      right: 0
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>