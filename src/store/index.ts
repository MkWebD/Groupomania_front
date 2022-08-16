import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        logged: false
    },
    getters: {
        loginStatus: state => state.logged
    },
    actions: {
        login({commit}) {
            commit('SET_LOGGED', true)
        },
        logout({commit}) {
            commit('SET_LOGGED', false)
        }
    },
    mutations: {
        SET_LOGGED(state, logged) {
            state.logged = logged
        }
    },
    modules: {},
    plugins: [createPersistedState()]
})
