import { API } from "./api";
import { Files } from "./files";
import { Base } from '@/services/base';

export const get_boards = (size, offset, search) => {
    return API().get(`boards?size=${size}&offset=${offset}&search=${search}`);
};

export const getMainBoardsWithoutToken = (size, page, search, country_id, region_id, city_id, category_id) => {
    return Base().get(`boards/enabled?size=${size}&page=${page}&search=${search}&country_id=${country_id}&region_id=${region_id}&city_id=${city_id}&category_id=${category_id}`);
}

export const getMainBoards = (size, page, search, country_id, region_id, city_id, category_id) => {
    return API().get(`boards/enabled?size=${size}&page=${page}&search=${search}&country_id=${country_id}&region_id=${region_id}&city_id=${city_id}&category_id=${category_id}`);
}

export const del = (board_id) => {
    return API().delete(`board?board_id=${board_id}`)
}

export const edit = (board) => {
    return API().post(`board`, board)
}

export const create = (board) => {
    return API().put(`boards`, board)
}

export const getUserBoards = (size, offset, search) => {
    return API().get(`boards/user?size=${size}&offset=${offset}&search=${search}`);
}

export const getUserBoardsById = (size, offset, search, user_id) => {
    return API().get(`boards/user?size=${size}&offset=${offset}&search=${search}&user_id=${user_id}`);
}

export const getFavouriteBoards = (size, offset, search) => {
    return API().get(`favorites?size=${size}&offset=${offset}&search=${search}`);
}

export const getArchiveBoards = (size, offset, search) => {
    return API().get(`boards/archive`, {size, offset, search});
}

export const addToFavourite = (subscription_board_id) => {
    return API().put(`favorites`, {subscription_board_id});
}

export const removeFromFavourite = (board_id) => {
    return API().delete(`favorites?board_id=${board_id}`);
}

export const removeFromArchive = (board_id) => {
    return API().delete(`boards/archive/delete?board_id=${board_id}`);
}

export const getBoardWithoutToken = (board_id) => {
    return Base().get(`board/${board_id}`);
}

export const getBoard = (board_id) => {
    return API().get(`board/${board_id}`);
}

export const deletePhoto = (photo_id) => {
    return API().delete(`boards/image/${photo_id}`);
}

export const addPhotos = (board_id, payload) => {
    return Files().put(`boards/image/${board_id}`, payload);
}