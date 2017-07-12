<template>
  <transition name="up">
    <div class="single-select" ref="singleSelect">
      <div class="optionTitle" v-html="title" @click.stop="toggleShow" ref="optionTitle" :style="getDaySSSty"></div>
      <div class="option-wrapper" v-show="showFlag" ref="optionWrapper" :style="getDaySSSty">
        <div class="option" v-for="option in options" @click="showOption(option.cName)">
          <span class="text">
            {{option.cName}}
            <i class="istar iconfont icon-xing" :data-belong="option.eName" ref="iStar" :style="{'opacity': 0}"></i>
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {addClass} from 'common/js/util'
  import {showModeMixin} from 'common/js/mixins'
  export default {
    mixins: [showModeMixin],
    props: {
      title: {
        type: String,
        default: '请开始选择'
      },
      slideUp: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    computed: {
      ...mapGetters([
        'currentCourses',
        'currentCourse'
      ])
    },
    mounted() {
      if (this.slideUp) {
        this._slideUp()
      }
      this._lighed()
      /* this.$refs.optionWrapper.style.width = this.$refs.singleSelect.clientWidth + 'px'
      console.log(this.$refs.singleSelect.clientWidth) */
    },
    methods: {
      _lighed() {
        let stars = JSON.parse(localStorage.getItem(this.currentCourses.class_id)) || ''
        if (!stars) {
          return
        }

        for (let i = 0; i < this.options.length; i++) {
          let eName = this.$refs.iStar[i].getAttribute('data-belong')
          if (stars[this.currentCourse] && stars[this.currentCourse][eName]) {
            addClass(this.$refs.iStar[i], 'lighed')
          }
        }
      },
      showOption(option) {
        this.$emit('clickOption', option)
      },
      toggleShow() {
        this.showFlag ? this.hide() : this.show()
        console.log('show option')
      },
      show() {
        this.showFlag = true
        if (this.slideUp) {
          this.$refs.optionWrapper.style.bottom = this.$refs.singleSelect.clientHeight + 'px'
        }
      },
      hide() {
        this.showFlag = false
        if (this.slideUp) {
          this.$refs.optionWrapper.style.bottom = 0
        }
      },
      _slideUp() {
        // this.options = this.options.reverse()
      }
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .single-select
    position: relative
    display: inline-block
    width: 100%
    .optionTitle
      position: relative
      padding: 15px
      border: 1px solid $n-colorWhite
      color: $n-colorWhite
      background: $n-background
      text-align: center
    .option-wrapper
      position: absolute
      display: flex
      flex-direction: column
      color: $n-colorWhite
      background: $n-background
      width: 100%
      .option
        padding: 15px
        border: 1px solid $n-colorWhite
        display: flex
        .text
          position: relative
          margin-left: 50%
          transform: translateX(-50%)
          width: 110px
          .istar
            float: right
          .lighed
            color: $n-colorStarLight
            opacity: 1 !important
</style>