import axios from 'axios'

export const mainHttpClient = axios.create({
  baseURL: '/api'
})

export const functionTemplatesHttpClient = axios.create({
  baseURL: '/function-catalog'
})
