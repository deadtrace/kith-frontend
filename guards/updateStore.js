import Cookie from 'js-cookie';
import store from '../store';
import * as Auth from '@/services/auth';
import {
    FETCH_USER_META
} from "../store/types";

export default (to, from, next) => {
    const token = Cookie.get('user-token')

    if (token) {
        Auth.refresh({
            token
        }).then(res => {
            store.dispatch(FETCH_USER_META, res.data);
            Cookie.set('user-token', res.data.token);
            next();
        }).catch(() => next());
    } else next();
};