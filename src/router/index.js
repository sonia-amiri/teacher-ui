import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () =>
      import('../views/login')
  },
  // {
  //   path: '/RegisterStudent',
  //   component: () =>
  //     import('../views/RegisterStudent.vue')
  // },
  {
    path: '/RegisterTeacher',
    component: () =>
      import('../views/RegisterTeacher')
  },
  {
    path: '/home',
    component: () =>
      import('../views/home'),
    children: [
      {
        path: 'exam',
        component: () => import('../components/exam.vue')
      },
      // {
      //   path: 'users',
      //   component: () => import('../components/UserManage.vue')
      // },
      {
        path: 'courses',
        component: () => import('../components/courses.vue')
      },
      {
        path: 'grade',
        component: () => import('../components/grade')
      },
      {
        path: 'subjects',
        component: () => import('../components/subject')
      },
      {
        path: 'curriculum',
        component: () => import('../components/curriculum')
      },
      {
        path: 'papers',
        component: () => import('../components/papers')
      },
      {
        path: 'plan/:id/paper',
        component: () => import('../components/Examining'),
        props: true
      }
      // {
      //   path: 'records',
      //   component: () => import('../components/Record'),
      //   props: true
      // }
    ]
  },
  {
    path: '/teacher',
    component: () =>
      import('../views/teacher'),
    children: [
      // {
      //   path: 'Student',
      //   component: () => import('../components/Student.vue')
      // },
      {
        path: 'exam',
        component: () => import('../components/exam.vue')
      },
      {
        path: 'questions/:id',
        component: () => import('../components/QuestionManage')
      },
      {
        path: 'courses',
        component: () => import('../components/courses.vue')
      },
      {
        path: 'grade',
        component: () => import('../components/grade.vue')
      }
    ]

  }
  // {
  //   path: '/Student',
  //   component: () =>
  //     import('../views/Student'),
  //   children: [
  //     {
  //       path: 'exam',
  //       component: () => import('../components/exam.vue')
  //     },
  //     {
  //       path: 'courses',
  //       component: () => import('../components/courses.vue')
  //     },
  //     {
  //       path: 'grade',
  //       component: () => import('../components/grade.vue')
  //     }
  //   ]

  // }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   const res = this.$http.get('api/v1/auth')
//   console.log(res)
//   res.then((v) => {
//     if (!v.data.data) return this.$router.push('/')
//     next()
//   })
// })

export default router
