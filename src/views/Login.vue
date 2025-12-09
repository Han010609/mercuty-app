<template>
  <q-page class="login-page">
    <div class="login-container">
      <q-card class="login-card">
        <q-card-section class="login-header">
          <!-- 紫色圓形圖標 -->
          <div class="login-icon-wrapper">
            <q-icon name="login" class="login-icon" />
          </div>
          <h1 class="login-title">歡迎回來</h1>
          <p class="login-subtitle">請登入您的帳號以繼續</p>
        </q-card-section>

        <q-card-section class="login-form-section">
          <q-form @submit="handleLogin" ref="formRef">
            <!-- Email 輸入框 -->
            <q-input
              v-model="loginData.email"
              label="電子郵件"
              type="email"
              outlined
              placeholder="your@email.com"
              :rules="[
                (val: string) => !!val || '請輸入 Email',
                (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email 格式不正確'
              ]"
              class="login-input q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="email" class="input-icon" />
              </template>
            </q-input>

            <!-- 密碼輸入框 -->
            <q-input
              v-model="loginData.password"
              label="密碼"
              type="password"
              outlined
              :rules="[(val: string) => !!val || '請輸入密碼']"
              class="login-input q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="lock" class="input-icon" />
              </template>
            </q-input>

            <!-- 記住我和忘記密碼 -->
            <div class="login-options q-mb-md">
              <q-checkbox
                v-model="rememberMe"
                label="記住我"
                class="remember-me"
              />
              <a href="#" class="forgot-password" @click.prevent>忘記密碼?</a>
            </div>

            <!-- 登入按鈕 -->
            <q-btn
              type="submit"
              class="login-button full-width"
              :loading="authStore.isLoading"
              unelevated
            >
              <q-icon name="arrow_forward" class="q-mr-sm" />
              登入
            </q-btn>

            <!-- 提示框 -->
            <div class="login-hint">
              <q-icon name="lightbulb" class="hint-icon" />
              <span>提示:輸入任意電子郵件和密碼即可登入</span>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LoginDto } from '@/types'
import type { QForm } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()

// 表單資料
const loginData = ref<LoginDto>({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const formRef = ref<QForm | null>(null)

/**
 * 處理登入
 */
const handleLogin = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  const success = await authStore.login(loginData.value)
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
/* 登入頁面容器 */
.login-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 登入卡片 */
.login-card {
  width: 100%;
  background: #ffffff;
  border-radius: 12.8px; /* 16px * 0.8 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px 25.6px; /* 40px * 0.8, 32px * 0.8 */
  margin-bottom: 19.2px; /* 24px * 0.8 */
}

/* 標題區域 */
.login-header {
  text-align: center;
  padding-bottom: 25.6px; /* 32px * 0.8 */
}

.login-icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 19.2px; /* 24px * 0.8 */
}

.login-icon {
  font-size: 32px; /* 40px * 0.8 */
  color: #ffffff;
}

.login-title {
  font-size: 16px;
  font-weight: 600;
  color: #030213;
  margin: 0 0 6.4px 0; /* 8px * 0.8 */
  line-height: 1.2;
}

.login-subtitle {
  font-size: 16px;
  color: #717182;
  margin: 0;
  line-height: 1.5;
}

/* 表單區域 */
.login-form-section {
  padding: 0;
}

.login-input {
  width: 100%;
}

.login-input :deep(.q-field__control) {
  background-color: #ffffff;
  border-radius: 6.4px; /* 8px * 0.8 */
}

.login-input :deep(.q-field__native) {
  padding-left: 6.4px; /* 8px * 0.8 */
  padding-right: 12.8px; /* 16px * 0.8 */
  font-size: 16px;
  min-height: 38.4px; /* 48px * 0.8 */
  display: flex;
  align-items: center;
}

.login-input :deep(.q-field__label) {
  font-size: 16px;
}

.login-input :deep(input) {
  font-size: 16px;
}

.login-input :deep(.q-field__messages) {
  font-size: 16px;
  padding-top: 4px;
  padding-left: 12.8px; /* 16px * 0.8 */
  display: flex;
  align-items: flex-start;
}

.login-input :deep(.q-field__messages .q-icon),
.login-input :deep(.q-field__messages .text-negative) {
  display: none !important;
}

.input-icon {
  color: #717182;
  font-size: 16px; /* 20px * 0.8 */
}

.login-input :deep(.q-field__prepend) {
  align-self: stretch;
  display: flex;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
}

.login-input :deep(.q-field__control-container) {
  align-items: stretch;
}

.login-input :deep(.q-field__inner) {
  align-items: stretch;
}

.login-input :deep(.q-field__control) {
  align-items: stretch;
}

/* 選項區域 */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 19.2px; /* 24px * 0.8 */
  width: 100%;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me :deep(.q-checkbox__inner) {
  display: flex;
  align-items: center;
}

.remember-me :deep(.q-checkbox__label) {
  color: #030213;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-left: 6.4px; /* 8px * 0.8 */
}

.forgot-password {
  color: #8b5cf6;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #7c3aed;
  text-decoration: underline;
}

/* 登入按鈕 */
.login-button {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6.4px; /* 8px * 0.8 */
  text-transform: none;
  height: 38.4px; /* 48px * 0.8 */
  margin-bottom: 12.8px; /* 16px * 0.8 */
  transition: opacity 0.2s, transform 0.2s;
}

.login-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.login-button :deep(.q-icon) {
  font-size: 16px; /* 20px * 0.8 */
}

.login-button :deep(.q-btn__content) {
  font-size: 16px;
}

/* 提示框 */
.login-hint {
  background-color: #e0f2fe;
  border-radius: 6.4px; /* 8px * 0.8 */
  padding: 9.6px 12.8px; /* 12px * 0.8, 16px * 0.8 */
  display: flex;
  align-items: center;
  gap: 6.4px; /* 8px * 0.8 */
  font-size: 16px;
  color: #0369a1;
}

.hint-icon {
  color: #f97316;
  font-size: 14.4px; /* 18px * 0.8 */
  flex-shrink: 0;
}

/* 響應式設計 */
@media (max-width: 600px) {
  .login-card {
    padding: 25.6px 19.2px; /* 32px * 0.8, 24px * 0.8 */
  }

  .login-title {
    font-size: 16px;
  }

  .login-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .login-icon {
    font-size: 32px;
  }
}
</style>

