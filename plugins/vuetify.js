import Vue from 'vue'
import Vuetify from "vuetify/lib"
import 'vuetify/dist/vuetify.min.css'
// import 'vuetify/src/stylus/app.styl'
import '@mdi/font/css/materialdesignicons.css'
import ru from 'vuetify/es5/locale/ru'
// import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'mdi'
    },
    lang: {
        locales: {
            ru
        },
        current: 'ru'
    },
    theme: {
        themes: {
            light: {
                default: '#0680C2',
                darkdefault: '#006195',
                // secondary: '#6b7478',
                // accent: '#7c8e51',
                // success: '#cfd9ce',
                // warning: '#384d47'
            }
        }
    }
})