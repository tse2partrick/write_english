import Vue from 'vue'
import Router from 'vue-router'
import Classes from 'components/classes/classes'
import ClassesDetail from 'components/classes-detail/classes-detail'
import Courses from 'components/courses/courses'
import Course from 'components/course/course'
import Recall from 'components/course-challenge/recall'
import Dictation from 'components/course-challenge/dictation'
import LineMatch from 'components/course-challenge/line-match'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/classes'
    },
    {
      path: '/classes',
      component: Classes,
      children: [
        {
          path: ':id',
          component: ClassesDetail
        }
      ]
    },
    {
      path: '/courses',
      component: Courses,
      children: [
        {
          path: ':classId',
          component: Course,
          children: [
            {
              path: 'recall',
              component: Recall
            },
            {
              path: 'dictation',
              component: Dictation
            },
            {
              path: 'line-match',
              component: LineMatch
            }
          ]
        }
      ]
    }
  ]
})
