<template>
  <div class="menu-wrapper">
    <scroll :data="menu" ref="scroll" class="menu">
      <div class="master-wrapper" ref="masterWrapper">
        <div class="subtitle">
          <span>正在学习</span>
          <span class="open iconfont" @click="toggleLearning" :class="learningIcon"></span>
          <hr>
        </div>
        <div class="learning-wrapper" v-if="showLearning && course">
          <div class="learning-inner" @click="goClasses(classes, classes.class_id)">
            <span class="learning-text">{{classes ? classes.master : ''}}</span>
          </div>
          <div class="learning-inner" @click="goCourses">
            <span class="learning-text">{{courses ? courses.name : ''}}</span>
          </div>
          <div class="learning-inner" @click="goCourse">
            <span class="learning-text">第{{course}}课</span>
          </div>
        </div>
        <div class="subtitle">
          <span>所有课程</span>
          <span class="open iconfont" @click="toggleAll" :class="allIcon"></span>
          <hr>
        </div>
        <div class="master" v-for="item in menu" v-if="showAll">
          <div class="master-inner" @click="start(item, item.class_id)">
            <span class="master-text">{{getDesc(item)}}</span>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {menu} from 'datas/menu'
  import Scroll from 'base/scroll/scroll'
  import {mapMutations, mapGetters} from 'vuex'
  import {getWordsMixin} from 'common/js/mixins'
  import weStore from 'common/js/localforage'
  export default {
    mixins: [getWordsMixin],
    data() {
      return {
        menu: menu,
        children: [],
        noClasses: true,
        classes: null,
        courses: null,
        course: null,
        showLearning: true,
        showAll: true
      }
    },
    created() {
      weStore.getItem('learning').then((learning) => {
        this.showAll = learning ? 0 : 1
        this.showLearning = learning ? 1 : 0
        setTimeout(() => {
          this.$refs.scroll.refresh()
          console.log('got learning. refresh')
        }, 20)
      }).catch((err) => {
        console.log('cpm classes func created() err: ' + err)
      })

      this.getClasses()
      this.getCourses()
      this.getCourse()
    },
    computed: {
      learningIcon() {
        return !this.showLearning ? 'icon-xiangshang' : 'icon-l2'
      },
      allIcon() {
        return !this.showAll ? 'icon-xiangshang' : 'icon-l2'
      },
      ...mapGetters([
        'currentCourse'
      ])
    },
    mounted() {
      window.addEventListener('resize', () => {
        if (!this.$refs.scroll) {
          return
        }
        this.$refs.scroll.refresh()
      })
    },
    methods: {
      getClasses() {
        weStore.getItem('learning').then((learning) => {
          this.classes = learning.classes
        }).catch((err) => {
          console.log('cpn classes func getClasses() err: ' + err)
        })
      },
      getCourses() {
        weStore.getItem('learning').then((learning) => {
          this.courses = learning.courses
        }).catch((err) => {
          console.log('cpn classes func getCourses() err: ' + err)
        })
        // return this.classes.coursesName ? this.classes.coursesName.name : '请选择课程'
      },
      getCourse() {
        weStore.getItem('learning').then((learning) => {
          this.course = learning.course
        }).catch((err) => {
          console.log('cpn classes func getCourse() err: ' + err)
        })
        // return this.classes.courseName ? `第${this.classes.courseName}课` : '请选择关卡'
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
        this.start(this.classes, this.classes.class_id)
      },
      goCourses() {
        this.$router.push({
          path: '/courses/'
        })
        if (this.courses === this.setCurrentCourses) {
          return
        }
        this.setCurrentClasses(this.classes)
        this.setCurrentCourses(this.courses)
      },
      goCourse() {
        this.$router.push({
          path: `/courses/${this.course.class_id}`
        })
        if (this.currentCourse === this.course) {
          return
        }
        this.setCurrentClasses(this.classes)
        this.setCurrentCourses(this.courses)
        this.setCurrentCourse(this.course)
        this._getWords()
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
          // this.children = item.children
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
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus" scope>
  @import "~common/stylus/variable"
  .menu-wrapper
    position:fixed
    width: 100%
    top: 88px
    bottom: 0
    .subtitle
      padding: 0 10px
      .open
        float: right
        padding-right: 10px
    .learning-wrapper
      display: flex
      flex-direction: column
      .learning-inner
        display: flex
        margin: 20px auto
        border: 1px solid #FFF
        width: 200px
        height: 100px
        text-align: center
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
          .master-inner
            display: flex
            border: 1px solid
            width: 200px
            height: 100px
            margin: 0 auto
            .master-text
              margin: auto
</style>