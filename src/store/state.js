import {showMode} from 'common/js/config'
const state = {
  currentClasses: [],
  currentCourses: {},
  currentCourse: 0,
  oldCourses: null,
  oldCourse: null,
  remoteData: [],
  eWordsArr: [],
  cWordsArr: [],
  nonsArr: [],
  needUnlock: 0,
  needLightStar: 0,
  mode: localStorage.getItem('mode') || showMode.day
}

export default state