<template>
  <transition name="">
    <div class="line-match" ref="lineMatch" :style="getDayBackgroundSty">
      <top :title="getTitle" :backMethodCustom="backMethodCustom" @back="onBack"></top>
      <div class="sub-title">
        <span>{{getSubTitle}}</span>
      </div>
      <canvas ref="cvs" class="cvs"></canvas>
      <table class="content" ref="content">
        <tr v-for="(item, index) in shuffleWordsArr[currentPage]">
          <td>
            <span class="text" @click="clicked(item.eWord, 'e', index, 'l')" :class="{'clicked': clickedArr.includes(item.eWord)}" ref="textL">
              {{item.eWord}}
              <span class="numR" v-show="showAnswer">{{getRightIndex(item.eWord, 'e')}}</span>
            </span>
          </td>
          <td>
            <span class="text right"  @click="clicked(item.cWord, 'c', index, 'r')" :class="{'clicked': clickedArr.includes(item.cWord)}" ref="textR">
              <span class="numL" v-show="showAnswer">{{getRightIndex(item.cWord, 'c')}}</span>
              {{shortful(item.cWord)}}
            </span>
          </td>
        </tr>
      </table>
      <div class="btn-group">
        <span @click.stop="btnNextCourse" v-show="end && score === remoteData.length" class="btn" :style="getDayBackgroundMenuSty">{{getPass}}</span>
        <span @click.stop="next" v-show="showAnswer" class="btn" :style="getDayBackgroundMenuSty">{{getNext}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Top from 'base/top/top'
  import {mapGetters, mapMutations} from 'vuex'
  import {challengeMode, CSS} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import {getWordsMixin, challengeMixin, showModeMixin} from 'common/js/mixins'

  const PAGE_SHOW_NUM = 5
  const TOP_HEIGHT = 50
  const SUBTITLE_MARGINTOP = 30
  const TABLE_MARGINTOP = 30
  const TRUE_COLOR = 'darkgreen'
  const WRONG_COLOR = 'darkred'
  export default {
    mixins: [getWordsMixin, challengeMixin, showModeMixin],
    data() {
      return {
        shuffleWordsArr: [],
        trueWordsArr: [],
        currentPage: 0,
        totalPage: 0,
        end: false,
        showAnswer: false,
        testArr: [],
        clickedArr: [],
        preType: '',
        recordArr: [],
        touches: {},
        ctx: null,
        score: 0,
        backMethodCustom: false
      }
    },
    computed: {
      getPass() {
        return this.currentCourse + 1 > this.currentCourses.class_num ? '课程完结' : '挑战下一关'
      },
      getNext() {
        return this.currentPage + 1 === this.totalPage ? '重新挑战' : '下一题'
      },
      getTitle() {
        return this.currentCourses.name + ' - 第' + this.currentCourse + '课'
      },
      getSubTitle() {
        return challengeMode.lineMatch.cName + ' - ' + (this.currentPage + 1) + '/' + this.totalPage
      },
      ...mapGetters([
        'currentCourseses',
        'currentCourses',
        'currentCourse',
        'remoteData',
        'cWordsArr',
        'eWordsArr',
        'mode'
      ])
    },
    created() {
      if (!this.currentCourses.class_id) {
        this.$router.push({
          path: '/classes'
        })
        return
      }
      this._getShuffleAndTrueArr()
    },
    mounted() {
      this._initCvs()
    },
    methods: {
      onBack() {
        this.$router.push({
          path: `/courses/${this.currentCourse}`
        })
      },
      getRightIndex(str, type) {
        let index
        if (type === 'c') {
          index = this.trueWordsArr[this.currentPage].findIndex((i) => {
            return i.cWord === str
          })
        } else {
          index = this.trueWordsArr[this.currentPage].findIndex((i) => {
            return i.eWord === str
          })
        }

        return index
      },
      clicked(str, type, index, leftOrRight) {
        if (this.clickedArr.includes(str)) {
          return
        }

        if (type === this.preType) {
          this.clickedArr.splice(this.clickedArr.length - 1, 1)
          this.testArr = []
          this.touches = {}
        }

        let el
        let x
        let y
        el = leftOrRight === 'l' ? this.$refs.textL[index] : this.$refs.textR[index]
        if (leftOrRight === 'l') {
          x = el.getBoundingClientRect().right
          y = el.getBoundingClientRect().top - TOP_HEIGHT - TABLE_MARGINTOP - SUBTITLE_MARGINTOP
          this.touches.x1 = x
          this.touches.y1 = y
        } else {
          x = el.getBoundingClientRect().left
          y = el.getBoundingClientRect().top - TOP_HEIGHT - TABLE_MARGINTOP - SUBTITLE_MARGINTOP
          this.touches.x2 = x
          this.touches.y2 = y
        }
        this.testArr.push({
          str,
          type
        })

        this.clickedArr.push(str)
        this.preType = type
      },
      test(arr) {
        this.preType = ''
        let k = arr[0].type === 'e' ? arr[0].str : arr[1].str
        let v = arr[1].type === 'c' ? arr[1].str : arr[0].str

        let index = this.remoteData.findIndex((i) => {
          return i.eWord === k
        })

        let isRight
        if (this.remoteData[index].cWord === v) {
          this.score++
          isRight = 1
        } else {
          isRight = 0
        }

        this.recordArr.push({
          isRight,
          k,
          v
        })
        this.testArr = []

        this.ctx.strokeStyle = CSS.day.colorStarLight
        this.ctx.beginPath()
        this.ctx.moveTo(this.touches.x1, this.touches.y1)
        this.ctx.lineTo(this.touches.x2, this.touches.y2)
        this.ctx.stroke()
        this.touches = {}

        if (this.clickedArr.length === this.shuffleWordsArr[this.currentPage].length * 2) {
          this.showAnswer = true
          this.recordArr.forEach((i) => {
            let eIndex = this.shuffleWordsArr[this.currentPage].findIndex((item) => {
              return item.eWord === i.k
            })
            let cIndex = this.shuffleWordsArr[this.currentPage].findIndex((item) => {
              return item.cWord === i.v
            })
            if (i.isRight) {
              this.$refs.textL[eIndex].style.background = TRUE_COLOR
              this.$refs.textR[cIndex].style.background = TRUE_COLOR
            } else {
              this.$refs.textL[eIndex].style.background = WRONG_COLOR
              this.$refs.textR[cIndex].style.background = WRONG_COLOR
            }
          })
          if (this.currentPage + 1 === this.totalPage) {
            this.end = true

            // 满分解锁星星
            if (this.score === this.remoteData.length) {
              this._lightStar(challengeMode.lineMatch.eName)
            }
            return
          }
        }
      },
      shortful(str) {
        if (str.length > 10) {
          return str.slice(0, 10)
        }

        return str
      },
      next() {
        this.showAnswer = false
        this.recordArr = []
        this.clickedArr = []
        if (this.shuffleWordsArr[this.currentPage]) {
          for (let i = 0; i < this.shuffleWordsArr[this.currentPage].length; i++) {
            this.$refs.textL[i].style.background = ''
            this.$refs.textR[i].style.background = ''
          }
        }
        if (!this.end) {
          this.currentPage++
          this._initCvs()
        } else {
          this.restart()
        }
      },
      btnNextCourse() {
        let course = this.currentCourse + 1
        if (course > this.currentCourses.class_num) {
          return
        }
        this.setCurrentCourse(course)
        this._getWords()
        this.$router.push({
          path: `/courses/${this.currentCourse}`
        })

        this._setLearning()
      },
      _getShuffleAndTrueArr() {
        this.totalPage = Math.ceil(this.eWordsArr.length / PAGE_SHOW_NUM)
        let shuffleRemoteData = shuffle(this.remoteData)
        for (let i = 0; i < this.totalPage; i++) {
          let cArrs = shuffleRemoteData.slice(i * PAGE_SHOW_NUM, (i + 1) * PAGE_SHOW_NUM)
          let eArrs = shuffleRemoteData.slice(i * PAGE_SHOW_NUM, (i + 1) * PAGE_SHOW_NUM)

          this.trueWordsArr[i] = []
          cArrs.forEach((item, index) => {
            this.trueWordsArr[i].push({
              cWord: item.cWord,
              eWord: eArrs[index].eWord
            })
          })

          this.shuffleWordsArr[i] = []
          eArrs = shuffle(eArrs)
          shuffle(cArrs).forEach((item, index) => {
            this.shuffleWordsArr[i].push({
              cWord: item.cWord,
              eWord: eArrs[index].eWord
            })
          })
        }
      },
      _initCvs() {
        this.ctx = this.$refs.cvs.getContext('2d')
        this.$nextTick(() => {
          // 直接设置屏幕高度，设置zIndex为-1
          this.$refs.cvs.setAttribute('width', screen.availWidth)
          this.$refs.cvs.setAttribute('height', screen.availHeight)
        })
      },
      restart() {
        this.shuffleWordsArr = []
        this.trueWordsArr = []
        this.currentPage = 0
        this.totalPage = 0
        this.end = false
        this.showAnswer = false
        this.testArr = []
        this.clickedArr = []
        this.preType = ''
        this.recordArr = []
        this.touches = {}
        this.ctx = null
        this.score = 0
        if (this.shuffleWordsArr[this.currentPage]) {
          for (let i = 0; i < this.shuffleWordsArr[this.currentPage].length; i++) {
            this.$refs.textL[i].style.background = ''
            this.$refs.textR[i].style.background = ''
          }
        }
        this._getShuffleAndTrueArr()
        this._initCvs()
      },
      ...mapMutations({
        'setCurrentCourse': 'SET_CURRENT_COURSE'
      })
    },
    watch: {
      testArr() {
        if (this.testArr.length === 2) {
          this.test(this.testArr)
        }
      },
      eWordsArr() {
        this.restart()
      }
    },
    components: {
      Scroll,
      Top
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  .line-match
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    height: 100%
    width: 100%
    background: $n-background
    .sub-title
      text-align: center
      padding: 30px
    .cvs
      position: absolute
      z-index: -1
    .content
      text-align: center
      width: 100%
      margin: 0 auto
      margin-top: 50%
      transform: translateY(-50%)
      & tr
        & td
          .text
            display: inline-block
            padding: 15px
            width: 70%
            border: 1px solid $n-colorTheme
            margin: 15px 0
            float: left
            .numR
              float: right
            .numL
              float: left
          .right
            float: right
          .clicked
            border: 1px solid $n-colorWhite
            color: $n-colorWhite
            background: $n-clicked
    .btn-group
      position: absolute
      left: 30%
      width: 100%
      height: 100%
      transform: translateX(-35%)
      text-align: center
      bottom: 10%
      z-index: -1
      .btn
        position: relative
        top: 90%
        margin: 20px
        display: inline-block
        padding: 10px
        color:  $n-colorWhite
        font-size: $font-size-large
        border: 1px solid $n-colorTheme
        border-radius: 10px
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>