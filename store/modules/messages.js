import {
    ADD_MESSAGE_TO_QUERY,
    DELETE_MESSAGE_FROM_QUERY
} from '../types'

const state = {
    socketMessages: []
};

const getters = {
    messages: (state) => (state.socketMessages),
};

const mutations = {
    [ADD_MESSAGE_TO_QUERY]: (state, message) => {
        state.socketMessages.push(message);
    },
    [DELETE_MESSAGE_FROM_QUERY]: (state, message) => {
        state.socketMessages = state.socketMessages.filter(socketMessage => socketMessage !== message);
    }
};

const actions = {
    [ADD_MESSAGE_TO_QUERY]: ({ commit }, message) => {
        commit(ADD_MESSAGE_TO_QUERY, message)
    },
    [DELETE_MESSAGE_FROM_QUERY]: ({ commit }, message) => {
        commit(DELETE_MESSAGE_FROM_QUERY, message)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}