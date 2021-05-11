import {
    FETCH_USER_META,
    UPDATE_USER_PHOTO,
    CLEAR_USER_META
} from '../types'

const state = {
    id: null,
    photo: null,
    firstname: '',
    lastname: '',
    middlename: '',
    permissions: []
};

const getters = {
    username: (state) => (`${state.firstname} ${state.lastname}`),
    userID: (state) => (state.id),
    photoURL: (state) => (`/media/${state.photo}`)
};

const actions = {
    [FETCH_USER_META]: ({ commit }, payload) => {
        commit(FETCH_USER_META, payload)
    },
    [UPDATE_USER_PHOTO]: ({ commit }, photo) => {
        commit(UPDATE_USER_PHOTO, photo)
    },
    [CLEAR_USER_META]: ({ commit }) => {
        commit(CLEAR_USER_META)
    }
};

const mutations = {
    [FETCH_USER_META]: (state, {user_id, user_photo, permissions, user_firstname, user_lastname, user_middlename }) => {
        state.id = user_id;
        state.photo = user_photo;
        state.permissions = permissions;
        state.firstname = user_firstname;
        state.lastname = user_lastname;
        state.middlename = user_middlename;
    },
    [UPDATE_USER_PHOTO]: (state, photo) => {
        state.photo = photo;
    },
    [CLEAR_USER_META]: (state) => {
        state.id = null;
        state.permissions = [];
        state.firstname = '';
        state.lastname = '';
        state.middlename = '';
        state.photo = null;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}