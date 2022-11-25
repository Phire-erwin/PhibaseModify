import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
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
          redirect: 'dashboard',
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
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/modules/dashboard/Dashboard.vue'),
          meta: {
          rule: 'editor',
           no_scroll: true,
           requiresAuth: true,
          },
        },

        {
          path: '/component',
          name: 'component',
          component: () => import('@/views/item/Component.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },
        {
          path: '/bom',
          name: 'bom',
          component: () => import('@/views/item/Bom.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },
        // Item
        {
          path: '/item',
          name: 'item',
          component: () => import('@/views/modules/item/Item.vue'),
          meta: {
          rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },

        // Role
        {
          path: '/role',
          name: 'role',
          component: () => import('@/views/modules/role/Role.vue'),
          meta: {
          rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },
        {
          path: '/role/add',
          name: 'role-add',
          component: () => import('@/views/modules/role/AddRole.vue'),
          meta: {
          rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },
        {
          path: '/role/edit/:id',
          name: 'role-edit',
          component: () => import('@/views/modules/role/EditRole.vue'),
          props: true,
          meta: {
          rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },
        {
          path: '/role/view/:id',
          name: 'role-view',
          component: () => import('@/views/modules/role/ViewRole.vue'),
          props: true,
          meta: {
          rule: 'editor',
            no_scroll: true,
            requiresAuth: true,
          },
        },
 
        // User
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/modules/user/User.vue'),
          meta: {
            rule: 'editor',
            no_scroll: true,
             requiresAuth: true,
          },
        },

        // OEE
        {
          path: '/oee',
          name: 'oee',
          component: () => import('@/views/modules/oee/OEE.vue'),
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

        // {
        //   path:'/admin/login',
        //   name:'login_admin',
        //   component: () => import('@/views/login-admin/Login.vue'),
        //   meta: {
        //     layout:'full'
        //   }
        // },
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
    userAccess.push('profile');
    userAccess.push('change-password');
    userAccess.push('application');
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
