import { API } from "./api";
import { Base } from '@/services/base';

export const add = (name_en, name_native) => {
    return API().put(`category`, { name_en, name_native });
};

export const getByID = (id) => {
    return API().get(`category/${id}`)
}

export const del = (id) => {
    return API().delete(`category?id=${id}`)
}

export const change = (payload) => {
    return API().post(`category`, payload)
}

export const get = (search, offset, size) => {
    return Base().get(`categories?search=${search}&offset=${offset}&size=${size}`)
}