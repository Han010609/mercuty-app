/**
 * 身份驗證相關 API
 */
import { LoginDto, LoginResponse } from '@/types'

export const authApi = {
  /**
   * 登入（模擬登錄，不調用真實 API）
   * 根據提示：輸入任意電子郵件和密碼即可登入
   * @param data 登入資料
   * @returns 登入回應（包含 token）
   */
  login: async (data: LoginDto): Promise<{ data: LoginResponse }> => {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 驗證輸入（雖然提示說任意輸入都可以，但我們還是做基本驗證）
    if (!data.email || !data.password) {
      throw new Error('請輸入電子郵件和密碼')
    }
    
    // 生成模擬 token（使用 base64 編碼 email + timestamp）
    const token = btoa(`${data.email}:${Date.now()}`)
    
    return {
      data: {
        token: token
      }
    }
  }
}

