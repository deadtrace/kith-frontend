import { Base } from '@/services/base'

export const authentificate = (login, password) => {
    return Base().post(`auth`, { login, password });
};

export const refresh = (payload) => {
    return Base().post(`auth/refresh`, payload);
};

export const sendRecoveryCode = (user) => {
    return Base().post(`password/recovery`, { user });
};

export const checkRecoveryCode = (email_code, user_id) => {
    return Base().post(`password/confirm`, { email_code, user_id });
};

export const changePassword = (first_password, second_password, user_id) => {
    return Base().put(`password/change`, { first_password, second_password, user_id });
};

export const checkReferral = (user_referral) => {
    return Base().post(`users/referral`, { user_referral });
}