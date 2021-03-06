import Vue from 'vue'
import Vuex from 'vuex'

import user from "./modules/user";
import messages from "./modules/messages";
import notifications from "./modules/notifications";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        messages,
        notifications
    }
})