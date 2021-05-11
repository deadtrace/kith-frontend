import { API } from "./api";
// import { Base } from '@/services/base';

export const getComments = (board_id, size, page) => {
    return API().get(`comments/${board_id}?size=${size}&page=${page}`);
};

export const addComment = (board_id, message) => {
    return API().put(`comments`, {board_id, message});
}