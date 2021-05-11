import {
    API
} from '@/services/api'

export const change = (id, oldPassword, newPassword) => {
    return API().put(`password/change`, {
        first_password: oldPassword,
        second_password: newPassword,
        user_id: id
    });
};