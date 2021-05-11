import { API } from "./api";
import { Base } from '@/services/base';

export const add = (name_en, name_native, country) => {
    return API().put(`region`, { name_en, name_native, country});
};

export const getByID = (id) => {
    return Base().get(`region/${id}`)
}

export const del = (id) => {
    return API().delete(`region?id=${id}`)
}

export const change = (payload) => {
    return API().post(`region`, payload)
}

export const get = (search, country, offset, size) => {
    return Base().get(`regions?search=${search}&country=${country}&offset=${offset}&size=${size}`)
}