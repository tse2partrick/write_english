<template>
  <div class="menu-wrapper" ref="menuWrapper" :style="getDayColorThemeSty">
    <div class="tip" ref="tip" v-if="showTip">
      <div class='text-wrapper'>
        <p class="text">
          {{TipE}}
        </p>
        <p class="text">
          {{TipC}}
        </p>
      </div>
    </div>
    <scroll :data="menu" ref="scroll" class="menu" :listenScroll="listenScroll" @scroll="onScroll" :probeType="probeType" :click="click">
      <div class="master-wrapper">
        <div class="subtitle" @click="toggleLearning">
          <span>正在学习</span>
          <span class="open iconfont" :class="learningIcon"></span>
          <hr>
        </div>
        <div class="learning-wrapper" v-if="showLearning && learning" ref="learningWrapper">
          <div class="learning-inner needsclick" @click.stop.prevent="goClasses" :style="getDayBackgroundMenuSty">
            <span class="learning-text">{{getClasses}}</span>
          </div>
          <div class="learning-inner needsclick" @click.stop.prevent="goCourses" :style="getDayBackgroundMenuSty">
            <span class="learning-text">{{getCourses}}</span>
          </div>
          <div class="learning-inner needsclick" @click.stop.prevent="goCourse" :style="getDayBackgroundMenuSty">
            <span class="learning-text">{{getCourse}}</span>
          </div>
        </div>
        <div class="subtitle" @click="toggleAll">
          <span>所有课程</span>
          <span class="open iconfont" :class="allIcon"></span>
          <hr>
        </div>
        <div class="master" v-for="item in menu" v-if="showAll">
          <div class="master-inner" @click="start(item, item.class_id)" :style="getDayBackgroundMenuSty">
            <span class="master-text">{{getDesc(item)}}</span>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {Menu, Tip} from 'datas/menu'
  import Scroll from 'base/scroll/scroll'
  import {mapMutations, mapGetters} from 'vuex'
  import {getWordsMixin, showModeMixin} from 'common/js/mixins'
  // import weStore from 'common/js/localforage'
  import {prefixStyle} from 'common/js/util'
  const transition = prefixStyle('transition')
  export default {
    mixins: [getWordsMixin, showModeMixin],
    data() {
      return {
        menu: Menu,
        children: [],
        noClasses: true,
        showLearning: true,
        showAll: true,
        listenScroll: true,
        posY: 0,
        probeType: 3,
        showTip: false,
        TipE: '',
        TipC: '',
        learning: '',
        click: true
      }
    },
    created() {
      this.getTip()
    },
    computed: {
      getClasses() {
        if (!this.learning) {
          return
        }
        let classes = this.learning.classes
        return classes.master.name || classes.master
      },
      getCourses() {
        if (!this.learning) {
          return
        }
        let courses = this.learning.courses
        return courses.name
      },
      getCourse() {
        if (!this.learning) {
          return
        }
        return `第${this.learning.course}课`
      },
      learningIcon() {
        return !this.showLearning ? 'icon-xiangshang' : 'icon-l2'
      },
      allIcon() {
        return !this.showAll ? 'icon-xiangshang' : 'icon-l2'
      },
      ...mapGetters([
        'currentCourse',
        'mode'
      ])
    },
    mounted() {
      window.addEventListener('resize', () => {
        if (!this.$refs.scroll) {
          return
        }
        this.$refs.scroll.refresh()
      })
      this.learning = JSON.parse(localStorage.getItem('learning')) || ''
      this.showAll = this.learning ? 0 : 1
      this.showLearning = this.learning ? 1 : 0
      this.$refs.scroll.refresh()
      this.$nextTick(() => {
        this._hideTip()
        // this._getModeCls()
      })
    },
    methods: {
      _getModeCls() {
        /* let html = document.getElementsByTagName('html')[0]
        if (this.mode === showMode.day) {
          html.style.background = CSS.day.white
          html.style.color = CSS.day.colorTheme
          for (let i = 0; i < this.$refs.learningWrapper.children.length; i++) {
            this.$refs.menuWrapper.style.background = CSS.day.white
            this.$refs.learningWrapper.children[i].style.background = CSS.day.backgroundMenu
            this.$refs.learningWrapper.children[i].style.color = CSS.day.white
          }
        }

        if (this.mode === showMode.night) {
          html.style.background = CSS.night.background
          for (let i = 0; i < this.$refs.learningWrapper.children.length; i++) {
            this.$refs.menuWrapper.style.background = CSS.night.background
            this.$refs.learningWrapper.children[i].style.background = CSS.night.backgroundMenu
            this.$refs.learningWrapper.children[i].style.color = CSS.night.white
          }
        } */
      },
      _showTip(newY) {
        if (newY <= 0) {
          this._hideTip()
          return
        }
        this.showTip = true
        if (!this.$refs.tip) {
          return
        }
        let opacity = Math.min(1, Math.max(0, (newY / 100)))
        this.$refs.tip.style['opacity'] = opacity
      },
      onScroll(pos) {
        this.posY = pos.y
      },
      _hideTip() {
        if (!this.$refs.tip) {
          return
        }
        this.$refs.tip.style[transition] = 0.2 + 's'
        this.$refs.tip.style['opacity'] = 0
        setTimeout(() => {
          this.getTip()
        }, 200)
        this.showTip = false
      },
      getTip() {
        this.randomIndex = Math.random() * Tip.length | 0
        this.TipC = this.getTipC(this.randomIndex)
        this.TipE = this.getTipE(this.randomIndex)
      },
      getTipE(index) {
        return Tip[index]['e']
      },
      getTipC(index) {
        return Tip[index]['c']
      },
      toggleLearning() {
        this.showLearning = !this.showLearning
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      },
      toggleAll() {
        this.showAll = !this.showAll
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      },
      goClasses() {
        this.start(this.learning.classes, this.learning.classes.class_id)
      },
      goCourses() {
        this.$router.push({
          path: '/courses/'
        })
        if (this.learning.courses === this.setCurrentCourses) {
          return
        }
        this.setCurrentClasses(this.learning.classes)
        this.setCurrentCourses(this.learning.courses)
      },
      goCourse() {
        this.setCurrentClasses(this.learning.classes)
        this.setCurrentCourses(this.learning.courses)
        this.setCurrentCourse(this.learning.course)
        this._getWords()
        this.$router.push({
          path: `/courses/${this.currentCourse}`
        })
      },
      getDesc(item) {
        if (!item) {
          return '无'
        }
        return item.children ? item.master : item.master.name
      },
      start(item, index) {
        if (!item) {
          return
        }

        if (item.children) {
          this.$router.push({
            path: `/classes/${index}`
          })

          this.setCurrentClasses(item)
        } else {
          this.$router.push({
            path: '/courses'
          })
          this.setCurrentClasses('')
          this.setCurrentCourses(item.master)
        }
      },
      ...mapMutations({
        'setCurrentClasses': 'SET_CURRENT_CLASSES',
        'setCurrentCourses': 'SET_CURRENT_COURSES',
        'setCurrentCourse': 'SET_CURRENT_COURSE'
      })
    },
    watch: {
      posY(newY) {
        this._showTip(newY)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .tip
    position: fixed
    text-align: center
    width: 100%
    height: 30%
    top: 0
    .text-wrapper
      margin-top: 30%
      transform: translateY(-30%)
      .text
        margin: 30px 0
        line-height: 30px
        font-size: $font-size-large
        font-family: 'Helvetica-Light', arial, sans-serif
  .menu-wrapper
    position:fixed
    width: 100%
    top: 88px
    bottom: 0
    color: $n-colorTheme
    .subtitle
      padding: 0 10px
      .open
        float: right
        padding-right: 10px
    .learning-wrapper
      display: flex
      flex-direction: column
      .learning-inner-day
        color: $d-background
        background: $d-backgroundMenu
      .learning-inner
        display: flex
        margin: 20px auto
        width: 200px
        height: 100px
        text-align: center
        color: $n-background
        font-size: $font-size-large
        background: $n-backgroundMenu
        border-radius: 10px
        .learning-text
          margin: auto
    .menu
      height: 100%
      overflow: hidden
      .master-wrapper
        position: relative
        .master
          position: relative
          padding: 20px
          margin: 0 auto
          .master-inner-day
            color: $d-background
            background: $d-backgroundMenu
          .master-inner
            display: flex
            width: 200px
            height: 100px
            margin: 0 auto
            text-align: center
            color: $n-background
            font-size: $font-size-large
            background: $n-backgroundMenu
            border-radius: 10px
            .master-text
              margin: auto
</style>