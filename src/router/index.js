import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Classes = (resolve) => {
  import('components/classes/classes').then((module) => {
    resolve(module)
  })
}
const ClassesDetail = (resolve) => {
  import('components/classes-detail/classes-detail').then((module) => {
    resolve(module)
  })
}
const Courses = (resolve) => {
  import('components/courses/courses').then((module) => {
    resolve(module)
  })
}
const Course = (resolve) => {
  import('components/course/course').then((module) => {
    resolve(module)
  })
}
const Recall = (resolve) => {
  import('components/course-challenge/recall').then((module) => {
    resolve(module)
  })
}
const Dictation = (resolve) => {
  import('components/course-challenge/dictation').then((module) => {
    resolve(module)
  })
}
const LineMatch = (resolve) => {
  import('components/course-challenge/line-match').then((module) => {
    resolve(module)
  })
}

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
