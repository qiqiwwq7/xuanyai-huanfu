// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  setLoading: ({ commit }, loading) => commit('setLoading', loading),
  setCurrentUser: ({ commit }, currentUser) => commit('setCurrentUser', currentUser),
  setCurrentAccessKey: ({ commit }, currentAccessKey) => commit('setCurrentAccessKey', currentAccessKey),
  setCurrentConfigs: ({ commit }, currentConfigs) => commit('setCurrentConfigs', currentConfigs),
  setCurrentCategories: ({ commit }, currentCategories) => commit('setCurrentCategories', currentCategories),
  setCurrentCategoriesHash: ({ commit }, currentCategoriesHash) => commit('setCurrentCategoriesHash', currentCategoriesHash),
  setCurrentCategoriesLastPath: ({ commit }, categoryUrl, fullPath) => commit('setCurrentCategoriesLastPath', categoryUrl, fullPath)
}
export default actions
