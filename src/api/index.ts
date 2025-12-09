/**
 * Axios 實例設定與攔截器
 * 負責處理請求/回應攔截、Token 管理、錯誤處理
 */
import axios from 'axios'
import { Notify } from 'quasar'
import { useAuthStore } from '@/stores/auth'

// 建立 axios 實例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'interviewerName': import.meta.env.VITE_INTERVIEWER_NAME
  }
})

/**
 * 請求攔截器 - 自動帶上 Token
 */
apiClient.interceptors.request.use(
  (config: any) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

/**
 * 回應攔截器 - Token 刷新與錯誤處理
 */
apiClient.interceptors.response.use(
  (response: any) => {
    return response
  },
  async (error: any) => {
    const authStore = useAuthStore()
    
    // Token 過期處理 (401 Unauthorized)
    if (error.response?.status === 401) {
      // 清除 token 並導向登入頁
      authStore.logout()
      
      // 避免在登入頁面顯示錯誤訊息
      if (!window.location.pathname.includes('/login')) {
        Notify.create({
          type: 'negative',
          message: '登入已過期，請重新登入',
          position: 'top'
        })
        
        // 導向登入頁
        window.location.href = '/login'
      }
      
      return Promise.reject(error)
    }
    
    // 統一錯誤處理
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        '發生錯誤，請稍後再試'
    
    // 避免重複顯示錯誤訊息（例如在登入頁面）
    if (error.config?.showError !== false) {
      Notify.create({
        type: 'negative',
        message: errorMessage,
        position: 'top'
      })
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

