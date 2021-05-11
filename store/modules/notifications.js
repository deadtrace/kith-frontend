import {
    NOTIFICATIONS_LIST__ADD,
    NOTIFICATIONS_LIST__DELETE,
    NOTIFICATIONS_COUNTER_INCREMENT,
    NOTIFICATIONS_COUNTER_SET
} from '../types'

const state = {
    notifications: [],
    unread: 0
};

const getters = {
    notifications: (state) => (state.notifications),
    unreadNotificationsCounter: (state) => (state.unread)
};

const mutations = {
    [NOTIFICATIONS_LIST__ADD]: (state, message) => {
        state.notifications.push(message);
    },
    [NOTIFICATIONS_LIST__DELETE]: (state, message) => {
        state.notifications = state.notifications.filter(notification => notification !== message);
    },
    [NOTIFICATIONS_COUNTER_INCREMENT] : (state) => {
        state.unread++;
    },
    [NOTIFICATIONS_COUNTER_SET] : (state, counter) => {
        state.unread = counter;
    }
};

const actions = {
    [NOTIFICATIONS_LIST__ADD]: ({ commit }, message) => {
        commit(NOTIFICATIONS_LIST__ADD, message)
    },
    [NOTIFICATIONS_LIST__DELETE]: ({ commit }, message) => {
        commit(NOTIFICATIONS_LIST__DELETE, message)
    },
    [NOTIFICATIONS_COUNTER_INCREMENT]: ({ commit }) => {
        commit(NOTIFICATIONS_COUNTER_INCREMENT)
    },
    [NOTIFICATIONS_COUNTER_SET]: ({ commit }, counter) => {
        commit(NOTIFICATIONS_COUNTER_SET, counter)
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}