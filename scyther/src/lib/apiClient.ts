/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { supabase } from './supabase.js'

const meta = import.meta as any
const apiClient = axios.create({
    baseURL: meta.env?.VITE_API_URL || 'http://localhost:4000/api/v1',
    headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(async (config) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

export default apiClient
