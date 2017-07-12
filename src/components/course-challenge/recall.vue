<template>
  <transition name="slide">
    <scroll :data="remoteData" class="recall" ref="recall" v-if="remoteData.length" :style="getDayBackgroundSty">
      <div>
        <top :title="getTitle" class="needsclick" :backMethodCustom="backMethodCustom" @back="onBack"></top>
        <div class="sub-title">{{getSubTitle}}</div>
        <div class="content-wrapper" v-show="!endFlag">
          <div class="content" v-for="(item, index) in shuffleRemoteData" v-show="index === currentIndex">
            <div class="title">
              <span @click="speak(item.nons)">
                {{item.cWord}}
                <i class="iconfont icon-shengyin" v-if="!playing && item.nons.indexOf('补充') === -1"></i>
                <i class="iconfont icon-shengyin1" v-if="playing && item.nons.indexOf('补充') === -1"></i>
              </span>
            </div>
            <p class="word-right" v-show="showAnswer && !nullAnswer">{{item.eWord}}</p>
          </div>
          <div class="content-input">
            <input type="text" class="user_write" ref="userWrite" :style="getNightColorWhiteSty" />
            <span class="btn" @click.stop.prevent="test" v-show="!showAnswer || nullAnswer" ref="testBtn" :style="getDayBackgroundMenuSty">提交</span>
            <span class="btn" @click.stop.prevent="next" v-show="showAnswer && !nullAnswer" ref="nextBtn" :style="getDayBackgroundMenuSty">下一题</span>
            <p class="answer" v-show="showAnswer">{{getTestAnswer}}</p>
            <p class="answer" v-show="nullAnswer" ref="nonTip">请输入单词再提交</p>
          </div>
        </div>
        <div class="endFlag" v-show="endFlag">
          <table v-show="wrongArr.length" class="haveWrong">
            <caption>写错了{{wrongArr.length}}个单词</caption>
            <tr>
              <th>写错单词</th>
              <th>正确单词</th>
              <!-- <th>释义</th> -->
            </tr>
            <tr v-for="item in wrongArr">
              <td v-html="item.wrongWord"></td>
              <td v-html="item.trueEWord"></td>
              <!-- 移动端空间不够 <td v-html="item.trueCWord"></td> -->
            </tr>
            <tr>
              <td colspan="2">
                <span class="btn" @click="restart" :style="getDayBackgroundMenuSty">重新挑战</span>
                <span class="btn" @click="btnNextCourse" v-show="getCourseendFlag" :style="getDayBackgroundMenuSty">挑战下一关</span>
              </td>
            </tr>
          </table>
          <div class="perfect" v-show="!wrongArr.length">
            <div class="perfectTip">{{perfectArr[Math.random() * 3 | 0]}}</div>
            <span class="btn btn-in-table" @click="restart" :style="getDayBackgroundMenuSty">再加深一遍</span>
            <span class="btn btn-in-table" @click="btnNextCourse" v-show="getCourseendFlag && score === 20" :style="getDayBackgroundMenuSty">挑战下一关</span>
          </div>
        </div>
        <audio ref="audio" @ended="onPlayEnd"></audio>
      </div>
    </scroll>
  </transition>
</template>

