import * as types from './mutation-types'

const mutations = {
  [types.SET_CURRENT_CLASSES](state, currentClasses) {
    state.currentClasses = currentClasses
  },
  [types.SET_CURRENT_COURSES](state, currentCourses) {
    state.currentCourses = currentCourses
  },
  [types.SET_CURRENT_COURSE](state, currentCourse) {
    state.currentCourse = currentCourse
  },
  [types.SET_OLD_COURSES](state, oldCourses) {
    state.oldCourses = oldCourses
  },
  [types.SET_OLD_COURSE](state, oldCourse) {
    state.oldCourse = oldCourse
  },
  [types.SET_REMOTE_DATA](state, remoteData) {
    state.remoteData = remoteData
  },
  [types.SET_EWORDSARR](state, eWordsArr) {
    state.eWordsArr = eWordsArr
  },
  [types.SET_CWORDSARR](state, cWordsArr) {
    state.cWordsArr = cWordsArr
  },
  [types.SET_NONSARR](state, nonsArr) {
    state.nonsArr = nonsArr
  },
  [types.SET_NEED_UNLOCK](state, num) {
    state.needUnlock = num
  },
  [types.SET_NEED_LIGHT_STAR](state, num) {
    state.needLightStar = num
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
    localStorage.setItem('mode', mode)
  }
}

export default mutations