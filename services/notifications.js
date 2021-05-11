import {
    API
} from "./api";

export const unread = () => {
    return API().post(`notifications`);
};

export const getNotifications = (page, size) => {
    return API().get(`notifications?page=${page}&size=${size}`);
};