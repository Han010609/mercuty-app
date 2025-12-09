/**
 * 帳號管理 Store
 * 管理帳號列表、CRUD 操作、Loading 狀態
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Account, AccountFormDto } from '@/types'
import { accountApi } from '@/api/account'
import { Notify } from 'quasar'

export const useAccountStore = defineStore('account', () => {
  // State
  const accounts = ref<Account[]>([])
  const isLoading = ref(false)

  // Actions
  /**
   * 取得帳號列表
   */
  const fetchAccounts = async () => {
    isLoading.value = true
    try {
      const response = await accountApi.getAccounts()
      accounts.value = response.data
    } catch (error) {
      console.error('取得帳號列表失敗:', error)
      // 錯誤處理由 axios 攔截器統一處理
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 新增帳號
   * @param data 帳號資料
   */
  const createAccount = async (data: AccountFormDto) => {
    try {
      await accountApi.createAccount(data)
      Notify.create({
        type: 'positive',
        message: '新增帳號成功',
        position: 'top'
      })
      // 重新取得列表
      await fetchAccounts()
    } catch (error) {
      console.error('新增帳號失敗:', error)
      throw error
    }
  }

  /**
   * 更新帳號
   * @param id 帳號 ID
   * @param data 帳號資料
   */
  const updateAccount = async (id: string, data: AccountFormDto) => {
    try {
      await accountApi.updateAccount(id, data)
      Notify.create({
        type: 'positive',
        message: '更新帳號成功',
        position: 'top'
      })
      // 重新取得列表
      await fetchAccounts()
    } catch (error) {
      console.error('更新帳號失敗:', error)
      throw error
    }
  }

  /**
   * 刪除帳號
   * @param id 帳號 ID
   */
  const deleteAccount = async (id: string) => {
    try {
      await accountApi.deleteAccount(id)
      Notify.create({
        type: 'positive',
        message: '刪除帳號成功',
        position: 'top'
      })
      // 重新取得列表
      await fetchAccounts()
    } catch (error) {
      console.error('刪除帳號失敗:', error)
      throw error
    }
  }

  return {
    accounts,
    isLoading,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount
  }
})

