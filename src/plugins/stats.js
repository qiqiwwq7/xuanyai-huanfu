import Util from '../libs/util'

const plugin = {
  install(Vue, options) {
    Vue.mixin({
      methods: {
        $stats_push(params) {
          return Util.ajax.post('/stats/push', Object.assign({
            accessCoreId: this.$store.getters.currentAccessKey.accessCoreId,
            accessKeyId: this.$store.getters.currentAccessKey.accessKeyId,
            userId: this.$store.getters.currentUser ? this.$store.getters.currentUser.userId : 0
          }, params))
        }
      }
    })
  }
}

export default plugin
export const install = plugin.install