<script>
  import Top from 'base/top/top'
  import Scroll from 'base/scroll/scroll'
  import animations from 'create-keyframe-animation'
  import {mapGetters, mapMutations} from 'vuex'
  import {prefixStyle} from 'common/js/util'
  import {getWordsMixin, challengeMixin, showModeMixin} from 'common/js/mixins'
  import {challengeMode, showMode, CSS} from 'common/js/config'

  const ANIMATION = prefixStyle('animation')
  export default {
    mixins: [getWordsMixin, challengeMixin, showModeMixin],
    data() {
      return {
        currentIndex: 0,
        answer: '',
        showAnswer: false,
        nullAnswer: false,
        score: 0,
        endFlag: false,
        wrongArr: [],
        perfectArr: ['厉害了，全对！', '完美！请再接再厉', 'Perfect!!!', '求求你把我打通关吧'],
        challengeMode: challengeMode.recall.cName,
        backMethodCustom: false,
        playing: false
      }
    },
    created() {
      if (!this.currentCourses.class_id) {
        console.log('无id - ' + this.currentCourses)
        /* this.$router.push({
          path: '/write'
        }) */
      }
    },
    mounted() {
      this._init()
      if (!this.$refs.userWrite) {
        return
      }
      this.answer = this.$refs.userWrite.value
      this.$refs.userWrite.addEventListener('keydown', (e) => {
        this.nullAnswer = false
        if (e.keyCode === 13) {
          this.showAnswer ? this.next() : this.test()
        }
      })
    },
    computed: {
      getAnswerCls() {
        // 红绿色 - 做回答正确错误的样式
        /* if (!this.answer) {
          return
        }
        if (this.endFlag) {
          return
        }
        return this.answer.toLowerCase() === this.shuffleRemoteData[this.currentIndex]['eWord'].toLowerCase() ? 'green' : 'red' */
        return this.mode === showMode.day ? {'color': CSS.night.colorBlack} : {'color': CSS.night.colorWhite}
      },
      getCourseendFlag() {
        return this.currentCourse === this.currentClasses.length ? '' : 'false'
      },
      getTitle() {
        return this.currentCourses.name + ' - 第' + this.currentCourse + '课'
      },
      getSubTitle() {
        return this.endFlag ? '测试结果' : challengeMode.recall.cName
      },
      getTestAnswer() {
        if (!this.answer) {
          return
        }
        if (this.endFlag) {
          return
        }
        return this.answer.toLowerCase() === this.shuffleRemoteData[this.currentIndex]['eWord'].toLowerCase() ? '正确' : '错误'
      },
      ...mapGetters([
        'currentClasses',
        'currentCourses',
        'currentCourse',
        'mode'
      ])
    },
    methods: {
      onPlayEnd() {
        this.playing = false
      },
      onBack() {
        this.$router.push({
          path: `/courses/${this.currentCourse}`
        })
      },
      test() {
        if (this.endFlag) {
          return
        }
        this.$refs.userWrite.focus()
        this.answer = this.$refs.userWrite.value
        if (!this.answer) {
          this.nullAnswer = true

          let animation = {
            0: {
              transform: 'translate3d(5px, 0, 0)'
            },
            20: {
              transform: 'translate3d(-5px, 0, 0)'
            },
            40: {
              transform: 'translate3d(5px, 0, 0)'
            },
            60: {
              transform: 'translate3d(-5px, 0, 0)'
            },
            80: {
              transform: 'translate3d(5px, 0, 0)'
            },
            100: {
              transform: 'translate3d(0, 0, 0)'
            }
          }
          animations.registerAnimation({
            name: 'shake',
            animation,
            presets: {
              duration: 300,
              easing: 'linear'
            }
          })
          animations.runAnimation(this.$refs.nonTip, 'shake', () => {
            animations.unregisterAnimation('shake')
            this.$refs.nonTip.style[ANIMATION] = ''
          })
          return
        }
        if (this.answer.toLowerCase() === this.shuffleRemoteData[this.currentIndex]['eWord'].toLowerCase()) {
          this.score++
        } else {
          this.wrongArr.push({
            wrongWord: this.answer,
            trueEWord: this.remoteData[this.currentIndex]['eWord']
            // trueCWord: this.remoteData[this.currentIndex]['cWord']
          })
        }
        this.showAnswer = true
      },
      next() {
        this._nextInit()
        this.currentIndex++
        if (this.currentIndex === this.shuffleRemoteData.length) {
          this.endFlag = true
          this.end()
        }
      },
      speak(nons) {
        // 过滤没有发音的单词
        if (nons.indexOf('补充') !== -1) {
          return
        }
        this.playing = true
        if (this.$refs.audio.src === nons) {
          this.$refs.audio.play()
          return
        }
        this.$refs.audio.src = nons
        this.$refs.audio.play()
      },
      end() {
        if (this.score === this.remoteData.length) {
          this._lightStar(challengeMode.recall.eName)
        }

        setTimeout(() => {
          this.$refs.recall.refresh()
        }, 20)
      },
      restart() {
        this._init()
        this._shuffleRemoteData()
      },
      btnNextCourse() {
        this._init()
        let course = this.currentCourse + 1
        if (course > this.currentCourses.class_num) {
          return
        }
        this.setCurrentCourse(course)

        this._getWords()
        this.$router.push({
          path: `/courses/${this.currentCourse}/${challengeMode.recall.eName}`
        })
        this._setLearning()
      },
      _init() {
        this._nextInit()
        this.currentIndex = 0
        this.endFlag = false
        this.wrongArr = []
      },
      _nextInit() {
        this.showAnswer = false
        this.$refs.userWrite.value = ''
        this.$refs.userWrite.focus()
      },
      ...mapMutations({
        'setCurrentCourse': 'SET_CURRENT_COURSE'
      })
    },
    components: {
      Top,
      Scroll
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .btn
    display: inline-block
    padding: 10px
    color: $n-colorWhite
    font-size: $font-size-large
    background: $n-background
    color: $n-colorWhite
    border: 1px solid $n-colorWhite
    border-radius: 10px
  .recall
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $n-background
    .sub-title
      text-align: center
      padding-top: 10px
    .content-wrapper
      position: relative
      bottom: 50px
      height: 100%
      font-size: $font-size-large-x
      .content
        margin: 0 auto
        margin-top: 30%
        text-align: center
        .title
          margin-bottom: 20px
      .content-input
        text-align: center
        .user_write
          background: none
          color: $n-colorBlack
          margin-top: 30px
          margin-bottom: 10px
          border-bottom: 1px solid $n-colorBlack
          width: 200px
        .answer
          position: relative
    .endFlag
      position: relative
      display: flex
      width: 100%
      height: 100%
      .haveWrong
        margin-top: 50px
        width: 100%
        text-align: left
        & caption
          margin: 20px 0
        & tr th
          padding: 5px
        & tr td
          padding: 5px
        & tr:last-child td
          text-align: center
          padding-top: 20px
          .btn-in-table
            width: 200px
            margin: 0 20px
      .perfect
        position: absolute
        top: 0
        left: 0
        bottom: 0
        right: 0
        width: 100%
        height
        margin: auto
        .perfectTip
          margin: 20px auto
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>