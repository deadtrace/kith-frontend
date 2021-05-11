import axios from 'axios'
import Cookies from 'js-cookie'

export const Base = () => (axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken')
  }
}))