<template>
  <div class="listview">
    <scroll :data="courses" class="courses">
      <div class="course-wrapper">
        <div class="course-inner" v-for="(item, index) in courses" @click="start(item, index)">
          <div class="title">
            <span class="text">第{{item}}课</span>
          </div>
          <div class="star-wrapper" ref="starWrapper">
            <i class="star iconfont icon-xing"></i>
            <i class="star iconfont icon-xing"></i>
            <i class="star iconfont icon-xing"></i>
          </div>
          <i class="lock iconfont icon-suo" ref="lock"></i>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Top from 'base/top/top'
  import {mapGetters} from 'vuex'
  import {removeClass, hasClass, addClass} from 'common/js/util'
  import weStore from 'common/js/localforage'

  const LOCK_CLASSNAME = 'icon-suo'
  export default {
    data() {
      return {
        courses: [],
        challengingIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'currentCourses',
        'currentCourse',
        'needUnlock',
        'needLightStar'
      ])
    },
    mounted() {
      this.courses = this._getClasses()

      // dom完全准备，判断解锁
      if (!this.currentCourses.class_id) {
        console.log('no ses id')
        return
      }
      this.$nextTick(() => {
        weStore.getItem(this.currentCourses.class_id.toString()).then((val) => {
          let challengingIndex = val['challengingIndex'] || 1
          for (let i = 0; i < challengingIndex; i++) {
            this.unlock(i)
            this.lightStar(i)
          }
        }).catch((err) => {
          console.log('base listview func mounted() err: ' + err)
          this.unlock(0)
          this.lightStar(0)
        })
      })
    },
    methods: {
      lightStar(course) {
        /* weStore.getItem(this.currentCourses.class_id.toString()).then((val) => {
          if (course === 0) {
            return
          }
          let starsNum = Object.keys(val[course]).length
          let child = this.$refs.starWrapper[course - 1].childNodes
          let starArr = []
          for (let key in child) {
            if (key % 2 === 0) {
              starArr.push(child[key])
            }
          }
          for (let i = 0; i < starsNum; i++) {
            addClass(this.$refs.starWrapper[course - 1].childNodes[i], 'lighted')
          }
        }).catch((err) => {
          console.log('err val: ' + course + ' base listview func lightStar err: ' + err)
        }) */

        // 同步获取数据
        let starsArr = JSON.parse(localStorage.getItem(this.currentCourses.class_id)) || ''
        if (!starsArr[course]) {
          return
        }

        // 点亮几颗星
        let starsNum = Object.keys(starsArr[course]).length
        for (let i = 0; i < starsNum; i++) {
          addClass(this.$refs.starWrapper[course - 1].children[i], 'lighted')
        }
      },
      unlock(index) {
        removeClass(this.$refs.lock[index], LOCK_CLASSNAME)
      },
      getStar(index) {
        /* let coursesId = this.currentCourses.class_id
        weStore.getItem(coursesId).then((val) => {
          index > val['challengingIndex'] - 1 ? addClass(this.$refs.lock[index], LOCK_CLASSNAME) : removeClass(this.$refs.lock[index], LOCK_CLASSNAME)
        }).catch((err) => {
          console.log('cpm listview func getLockCls(): ' + err)
          if (index > 0) {
            addClass(this.$refs.lock[index], LOCK_CLASSNAME)
          }
        }) */
      },
      start(item, index) {
        if (hasClass(this.$refs.lock[index], LOCK_CLASSNAME)) {
          console.log('locked. can not open')
          return
        }
        this.$emit('showWords', item)
      },
      _getClasses() {
        let ret = []
        for (let i = 1; i <= this.currentCourses.class_num; i++) {
          ret.push(i)
        }

        return ret
      }
    },
    watch: {
      needUnlock() {
        this.unlock(this.currentCourse)
      },
      needLightStar() {
        this.lightStar(this.currentCourse)
      }
    },
    components: {
      Scroll,
      Top
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .listview
    position: fixed
    width: 100%
    top: 50px
    bottom: 50px
    .courses
      height: 100%
      overflow: hidden
      background: $color-background
      .course-wrapper
        display: flex
        flex-wrap: wrap
        .course-inner
          position: relative
          border: 1px solid
          width: 30%
          height: 100px
          margin: 10px 3px
          .title
            display: flex
            position: relative
            top: 40%
            transform: translateY(-50%)
            .text
              margin: auto
          .star-wrapper
            position: relative
            top: 50%
            width: 80%
            margin: 0 auto
            text-align: center
            .lighted
              color: $color-D-star-light
          .lock
            position: absolute
            width: 100%
            bottom: 5px
            left: 85%
</style>