<template>
  <q-dialog v-model="dialogVisible" maximized>
    <q-card style="max-width: 500px; width: 100%">
      <q-card-section>
        <div class="text-h6">{{ isEditMode ? '編輯帳號' : '新增帳號' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit" ref="formRef">
          <q-input
            v-model="formData.name"
            label="姓名 *"
            outlined
            :rules="[
              (val: string) => !!val || '請輸入姓名',
              (val: string) => val.length >= 2 || '姓名至少 2 字元'
            ]"
            class="q-mb-md"
          />

          <q-input
            v-model="formData.email"
            label="Email *"
            type="email"
            outlined
            :rules="[
              (val: string) => !!val || '請輸入 Email',
              (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email 格式不正確'
            ]"
            class="q-mb-md"
          />

          <q-select
            v-model="formData.roleLevel"
            :options="roleLevelOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="角色等級 *"
            outlined
            :rules="[(val: any) => !!val || '請選擇角色等級']"
            class="q-mb-md"
          />

          <q-select
            v-model="formData.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="狀態 *"
            outlined
            :rules="[(val: any) => !!val || '請選擇狀態']"
            class="q-mb-md"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="取消" @click="handleCancel" />
        <q-btn
          color="primary"
          label="儲存"
          @click="handleSubmit"
          :loading="isSubmitting"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAccountStore } from '@/stores/account'
import { Account, AccountFormDto, RoleLevel, AccountStatus } from '@/types'
import type { QForm } from 'quasar'

/**
 * Props
 */
interface Props {
  modelValue: boolean
  account?: Account | null
}

const props = withDefaults(defineProps<Props>(), {
  account: null
})

/**
 * Emits
 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const accountStore = useAccountStore()

// 對話框顯示狀態（使用計算屬性處理 v-model）
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// 表單資料
const formData = ref<AccountFormDto>({
  name: '',
  email: '',
  roleLevel: RoleLevel.ADMIN,
  status: AccountStatus.ON
})

const formRef = ref<QForm | null>(null)
const isSubmitting = ref(false)

// 是否為編輯模式
const isEditMode = computed(() => !!props.account)

// 選項
const roleLevelOptions = [
  { label: '管理員', value: RoleLevel.ADMIN }
  // 根據 Swagger 補充其他選項
]

const statusOptions = [
  { label: '啟用', value: AccountStatus.ON },
  { label: '停用', value: AccountStatus.OFF }
]

/**
 * 監聽 account 變化，預填表單
 */
watch(() => props.account, (newAccount) => {
  if (newAccount) {
    formData.value = {
      name: newAccount.name,
      email: newAccount.email,
      roleLevel: newAccount.roleLevel,
      status: newAccount.status
    }
  } else {
    // 重置表單
    formData.value = {
      name: '',
      email: '',
      roleLevel: RoleLevel.ADMIN,
      status: AccountStatus.ON
    }
  }
}, { immediate: true })

/**
 * 處理提交
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  isSubmitting.value = true
  try {
    if (isEditMode.value && props.account) {
      await accountStore.updateAccount(props.account.id, formData.value)
    } else {
      await accountStore.createAccount(formData.value)
    }
    handleCancel()
  } catch (error) {
    // 錯誤處理由 store 和 axios 攔截器處理
  } finally {
    isSubmitting.value = false
  }
}

/**
 * 處理取消
 */
const handleCancel = () => {
  emit('update:modelValue', false)
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}
</script>

