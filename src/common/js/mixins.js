import {mapGetters, mapMutations, mapActions} from 'vuex'
import {getWords} from 'datas/words'
import {shuffle} from './util'
import {Mode} from './config'
import weStore from 'common/js/localforage'
export const getWordsMixin = {
  computed: {
    ...mapGetters([
      'currentCourses',
      'currentCourse',
      'oldCourses',
      'oldCourse',
      'remoteData',
      'cWordsArr',
      'eWordsArr',
      'nonsArr'
    ])
  },
  methods: {
    _getWords() {
      // 如果还是请求之前的数据，什么都不做
      if (this.oldCourses && this.oldCourses.class_id === this.currentCourses.class_id && this.oldCourse && this.oldCourse === this.currentCourse) {
        console.log('old data used')
        return
      }
      // 如果之前有数据 清空
      if (this.remoteData.length) {
        this.setRemoteData([])
        this.setCWordsArr([])
        this.setEWordsArr([])
        this.setNonsArr([])
      }
      getWords(this.currentCourses.class_id, this.currentCourse).then((res) => {
        let str = res.data.slice(32240, 75900).toString()
        let reg = new RegExp('<?.title=.*>', 'g')
        let result = str.match(reg)[0]// .replace(/\s/g, '')
        let dataArr = result.split('title').slice(1)
        let {wordsAndNonsArr, cWordsArr, eWordsArr, nonsArr} = this._normalize(dataArr)
        this.setWord({wordsAndNonsArr, cWordsArr, eWordsArr, nonsArr})
      }).catch((err) => {
        console.log('js mixins fnc _getWords() err: ' + err)
      })
    },
    _normalize(arr) {
      let reg
      let wordsAndNonsArr = []
      let arrCopy = []
      let cWordsArr = []
      let eWordsArr = []
      let nonsArr = []
      // 如果没有声音资源补一个错误的地址

      arr.forEach((item) => {
        arrCopy.push(item.slice(0, 170))
      })
      arrCopy.forEach((item, index) => {
        if (index % 2 === 0) {
          if (item.indexOf('发音') === -1) {
            arr.splice(index, 0, '补"发音"href="javascript:void(0)"id="http://补充资源.mp3"onclick="asplay_top(this.id);"onmouseover="asplay_top(this.id)"></a>\')')
            arrCopy.splice(index, 0, '发音')
          }
        }
      })

      // 确认不超过20个单词
      /* if (arr.length > 40) {
        arr = arr.slice(0, 40)
      } */
      arr.forEach((item) => {
        let itemWord = item.slice(118)
        // 先得到w_right这个html元素，这个元素包含着词霸正确单词，提取它准备再过滤加入eWordsArr
        if (itemWord.indexOf('w_right') !== -1) {
          // reg = /<span class="w_right".*>([a-zA-Z|\\'|\/]+\s?)+<\/span>/
          // reg = new RegExp('<span class="w_right".*>([a-zA-Z|\'|/|\\]+\\s?)+</span>')
          reg = new RegExp('<span class="w_right" style="display:none">[^<]+</span>')
          // 如果有单词
          if (itemWord.match(reg) !== null) {
            itemWord = itemWord.match(reg)[0]
            reg = new RegExp('>.*<')
            itemWord = itemWord.match(reg)[0]
            // 格式化取得的数据 去掉>< 合并\
            itemWord = itemWord.slice(1, itemWord.length - 1).split('\\').join('')
          } else {
            itemWord = ''
          }
          eWordsArr.push(itemWord)
        }

        item = item.slice(0, 118)
        if (item.indexOf('发音') !== -1) {
          reg = new RegExp('(http).*mp3')
          let res = item.match(reg)[0]
          nonsArr.push(res)
        } else {
          reg = /\w?\.?.[^\\]+\\'>/
          if (item.match(reg) === null) {
            item = ''
          } else {
            item = item.match(reg)[0]
          }
          cWordsArr.push(item.slice(2, item.length - 3))
        }
      })

      /* let ret = []
      cWordsArr.forEach((item) => {
        ret.push(item.slice(0, item[0].length - 1))
      })
      cWordsArr = ret */
      eWordsArr = eWordsArr.filter((i) => {
        return i !== ''
      })
      cWordsArr = cWordsArr.filter((i) => {
        return i !== ''
      })
      nonsArr = nonsArr.filter((i) => {
        return i !== ''
      })
      eWordsArr.forEach((item, index) => {
        wordsAndNonsArr.push({
          'nons': nonsArr[index],
          'cWord': cWordsArr[index],
          'eWord': item
        })
      })

      return {wordsAndNonsArr, cWordsArr, eWordsArr, nonsArr}
    },
    ...mapMutations({
      'setRemoteData': 'SET_REMOTE_DATA',
      'setCWordsArr': 'SET_CWORDSARR',
      'setEWordsArr': 'SET_EWORDSARR',
      'setNonsArr': 'SET_NONSARR'
    }),
    ...mapActions([
      'setWord'
    ])
  }
}

