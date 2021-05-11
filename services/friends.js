import {
    API
} from "./api";

export const add = (id) => {
    return API().put(`users/friends/${id}`);
};

export const getRequests = () => {
    return API().get(`users/friends/income`);
}

export const getFams = (search, country_id, region_id, city_id) => {
    return API().get(`users/kith?search=${search}&country_id=${country_id}&region_id=${region_id}&city_id=${city_id}`);
}

export const getFriends = (search, country_id, region_id, city_id) => {
    return API().get(`users/friends?search=${search}&country_id=${country_id}&region_id=${region_id}&city_id=${city_id}`);
}

export const removeFromFriends = (user_id) => {
    return API().delete(`users/friends/${user_id}`);
}

export const acceptRequest = (user_id) => {
    return API().post(`users/friends/${user_id}`);
}

export const hideRequest = (user_id) => {
    return API().get(`users/friends/${user_id}`);
}