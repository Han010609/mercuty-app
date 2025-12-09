<template>
  <q-page class="q-pa-md">
    <!-- 頂部工具列 -->
    <q-toolbar class="bg-primary text-white q-mb-md" style="height: 60px">
      <q-toolbar-title>帳號管理</q-toolbar-title>
      <q-btn
        color="white"
        text-color="primary"
        label="新增帳號"
        icon="add"
        @click="openCreateDialog"
        unelevated
        class="q-mr-sm"
      />
      <q-btn
        color="white"
        text-color="primary"
        label="登出"
        icon="logout"
        @click="handleLogout"
        unelevated
      />
    </q-toolbar>

    <!-- 搜尋區塊 -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-gutter-md">
          <q-input
            v-model="searchName"
            label="姓名"
            outlined
            dense
            clearable
            class="col"
            @keyup.enter="handleSearch"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            v-model="searchEmail"
            label="Email"
            outlined
            dense
            clearable
            class="col"
            @keyup.enter="handleSearch"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-btn
            color="primary"
            label="搜尋"
            icon="search"
            @click="handleSearch"
            class="col-auto"
            unelevated
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- 資料表格 -->
    <AccountTable
      :accounts="filteredAccounts"
      :is-loading="accountStore.isLoading"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />

    <!-- 新增/編輯 Dialog -->
    <AccountForm
      v-model="showFormDialog"
      :account="selectedAccount"
    />

    <!-- 刪除確認 Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="max-width: 400px; width: 100%">
        <q-card-section>
          <div class="text-h6">確認刪除</div>
        </q-card-section>

        <q-card-section>
          確定要刪除此帳號嗎？此操作無法復原。
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="取消" @click="showDeleteDialog = false" />
          <q-btn
            color="negative"
            label="確定刪除"
            @click="handleDelete"
            :loading="isDeleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { useAuthStore } from '@/stores/auth'
import AccountTable from '@/components/AccountTable.vue'
import AccountForm from '@/components/AccountForm.vue'
import { Account } from '@/types'

const router = useRouter()
const accountStore = useAccountStore()
const authStore = useAuthStore()

// 檢查登入狀態
if (!authStore.isAuthenticated) {
  router.push('/login')
}

// 搜尋條件
const searchName = ref('')
const searchEmail = ref('')

// Debounce 搜尋條件（用於優化效能）
const debouncedSearchName = ref('')
const debouncedSearchEmail = ref('')

/**
 * Debounce 函數
 * @param fn 要延遲執行的函數
 * @param delay 延遲時間（毫秒）
 */
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 建立 debounced 更新函數
const updateDebouncedSearchName = debounce((value: string) => {
  debouncedSearchName.value = value
}, 300)

const updateDebouncedSearchEmail = debounce((value: string) => {
  debouncedSearchEmail.value = value
}, 300)

// 監聽搜尋條件變化，套用 debounce
watch(searchName, (newValue) => {
  updateDebouncedSearchName(newValue)
})

watch(searchEmail, (newValue) => {
  updateDebouncedSearchEmail(newValue)
})

// Dialog 狀態
const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedAccount = ref<Account | null>(null)
const isDeleting = ref(false)

/**
 * 過濾後的帳號列表（使用 debounced 搜尋條件）
 */
const filteredAccounts = computed(() => {
  let result = accountStore.accounts

  // 根據姓名過濾（使用 debounced 值）
  if (debouncedSearchName.value) {
    result = result.filter(account =>
      account.name.toLowerCase().includes(debouncedSearchName.value.toLowerCase())
    )
  }

  // 根據 Email 過濾（使用 debounced 值）
  if (debouncedSearchEmail.value) {
    result = result.filter(account =>
      account.email.toLowerCase().includes(debouncedSearchEmail.value.toLowerCase())
    )
  }

  return result
})

/**
 * 處理搜尋
 * 立即套用搜尋條件（不使用 debounce）
 */
const handleSearch = () => {
  // 立即更新 debounced 值，觸發過濾
  debouncedSearchName.value = searchName.value
  debouncedSearchEmail.value = searchEmail.value
  // 搜尋邏輯已由 computed 處理
  // 此處可加入 API 搜尋邏輯（如需要）
}

/**
 * 開啟新增 Dialog
 */
const openCreateDialog = () => {
  selectedAccount.value = null
  showFormDialog.value = true
}

/**
 * 開啟編輯 Dialog
 */
const openEditDialog = (account: Account) => {
  selectedAccount.value = account
  showFormDialog.value = true
}

/**
 * 開啟刪除確認 Dialog
 */
const openDeleteDialog = (account: Account) => {
  selectedAccount.value = account
  showDeleteDialog.value = true
}

/**
 * 處理刪除
 */
const handleDelete = async () => {
  if (!selectedAccount.value) return

  isDeleting.value = true
  try {
    await accountStore.deleteAccount(selectedAccount.value.id)
    showDeleteDialog.value = false
    selectedAccount.value = null
  } catch (error) {
    // 錯誤處理由 store 和 axios 攔截器處理
  } finally {
    isDeleting.value = false
  }
}

/**
 * 處理登出
 */
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

/**
 * 初始化 - 取得帳號列表
 */
onMounted(() => {
  accountStore.fetchAccounts()
})
</script>

