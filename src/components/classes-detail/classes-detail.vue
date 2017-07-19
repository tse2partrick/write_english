<template>
  <transition name="">
    <div class="menu-detail-wrapper">
      <top :title="currentClasses.master" :backMethodCustom="backMethodCustom" @back="onBack"></top>
      <scroll :data="currentClasses.children || []" ref="scroll" class="menu-detail" :style="getDayBackgroundSty">
        <div class="children-wrapper" ref="childrenWrapper">
          <ul class="children" v-for="(item, index) in currentClasses.children">
            <li class="children-inner" @click="start(item, index)" :style="getDayBackgroundMenuSty">
              <span class="children-text">{{item.name}}</span>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import Top from 'base/top/top'
  import {showModeMixin} from 'common/js/mixins'
  export default {
    mixins: [showModeMixin],
    data() {
      return {
        backMethodCustom: true
      }
    },
    computed: {
      ...mapGetters([
        'currentClasses'
      ])
    },
    mounted() {
      if (!this.currentClasses.children) {
        this.$router.push({
          path: '/classes'
        })
      }
    },
    methods: {
      onBack() {
        this.$router.push({
          path: '/classes'
        })
      },
      start(item, index) {
        this.$router.push({
          path: '/courses'
        })
        this.currentCourses(item)
      },
      ...mapMutations({
        'currentCourses': 'SET_CURRENT_COURSES'
      })
    },
    components: {
      Scroll,
      Top
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .menu-detail-wrapper
    position:fixed
    width: 100%
    top: 0
    bottom: 50px
    .menu-detail
      height: 100%
      overflow: hidden
      background: #333
      .children-wrapper
        position: relative
        .children
          position: relative
          padding: 20px
          margin: 0 auto
          .children-inner
            display: flex
            border: 1px solid
            width: 200px
            height: 100px
            margin: 0 auto
            color:  #333
            font-size: $font-size-large
            background: linear-gradient(#d3d7d4, #aaa)
            border-radius: 10px
            .children-text
              margin: auto
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>