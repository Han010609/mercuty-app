# 帳號管理系統

Vue 3 前端工程師面試測驗專案 - 帳號管理 CRUD 系統

## 技術棧

- **Vue 3** - 前端框架（Composition API）
- **TypeScript** - 型別系統
- **Vite** - 建置工具
- **Quasar Framework** - UI 框架
- **Pinia** - 狀態管理
- **Axios** - HTTP 請求
- **Vue Router** - 路由管理

## 功能特色

- 登入功能（Token 認證）
- 帳號列表展示（GET /accounts）
- 新增帳號（POST /create-account）
- 編輯帳號（PATCH /update-account/{id}）
- 刪除帳號（DELETE /delete-account/{id}）
- 搜尋過濾（姓名、Email）
- 表單驗證（必填、Email 格式、最少字元）
- Loading 狀態顯示
- 錯誤處理與通知
- RWD 響應式設計

## 安裝

```bash
npm install
```

## 環境變數設定

建立 `.env` 檔案：

```env
VITE_API_BASE_URL=https://api-frontend-interview-server.metcfire.com.tw/
VITE_INTERVIEWER_NAME=pk
```

**注意：** Base URL 結尾需包含斜線 `/`

## 啟動

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 專案結構

```
src/
├── api/
│   ├── index.ts          # axios 設定與攔截器
│   ├── auth.ts           # 登入 API 方法
│   └── account.ts        # 帳號 CRUD API 方法
├── stores/
│   ├── auth.ts           # 身份驗證 Store
│   └── account.ts        # 帳號管理 Store
├── types/
│   └── index.ts          # TypeScript 型別定義
├── components/
│   ├── AccountTable.vue  # 帳號表格元件
│   └── AccountForm.vue   # 帳號表單元件（新增/編輯）
├── views/
│   ├── Login.vue         # 登入頁面
│   └── Dashboard.vue     # 主頁面（帳號管理）
├── router/
│   └── index.ts          # 路由設定（含路由守衛）
├── App.vue               # 根元件
└── main.ts               # 入口檔案
```

## API 資訊

- **Base URL:** `https://api-frontend-interview-server.metcfire.com.tw/`
- **API 文件（Swagger）:** https://api-frontend-interview-server.metcfire.com.tw/api-docs
- **設計稿（Figma）:** https://server-door-49461275.figma.site/

## 開發說明

### 身份驗證流程

1. 使用者登入後取得 Token
2. Token 儲存於 localStorage
3. 所有 API 請求自動帶上 Token（透過 axios 攔截器）
4. Token 過期時自動導向登入頁

### 狀態管理

- **auth Store**: 管理登入狀態、Token
- **account Store**: 管理帳號列表、CRUD 操作

### 表單驗證

- 姓名：必填，最少 2 字元
- Email：必填，Email 格式驗證
- 角色等級：必填
- 狀態：必填

## Git Commit 節奏

```bash
feat: init project with quasar
feat: add api layer and types
feat: implement account CRUD
style: match figma design
docs: add README
```

## 授權

此專案為面試測驗專案，僅供技術能力評估使用。

