// root state object.
// each Vuex instance is just a single state tree.
const states = {
  loading: false,
  currentUser: {
    userId: 0,
    snsUserId: '',
    snsNickName: '',
    snsShortName: '',
    snsHeadPhoto: '',
    snsUserExts: []
  },
  currentAccessKey: {},
  currentConfigs: {},
  currentCategories: [],
  currentCategoriesHash: {}
}
export default states
