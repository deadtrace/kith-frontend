import { API } from "./api";
import { Files } from "./files";

export const getChats = (page, size, search) => {
    return API().get(`chat?page=${page}&size=${size}&search=${search}`);
};

export const deleteChat = (user_id) => {
    return API().delete(`chat/${user_id}`);
}

export const blockChat = (user_id) => {
    return API().post(`chat/${user_id}`);
}

export const getMessages = (user_id, page, size, skip) => {
    return API().get(`chat/${user_id}?page=${page}&size=${size}&skip=${skip}`);
}

export const sendMessage = (user_id, payload) => {
    return Files().put(`chat/${user_id}`, payload);
}

