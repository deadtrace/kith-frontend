import { API } from "./api";
import { Files } from "./files";
import { baseFiles } from "./baseFiles";


export const del = (id) => {
    return API().delete(`users/${id}`);
};

export const info = (id) => {
    return API().get(`users/${id}`);
};

export const search = ({search, page, size}) => {
    return API().get(`users?search=${search}&page=${page}&size=${size}`);
};

export const edit = (id, payload) => {
    return API().put(`users/${id}`, payload);
};

export const edit_mp = (id, fd) => {
    return Files().put(`users/${id}`, fd);
};

export const create = (payload) => {
    return API().post(`users`, payload);
};

export const get = (id) => {
    return API().get(`users/${id}`);
}

export const register = (fd) => {
    return baseFiles().post(`signup`, fd);
}
