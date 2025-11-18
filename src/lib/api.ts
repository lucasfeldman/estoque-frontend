import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data
    const message = data?.erro || data?.message || error.message || 'Erro inesperado'
    return Promise.reject(new Error(message))
  }
)