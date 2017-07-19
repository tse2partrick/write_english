import * as types from './mutation-types'

export function setWord({commit, state}, {wordsAndNonsArr, cWordsArr, eWordsArr, nonsArr}) {
  let courses = state.currentCourses
  let course = state.currentCourse

  commit(types.SET_OLD_COURSES, courses)
  commit(types.SET_OLD_COURSE, course)
  commit(types.SET_REMOTE_DATA, wordsAndNonsArr)
  commit(types.SET_CWORDSARR, cWordsArr)
  commit(types.SET_EWORDSARR, eWordsArr)
  commit(types.SET_NONSARR, nonsArr)
}