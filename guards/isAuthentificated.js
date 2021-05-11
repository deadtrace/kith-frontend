import Cookie from 'js-cookie';
import store from '../store'
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
            if (canRoute(to, res.data)) {
                store.dispatch(FETCH_USER_META, res.data);
                Cookie.set('user-token', res.data.token);
                next();
            } else next('/auth');
        }).catch(() => next('/auth'));
    } else next('/auth');
};

function canRoute(to, data) {
    if (to.path.includes("/admin") && !(data['is_superuser'] || data.groups.indexOf('admin') != -1 || data.groups.indexOf('manager') != -1))
        return false;
    return true;
}