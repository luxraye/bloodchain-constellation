import axios from 'axios'
import { supabase } from './supabase.js'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
    headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(async (config) => {
    const isBypass = import.meta.env.VITE_AUTH_BYPASS === 'true'

    if (isBypass) {
        // In bypass/demo mode send the hardcoded dev token the backend accepts
        config.headers.Authorization = 'Bearer dev-bypass'
    } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`
        }
    }

    return config
}, (error) => Promise.reject(error))

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If a 401 comes back and we're not in bypass mode, the session is gone —
        // Supabase will handle the redirect via onAuthStateChange in useAuth.
        if (error.response?.status === 401 && import.meta.env.VITE_AUTH_BYPASS !== 'true') {
            supabase.auth.signOut()
        }
        return Promise.reject(error)
    }
)

export default apiClient
