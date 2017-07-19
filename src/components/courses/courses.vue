<template>
  <transition name="">
    <div class="courses">
      <top :title="getTitle" :backMethodCustom="backMethodCustom" @back="onBack"></top>
      <div class="listWrapper">
        <listview @showWords="onShowWords" ref="listview"></listview>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import Listview from 'base/listview/listview'
  import Top from 'base/top/top'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapGetters, mapMutations} from 'vuex'
  import {getWordsMixin} from 'common/js/mixins'

  export default {
    mixins: [getWordsMixin],
    data() {
      return {
        backMethodCustom: true
      }
    },
    created() {
      if (!this.currentCourses.class_id) {
        this.$router.push({
          path: '/classes'
        })
      }
    },
    computed: {
      getTitle() {
        return this.currentCourses.name
      },
      ...mapGetters([
        'remoteData',
        'currentClasses',
        'currentCourses',
        'currentCourse'
      ])
    },
    methods: {
      onBack() {
        if (this.currentClasses) {
          this.$router.push({
            path: `/classes/${this.currentCourses.class_id}`
          })
        } else {
          this.$router.push({
            path: '/classes'
          })
        }
      },
      onShowWords(item) {
        this.setCurrentCourse(item)
        this._getWords()
        this.$router.push({
          path: `/courses/${this.currentCourse}`
        })
      },
      ...mapMutations({
        'setCurrentCourse': 'SET_CURRENT_COURSE'
      })
    },
    components: {
      Listview,
      Top,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .courses
    position: fixed
    width: 100%
    top: 0
    bottom: 0
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>