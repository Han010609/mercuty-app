/**
 * 角色等級枚舉
 * 根據 Swagger API 文件定義
 */
export enum RoleLevel {
  ADMIN = 'ADMIN'
  // 根據實際 Swagger 文件補充其他值
}

/**
 * 帳號狀態枚舉
 */
export enum AccountStatus {
  ON = 'ON',
  OFF = 'OFF'
}

/**
 * 帳號資料介面
 */
export interface Account {
  id: string
  name: string
  email: string
  roleLevel: RoleLevel
  status: AccountStatus
  // 其他欄位請參考 Swagger Schema
}

/**
 * 帳號表單資料傳輸物件
 */
export interface AccountFormDto {
  name: string
  email: string
  roleLevel: RoleLevel
  status: AccountStatus
}

/**
 * 登入請求資料
 */
export interface LoginDto {
  email: string
  password: string
}

/**
 * 登入回應資料
 */
export interface LoginResponse {
  token: string
  // 其他欄位請參考 Swagger Schema
}

