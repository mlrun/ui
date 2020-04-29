import axios from 'axios'

export const mainHTTPClient = axios.create({
  baseURL: '/api'
})

export const functionsTemplatesHTTPClient = axios.create({
  baseURL: '/function-catalog'
})
