import { API } from '@/services/api'

export const get_profile_info = (id) => {
    return API().get(`users/` + id);
};