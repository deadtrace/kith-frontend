import Vue from 'vue'
import vuetify from './plugins/vuetify'
import './plugins/vue-meta'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'

import VueWindowSize from 'vue-window-size';
Vue.use(VueWindowSize);

import Clipboard from 'v-clipboard';
Vue.use(Clipboard);

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const toastOptions = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,
    position: "top-center",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: false,
    icon: false,
    rtl: false,
    containerClassName: "my-container-class"
};
Vue.use(Toast, toastOptions);

export const bus = new Vue();

import moment from 'moment';
moment.locale('ru');
Vue.prototype.$moment = moment;

Vue.config.productionTip = false

const vue = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
})

vue.$mount('#app')
window.vue = vue