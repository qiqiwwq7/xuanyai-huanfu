// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'assets/fonts/css/gcicon.css'

import Vue from 'vue'
import App from 'App'
import Util from './libs/util'

import Vuex from 'vuex'
import states from 'store/states'
import gettters from 'store/getters'
import actions from 'store/actions'
import mutations from 'store/mutations'
Vue.use(Vuex)

import VueRouter from 'vue-router'
import components from 'router/components'
import routes from 'router/routes'
Vue.use(VueRouter)

import CommonPlugin from 'plugins/common'
import InputPlugin from 'plugins/input'
import VideoPlugin from 'plugins/video'
import StatsPlugin from 'plugins/stats'
Vue.use(CommonPlugin)
Vue.use(InputPlugin)
Vue.use(VideoPlugin)
Vue.use(StatsPlugin)

//添加Fastclick移除移动端点击延迟
import FastClick from 'fastclick'
FastClick.attach(document.body)

// plugins
import {
  ConfirmPlugin,
  ToastPlugin
} from 'vux'
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)

// 状态管理
const store = new Vuex.Store({
  state: states,
  getters: gettters,
  mutations: mutations,
  actions: actions
})

// 路由配置
const router = new VueRouter({
  mode: 'history',
  routes: []
})

new Vue({
  store,
  router,
  render: h => h(App),
  methods: {
    load() {
      let $vue = this

      let topPathRegexp = new RegExp('/(\\w)+/(\\w)+/(\\d)+$')
      router.beforeEach((to, from, next) => {
        if (topPathRegexp.test(to.fullPath)) {
          if (to.fullPath.indexOf('/note') > -1) {
            this.$store.dispatch('setCurrentCategoriesLastPath', {
              '/note': {
                last: to.fullPath
              }
            })
          } else if (to.fullPath.indexOf('/video') > -1) {
            this.$store.dispatch('setCurrentCategoriesLastPath', {
              '/video': {
                last: to.fullPath
              }
            })
          }
        }
        if ($vue.$input.getValue() || $vue.$video.getSources()) {
          //当后退触发时，先收起输入组件或视频组件
          $vue.$input.hide()
          $vue.$video.hide()
        } else {
          $vue.$store.dispatch('setLoading', true)
          next()
        }
      })

      router.afterEach(function(to) {
        $vue.statsPush(to)
        $vue.$store.dispatch('setLoading', false)
      })

      if (this.$route.path == '/login') {
        Util.ajax.post('/login', this.$route.query).then((response) => {
          if (response.data.success == Util.response.code.Success) {
            this.initialize(response.data.data)
            $vue.$router.push('/')
          } else {
            this.$router.addRoutes(routes)
            $vue.$router.push({path: '/error', query: {code: response.data.code}})
          }
          this.$mount('#app-box')
        }).catch((error) => {
          this.$router.addRoutes(routes)
          $vue.$router.push('/error')
          this.$mount('#app-box')
        })
      } else {
        return Util.ajax.get('/current/get').then((response) => {
          if (response.data.success == Util.response.code.Success) {
            this.initialize(response.data.data)
          } else {
            this.$router.addRoutes(routes)
            $vue.$router.push({path: '/error', query: {code: response.data.code}})
          }
          this.$mount('#app-box')
        }).catch((error) => {
          this.$router.addRoutes(routes)
          if (error.response.status == 401) {
            $vue.$router.push('/un-authorized')
          } else {
            $vue.$router.push('/error')
          }
          this.$mount('#app-box')
        })
      }
    },
    statsPush(route) {
      //PV统计
      for (let matched of route.matched) {
        if (matched.path.endsWith('/category/:id')) {
          this.$stats_push({
            fullPath: matched.path.replace('/category/:id', '/category/' + route.params.id),
            accessCategoryId: route.params.id
          })
        } else if (matched.path.endsWith('/note/:noteId')) {
          this.$stats_push({
            fullPath: matched.path.replace('/note/:noteId', '/note/' + route.params.noteId),
            noteId: route.params.noteId
          })
        } else {
          let category = this.$store.getters.currentCategoriesHash[matched.path]
          if (category) {
            this.$stats_push({
              fullPath: category.category.fullPath,
              accessCategoryId: category.category.id
            })
          }
        }
      }
    },
    initialize(data) {
      //设置拦截器
      Util.ajax.interceptors.response.use((success) => {
        return success
      }, (failure) => {
        if (window.navigator.onLine == false) {
          this.$vux.toast.show({
            text: '请检查网络连接或尝试刷新<br>╭(╯^╰)╮',
            type: 'text'
          })
        }
        if (failure.response.status == 401) {
          this.$router.push('/un-authorized')
        } else {
          this.$router.push('/error')
        }
        return Promise.reject(failure)
      })
      //组装权限树
      let categoriesTree = []
      let categoriesHash = {}
      let temp = {}
      for (let category of data.accessCategories) {
        category.selected = false
        category.fullPath = category.fullUrl.replace('/:id', '/' + category.id)
        temp[category.id] = category
        if (temp[category.parentId] != null) {
          let parent = temp[category.parentId]
          if (!parent.children) {
            parent.children = []
          }
          if (category.type == '1') {
            parent.children.push(category)
          }
        } else {
          if (category.type == '1') {
            categoriesTree.push(category)
          }
        }
        categoriesHash[category.fullUrl.replace('/category/:id', '/category/' + category.id)] = {
          category: category,
          last: ''
        }
      }
      //保存会话
      this.$store.dispatch('setCurrentUser', data.snsUser)
      this.$store.dispatch('setCurrentAccessKey', data.accessKey)
      this.$store.dispatch('setCurrentConfigs', data.accessConfigs)
      this.$store.dispatch('setCurrentCategories', categoriesTree)
      this.$store.dispatch('setCurrentCategoriesHash', categoriesHash)
      //加载路由
      let categories = this.loadRoutes([], categoriesTree)
      categories.push.apply(categories, routes)
      this.$router.addRoutes(categories)
    },
    loadRoutes(routes, categories, parent) {
      if (categories && categories.length > 0) {
        for (let i = 0; i < categories.length; i++) {
          let category = categories[i]
          if (i == 0) {
            routes.push({
              path: parent ? parent.fullUrl : '/',
              redirect: category.fullPath
            })
          }
          routes.push({
            path: category.fullUrl,
            component: components[category.fullUrl],
            children: this.loadRoutes([], category.children, category)
          })
        }
      }
      return routes
    }
  }
}).load()
