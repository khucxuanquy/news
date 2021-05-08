import Vue from 'vue'
import App from './App.vue'

import router from './router/index'
import store from './_store/index'
import registerModule from './_store/registerModule'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/vi'
import './styles/index.scss'; // global css
import axios from 'axios'
require('dotenv').config()

Vue.use(ElementUI, { size: 'medium', locale })
let headerGetAuth = () => ({ Authorization: localStorage.getItem('_u') || '' })
const loadScript = (src, async = true, type = "text/javascript") => {
  const el = document.createElement("script");
  const container = document.head || document.body;
  el.type = type;
  el.async = async;
  el.src = src;
  el.addEventListener("load", () => console.log('load script success'));
  el.addEventListener("error", () => console.log('load script fail'));
  container.appendChild(el);
};

let socket;
registerModule().then(async () => {
  Vue.config.productionTip = false

  if (location.pathname.includes('/admin')) {
    loadScript("http://localhost:3000/static/js/jquery_3.5.1.js");
    loadScript("https://cdn.tiny.cloud/1/pmx69zke0g1nne4ogs14gbeuj5l5w4sw5wzip9j4xxjlzsyl/tinymce/5/tinymce.min.js", true);

    let user_info = {}
    await axios.get('http://localhost:3000/API/users/getInfoUser', { params: { location: 'admin' }, headers: headerGetAuth() }).then(res => {
      const { ok, data } = res.data
      if (!ok) return localStorage.clear()
      user_info = data
      localStorage.setItem('_info', JSON.stringify(data))
    })

    socket = await io('http://localhost:3000');
    socket.on("connect", () => {
      if (user_info && user_info.id) {
        socket.emit("USER_CONNECTED", {
          id: user_info.id,
          manager_id: user_info.manager_id,
          socketId: socket.id,
        });
      }
    });

    window.onbeforeunload = function () {
      if (user_info && user_info.id) {
        socket.emit("USER_DISCONNECTED", {
          id: user_info.id,
          manager_id: user_info.manager_id,
          socketId: socket.id,
        });
        socket.emit('GET_USERS_ONLINE')
      }
    }
  } else {
    await axios.get('http://localhost:3000/API/users/getInfoUser', { headers: headerGetAuth() }).then(res => {
      const { ok, data } = res.data
      if (!ok) return localStorage.clear()
      localStorage.setItem('_user', JSON.stringify(data))
    })
  }

  new Vue({ render: h => h(App), store, router }).$mount('#app')

  Vue.mixin({
    methods: {
      storeVue: function (STORE_KEY) {
        let s = {}
        if ([STORE_KEY] in store._modules.root._children) s = store._modules.root._children[STORE_KEY].context;
        return {
          dispatch: (action, dataInput) => (Object.getOwnPropertyNames(s).length) ? s.dispatch(action, dataInput) : '',
          getters: s.getters || {}
        }
      },
      postAPI: (url, dataInput, callback) => axios.post(url, dataInput, { headers: headerGetAuth() }).then(res => callback(res.data)),
      putAPI: (url, dataInput, callback) => axios.put(url, dataInput, { headers: headerGetAuth() }).then(res => callback(res.data)),
      getAPI: (url, params, callback) => axios.get(url, { params, headers: headerGetAuth() }).then(res => callback(res.data)),
      deleteAPI: (url, params, callback) => axios.delete(url, { params, headers: headerGetAuth() }).then(res => callback(res.data)),
    },
    computed: {
      lang() {
        if (['_LANGUAGES'] in store._modules.root._children) return store._modules.root._children['_LANGUAGES'].context.getters.lang || {};
        else return {}
      },
      socket() {
        return socket;
      }
    }
  })

})