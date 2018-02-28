const routes = [
  {
    path: '/login',
    redirect: '/'
  },
  {
    path: '/note/post',
    component: resolve => require(['components/NotePostComponent.vue'], resolve)
  },
  {
    path: '/note/:noteId',
    component: resolve => require(['components/NoteDetailComponent.vue'], resolve)
  },
  {
    path: '/preview/note/:data',
    component: resolve => require(['components/NoteDetailComponent.vue'], resolve)
  },
  {
    path: '/un-authorized',
    component: (resolve) => require(['../components/UnAuthorizedComponent.vue'], resolve)
  },
  {
    path: '/not-found',
    component: (resolve) => require(['../components/NotFoundComponent.vue'], resolve)
  },
  {
    path: '/error',
    component: (resolve) => require(['../components/ErrorComponent.vue'], resolve)
  },
  {
    path: '*',
    redirect: '/not-found'
  }
]
export default routes