export const challengeMixin = {
  data() {
    return {
      shuffleRemoteData: null,
      learningName: 'learning'
    }
  },
  computed: {
    ...mapGetters([
      'remoteData',
      'currentClasses',
      'currentCourses',
      'currentCourse',
      'oldCourses',
      'oldCourse',
      'needUnlock',
      'needLightStar'
    ])
  },
  created() {
    this._shuffleRemoteData()
    // this._setLearning()
  },
  methods: {
    _lightStar(challengeName) {
      let num = this.needUnlock + 1
      this.setNeedUnlock(num)

      challengeName = challengeName === Mode.recall.eName ? Mode.recall.eName : challengeName === Mode.dictation.eName ? Mode.dictation.eName : Mode.lineMatch.eName

      /* let course = `${this.currentCourses.class_id}-${this.currentCourse}`
      weStore.getItem(course).then((val) => {
        val[challengeName] = 1
        weStore.setItem(course, val)
      }).catch((err) => {
        console.log(err + ' --- ' + challengeName + ' is new create.')
        let value = {}
        value[challengeName] = 1
        weStore.setItem(course, value)
      }) */
      let courses = this.currentCourses.class_id.toString()
      weStore.getItem(courses).then((val) => {
        val[this.currentCourse] = val[this.currentCourse] || {}

        // 如果之前没有星星 就添加星星确认
        if (!val[this.currentCourse][challengeName]) {
          val[this.currentCourse][challengeName] = 1
        }

        // 之前通过的关卡判断 相等的时候就要开通下一关 小于通关不管
        val['challengingIndex'] = val['challengingIndex'] ? val['challengingIndex'] > this.currentCourse ? val['challengingIndex'] : this.currentCourse + 1 : 2
        weStore.setItem(courses, val)
      }).catch((err) => {
        console.log(err + ' --- ' + challengeName + ' is new create.')
        let value = {}

        // 通过的一定是第二关
        value['challengingIndex'] = 2
        value[this.currentCourse] = {}
        value[this.currentCourse][challengeName] = 1
        weStore.setItem(courses, value)
      })

      // 要用localStorage的同步，异步不方便做实时亮灯
      let localVal = JSON.parse(localStorage.getItem(this.currentCourses.class_id)) || {}
      if (localVal[this.currentCourse]) {
        if (localVal[this.currentCourse][challengeName]) {
          return
        } else {
          localVal[this.currentCourse][challengeName] = 1
        }
      } else {
        localVal[this.currentCourse] = {}
        localVal[this.currentCourse][challengeName] = 1
      }
      localVal['challengingIndex'] = localVal['challengingIndex'] ? localVal['challengingIndex'] > this.currentCourse ? localVal['challengingIndex'] : this.currentCourse + 1 : 2

      localStorage.setItem(this.currentCourses.class_id, JSON.stringify(localVal))

      // 亮星
      this.setNeedLightStar(this.needLightStar + 1)
    },
    _shuffleRemoteData() {
      this.shuffleRemoteData = shuffle(this.remoteData)
    },
    _setLearning() {
      let learning = {
        classes: this.currentClasses || '',
        courses: this.currentCourses,
        course: this.currentCourse
      }
      weStore.setItem(this.learningName, learning).then(() => {
        console.log('current learning setting success.')
      }).catch((err) => {
        console.log('js mixins fnc _setLearning() err: ' + err)
      })
    },
    ...mapMutations({
      'setNeedUnlock': 'SET_NEED_UNLOCK',
      'setNeedLightStar': 'SET_NEED_LIGHT_STAR'
    })
  }
}
