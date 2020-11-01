import axios from 'axios'

export const mainHttpClient = axios.create({
  baseURL: `${process.env.PUBLIC_URL}/api`
})

export const functionTemplatesHttpClient = axios.create({
  baseURL: `${process.env.PUBLIC_URL}/function-catalog`
})

export const nuclioHttpClient = axios.create({
  baseURL: '/nuclio'
})
