/**
 * 帳號管理相關 API
 */
import apiClient from './index'
import { Account, AccountFormDto } from '@/types'

export const accountApi = {
  /**
   * 取得帳號列表
   * @returns 帳號列表
   */
  getAccounts: () => {
    return apiClient.get<Account[]>('/accounts')
  },

  /**
   * 取得單個帳號
   * @param id 帳號 ID
   * @returns 帳號資料
   */
  getAccountById: (id: string) => {
    return apiClient.get<Account>(`/account/${id}`)
  },

  /**
   * 新增帳號
   * @param data 帳號資料
   */
  createAccount: (data: AccountFormDto) => {
    return apiClient.post('/create-account', data)
  },

  /**
   * 更新帳號
   * @param id 帳號 ID
   * @param data 帳號資料
   */
  updateAccount: (id: string, data: AccountFormDto) => {
    return apiClient.patch(`/update-account/${id}`, data)
  },

  /**
   * 刪除帳號
   * @param id 帳號 ID
   */
  deleteAccount: (id: string) => {
    return apiClient.delete(`/delete-account/${id}`)
  }
}

