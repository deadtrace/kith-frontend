import { API } from "./api";
import { Base } from '@/services/base';

export const add = (name_en, name_native, region, country) => {
    return API().put(`city`, { name_en, name_native, region, country});
};

export const getByID = (id) => {
    return Base().get(`city/${id}`)
}

export const del = (id) => {
    return API().delete(`city?id=${id}`)
}

export const change = (payload) => {
    return API().post(`city`, payload)
}

export const get = (search, region, offset, size) => {
    return Base().get(`cities?search=${search}&region=${region}&offset=${offset}&size=${size}`)
}