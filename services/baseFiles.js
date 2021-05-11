import axios from 'axios'
import Cookies from 'js-cookie'

export const baseFiles = (onUpload=() => {}) => {
    return axios.create({
        baseURL: '/api',
        onUploadProgress: onUpload,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    })
}

