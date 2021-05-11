import { Base } from '@/services/base';

export const send = (user_id) => {
    return Base().post(`users/confirm`, {user_id});
};

export const check = (sms_code, user_id) => {
    return Base().post(`users/checkcode`, {sms_code, user_id});
};