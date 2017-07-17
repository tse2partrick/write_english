<template>
  <transition name="slide">
    <div class="course" ref="course" :style="[getDayColorThemeSty
, getDayBackgroundSty]">
      <top :title="getTitle" :backMethodCustom="backMethodCustom" @back="onBack"></top>
      <div class="scroll-wrapper">
        <scroll class="words-wrapper" :data="eWordsArr" ref="wordsWrapper">
          <table class="words-table" @click="onTouchStart">
            <tr>
              <th :style="getDayBlackWordSty">单词</th>
              <th :style="getDayBlackWordSty">释义</th>
            </tr>
            <tr v-for="(item, index) in remoteData">
              <td>
                <span class="eWord" @click.stop="speak(item.nons, index)" :style="item.nons.indexOf('补充') !== -1 ? getDayBlackWordSty : ''">
                  {{item.eWord}}
                  <i class="iconfont icon-shengyin" v-show="currentPlayIndex !== index && item.nons.indexOf('补充') === -1"></i>
                  <i class="iconfont icon-shengyin1" v-show="currentPlayIndex === index && item.nons.indexOf('补充') === -1"></i>
                </span>
              </td>
              <td>
                <span class="cWord" :style="getDayBlackWordSty">{{item.cWord}}</span>
              </td>
            </tr>
          </table>
        </scroll>
        <loading v-show="!eWordsArr.length"></loading>
      </div>
      <single-select class="singleSelect" :title="title" :options="options" @clickOption="onClickOption" ref="singleSelect" :slideUp="slideUp" v-show="eWordsArr.length"></single-select>
      <audio ref="audio" @ended="onAudioEnd"></audio>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import Top from 'base/top/top'
  import SingleSelect from 'base/single-select/single-select'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapGetters} from 'vuex'
  import {getWordsMixin, challengeMixin, showModeMixin} from 'common/js/mixins'

  const TOP_HEIGHT = 50
  const BUTTON_HEIGHT = 48
  export default {
    mixins: [getWordsMixin, challengeMixin, showModeMixin],
    data() {
      return {
        title: '开始挑战',
        options: [
          {cName: '中英连连看', eName: 'line-match'},
          {cName: '听写电台', eName: 'dictation'},
          {cName: '英文回想', eName: 'recall'}
        ],
        slideUp: true,
        backMethodCustom: true,
        currentPlayIndex: null
      }
    },
    created() {
      if (!this.currentCourse) {
        this.$router.push({
          path: '/courses'
        })
      }
    },
    mounted() {
      this._setShowHeigth()
    },
    computed: {
      getTitle() {
        return `${this.currentCourses.name} - 第${this.currentCourse}课`
      },
      ...mapGetters([
        'remoteData'
      ])
    },
    methods: {
      onAudioEnd() {
        this.currentPlayIndex = null
      },
      onBack() {
        // if ()
        this.$router.push({
          path: '/courses'
        })
      },
      onTouchStart(e) {
        this.reChoose()
      },
      onClickOption(item) {
        this.options.forEach((i) => {
          if (i.cName === item) {
            this.$router.push({
              path: `/courses/${this.currentCourse}/${i.eName}`
            })
          }
        })
        this.$refs.singleSelect.hide()
        this._setLearning()
      },
      _setShowHeigth() {
        this.$refs.wordsWrapper.refresh()
        this.$refs.wordsWrapper.$el.style.height = this.$refs.course.clientHeight - TOP_HEIGHT - BUTTON_HEIGHT + 'px'
      },
      reChoose() {
        this.$refs.singleSelect.hide()
      },
      speak(nons, index) {
        if (nons.indexOf('补充') !== -1) {
          return
        }
        if (index >= 0) {
          this.currentPlayIndex = index
        }
        if (this.$refs.audio.src === nons) {
          this.$refs.audio.play()
          return
        }
        this.$refs.audio.src = nons
        this.$refs.audio.play()
        /* if (this.timer) {
          clearTimeout(this.timer)
        } */
        /* this.timer = setTimeout(() => {
        }, 20) */
      }
    },
    components: {
      Top,
      SingleSelect,
      Scroll,
      Loading
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