import langEn from '../en'
import langVi from '../vi'

export default {
    KEY_NAME: '_LANGUAGES',
    // ACTION,
    namespaced: true,
    state: {
        lang: localStorage.getItem('lang') && String(localStorage.getItem('lang')).toLowerCase().trim() == 'en' ? langEn : langVi,
        currentLanguage: null
    },
    getters: {
        lang: state => state.lang,
    },
    mutations: {
        CHANGE_LANGUAGES(state, lang) {
            state.lang = String(lang).toLowerCase() == 'en' ? langEn : langVi
        }
    },
    actions: {
        CHANGE_LANGUAGES({ commit }, lang) {
            commit('CHANGE_LANGUAGES', lang);
        }
    }
}
