import axios from 'axios'
import Cookies from 'js-cookie'

export const API = () => {
    return axios.create({
        baseURL: '/api',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Authorization': `JWT ${Cookies.get('user-token')}`,
            'Application-Server-Key': `BFwHvbAIhN5LAWkDzQfMV51NyUmrT3H8A3vw5xHBq-OPjGNOz49mP07tAPG_8HRCSuQABei91CCU2kTQgsozSYQ`
        }
    });
}