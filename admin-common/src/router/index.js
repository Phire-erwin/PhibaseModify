import Vue from 'vue'
import VueRouter from 'vue-router'
import { domainPermission, viewAccess } from '@/utils/utils'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '',
      component: () => import('../layouts/vertical/LayoutVertical.vue'),
      children: [
        {
          path: '/',
          redirect: 'request-form',
        },

        // Profile
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/Profile.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },

        // Change Password
        {
          path: '/change-password',
          name: 'change-password',
          component: () => import('@/views/ChangePassword.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },

        // Application
        {
          path: '/application',
          name: 'application',
          component: () => import('@/views/Application.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },

        // Dashboard
        {
          path: '/request-form',
          name: 'request-form',
          component: () => import('@/views/modules/dashboard/Dashboard.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },

        {
          path: '/accept-form',
          name: 'accept-form',
          component: () => import('@/views/modules/acceptform/AcceptForm.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },

        {
          path: '/reject-form',
          name: 'reject-form',
          component: () => import('@/views/modules/rejectform/RejectForm.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },
      ]
    },

    {
      path: '',
      component: () => import('../layouts/full/LayoutFull.vue'),
      children: [
        {
          path: '/error-404',
          name: 'error-404',
          component: () => import('@/views/error/Error404.vue'),
          meta: {
            layout: 'full',
          },
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/login/Login.vue'),
          meta: {
            layout: 'full'
          },
        },

        {
          path: '/not-authorized',
          name: 'not-authorized',
          component: () => import('@/views/error/NotAuthorized.vue'),
          meta: {
            layout: 'full',
          },
        },
      ],
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

router.beforeEach((to, from, next) => {
  // Check Password
  // setTimeout(() => {
  //   var getActiveUser = store.getters['auth/getActiveUser'];
  //
  //   var getLastUpdatedPassword = getActiveUser.props ? getActiveUser.props.passwordUpdatedAt ? new Date(getActiveUser.props.passwordUpdatedAt).getTime() : undefined : undefined;
  //
  //   if (getLastUpdatedPassword === undefined || getLastUpdatedPassword < 1663139421195) {
  //     next({
  //       path: '/change-password',
  //     })
  //   }
  // }, 1000)

  var permission = {
    allAccess: true
  };

  if (router.app.$session.get('phibase-permission')) {
    permission = domainPermission('Common');

    var userAccess = viewAccess();
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    var path = to.path.split('/')

    if (!router.app.$session.exists()) {
      next({
        path: '/login',
      })
    }

    if (!permission.allAccess && path.length > 0 && !userAccess.includes(path[1])) {
      next({
        path: '/not-authorized',
      })
    }

    next()
  } else {
    next()
  }
})

export default router 
