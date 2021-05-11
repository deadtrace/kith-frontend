import { API } from "./api";
import { Base } from '@/services/base';

export const add = (name_en, name_native, phone_code) => {
    return API().put(`country`, { name_en, name_native, phone_code});
};

export const getByID = (id) => {
    return Base().get(`country/${id}`)
}

export const del = (id) => {
    return API().delete(`country?id=${id}`)
}

export const change = (payload) => {
    return API().post(`country`, payload)
}

export const get = (search, offset, size) => {
    return Base().get(`countries?search=${search}&offset=${offset}&size=${size}`)
}