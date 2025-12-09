/**
 * 身份驗證 Store
 * 管理登入狀態、Token 儲存與刷新
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { LoginDto } from '@/types'
import { Notify } from 'quasar'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  /**
   * 登入
   * @param loginData 登入資料
   */
  const login = async (loginData: LoginDto) => {
    isLoading.value = true
    try {
      const response = await authApi.login(loginData)
      token.value = response.data.token
      localStorage.setItem('token', response.data.token)
      
      Notify.create({
        type: 'positive',
        message: '登入成功',
        position: 'top'
      })
      
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '登入失敗，請檢查帳號密碼'
      Notify.create({
        type: 'negative',
        message: errorMessage,
        position: 'top'
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 登出
   */
  const logout = () => {
    token.value = null
    localStorage.removeItem('token')
    
    Notify.create({
      type: 'info',
      message: '已成功登出',
      position: 'top'
    })
  }

  return {
    token,
    isLoading,
    isAuthenticated,
    login,
    logout
  }
})

